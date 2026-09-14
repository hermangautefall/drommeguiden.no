# Oversettelse til dansk — arbeidsspec

Denne filen er kontrakten for alle danske oversettelser. Les den helt før du
skriver en eneste fil.

---

## Hva oppgaven er

Du oversetter ferdige norske artikler til dansk. Det er **oversettelse**, ikke
omskriving: samme struktur, samme H2-er, samme avsnitt, samme kilder, samme
lengde (±10 %). Den svenske utgaven er gjort slik, og dansk skal ligne den.

## Hvorfor dette er vanskeligere enn det ser ut

Norsk bokmål og dansk deler det meste av skriftbildet. Det gjør at en
oversettelse kan se ferdig ut mens den fortsatt er **norsk med dansk staving**
— og en dansk leser ser det på første avsnitt. Nærheten er fellen, ikke
lettelsen.

Du skal skrive slik en dansk redaktør ville skrevet teksten fra bunnen av.
Sett deg i den stolen før du begynner.

---

## Harde språkregler

Disse finnes ikke på dansk, eller er entydig feil:

| norsk | dansk |
|---|---|
| `å` (infinitivsmerke) | `at` |
| `gjennom`, `gjøre`, `gjerne` | `gennem`, `gøre`, `gerne` |
| `kjenne`, `kjøpe`, `kjære` | `kende`, `købe`, `kære` |
| `øye`, `høyre`, `støy` | `øje`, `højre`, `støj` |
| `oss`, `deg`, `meg`, `seg` | `os`, `dig`, `mig`, `sig` |
| `noe`, `mye`, `veldig` | `noget`, `meget`, `meget`/`virkelig` |
| `etter`, `mellom`, `uten`, `igjen`, `enn` | `efter`, `mellem`, `uden`, `igen`, `end` |
| `blir`, `gir`, `tar`, `sier` | `bliver`, `giver`, `tager`, `siger` |
| `vann`, `natt`, `litt`, `alltid` | `vand`, `nat`, `lidt`, `altid` |
| `hverandre`, `sjelden`, `sånn`, `slik` | `hinanden`, `sjælden`, `sådan`, `sådan` |
| `hjelpe`, `fortelle`, `viktig` | `hjælpe`, `fortælle`, `vigtig` |
| `måte`, `gate`, `bok`, `sitte` | `måde`, `gade`, `bog`, `sidde`|
| `tenner`, `jente`, `gutt`, `sau` | `tænder`, `pige`, `dreng`, `får` |
| `hvit`, `svart`, `farge`, `spørre`, `syk` | `hvid`, `sort`, `farve`, `spørge`, `syg` |
| `rom` (værelse), `ut`, `inn`, `mot` | `rum`, `ud`, `ind`, `mod` |
| `-sjon` (situasjon) | `-tion` (situation) |
| `fortsatt`, `ennå`, `nå` (=nu) | `stadig`, `endnu`, `nu` |

**Merk:** `gjorde`, `gjort` og `nå` (= nå frem til) *er* ekte dansk. Ikke rett
dem.

Ut over ordlisten: dansk bruker `bliver`/`giver`/`tager` der norsk kortformer,
`hinanden` der norsk sier `hverandre`, og setter oftere `at` inn i
leddsetninger. Les setningen høyt for deg selv på dansk før du går videre.

---

## Frontmatter — eksakt

```yaml
---
tittel: "<dansk tittel, se under>"
slug: <dansk slug>
nb_slug: <den norske filens slug — UENDRET, dette er limet mellom språkene>
kategori: <dansk kategoriverdi, se tabell>
kortbeskrivelse: "<134–160 tegn, dansk, ingen linjeskift>"
relaterte:
  - <slug som FINNES i src/content/drommer-da/ eller i denne puljen>
tolkninger_kort:
  - "<tre korte danske punkter, oversatt fra de norske>"
bilde: <kopier uendret fra den norske filen, hvis den har et>
dato: <kopier fra norsk>
oppdatert: <kopier fra norsk>
author: 'default'
---
```

Felt som **ikke** skal med: `sensitivt` kopieres kun hvis den norske har det.
`relaterte_sovn` sløyfes (ingen danske søvnartikler finnes ennå).

### Kategorier — norsk verdi → dansk verdi

| nb | da |
|---|---|
| `dyr` | `dyr` |
| `vann` | `vand` |
| `kropp` | `krop` |
| `steder` | `steder` |
| `hendelser` | `haendelser` |
| `mennesker` | `mennesker` |
| `natur` | `natur` |
| `gjenstander` | `genstande` |
| `aandelig` | `aandeligt` |

Feil her gjør at artikkelen faller ut av kategorisiden sin uten å feile i bygget.

### Slug — ikke finn på din egen

Alle 231 danske slugger er bestemt på forhånd i `_prosjekt/slugkart-dansk.tsv`
(kolonne 1 = norsk slug, kolonne 2 = dansk slug). Slå opp der. Sluggen er en
permanent URL, og kartet er det som hindrer at to agenter velger hvert sitt
navn på samme artikkel.

Samme fil er fasiten for `relaterte`: du kan peke på hvilken som helst dansk
slug i kartet, også en som ikke er skrevet ennå. Systemet dropper stille de som
mangler, så det blir aldri en død lenke — men bruk helst slugger som finnes nå,
så boksene ikke står halvtomme.

### Tittel

**Ikke bruk samme mal på alle.** De norske heter nesten alle «Drømmer om X —
hva betyr det?», og det koster oss klikk. Danske sider rangerer ikke ennå, så
det koster ingenting å variere fra start.

Hodet skal inneholde det folk faktisk søker på (`Drømme om X`), halen skal gi
en grunn til å klikke:

- `Drømme om at miste tænder — hvorfor er den så almindelig?`
- `Drømme om kat — hvem er den uafhængige i drømmen?`
- `Drømme om slanger — advarsel eller forvandling?`

Halen skal være et spørsmål som slutter med `?`, og den skal stå etter ` — `
(tankestrek med mellomrom). Systemet bruker akkurat det mønsteret til å lage
korte etiketter i brødsmuler og relatert-bokser.

---

## Første overskrift — alltid

Artikkelen skal åpne med denne H2-en, og innledningsprosaen skal stå under den:

```
## Hvad betyder det at drømme om <dansk frase>?
```

Dette gjelder **også når den norske kilden mangler den**. 238 av 241 svenske og
237 av 241 engelske artikler har den; bare 196 av 241 norske. Overskriften er
en ordrett søkefrase, og dansk skal ligne søsterspråkene, ikke kilden.

Frasen er den naturlige danske formen: `hund`, `slanger`, `at miste tænder`,
`en afdød person`, `at dræbe nogen`.

Eneste unntak: starter artikkelen rett på en annen H2 uten innledningsprosa,
la den stå — to overskrifter på rad er verre enn en manglende.

---

## Tone og innhold

- Varm, respektfull, nysgjerrig. Ikke akademisk, ikke mystisk.
- Aldri absolutte påstander. «kan betyde», «tolkes ofte som» — aldri «betyder
  at».
- Behold alle kildehenvisninger. Seksjonen heter `## Kilder og videre læsning`.
- **Interne lenker skal du ikke lage manuelt.** Fjern lenkemarkeringen fra alle
  lenker i den norske teksten og la ordene stå som vanlig tekst. En remark-plugin
  legger inn 3–7 danske lenker automatisk ved bygg, og den gjør det på nytt hver
  gang — så artikler du skriver nå får lenker etter hvert som resten av korpuset
  kommer til. Legger du inn lenker for hånd, blir de enten døde nå eller
  dobbeltlenker senere.
- H2-ene skal være unike på tvers av hele det danske korpuset, bortsett fra
  `## Kilder og videre læsning`. Ikke gjenbruk en overskrift du har brukt i en
  annen artikkel i samme pulje.

---

## Før du leverer — kjør dette selv

```bash
python3 _prosjekt/verktoy/norvagismer.py src/content/drommer-da/<dine-filer>.md
```

Den skal svare `HARD 0`. Gjør den ikke det, er teksten ikke ferdig oversatt.
Rett og kjør på nytt. Myke treff leses, men er ikke nødvendigvis feil.

**Hvis skannet flagger noe du mener er korrekt dansk — ikke skriv om teksten
for å blidgjøre det.** Skriv det i rapporten i stedet, så retter jeg regelen.
Kalibreringen kostet oss allerede ett slikt tilfelle: en agent byttet det helt
normale `det skjulte` mot det arkaiske `det dulgte` fordi regelen min for `skj-`
var for bred. Regelen var feil, ikke teksten. Et falskt treff er min feil å
rette, ikke din å pynte bort.

Sjekk også selv:
- `kortbeskrivelse` er 134–160 tegn
- `kategori` står i tabellen over
- hver `relaterte`-slug finnes som fil i `src/content/drommer-da/`
- ingen H2 er gjenbrukt fra en annen fil i puljen
