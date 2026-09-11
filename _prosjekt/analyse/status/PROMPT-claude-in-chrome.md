# Uttrekk 2 — lim inn i Claude in Chrome

Du er logget inn i Google Search Console for `drommeguiden.no`. Hent ut fem
datasett. Ikke analyser, ikke foreslå tiltak. Bare hent, noter og lever.

## Hvorfor akkurat disse fem

Vi har i dag spørringsdata for **8 av 723 sider**. Alt vi har bestemt om
innholdsplanen hviler på den prøven. De fem oppgavene under lukker de hullene
som faktisk endrer beslutninger — i prioritert rekkefølge. Rekker du bare de to
første, er det fortsatt verdt turen.

---

## Felles oppsett

- Property: `drommeguiden.no` (domeneproperty)
- Rapport: Ytelse → Søkeresultater · Søketype: **Nett**
- **Sorter alltid på Visninger, synkende.** Standard er klikk, og det fyller
  tabellen med toppen vi allerede kjenner. Halen har visninger, ikke klikk.
- Filtrer på side med **Eksakt nettadresse**, aldri «Inneholder».
- Datoer settes under **Dato → Tilpasset**. Search Console ignorerer
  datoparametre i URL-en.
- Tabellen viser maks **1 000 rader**. **Noter hvert uttrekk som traff taket** —
  da mangler bunnen av halen, og det må vi vite.

Kjører økten din i skyen uten tilgang til nedlastingsmappa, les radene rett ut
av tabellen i stedet for å bruke EKSPORTÉR. Samme data, og du kan navngi filene
riktig.

---

## 1. Er det nye indeksert? (viktigst)

**Uten dette er resten uten mening.** 23 sider er publisert de siste ukene og vi
vet ikke om Google har sett dem.

Gå til **Indeksering → Sider**. For hver av URL-ene under, bruk
**URL-inspeksjon** og noter status (Indeksert / Oppdaget – ikke indeksert /
Gjennomsøkt – ikke indeksert / Ikke funnet):

```
https://drommeguiden.no/symboler/sommerfugl/
https://drommeguiden.no/sv/symboler/fjaril/
https://drommeguiden.no/en/symbols/butterfly/
https://drommeguiden.no/drommer/noen-dor/
https://drommeguiden.no/drommer/dod-mor/
https://drommeguiden.no/drommer/vaere-utro/
https://drommeguiden.no/drommer/basseng/
https://drommeguiden.no/drommer/fisk/
https://drommeguiden.no/sv/drommar/nagon-dor/
https://drommeguiden.no/en/dreams/someone-dying/
```

Noter også totaltallene fra Sider-rapporten: hvor mange indekserte, hvor mange
ikke indekserte, og de tre vanligste årsakene til at sider ikke er indeksert.

**Fil:** `indeksering.md`

---

## 2. Sommerfuglpiloten

Tre sider publisert 4. september. De avgjør om en hel seksjon skal bygges ut.

Vindu: **2026-09-04 til i dag**. Én spørring per URL, eksakt nettadresse:

```
https://drommeguiden.no/symboler/sommerfugl/
https://drommeguiden.no/sv/symboler/fjaril/
https://drommeguiden.no/en/symbols/butterfly/
```

Noter per side: visninger, klikk, CTR, snittplassering — og alle spørringer.

Hent samme tall for **de gamle sidene i samme vindu**, så vi kan se om trafikken
flyttet seg eller kom i tillegg:

```
https://drommeguiden.no/drommer/sommerfugl/
https://drommeguiden.no/sv/drommar/fjaril/
https://drommeguiden.no/en/dreams/butterfly/
```

**Fil:** `sommerfugl.md`

---

## 3. Hele siden på sidenivå

Dette er det største hullet. Vi har aldri sett hvilke sider som faktisk bærer
trafikken.

Vindu: **2026-06-02 til 2026-09-01** (samme som tidligere faser, så tallene kan
krysssjekkes).

Gå til fanen **Sider**, sorter på visninger synkende, og hent **alle rader**
med kolonnene: side, klikk, visninger, CTR, snittplassering.

Ikke filtrer på noe. Vi vil ha hele bildet, også søvnsidene, guidene og
oversiktssidene.

**Fil:** `sider-alle.csv`

---

## 4. Søvnseksjonen på spørringsnivå

33 søvnartikler per språk, og vi har null spørringsdata på dem. Neste pulje
artikler er planlagt her, og uten dette blir utvalget gjetning.

Samme vindu som over. Ta de **ti søvnsidene med flest visninger** fra
oppgave 3, og hent alle spørringer for hver, én side om gangen med eksakt
nettadresse.

Traff noen av dem 1 000-radersgrensen, noter det.

**Fil:** `sovn-[slug].csv` per side, pluss en kort `sovn-logg.md` med hvilke ti
sider du valgte og radantallet for hver.

---

## 5. Søk på plassering 11–20

De billigste gjenværende gevinstene: søk der siden er på side 2 av Google.

Samme vindu. Fanen **Spørringer**, ingen sidefilter, sortert på visninger
synkende. Hent alle rader, og marker hvilke som har snittplassering mellom
**11,0 og 20,0**.

Er det for mange rader til å håndtere, ta de 300 med flest visninger innenfor
det plasseringsintervallet.

**Fil:** `plassering-11-20.csv` med kolonnene query, clicks, impressions, ctr,
position.

---

## Regler

- **Ikke aggregér.** Ingen sammenslåing av varianter, ingen fjerning av
  duplikater.
- **Ikke rediger radene.** Stavefeil og tilsynelatende irrelevante søk skal med.
- **Ikke filtrer bort noe** på eget initiativ.
- Tallformat: bruk punktum som desimalskilletegn og oppgi `ctr` som prosenttall
  uten `%`-tegn. Ikke endre verdier utover det.
- Kontroller at `ctr` stemmer mot `clicks / impressions` før du leverer.

## Noter avvik

Lag `uttrekk-logg.md` med alt som ikke gikk som beskrevet: filtre som ikke lot
seg sette, datovinduer som ble justert, tabeller som traff taket, rapporter som
manglet data.

Det siste punktet er viktigere enn det ser ut. **Google anonymiserer søk som
ikke er gjort av mer enn noen titalls distinkte brukere over to–tre måneder**,
og de strengene returneres aldri. Forrige uttrekk dekket bare 5–36 % av
trafikken på sidene vi målte. Kommer noe tynt tilbake, er det Googles gulv og
ikke en feil hos deg — men noter det, så vi ikke tolker stillhet som fravær.

## Levering

Alle filene i `_prosjekt/analyse/status/`.

Stopp der. Ingen analyse.
