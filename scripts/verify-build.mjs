import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);
const profile = require('../site-profile.js');
const siteDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const buildDir = path.join(siteDir, 'build');

async function walk(dir) {
  return (await Promise.all((await fs.readdir(dir, {withFileTypes: true})).map(async entry =>
    entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)]))).flat();
}

const files = new Set((await walk(buildDir)).map(file => path.relative(buildDir, file).split(path.sep).join('/')));
const decode = text => text.replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"');
const htmlFiles = [...files].filter(file => file.endsWith('.html'));
const pages = new Map(await Promise.all(htmlFiles.map(async file => {
  const html = await fs.readFile(path.join(buildDir, file), 'utf8');
  return [file, {html, ids: new Set([...html.matchAll(/\bid="([^"]*)"/g)].map(match => decode(match[1])))}];
})));
const errors = [];
const origin = new URL(profile.url).origin;
let internalLinks = 0;
let sourceLinks = 0;
let externalLinks = 0;

function checkLocalUrl(value, from) {
  const url = new URL(value, `${origin}/${from}`);
  if (url.origin !== origin) return;
  const pathname = decodeURIComponent(url.pathname).replace(/^\//, '');
  const target = files.has(pathname) ? pathname : `${pathname.replace(/\/$/, '')}${pathname ? '/' : ''}index.html`;
  if (!files.has(target)) { errors.push(`${from}: brak ${url.pathname}`); return; }
  if (url.hash && pages.has(target) && !pages.get(target).ids.has(decodeURIComponent(url.hash.slice(1)))) {
    errors.push(`${from}: brak kotwicy ${url.pathname}${url.hash}`);
  }
  internalLinks++;
}

for (const [file, {html}] of pages) {
  // Docusaurus gives 404.html a canonical URL with a trailing slash. It isn't a navigation link.
  const markup = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  const linkHtml = file === '404.html' ? markup.replace(/<link\b[^>]*rel="(?:canonical|alternate)"[^>]*>/g, '') : markup;
  for (const match of linkHtml.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const value = decode(match[1]);
    if (/^(mailto:|tel:|data:)/.test(value)) continue;
    checkLocalUrl(value, file);
    const sourcePrefix = `${profile.repository}/blob/${profile.branch}/docs/`;
    if (value.startsWith(sourcePrefix)) {
      const relative = decodeURIComponent(value.slice(sourcePrefix.length));
      const source = path.resolve(siteDir, 'docs', relative);
      if (!source.startsWith(path.join(siteDir, 'docs') + path.sep)) errors.push(`${file}: nieprawidłowa ścieżka źródła`);
      else {
        try { if (!profile.prototype) await fs.access(source); sourceLinks++; }
        catch { errors.push(`${file}: nie istnieje plik źródłowy docs/${relative}`); }
      }
    }
  }
  for (const [tag] of markup.matchAll(/<a\b[^>]*>/gi)) {
    const attrs = Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(match => [match[1], decode(match[2])]));
    if (!/^(https?:)?\/\//.test(attrs.href || '')) continue;
    const rel = (attrs.rel || '').split(/\s+/);
    if (attrs.target !== '_blank' || !rel.includes('noopener') || !rel.includes('noreferrer')) {
      errors.push(`${file}: link zewnętrzny bez _blank/noopener/noreferrer: ${attrs.href}`);
    }
    externalLinks++;
  }
  if (/Wszystkie wiki|Razem wiemy więcej|Każda przygoda ma swój początek|cdn\.jsdelivr\.net\/npm\/docsify/.test(markup)) {
    errors.push(`${file}: nieaktualny element szablonu`);
  }
  if (/<footer\b[^>]*class="[^"]*\bfooter\b/.test(markup)) errors.push(`${file}: zbędna stopka strony`);
  if (!profile.prototype && file !== '404.html' && !html.includes('Materiał źródłowy')) errors.push(`${file}: brak odnośnika do źródła`);
}

const globalData = JSON.parse(await fs.readFile(path.join(siteDir, '.docusaurus/globalData.json'), 'utf8'));
const searchEntries = globalData['sefaris-local-search'].default.entries;
for (const entry of searchEntries) checkLocalUrl(entry.url, 'search-index');
const documents = htmlFiles.filter(file => file !== '404.html');
const indexedDocuments = new Set(searchEntries.map(entry => entry.url.split('#')[0]));
for (const file of documents) {
  const route = '/' + file.replace(/index\.html$/, '');
  if (!indexedDocuments.has(route)) errors.push(`${file}: dokument nie występuje w wyszukiwarce.`);
}
if (!profile.prototype && sourceLinks !== documents.length) errors.push(`Oczekiwano ${documents.length} źródeł dokumentów, znaleziono ${sourceLinks}.`);
if (!files.has('index.html')) errors.push('Brak index.html w katalogu build/.');
if ((await fs.readFile(path.join(buildDir, 'CNAME'), 'utf8')).trim() !== new URL(profile.url).hostname) {
  errors.push('CNAME i domena w profilu nie są zgodne.');
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`OK: ${pages.size} stron HTML, ${internalLinks} lokalnych odnośników, ${externalLinks} zewnętrznych, ${sourceLinks} źródeł GitHub i ${searchEntries.length} pozycji wyszukiwania.`);
}
