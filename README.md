# Gothic II: New Balance — Wiki

Wiki z solucją do modyfikacji Gothic, oparta na Docusaurusie. [Otwórz wiki](https://nb.mody.sefaris.eu).

## Jak edytować wiki

Drobne poprawki możesz zgłosić bezpośrednio w przeglądarce:

1. Na podstronie wiki kliknij **Materiał źródłowy**. Otworzy się plik tej strony na GitHubie.
2. Zaloguj się na GitHubie i kliknij **ikonę ołówka**. Jeśli GitHub poprosi o utworzenie forka, utwórz własną kopię repozytorium.
3. Popraw treść i zapisz zmiany z krótkim opisem na osobnej gałęzi.
4. Utwórz **Pull Request** do repozytorium wiki. Napisz, co zmieniasz i dlaczego; opiekunowie sprawdzą zgłoszenie.

Zachowuj układ dokumentu i identyfikatory nagłówków, np. `{#nazwa-zadania}`, aby linki do zadań nadal działały.

Błąd lub brakującą informację możesz też zgłosić na [Discordzie Sefaris](https://discord.gg/9EVFJv5Uyf).

## Praca lokalna

Wymagane: Node.js 24 i pnpm 11.19.0. Pobierz własnego forka i w jego katalogu uruchom:

```sh
pnpm install --frozen-lockfile
pnpm start
```

Adres podglądu pojawi się w terminalu. Zmiany w dokumentach są widoczne po zapisaniu pliku. Przed wysłaniem Pull Requesta uruchom:

```sh
pnpm check
```

Polecenie buduje wiki oraz sprawdza odnośniki, zasoby i indeks wyszukiwania.

## Gdzie wprowadzać zmiany

- `docs/` — treść stron i ilustracje. Zwykły tekst zapisuj w `.md`, a strony z komponentami, np. zakładkami lub filmami, w `.mdx`.
- `sidebars.js` — układ menu. Dodając stronę, wzoruj się na sąsiednim dokumencie i dodaj ją do odpowiedniego działu.
- `site-profile.js` — dane modyfikacji i adresy wiki.
- `src/css/custom.css` — wspólny wygląd strony.

Zachowuj metadane na początku dokumentów, kotwice, warianty zadań i odnośniki do lokalnych ilustracji. Ostrzeżenia zapisuj jako `:::warning Uwaga`, porady jako `:::tip Wskazówka`, a dodatkowe informacje jako `:::info Informacja`. Zostaw puste wiersze po tytule ramki i przed zamykającym `:::`.

## Autorzy

**Autor oryginalnej solucji:** MarekZ (Marek Z).

**Team Sefaris:**

- [Sebastian](https://github.com/met0rii)
- [Tulipan](https://github.com/tulipanov)
- [fyryNy](https://github.com/fyryNy)

**Inni współtwórcy:**

- xez20003
- Flopson
- FortyNest22
- Deetom554
- Delph
- Katspa
