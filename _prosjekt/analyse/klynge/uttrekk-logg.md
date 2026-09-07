# Uttrekk-logg — Search Console, drommeguiden.no

Kjørt: 2026-09-07
Property: `sc-domain:drommeguiden.no`
Rapport: Ytelse → Søkeresultater · Søketype: **Nett** · Fane: **Spørringer**
Filter: Side → **Eksakt nettadresse** (én URL om gangen)
Sortering: **Visninger, synkende**
Kolonner: `query, clicks, impressions, ctr, position`

Vinduer:

| Kode | Fra | Til |
|---|---|---|
| v1 | 2026-06-02 | 2026-09-01 |
| v2 | 2026-03-16 | 2026-09-01 |

## Per uttrekk

| Side | Vindu | Rader eksportert | Traff 1 000-taket | Avvik |
|---|---|---|---|---|
| orm | v1 | 54 | nei | – |
| orm | v2 | 54 | nei | – |
| tand | v1 | 38 | nei | – |
| tand | v2 | 39 | nei | – |
| otrohet | v1 | 38 | nei | – |
| otrohet | v2 | 39 | nei | – |
| otrohet-partner | v1 | 26 | nei | – |
| otrohet-partner | v2 | 28 | nei | – |
| avliden-person | v1 | 37 | nei | – |
| avliden-person | v2 | 37 | nei | – |
| gravid | v1 | 30 | nei | – |
| gravid | v2 | 32 | nei | – |
| tann | v1 | 23 | nei | – |
| tann | v2 | 23 | nei | – |
| avdod-person | v1 | 25 | nei | – |
| avdod-person | v2 | 25 | nei | – |

**Totalt: 16 uttrekk, 548 rader.**

## 1 000-rader-taket

**Ingen** av de 16 uttrekkene kom i nærheten av taket. Største tabell er 54 rader
(orm, begge vinduer). Halen er altså komplett i alle filer — ingenting er kuttet
i bunnen, og ingen side mangler bunnrader.

## Sider med få rader

Ingen side kom tilbake med under 10 rader. Laveste er 23 (tann, begge vinduer).

## Avvik og merknader

**1. Uttrekksmetode — lest fra tabellen, ikke via EKSPORTÉR-knappen.**
Denne økten kjører i skyen og er ikke koblet til maskinen din. Search Consoles
egen CSV-eksport laster ned til nedlastingsmappa lokalt, der jeg verken kan
hente fila eller gi den riktig navn. Radene er derfor lest rett ut av
spørringstabellen i samme visning — samme datagrunnlag, samme filtre, samme
sortering — og skrevet til CSV med de avtalte filnavnene.

**2. Tallformat normalisert til punktum.**
Grensesnittet viser norsk format (`2,5 %`, `6,7`). I filene er dette skrevet som
`2.5` og `6.7`, og `ctr` er prosenttall uten `%`-tegn (`2.5` = 2,5 %).
Ingen verdier er endret, bare desimalskilletegn og prosenttegn.

**3. Sorteringen måtte settes på nytt for hvert uttrekk.**
Tabellen faller tilbake til sortering på klikk hver gang sidefilteret endres.
Visninger-synkende ble satt og verifisert (`aria-sort=descending`) før hver
avlesning.

**4. Radrekkefølgen ble sortert i etterkant.**
Search Console leverer radene i DOM-en i en blandet rekkefølge (rester av
klikk-sorteringen ligger igjen mellom de visningssorterte radene), selv når
visningen er satt til Visninger synkende. Filene er derfor sortert på
`impressions` synkende etter uthenting, med stabil sortering (like verdier
beholder opprinnelig rekkefølge). Dette påvirker **ikke** hvilke rader som er
med: siden ingen tabell er i nærheten av 1 000-taket, er alle spørringer med
uansett sortering.

**5. Integritetskontroll kjørt.**
For alle 548 rader er `ctr` kontrollert mot `clicks / impressions`. Null avvik,
altså ligger tall og spørring i samme rad slik de skal. Sorteringen er
kontrollert på nytt etter skriving: null brudd.

**6. Datovinduene måtte settes manuelt.**
Search Console ignorerer datoparametre i URL-en, så begge vinduer er satt via
Dato → Tilpasset og verifisert mot grafens akse (02.06–01.09 for v1,
16.03–01.09 for v2) før uttrekkene startet.

**7. De norske sidene har identiske tall i begge vinduer.**
`tann` (23 rader) og `avdod-person` (25 rader) er helt like i v1 og v2, og
`avliden-person` har samme radantall (37). Det ekstra kvartalet i v2 tilfører
altså så godt som ingenting for disse — dataene starter først i juni. Det er en
egenskap ved datagrunnlaget, ikke en feil i uttrekket.

**8. Ingen redigering av rader.**
Ingen aggregering, ingen sammenslåing av varianter, ingen fjerning av
duplikater, ingen filtrering. Stavefeil og tilsynelatende irrelevante søk
(`dalai lama`, `läkare symbol`, `inom islam`, `1`) står som de er.
