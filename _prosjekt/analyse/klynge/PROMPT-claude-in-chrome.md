# Uttrekk fra Search Console — lim inn i Claude in Chrome

Du er logget inn i Google Search Console. Hent ut spørringsdata for åtte sider,
i to tidsvinduer. Ikke analyser noe. Ikke foreslå artikler. Bare hent, eksporter
og navngi riktig.

## Viktig om radgrensen

Grensesnittet viser maks **1 000 rader** per visning. Standard sortering er på
klikk, og det er feil her: vi er ute etter halen, altså søk med visninger men
få eller ingen klikk. Sortering på klikk fyller de 1 000 radene med toppen vi
allerede kjenner.

**Sorter derfor alltid på visninger (Impressions), synkende**, før du
eksporterer. Klikk på kolonneoverskriften «Visninger» / «Impressions» i tabellen.

## Oppsett som gjelder alle uttrekk

- Property: `drommeguiden.no` (domeneproperty)
- Rapport: Ytelse → Søkeresultater (Performance → Search results)
- Søketype: **Web** (ikke Bilde, ikke Video, ikke Nyheter)
- Fane: **Spørringer** (Queries)
- Filter: **Side → Nøyaktig URL** (Page → URL is exactly), én URL om gangen
- Sortering: **Visninger, synkende**
- Eksport: CSV

Ikke bruk «Inneholder»-filter. Nøyaktig URL, ellers blander du inn undersider.

## De to vinduene

| Kode | Fra | Til |
|---|---|---|
| `v1` | 2026-06-02 | 2026-09-01 |
| `v2` | 2026-03-16 | 2026-09-01 |

Datoene settes under **Dato → Egendefinert** (Custom).

## De åtte sidene

| # | URL | Filnavn |
|---|---|---|
| 1 | `https://drommeguiden.no/sv/drommar/orm/` | `orm` |
| 2 | `https://drommeguiden.no/sv/drommar/tand/` | `tand` |
| 3 | `https://drommeguiden.no/sv/drommar/otrohet/` | `otrohet` |
| 4 | `https://drommeguiden.no/sv/drommar/otrohet-partner/` | `otrohet-partner` |
| 5 | `https://drommeguiden.no/sv/drommar/avliden-person/` | `avliden-person` |
| 6 | `https://drommeguiden.no/sv/drommar/gravid/` | `gravid` |
| 7 | `https://drommeguiden.no/drommer/tann/` | `tann` |
| 8 | `https://drommeguiden.no/drommer/avdod-person/` | `avdod-person` |

## Oppgaven

16 uttrekk: hver av de åtte sidene, i hvert av de to vinduene.

For hvert uttrekk:

1. Sett datovinduet
2. Sett sidefilteret til nøyaktig URL
3. Åpne Spørringer-fanen
4. Sorter på Visninger, synkende
5. Eksporter som CSV
6. Gi fila navnet `[filnavn]-[vindu].csv` — for eksempel `orm-v1.csv`,
   `avdod-person-v2.csv`

Filene skal ha kolonnene `query, clicks, impressions, ctr, position`. Eksporterer
Search Console andre kolonnenavn, la dem stå — jeg normaliserer etterpå.

## Regler

- **Ikke aggregér.** Ikke slå sammen varianter, ikke fjern duplikater.
- **Ikke rediger radene.** Stavefeil, rare formuleringer og tilsynelatende
  irrelevante søk skal med. De er ofte det tydeligste sporet etter en undertype.
- **Ikke filtrer bort noe** på egen hånd, uansett hvor irrelevant det ser ut.
- Kommer en side tilbake med færre enn 10 rader, noter det og gå videre. Det er
  et funn i seg selv, ikke en feil.

## Noter underveis

Lag en kort tekstfil `uttrekk-logg.md` med, per uttrekk:

- side, vindu, antall rader som faktisk ble eksportert
- om tabellen traff 1 000-rader-taket (da er halen kuttet, og det må jeg vite)
- eventuelle avvik: filter som ikke lot seg sette, datovindu som ble justert,
  advarsler fra Search Console

Det siste punktet er viktigere enn det ser ut. Hvis et uttrekk traff taket,
mangler vi bunnen av halen for akkurat den siden.

## Levering

Legg alle CSV-filene og `uttrekk-logg.md` i:

`_prosjekt/analyse/klynge/`

Stopp der. Ingen analyse.
