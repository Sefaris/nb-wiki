const profile = require('../site-profile');

if (profile.prototype) {
  throw new Error('Profil nadal ma włączony tryb prototypu. Po przygotowaniu pełnej wiki ustaw prototype: false w site-profile.js.');
}

const branch = process.env.WIKI_DEFAULT_BRANCH;
if (!branch || profile.branch !== branch) {
  throw new Error(`Gałąź źródeł w site-profile.js (${profile.branch}) musi odpowiadać domyślnej gałęzi repozytorium (${branch || 'brak wartości'}).`);
}

console.log(`Profil wiki jest gotowy do publikacji z ${branch}.`);
