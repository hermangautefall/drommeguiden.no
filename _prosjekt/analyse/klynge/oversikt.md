# Fase A — oversikt over uttrekket

Generert 7. september 2026 fra de 16 CSV-filene i denne mappa.
Ingen tolkning, ingen artikkelforslag — det hører til fase B.

## Metode

Uttrekket ble lest **direkte fra spørringstabellen**, ikke via Search Consoles
EKSPORTÉR-knapp, fordi økten kjørte i skyen uten tilgang til nedlastingsmappa.
Samme filtre, samme sortering, samme datagrunnlag. `ctr` er kontrollert mot
`clicks / impressions` for alle 548 rader: **null avvik**.

Snittplassering under er visningsvektet, slik Search Console selv regner den.

## Per side og vindu

| Side | Vindu | Rader | Klikk | Visninger | Snittpos. | Laveste visningstall |
|---|---|---:|---:|---:|---:|---:|
| `orm` | v1 | 54 | 49 | 3922 | 7.0 | 1 |
| `orm` | v2 | 54 | 49 | 4107 | 7.6 | 1 |
| `tand` | v1 | 38 | 4 | 375 | 26.7 | 1 |
| `tand` | v2 | 39 | 4 | 401 | 27.0 | 1 |
| `otrohet` | v1 | 38 | 1 | 821 | 11.3 | 1 |
| `otrohet` | v2 | 39 | 1 | 941 | 12.5 | 1 |
| `otrohet-partner` | v1 | 26 | 1 | 225 | 16.5 | 1 |
| `otrohet-partner` | v2 | 28 | 1 | 270 | 18.8 | 1 |
| `avliden-person` | v1 | 37 | 15 | 1179 | 7.3 | 1 |
| `avliden-person` | v2 | 37 | 15 | 1182 | 7.3 | 1 |
| `gravid` | v1 | 30 | 21 | 1129 | 6.9 | 1 |
| `gravid` | v2 | 32 | 22 | 1372 | 7.7 | 1 |
| `tann` | v1 | 23 | 19 | 1404 | 6.6 | 1 |
| `tann` | v2 | 23 | 19 | 1424 | 6.9 | 1 |
| `avdod-person` | v1 | 25 | 10 | 421 | 7.9 | 1 |
| `avdod-person` | v2 | 25 | 10 | 459 | 8.8 | 1 |

## Kryssjekk mot de kjente sidetallene (vindu 1)

De kjente verdiene er **sidenivå**. Summen av spørringsradene er lavere, og
differansen er søk Google ikke navngir. Dekningsgraden er derfor det viktigste
tallet i hele uttrekket.

| Side | Klikk i radene | Kjent på siden | Dekning | Visn. i radene | Kjent | Dekning |
|---|---:|---:|---:|---:|---:|---:|
| `orm` | 49 | 197 | **25 %** | 3922 | 11030 | **36 %** |
| `tand` | 4 | 45 | **9 %** | 375 | 3441 | **11 %** |
| `otrohet` | 1 | 20 | **5 %** | 821 | 3642 | **23 %** |
| `otrohet-partner` | 1 | — | — | 225 | — | — |
| `avliden-person` | 15 | 314 | **5 %** | 1179 | 9613 | **12 %** |
| `gravid` | 21 | 80 | **26 %** | 1129 | 3795 | **30 %** |
| `tann` | 19 | 54 | **35 %** | 1404 | 4701 | **30 %** |
| `avdod-person` | 10 | 115 | **9 %** | 421 | 3922 | **11 %** |

`otrohet-partner` hadde ingen kjent sideverdi i oppdraget og er ikke kryssjekket.

### Avvik som må rapporteres

Ingen av de kjente tallene lot seg gjenskape fra spørringsradene. Dekningen
ligger på **5–36 % av visningene** og **5–35 % av klikkene**. For
`avliden-person` er 15 av 314 klikk synlige; for `otrohet` 1 av 20.

Dette er ikke et uttrekksfeil. To forhold utelukker avkorting:

1. Ingen av de 16 tabellene kom i nærheten av 1 000-radersgrensen — største er 54.
2. **Alle åtte v1-filene går ned til 1 visning i siste rad.** Hadde tabellen
   vært kuttet, ville halen stoppet på et høyere tall.

Listene er altså komplette ned til Googles rapporteringsgulv. Differansen er
anonymiserte søk: Google navngir ikke spørringer som ikke er gjort av mer enn
noen titalls distinkte brukere over to–tre måneder, verken i grensesnittet
eller via API-et.

## Kannibalisering: `otrohet` mot `otrohet-partner`

| | v1 | v2 |
|---|---:|---:|
| Spørringer på `otrohet` | 38 | 39 |
| Spørringer på `otrohet-partner` | 26 | 28 |
| Spørringer i begge sett | **26** | **28** |
| Andel av `otrohet` sine spørringer | 68 % | 72 % |
| Andel av `otrohet-partner` sine spørringer | **100 %** | **100 %** |
| Visninger på felles søk, `otrohet` | 690 av 821 (84 %) | 813 av 941 (86 %) |
| Visninger på felles søk, `otrohet-partner` | 225 av 225 (100 %) | 270 av 270 (100 %) |

Hver eneste spørring `otrohet-partner` vises på, vises også `otrohet` på — i
begge vinduer. Tallene står uten tolkning, slik oppdraget ber om.

## Filer

16 CSV-filer, 548 rader totalt, kolonnene `query, clicks, impressions, ctr,
position`. Desimaler med punktum, `ctr` som prosenttall uten `%`.
Radene er usortert-uendret: ingen aggregering, ingen sammenslåing, ingen
filtrering. Stavefeil og tilsynelatende irrelevante søk står som de er.
