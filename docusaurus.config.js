const profile = require('./site-profile');
const {themes} = require('prism-react-renderer');

/** @type {import('@docusaurus/types').Config} */
module.exports = {
  title: `${profile.name} · Sefaris Wiki`,
  tagline: profile.description,
  favicon: 'img/favicon.ico',
  url: profile.url,
  baseUrl: '/',
  trailingSlash: true,
  onBrokenLinks: 'throw',
  i18n: {defaultLocale: 'pl', locales: ['pl']},
  customFields: {profile},
  markdown: {format: 'detect', hooks: {onBrokenMarkdownLinks: 'throw'}},
  presets: [['classic', {
    docs: {
      routeBasePath: '/',
      sidebarPath: require.resolve('./sidebars.js'),
      showLastUpdateTime: false,
      showLastUpdateAuthor: false,
      breadcrumbs: true,
    },
    blog: false,
    theme: {customCss: require.resolve('./src/css/custom.css')},
  }]],
  plugins: [require.resolve('./plugins/local-search')],
  themeConfig: {
    colorMode: {defaultMode: 'dark', disableSwitch: true, respectPrefersColorScheme: false},
    navbar: {
      title: 'Sefaris',
      hideOnScroll: false,
      items: [
        {type: 'docSidebar', sidebarId: 'wiki', position: 'left', label: 'Wiki'},
        {href: profile.modUrl, label: 'O modyfikacji', position: 'right'},
        {type: 'custom-discord', href: profile.discordUrl, position: 'right'},
        {href: 'https://sefaris.eu', label: 'Wróć do Sefaris', position: 'right', className: 'mobile-sefaris-link'},
        {type: 'search', position: 'right'},
      ],
    },
    docs: {sidebar: {hideable: false, autoCollapseCategories: true}},
    tableOfContents: {minHeadingLevel: 2, maxHeadingLevel: 3},
    prism: {theme: themes.vsDark, darkTheme: themes.vsDark, additionalLanguages: ['ini', 'powershell']},
  },
};
