# CLAUDE.md — drommeguiden.no

Dette er prosjektinstruksjoner for Claude Code. Les denne filen grundig før du gjør
noen endringer i prosjektet.

---

## Hva er dette prosjektet?

**drommeguiden.no** er en norsk drømmtydningsside med mål om å bli den ledende
ressursen for norske søk på drømmesymboler og drømmtolkning. Siden er bygget for
organisk SEO-trafikk og monetiseres med display-annonser (Ezoic/Mediavine).

Siden har tre innholdstyper:
1. **Symbolsider** — én side per drømmesymbol (mål: 2000–5000 sider)
2. **Kategorisider** — tematiske hubber som samler symboler
3. **Guideartikler** — langformat, autoritativt innhold om drømmer generelt

---

## Teknisk stack

- **Rammeverk:** Astro (statisk site generation, ingen server-side rendering)
- **Styling:** Tailwind CSS
- **Innhold:** Markdown med frontmatter (Astro Content Collections)
- **Hosting:** Cloudflare Pages (deploy ved push til main-branch på GitHub)
- **Versjonskontroll:** GitHub

---

## Mappestruktur

```
drommeguiden/
├── src/
│   ├── content/
│   │   ├── drommer/       ← En .md-fil per drømmesymbol
│   │   ├── kategorier/    ← Kategorisider (hub-sider)
│   │   └── guider/        ← Langformat guideartikler
│   ├── pages/
│   │   ├── index.astro          ← Forside
│   │   ├── drommer/
│   │   │   └── [slug].astro     ← Dynamisk symbolside
│   │   ├── kategori/
│   │   │   └── [slug].astro     ← Dynamisk kategoriside
│   │   └── guider/
│   │       └── [slug].astro     ← Dynamisk guideside
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── SymbolKort.astro     ← Kort-komponent brukt i lister
│   │   ├── RelaterteBoks.astro  ← "Se også"-boks på symbolsider
│   │   ├── TLDRBoks.astro       ← Rask-tolkningsboks øverst på symbolsider
│   │   └── NewsletterCTA.astro  ← Nyhetsbrev-påmelding
│   └── layouts/
│       ├── Base.astro           ← HTML-skall med meta, fonts, ads
│       ├── Symbol.astro         ← Layout for symbolsider
│       ├── Kategori.astro       ← Layout for kategorisider
│       └── Guide.astro          ← Layout for guideartikler
├── public/
│   ├── fonts/
│   ├── ikoner/                  ← SVG-ikoner for kategorier
│   └── og-image.png             ← Standard Open Graph-bilde
├── CLAUDE.md                    ← Denne filen
└── astro.config.mjs
```

---

## Design og estetikk

### Fargepalett (bruk ALLTID disse variablene)

```css
--farge-natt:       #1a1f3a   /* Primær mørk — bakgrunn header/footer */
--farge-krem:       #f2ede6   /* Primær lys — sidens bakgrunn */
--farge-sand:       #e8e0d4   /* Sekundær lys — kortbakgrunner */
--farge-terrakotta: #c08070   /* Aksent — knapper, lenker, highlights */
--farge-tekst:      #2d2926   /* Brødtekst — ikke rent svart */
--farge-subtil:     #8a7f76   /* Sekundær tekst, metadata */
```

### Typografi

- **Overskrifter:** Cormorant Garamond (serif) — lades fra Google Fonts
- **Brødtekst:** Inter (sans-serif) — lades fra Google Fonts
- Overskriftstørrelser: H1: 2.5rem, H2: 1.75rem, H3: 1.25rem
- Linjelengde i brødtekst: maks 68 tegn (ca. 650px)

### Generelle designregler

- Mye whitespace. Aldri overfylt.
- Mobilfirst — test alltid på 375px bredde
- Ingen rene svarte farger (`#000`) — bruk `--farge-tekst`
- Ingen rene hvite farger (`#fff`) — bruk `--farge-krem`
- Avrundede hjørner: `border-radius: 12px` på kort, `8px` på knapper
- Skygger: myk og varm — `box-shadow: 0 2px 12px rgba(26,31,58,0.08)`

---

## URL-konvensjoner

- Symbolsider:    `/drommer/[slug]`      eks: `/drommer/slange`
- Kategorisider:  `/kategori/[slug]`     eks: `/kategori/dyr`
- Guideartikler:  `/guider/[slug]`       eks: `/guider/hva-er-drommer`
- Alle slugs: lowercase, norske bokstaver erstattes (ø→o, æ→ae, å→a)
  - eks: `drøm` → `drom`, `ørken` → `orken`

---

## SEO-regler (følg alltid disse)

Hver side MÅ ha:
- `<title>` på formen: `[Tittel] | Drømmeguiden`
- `<meta name="description">` mellom 140–160 tegn
- Én `<h1>` per side — ingen flere
- `canonical`-URL
- Open Graph-tags (`og:title`, `og:description`, `og:image`)

Symbolsider bruker alltid disse søkeordsvariantene i innholdet:
- `drømt om [symbol]`
- `hva betyr det å drømme om [symbol]`
- `[symbol] i drøm`

Aldri keyword-stuffing. Innholdet skal leses naturlig.

### Schema markup

- Symbolsider: `FAQPage`-schema + `Article`-schema
- Guideartikler: `Article`-schema
- Forside: `WebSite`-schema med `SearchAction`

---

## Innholdsregler

- Språk: **norsk bokmål** alltid
- Tone: varm, respektfull, nysgjerrig — ikke akademisk, ikke mystisk/tabloid
- Aldri absolutte påstander ("denne drømmen BETYR at...") — alltid "kan bety", "tolkes ofte som"
- Hver symbolside skal gi **minst 3 ulike tolkninger** av symbolet
- Interne lenker: minst 3–5 per side til relaterte symboler eller kategorier

---

## Kritiske ting å ALDRI gjøre

- Ikke bruk database eller server-side kode — alt skal være statisk
- Ikke installer unødvendige npm-pakker — hold prosjektet lett
- Ikke bruk inline styles — bruk Tailwind-klasser eller CSS-variabler
- Ikke hardkod farger i komponenter — bruk alltid CSS-variablene over
- Ikke lag sider utenfor den definerte mappestrukturen
- Ikke endre URL-strukturen uten å oppdatere denne filen

---

## Vanlige oppgaver — slik gjør du dem

### Legge til en ny symbolside
1. Lag fil: `src/content/drommer/[slug].md`
2. Bruk frontmatter-malen fra `_MAL_SYMBOL.md`
3. Push til GitHub — Cloudflare deployer automatisk

### Legge til mange symbolsider på en gang
Be Claude Chat generere Markdown-filer i bulk og lim dem inn i `src/content/drommer/`

### Endre design på alle symbolsider
Rediger `src/layouts/Symbol.astro` og `src/components/` — ikke enkeltfiler

### Legge til ny kategori
1. Lag `src/content/kategorier/[slug].md`
2. Legg til kategori-verdien i frontmatter på relevante symbolsider

---

## Annonser (Ezoic)

Ezoic-scriptet legges i `<head>` i `src/layouts/Base.astro`.
Annonse-plasseringer som fungerer best for denne siden:
- Etter TL;DR-boksen (høyt på siden, god synlighet)
- Midt i brødteksten etter 3. avsnitt
- Etter "Relaterte symboler"-seksjonen

---

## Kontakt og eier

Eier: Herman Gautefall Olsson  
Nettside: drommeguiden.no  
Repo: github.com/[brukernavn]/drommeguiden
