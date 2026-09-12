import React, {useEffect, useMemo, useRef, useState} from 'react';
import Link from '@docusaurus/Link';
import {usePluginData} from '@docusaurus/useGlobalData';
import {Search, X, ArrowUpRight, FileText, CornerDownLeft} from 'lucide-react';

const normalize = text => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ł/g, 'l');

export default function SearchBar() {
  const {entries = []} = usePluginData('sefaris-local-search') || {};
  const dialog = useRef(null);
  const input = useRef(null);
  const resultsRef = useRef(null);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const results = useMemo(() => {
    const words = normalize(query.trim()).split(/\s+/).filter(Boolean);
    if (!words.length) return entries.filter(entry => !entry.url.includes('#')).slice(0, 6);
    return entries.map(entry => {
      const title = normalize(entry.title), body = normalize(entry.text);
      return {...entry, score: words.every(word => `${title} ${body}`.includes(word)) ? words.reduce((score, word) => score + (title.includes(word) ? 10 : 1), 0) : 0};
    }).filter(entry => entry.score > 0).sort((a,b) => b.score-a.score).slice(0, 8);
  }, [query, entries]);
  function open() { dialog.current.showModal(); input.current.focus(); }
  function close() { dialog.current.close(); }
  useEffect(() => {
    const listener = event => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault(); dialog.current.open ? close() : open();
      }
    };
    document.addEventListener('keydown', listener);
    return () => document.removeEventListener('keydown', listener);
  }, []);
  useEffect(() => {setSelected(0);}, [query]);
  function keyDown(event) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const next = (selected + (event.key === 'ArrowDown' ? 1 : -1) + results.length) % Math.max(results.length,1);
      setSelected(next); resultsRef.current?.children[next]?.scrollIntoView({block: 'nearest'});
    }
    if (event.key === 'Enter' && results.length) {event.preventDefault(); resultsRef.current?.children[selected]?.click();}
  }
  return <>
    <button type="button" className="wiki-search-button" onClick={open} aria-label="Szukaj w wiki"><Search size={17}/><span>Szukaj w wiki…</span><kbd>Ctrl K</kbd></button>
    <dialog ref={dialog} className="search-dialog" aria-label="Wyszukiwanie w wiki" onClick={event => {if(event.currentTarget === event.target) close();}}>
      <div className="search-dialog-input"><Search size={21}/><input ref={input} value={query} onChange={event => setQuery(event.target.value)} placeholder="Zadanie, postać, miejsce…" aria-label="Szukaj w treści wiki" onKeyDown={keyDown}/><button type="button" onClick={close} aria-label="Zamknij wyszukiwarkę"><X size={20}/></button></div>
      <div className="search-caption">{query ? `${results.length ? 'Wyniki wyszukiwania' : 'Brak wyników'}` : 'Odkryj wiki'}</div>
      <div className="search-results" ref={resultsRef}>{results.map((result, i) => <Link key={result.url} to={result.url} onClick={close} onFocus={() => setSelected(i)} className={`search-result ${i === selected ? 'is-selected' : ''}`}><FileText size={19}/><span><small>{result.page}</small><strong>{result.title}</strong><span>{result.text.slice(0, 120)}…</span></span><ArrowUpRight size={16}/></Link>)}</div>
      {!results.length && <p className="search-empty">Spróbuj wpisać „Cavalorn”, „retoryka” albo „mapa”. Polskie znaki są opcjonalne.</p>}
      <div className="search-dialog-footer"><span><kbd>↑</kbd><kbd>↓</kbd> wybierz <kbd><CornerDownLeft size={11}/></kbd> otwórz</span><span><kbd>Esc</kbd> zamknij</span></div>
    </dialog>
  </>;
}
