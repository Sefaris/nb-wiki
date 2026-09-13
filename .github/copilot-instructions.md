# Edycja wiki

Zachowuj treść, autorów na stronie głównej i jawne kotwice zadań. Zwykłe dokumenty zapisuj w `.md`, komponenty w `.mdx`. Przed zakończeniem uruchom `pnpm check`. Git i publikację wykonuje właściciel.

## Wspólny układ menu i wyróżnień

- Menu: Strona główna, Solucja i pozostałe działy z zadaniami, na końcu Informacje dodatkowe (konfiguracja, porady, teleporty, mapy i spisy). Nie twórz pustej kategorii i zachowuj rozwijane lokacje rozdziałów.
- Ostrzeżenia: `:::warning Uwaga`; porady: `:::tip Wskazówka`; warunki i fakty: `:::info Informacja`. Dobieraj rodzaj po znaczeniu, nie tylko po dawnej etykiecie. Krytyczną blokadę gry można oznaczyć `:::danger Uwaga`.
- Po otwarciu i przed zamknięciem ramki `:::` zostaw pusty wiersz. Nie powtarzaj tytułu jako „UWAGA:” w treści. Zachowuj listy, warianty, liczby i powiązane media; nie obejmuj uwagą dalszego opisu zadania.
- Cytaty `>` służą autentycznym wypowiedziom lub listom z gry. Nie używaj ich do wyróżniania instrukcji autora, nagród ani opisów strony. Ramki działają również w zwykłych `.md` i nie wymagają MDX.
- README repozytorium i strona główna używają wspólnej sekcji „Jak edytować wiki” z bazy. Instrukcja edycji jest jednakowa we wszystkich wiki; nazwa, adres, materiały i autorzy dotyczą danego moda. Zachowuj zgodne osoby i role w obu sekcjach „Autorzy”; nie kopiuj autorstwa z przykładowego NB.
- Nagłówek strony głównej pokazuje heroDescription z site-profile.js: jedno zdanie o fabule lub charakterze danego moda na podstawie jego opisu na Sefaris. Zachowuj wspólny komponent HomeHeader i styl opisu; nie przenoś opisu innego moda ani autorstwa do nagłówka.

- Spis „Na tej stronie” używa wspólnego `src/theme/TOCItems/`: po dojściu do końca przewijanej strony zaznacza ostatnią sekcję, a przy przewijaniu w górę wraca do pozycji czytania. Zachowuj identyczny mechanizm w bazie i wiki; test regresji jest częścią `pnpm check`.
