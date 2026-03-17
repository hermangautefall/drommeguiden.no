# Innholdsprompts — drommeguiden.no

Bruk disse promptene i Claude Chat for å generere innhold i bulk.
Lim inn det genererte innholdet direkte i riktig mappe og push til GitHub.

---

## PROMPT 1: Generer mange symbolsider på én gang

```
Du er innholdsskaper for drommeguiden.no — en norsk drømmtydningsside
med varm, respektfull og nysgjerrig tone.

Generer [TALL] Markdown-filer for drømmesymboler. Bruk nøyaktig denne malen:

---
tittel: "Drømmer om [SYMBOL] — hva betyr det?"
slug: [slug-lowercase-ingen-norske-bokstaver]
kategori: [dyr|vann|mennesker|steder|kropp|hendelser|ting]
kortbeskrivelse: "[140-160 tegn]"
relaterte:
  - [slug1]
  - [slug2]
  - [slug3]
tolkninger_kort:
  - "[Tolkning 1]"
  - "[Tolkning 2]"
  - "[Tolkning 3]"
dato: 2025-03-17
---

## Hva betyr det å drømme om [symbol]?
[3-5 setninger, varm og direkte, bekreft at dette er vanlig]

## De vanligste tolkningene
### [Tolkning 1]
[2-4 avsnitt]
### [Tolkning 2]
[2-4 avsnitt]
### [Tolkning 3]
[2-4 avsnitt]

## Hva påvirker tolkningen?
[4-6 varianter med fet innledning]

## Psykologiske og kulturelle perspektiver
[2-3 avsnitt, kan nevne Jung, norsk folklore eller kulturell kontekst]

## Drømmeguiden anbefaler
Drømmer gir sjelden ett enkelt svar — de snakker til deg gjennom bilder
og følelser. Spør deg selv:
- Hvilken **følelse** satt du igjen med da du våknet?
- Hva skjer i **livet ditt** akkurat nå?
- Har du drømt om [symbol] **flere ganger**?

---

Symbolene du skal skrive om:
[LИСТ MED SYMBOLER HER]

Viktig:
- Skriv alltid "kan bety", "tolkes ofte som" — aldri absolutte påstander
- Norsk bokmål alltid
- Slug: erstatt ø→o, æ→ae, å→a, mellomrom→bindestrek
- Lever alle filene i ett svar, tydelig separert
```

---

## PROMPT 2: Generer én grundig symbolside

```
Skriv en fullstendig Markdown-fil for drommeguiden.no om drømmesymbolet "[SYMBOL]".

Bruk malen i _MAL_SYMBOL.md. Siden skal:
- Ha minimum 600 ord
- Gi 3-4 distinkte tolkninger med egne avsnitt
- Nevne minst én psykologisk referanse (Jung er alltid relevant)
- Ha en norsk/nordisk kulturell vinkel der det passer
- Liste 5 kontekstvarianter under "Hva påvirker tolkningen?"
- Foreslå 4 relaterte symboler (som slugs)

Ton: varm, respektfull, aldri mystig eller skummel. Som en klok venn,
ikke en horoskopside.
```

---

## PROMPT 3: Generer en kategoriside

```
Skriv en Markdown-fil for kategorisiden "[KATEGORI]" på drommeguiden.no.
Bruk malen i _MAL_KATEGORI.md.

Kategorien dekker disse typene symboler: [LIST EKSEMPLER]

Siden skal ha:
- En engasjerende introduksjon (4-6 setninger)
- Et avsnitt om hva denne typen drømmer generelt kan bety
- 3 FAQ-spørsmål med svar
- Totalt 400-600 ord
```

---

## PROMPT 4: Generer en guideartikkel

```
Skriv en guideartikkel for drommeguiden.no om emnet: "[EMNE]"

Bruk malen i _MAL_GUIDE.md. Artikkelen skal:
- Være 1200-1800 ord
- Ha en engasjerende åpning som ikke starter med "I denne artikkelen"
- Inkludere psykologisk perspektiv (Jung, Freud, moderne søvnforskning)
- Ha praktiske råd leseren kan bruke
- Avsluttes med en konkret oppsummering
- Inkludere 5-6 forslag til interne lenker (som slugs)

Tone: varm, tillitsskapende, litt nordisk — rolig og gjennomtenkt.
```

---

## PROMPT 5: Massegenerering av symboler etter kategori

```
Generer 30 Markdown-filer for drommeguiden.no.
Alle symbolene skal tilhøre kategorien "[KATEGORI]".

Hold dem korte og konsise — ca. 400-500 ord per fil.
Bruk den faste malen. Prioriter de mest søkte norske drømmesymbolene
innen denne kategorien.

Lever alle 30 filer sammenhengende i ett svar.
Skill filene med en tydelig separator: === NESTE FIL: [slug].md ===
```

---

## Tips for effektiv bruk

1. Start alltid med de 20-30 mest søkte symbolene (se listen under)
2. Generer 10-20 filer om gangen — ikke for mange i én prompt
3. Les igjennom et par stykker etter generering for å sjekke kvalitet
4. Push til GitHub etter hver batch — da ser du resultatet live

## De 30 mest søkte norske drømmesymbolene (start her)

```
slange, eksen, tann (faller ut), falle, flyge, hav, hund, katt,
baby, brann, bil (krasjer), forfølgelse, hus, dø, bryllup, gravid,
edderkopp, bjørn, vann (drukne), naken (i offentlighet), eksamen,
drage, ulv, orm, tiger, løve, rev, fugl, blod, mørkt rom
```
