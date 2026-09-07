# Sommerfuglpiloten — lansering

Bygget 7. september 2026. Ett symbol, tre språk, egen seksjon.

## URL-er

| Språk | URL | Ord |
|---|---|---|
| Norsk | `/symboler/sommerfugl/` | 1 008 |
| Svensk | `/sv/symboler/fjaril/` | 983 |
| Engelsk | `/en/symbols/butterfly/` | 1 041 |

Ruteordet ble som foreslått. `/symboler/` var ledig på alle tre språk — ingen
sidefiler, ingen redirects som skygget.

---

## Hva som ble bygget

**Tre nye innholdssamlinger** i `src/content.config.ts`: `symboler`,
`symboler-sv`, `symboler-en`, med et eget `symbolerSchema`. Skjemaet har
ikke `kategori` — seksjonen har ingen kategoriinndeling — og har i stedet
`relaterte_drommer`.

**Egen layout**, `src/layouts/SymbolBetydning.astro`, kopiert fra
`Symbol.astro` og deretter tilpasset. Kopi, ikke variant, fordi de to
seksjonene skal kunne utvikle seg hver for seg. Forskjellene:

- `ReflectionPrompts` rendres ikke — refleksjonsspørsmål hører til drømmetydning
- ingen kategori, så brødsmulene er Hjem / Symbolbetydning / tittel
- `RelaterteBoks` er byttet mot en ny `TilDrommetydning.astro`
- FAQ-schemaet spør om å **se** symbolet, ikke om å drømme om det
- `RelatertSovn` og `relaterte_sovn` er fjernet

**`src/components/TilDrommetydning.astro`** — boksen som lenker over til
drømmeartikkelen. Bruker `symbolerSomFinnes()`, så en slug uten artikkel
droppes stille i stedet for å bli en død lenke, akkurat som `RelaterteBoks`.

**Sitemap**: tre `loadCollection()`-kall og tre løkker med gjensidig hreflang
lagt inn i `sitemap-integration.mjs`. 282 → 283 URL-er per språk.

---

## Frontmatter — hvert felt jeg endret

| Fil | Felt | Fra | Til | Hvorfor |
|---|---|---|---|---|
| `symboler-sv/fjaril.md` | `bilde` | `/bilder/symboler/fjaril.jpg` | `/bilder/symboler/sommerfugl.jpg` | Fila fantes ikke |
| `symboler-en/butterfly.md` | `bilde` | `/bilder/symboler/butterfly.jpg` | `/bilder/symboler/sommerfugl.jpg` | Fila fantes ikke |
| `symboler/sommerfugl.md` | `nb_slug` | — | `sommerfugl` | `nb_slug` er ryggraden i språkkoblingen; uten den måtte hreflang-oppslaget ha en særregel for norsk |

Ingenting annet ble endret. `kategori` fantes ikke i utkastene og trengtes
ikke. `relaterte_drommer` ble beholdt som det sto.

**Bildet er ikke lastet opp på nytt.** Det norske utkastet pekte på
`/bilder/symboler/sommerfugl.jpg` — nøyaktig samme fil som de tre
*eksisterende* drømmeartiklene bruker. Å legge et nytt bilde der ville
overskrevet bildet på `/drommer/sommerfugl/`, `/sv/drommar/fjaril/` og
`/en/dreams/butterfly/`. Alle tre nye sider gjenbruker derfor den eksisterende
fila. Attribusjonen følger med av seg selv: `BildeKreditt` slår opp på
filnavnet, og `sommerfugl.jpg` står allerede i `credits.json` med Belén
Montero. Det fantes ingen Pexels-nøkkel i miljøet, så API-alternativet var
ikke tilgjengelig.

---

## Fase 4 — verifisering, med funn

**H2-unikhet.** Alle femten overskrifter kontrollert mot 4 525 H2-er i hele
`src/content/`. Ingen kollisjoner utover de tre kildeoverskriftene, som skal
gjenta seg.

**Interne lenker.** Alle ni fantes. De engelske sluggene var antatt i
oppdraget og viste seg å stemme: `butterfly.md`, `deceased-person.md` og
`bird.md` ligger alle i `drommer-en`. Ingen lenker måtte fjernes.

**Artsnavn.** Kontrollert mot eksterne kilder, ikke mot hukommelse.
*Aglais urticae* = neslesommerfugl / nässelfjäril / small tortoiseshell og
*Gonepteryx rhamni* = sitronsommerfugl / citronfjäril / brimstone. Begge
overvintrer som voksne, og begge er blant de første som viser seg om våren.
Påstandene i teksten holder. Ingen navn endret.

**Kilder.** Jung, Wiseman og Worden står alle på `_prosjekt/kilder.md`. Ingen
er tillagt et tall, en prosent eller et konkret funn — alle tre står med hedget
formulering og begrunnelse skrevet for sommerfuglen.

Den svenske Jung-tittelen er kontrollert: *Människan och hennes symboler*,
Karin Stolpes oversettelse. Første svenske utgave er **1966**, ikke 1964 som
oppgitt. Årstallet er likevel **beholdt**, fordi hele korpuset bruker lokal
tittel med originalens årstall — 160 svenske, 159 norske og 160 engelske
artikler gjør det slik. Å rette denne ene ville gjort den inkonsistent med
479 andre.

**Auto-lenking.** `remark-auto-link-symbols.mjs` har en hard stivakt på
`content/drommer/` og hopper dessuten eksplisitt over `drommer-sv`. Den rører
ikke den nye samlingen, og ingen eksklusjon var nødvendig. De eneste lenkene
til drømmesider i de nye artiklene er de tre i `relaterte_drommer`-boksen.

**Absolutter.** Ingen forekomster av «varsler at» eller «du kommer til å».
Ett treff på «betyr at» i den norske teksten: *«Nei. Det betyr at det ikke var
et varsel.»* Det er en benektelse som peker riktig vei, og den står urørt.

### Rettet i layouten, ikke i teksten

FAQ-schemaet hentet symbolordet fra sluggen. Sluggene er transkribert, så det
svenske spørsmålet ble **«Vad betyder det att se en fjaril?»** — uten ä, som
ville stått feilstavet i Googles rike resultater. Schemaet bruker nå
artikkeltittelen i stedet. Norsk og svensk fikk samtidig bestemt form i det
andre spørsmålet, som leser bedre.

---

## Byggestatus

Exit-kode 0, ingen advarsler. 852 sider, **0 døde lenker** i hele bygget.
Sitemap 283 per språk med gjensidig hreflang og x-default. Én `h1` per side,
canonical på alle tre, `sensitivt`-boksen rendrer med Mental Helse 116 123 på
norsk, Mind Självmordslinjen 90101 på svensk og en generisk henvisning på
engelsk.

Kategorisidene, drømmeoversikten og forsiden lenker **ikke** til den nye
seksjonen — kontrollert, og alle tilsynelatende treff viste seg å være
bildestier. De eneste inngangene er de tre brosetningene.

### Underveis: én feil verdt å notere

`RelaterteDrommer.astro` fantes allerede og brukes av `Sovn.astro` med en
annen prop (`artikler`, ikke `slugs`). Jeg opprettet min komponent under samme
navn og brøt dermed byggingen av søvnsidene. Originalen er gjenopprettet fra
git, og den nye heter `TilDrommetydning.astro`.

---

## Fase 5 — broene

Én setning lagt inn i hver av de tre eksisterende drømmeartiklene, rett før
kildelista. To linjer lagt til per fil, null fjernet — tittel,
`kortbeskrivelse` og struktur står urørt, slik måligrunnlaget krever.

> Så du derimot en sommerfugl i våken tilstand, er det et annet spørsmål — det
> handler om [hva sommerfuglen har betydd som symbol](/symboler/sommerfugl/).

Svensk og engelsk er skrevet, ikke substituert.

---

## Nullpunkt for målingen

**Kriteriet er over 2,5 % CTR innen seks uker etter indeksering.**

Utgangspunktet er `/sv/drommar/fjaril/` med 8 747 visninger og 0,7 % CTR —
den dårligst konverterende siden i korpuset — og omkring 3 150 visninger i
kvartalet på sommerfuglsøk som ikke handler om drømmer.

Sidene er bygget, men **ikke sendt til indeksering**. Det krever Search
Console, som jeg ikke har tilgang til. Nullpunktet settes den dagen de tre
URL-ene sendes inn, og det er den datoen seksukersfristen skal regnes fra.
Noter datoen her når det er gjort:

- Innsendt til indeksering: `________`
- Frist for vurdering (+6 uker): `________`

Piloten er ett symbol. Ingen flere sider skal opprettes i seksjonen før
tallet foreligger.
