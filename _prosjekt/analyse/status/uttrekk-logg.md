# Uttrekk-logg — uttrekk 2

Uttrukket: 2026-09-11 · Property: `sc-domain:drommeguiden.no` · Søketype: Nett

Her er alt som ikke gikk som beskrevet, og det som er verdt å vite om datagrunnlaget. Ingen analyse.

## Generelt

- **EKSPORTÉR ble ikke brukt.** Alle rader er lest rett ut av tabellen i Search Console (DOM-en). For hver tabell ble antall rader, sum klikk, sum visninger og en hash av radene kontrollert i nettleseren og mot filene. Alt stemte.
- **Datoparametre i URL-en virket.** Oppdraget sa at Search Console ignorerer dem. I oppgave 2 og 3 ble datoene satt under Dato → Tilpasset. I oppgave 4 og 5 ble `start_date=20260602&end_date=20260901` lagt i URL-en, og det virket: dialogen viste «Tilpasset», og sidetotalene stemte med radene i `sider-alle.csv` (for eksempel melatonin: 1363 visninger, plassering 64.0).
- **Tallformat:** punktum som desimaltegn, `ctr` uten %-tegn. CTR og plassering er slik GSC viser dem, altså avrundet til én desimal. Der GSC viser tallet uten desimal (for eksempel «6» og «10»), er det beholdt slik.
- **CTR-kontroll:** 1555 rader i alle CSV-filer og i `sommerfugl.md` er sjekket mot `clicks / impressions`. Alle stemmer innenfor GSC-avrundingen (±0.05).
- **Totalkortene er avrundet i GSC:** «10,3k» klikk, «330k» visninger og «1,36k» for melatonin. Eksakte sidetall er hentet fra sidetabellen der de fantes.

## 1. Indeksering

- **Sju av ti URL-er har en status som ikke er blant de fire kategoriene:** «Siden er ikke indeksert: Nettadressen er ukjent for Google». Det gjelder `drommer/noen-dor`, `dod-mor`, `vaere-utro`, `basseng`, `fisk`, `sv/drommar/nagon-dor` og `en/dreams/someone-dying`. Det er ikke det samme som «Ikke funnet (404)». GSC-ordlyden er beholdt.
- Detaljpanelet ble bare lest for `en/dreams/someone-dying/`. Der sto det: «Fant ingen henvisende nettstedskart», «Henvisningsside: Ingen er funnet», «Siste gjennomsøking: Ingen verdi».
- Sider-rapporten var sist oppdatert **04.09.2026**. URL-inspeksjonen er live per 11.09.2026, så de to kildene har ulik dato.

## 2. Sommerfuglpiloten

- **Datovinduet er justert til 2026-09-04 – 2026-09-09.** GSC godtar ikke sluttdato etter 2026-09-09. Både 2026-09-10 og 2026-09-11 ga feilmelding i datofeltet.
- **Tynne data:** dagsgrafen for `symboler/sommerfugl/` viste null visninger fram til 07.09 og visninger først 08.–09.09. Vinduet inneholder altså i praksis bare om lag to dager med data for de nye sidene.
- **Anonymisering** (sum av visninger i spørringsradene delt på sidetotalen):
  - `symboler/sommerfugl/`: 15/34
  - `sv/symboler/fjaril/`: 10/39
  - `en/symbols/butterfly/`: 1/2. Kortet viser snittplassering 6, mens eneste spørringsrad har plassering 51.0.
  - `drommer/sommerfugl/`: 69/207
  - `sv/drommar/fjaril/`: 147/320
  - `en/dreams/butterfly/`: 52/119
- **Filteret var eksakt nettadresse.** Dette ble kontrollert i filterdialogen.

## 3. Hele siden på sidenivå

- **Tabellen traff 1000-radertaket.** Bunnen av halen mangler.
- **Hvilke rader som kom med:** alle 531 sider med minst ett klikk (laveste: 3 visninger), pluss sider med 0 klikk ned til 10 visninger. Sider med 0 klikk og under 10 visninger er ikke med.
- **Sortering endret ikke utvalget.** Å sortere på visninger i grensesnittet sorterte de samme 1000 radene på nytt, men hentet ikke andre rader. Utvalget ser ut til å være bestemt av klikk. Filen er sortert på visninger synkende.
- **266 av radene er URL-er med #-fragment** (for eksempel `/drommer/tann/#hva-påvirker-tolkningen`). De er beholdt, siden ingenting skulle filtreres bort.
- **Søvnseksjonen i de 1000 radene:** 32 URL-er under `/sovn/`, 27 under `/sv/somn/` og 8 under `/en/sleep/`. De søvnsidene som mangler, falt utenfor taket.

## 4. Søvnseksjonen

- **Utvalg:** de ti søvnartiklene med flest visninger på tvers av språk. Seksjonsforsiden `/sovn/` (349 visninger) er holdt utenfor som oversiktsside. Se `sovn-logg.md`.
- **Ingen av sidene traff 1000-taket.** Flest rader hadde melatonin, med 72.
- **Dekning** (visninger i spørringsradene delt på sidetotalen): 60–99 %. Lavest var `sv/somn/somn-graviditet/` (60 %) og `sovn/sovn-graviditet/` (71 %).

## 5. Plassering 11–20

- **Spørringstabellen traff 1000-radertaket.**
- **Hvilke rader som kom med:** alle 236 spørringer med minst ett klikk, pluss spørringer med 0 klikk ned til 6 visninger. Spørringer med 0 klikk og under 6 visninger mangler, også de som har plassering 11–20.
- **91 av de 1000 radene har snittplassering fra og med 11.0 til og med 20.0.** Det er under grensen på 300, så alle 91 er med i `plassering-11-20.csv`. Filen inneholder bare disse radene.
- **Intervallet bygger på plasseringen slik GSC viser den** (avrundet til én desimal). En spørring med faktisk plassering 10.96 vises som 11.0 og er da med.
- **Anonymisering / tak:** de 1000 spørringsradene summerer til 811 klikk og 43 313 visninger. Totalkortene viser 10,3k klikk og 330k visninger for samme vindu. Omtrent 8 % av klikkene og 13 % av visningene er dermed synlige på spørringsnivå. Resten er anonymiserte søk eller ligger under taket. Dette er Googles gulv, ikke en feil i uttrekket.
