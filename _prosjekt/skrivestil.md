# Skrivestil for symbolartikler på drommeguiden.no

Denne filen er skrevet for å limes inn som instruks når nye symbolartikler
skal produseres. Alt under er målt på de 215 norske artiklene som ligger ute,
ikke hentet fra hukommelsen.

Siden ble godkjent for Google AdSense i august 2026, etter et tidligere avslag
begrunnet med lavverdig innhold. Reglene under er ikke stilpreferanser — de er
det som skiller den godkjente versjonen fra den avviste.

---

## 0. Les dette først: malen er død

`_MAL_SYMBOL.md` i rotmappen er **utdatert og skal ikke brukes**. Den beskriver
den gamle strukturen, der hver artikkel hadde de samme fem overskriftene:

```
## Hva betyr det å drømme om [symbol]?
## De vanligste tolkningene
## Hva påvirker tolkningen?
## Psykologiske og kulturelle perspektiver
## Drømmeguiden anbefaler
```

Det var nøyaktig denne strukturen som gjorde 500+ sider til det Google kaller
skalert innholdsmisbruk: samme skjelett, byttet substantiv. Den er fjernet fra
alle artikler.

`## Drømmeguiden anbefaler` skal **aldri** skrives. Refleksjonsspørsmålene
rendres nå av komponenten `ReflectionPrompts.astro` på hver symbolside. Skriver
du den overskriften i markdown, fjerner en remark-plugin alt fra den og ned til
neste H2 — innhold du legger etter den, forsvinner.

---

## 1. Den viktigste regelen

**Ingen H2 skal gjenbrukes mellom artikler.**

Målt på de 215 publiserte artiklene: 1 082 H2-overskrifter, og den eneste som
går igjen er `## Kilder og videre lesning` (215 ganger, med hensikt). Ikke én
eneste annen overskrift finnes i to artikler.

Overskriften skal si noe om *dette* symbolet. Den er ikke en etikett på en
seksjonstype.

| I stedet for | Skriv noe som |
|---|---|
| `## De vanligste tolkningene` | `## Gift og legedom: slangens doble natur` |
| `## Hva påvirker tolkningen?` | `## Hva vepsen gjorde, og hvor mange det var` |
| `## Psykologiske perspektiver` | `## Mellom fest og skyld i norsk kultur` |

Sjekk alltid mot eksisterende artikler før du fester en overskrift.

---

## 2. To nivåer av artikkel

Artiklene finnes i to former, og valget avgjør både lengde og struktur.

### Flaggskip — 40 artikler, median 965 ord

De 40 symbolene i `_prosjekt/flaggskip.txt`: de mest søkte. Disse er skrevet
som **sammenhengende essay**. 39 av 40 har verken H3-underoverskrifter eller
punktblokker — bare 4–6 egne H2-er med prosa under.

Kjennetegn:
- Åpner **uten** H2-spørsmål. Første linje etter frontmatter er brødtekst.
- Første H2 er en egen formulering, aldri «Hva betyr det å drømme om X?».
  Alle 40 flaggskip har dette; eksempler: «Rykket i det du sovner» (falle),
  «Hvem er det som jager deg?» (forfulgt), «Prøven som aldri tar slutt»
  (eksamen), «Nei, det betyr nesten aldri at du vil ha eksen tilbake» (eksen).
- Drømmevariantene skrives inn i prosaen, ikke som punktliste: «En slange som
  biter deg peker gjerne mot … En slange som derimot er vennlig, tolkes ofte
  som …»
- Tåler kulturhistorie, mytologi og etymologi i lengre drag.

### Øvrige — 175 artikler, median 653 ord

Kjennetegn:
- Åpner med `## Hva betyr det å drømme om [symbol]?` (171 av 215 gjør dette).
- 173 av 175 har H3-underoverskrifter under en egen H2.
- 132 av 175 har én seksjon med scenariovarianter i formen:

```markdown
## Hvem drakk, og hvordan føltes det

**Hvis du drakk med glede:**
Et ønske om mer letthet, spontanitet og sosial glede i livet.

**Hvis du ikke ville drikke men følte press:**
En grensesituasjon — noe eller noen presser deg til å gjøre noe du ikke vil.
```

  4–6 slike blokker. Overskriften over dem skal være egen — ikke «Hva påvirker
  tolkningen?».

**Tall å treffe:** 5 H2-er (spenn 3–7), 3 H3-er, 434–1 138 ord. Ligger du under
430 ord, er artikkelen for tynn til å forsvare seg selv.

Ikke bruk `---`-skillelinjer. Bare 8 av 215 har dem, og de er rester.

---

## 3. Stemme

Varm, direkte, andre person. Ikke akademisk, ikke mystisk, ikke tabloid.

**Åpningen skal aldri være en metabeskrivelse.** Ingen «I denne artikkelen skal
vi se på…». Gå rett i symbolet. De vanligste åpningsordene i korpuset er «Å»
(17), «Du» (12), «Der» (9), «Det» (8).

Tre reelle åpninger:

> Få dyr har fått lov til å bety så mye motstridende på én gang som slangen.

> Vepsen er ikke som biet — den produserer ikke honning, den gagner ikke
> direkte. Den er et dyr som bare stikker, og som kan stikke flere ganger.

> Klær er identitetens ytre hud — det vi viser frem til verden, den rollen vi
> ikler oss.

### Hedging er ufravikelig

Ingen absolutte påstander om hva en drøm betyr. Målt i korpuset: `kan speile`
158 ganger, `kan være` 75, `kan tolkes` 73, `trolig` 33, `handler ofte` 27,
`ofte er` 19, `kan bety` 18, `tolkes ofte` 16, `gjerne mot` 14, `peker gjerne` 10.

Formuleringer som **ikke** forekommer i korpuset og ikke skal skrives:
«dette betyr», «varsler at», «du kommer til å». Drømmen *kan speile*, *peker
gjerne mot*, *tolkes ofte som*. Aldri *betyr*.

Dette gjelder også varsler og forutsigelser. Norrøn drømmetradisjon skal
presenteres som kulturhistorie, aldri som dokumentasjon på at drømmer varsler.

### Norsk forankring der den finnes

Det er dette som skiller siden fra oversatte internasjonale drømmebøker. Bruk
det når det er ekte: alkoholens plass mellom fest og avholdskultur, fylgje og
hamingja fra ættesagaene, hjorten i Yggdrasil. Ikke finn på nordisk kobling der
den ikke finnes.

---

## 4. Frontmatter

```yaml
---
tittel: "Drømmer om [symbol] — hva betyr det?"
slug: [slug]
kategori: dyr | vann | mennesker | steder | kropp | hendelser | gjenstander | natur | aandelig
kortbeskrivelse: "[134–160 tegn. Median i korpuset er 145. Blir meta description.]"
relaterte:
  - [3–4 slugs som faktisk finnes]
tolkninger_kort:
  - "[Tolkning 1 — én setning]"
  - "[Tolkning 2]"
  - "[Tolkning 3]"
bilde: /bilder/symboler/[slug].jpg
dato: ÅÅÅÅ-MM-DD
oppdatert: ÅÅÅÅ-MM-DD
author: 'default'
sensitivt: true          # bare der det trengs, se punkt 7
relaterte_sovn:          # valgfritt, 24 % har det
  - [slug i src/content/sovn]
---
```

Alle 215 har `bilde`, `oppdatert` og `author`. 76 % har nøyaktig tre punkter i
`tolkninger_kort` — de vises i TL;DR-boksen øverst, så de skal kunne leses alene.

**Slugregel:** ø→o, æ→ae, å→a. `drøm` → `drom`, `ørken` → `orken`.

**Alle slugs i `relaterte` må finnes.** Ikke-eksisterende slugs droppes stille
av `finnes-symbol.ts`, så boksen blir bare tommere enn planlagt.

---

## 5. Interne lenker

Skriv **3 manuelle lenker** i brødteksten (median i korpuset; spenn 0–9), til
symboler eller guider som er reelt beslektet, i formen
`[edderkopp](/drommer/edderkopp/)`.

Ikke lenk mer enn det. En remark-plugin (`remark-auto-link-symbols.mjs`)
auto-lenker første forekomst av andre symbolnavn ved bygg, med maks 7 lenker per
artikkel og minst 100 tegn mellom hver. Skriver du inn mange lenker selv,
spiser du opp kvoten og hindrer pluginen i å gjøre jobben.

Overskrifter, sitatblokker og kodeblokker hoppes over av pluginen — en lenke i
en H2 må skrives manuelt (det er gjort i noen få artikler og ser greit ut).

---

## 6. Kildeliste

Siste seksjon, alltid `## Kilder og videre lesning`, **2–3 kilder** (median 3,
aldri flere).

```markdown
## Kilder og videre lesning

- Sigmund Freud, *Drømmetydning* (1900) — om slangen som fallisk symbol og
  undertrykt begjær.
- Carl Gustav Jung, *Mennesket og dets symboler* (1964) — om arketyper og
  skyggesider, relevant for slangens rolle som bilde på det ubevisste.
- G. William Domhoff, *The Scientific Study of Dreams* (2003) —
  kontinuitetshypotesen: hvordan en truende drøm ofte speiler en reell,
  uløst bekymring i våkenlivet.
```

Begrunnelsen etter tankestreken skal være skrevet **for dette symbolet**. En
generisk linje om kontinuitetshypotesen som er lik i femti artikler, er verre
enn ingen kilde.

**Bare verk fra `_prosjekt/kilder.md`.** Ingen sidetall, ingen oppdiktede
URL-er. Den fullstendige listen og reglene for navngitte forskere står der —
les den før du skriver kildelister. Kortversjonen: å tillegge en ekte forsker et
funn som ikke lar seg finne igjen, er verre enn å droppe kilden. Vi har allerede
måttet skrive om 18 slike avsnitt.

---

## 7. Sensitive symboler

32 av 215 har `sensitivt: true` — død, selvskade, vold, ulykker, sykdom, rus,
utroskap, tap av barn. Flagget rendrer en boks med:

> Drømmetolkning er refleksjon, ikke diagnose. Hvis innholdet i drømmen eller
> artikkelen vekker sterke følelser, snakk med noen du stoler på eller kontakt
> Mental Helse på 116 123.

Er du i tvil, sett flagget. I selve teksten: ingen dramatisering, ingen
varseltolkning av dødsdrømmer, og et avsnitt som møter leseren der de er —
slik `alkohol.md` gjør det for folk i rusfrihet.

---

## 8. Sjekkliste før en artikkel er ferdig

- [ ] Ingen H2 finnes fra før i noen annen artikkel
- [ ] 434–1 138 ord; flaggskip nær 965, øvrige nær 653
- [ ] Riktig nivå valgt: essay uten H3 (flaggskip) eller H3 + Hvis-blokker (øvrige)
- [ ] Minst tre ulike tolkninger av symbolet
- [ ] Ingen absolutte påstander — alt hedget
- [ ] Åpner i symbolet, ikke i en metabeskrivelse
- [ ] `kortbeskrivelse` 134–160 tegn
- [ ] Tre punkter i `tolkninger_kort`
- [ ] Alle `relaterte`-slugs finnes
- [ ] ~3 manuelle interne lenker
- [ ] 2–3 kilder, alle fra `_prosjekt/kilder.md`, begrunnet for dette symbolet
- [ ] `sensitivt: true` hvis temaet krever det
- [ ] Ingen `## Drømmeguiden anbefaler`, ingen `---`-skillelinjer

---

## 9. Svensk og engelsk

Norsk skrives først og er fasit. De to andre språkene har full paritet i dag:
215 / 215 / 215 symboler, alle koblet med `nb_slug`.

Oversettelse skal **skrives**, ikke maskinoversettes. En substitusjonstabell
gir svensk som ser riktig ut på overflaten og er feil for en svenske
(«sidene», «ennå», «oss själv» kom alle gjennom en slik runde og måtte skrives
om for hånd). Målet er idiomatisk svensk og idiomatisk engelsk — ikke norsk
med annen ortografi.

Frontmatter i oversettelsene:
- svensk: `nb_slug: [norsk slug]`, kildeoverskrift `## Källor och vidare läsning`
- engelsk: `nb_slug: [norsk slug]`, kildeoverskrift `## Sources and further reading`
- den norske filen får `sv_slug:` og `en_slug:` tilbake

Merk at `kategori` skal være den **norske** kategoriverdien også i svenske og
engelske filer — det er nøkkelen kategorisidene grupperer på. En svensk fil med
`kategori: djur` faller ut av kategorisiden.

Engelske titler skrives «Dreaming of a beach — what does it mean?». Etiketten
som vises i brikker utledes automatisk, og artikkelen (`a`, `an`, `the`)
strippes bort — du skal ikke fjerne den selv i tittelen.
