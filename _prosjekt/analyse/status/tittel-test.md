# Titteltest — nullpunkt

Startet 11. september 2026. Fire sider av fjorten, som avtalt: endre noen få,
måle, og først deretter ta resten.

## Hvorfor bare fire

Å endre tittelen på en side som allerede rangerer topp 10 kan koste plassering.
Fire sider gir signal uten å sette 22 789 visninger i kvartalet på spill
samtidig.

**`/sv/drommar/fjaril/` og `/drommer/sommerfugl/` er holdt utenfor.** De er
kontrollsider i sommerfuglmålingen. Røres de nå, mister vi det eksperimentet.

## Nullpunkt (2026-06-02 til 2026-09-01)

| Side | Visn. | Klikk | CTR | Pos. | Hypotese |
|---|---:|---:|---:|---:|---|
| `/drommer/tann/` | 4 701 | 54 | 1,1 % | 5,9 | Søkematch |
| `/sv/drommar/orm/` | 11 030 | 197 | 1,8 % | 5,8 | Søkematch + spenning |
| `/sv/drommar/otrohet/` | 3 642 | 20 | 0,5 % | 8,6 | Spenning |
| `/sv/drommar/rav/` | 3 416 | 60 | 1,8 % | 6,2 | Spenning |

Samlet: 22 789 visninger, 331 klikk, 1,45 % CTR.

## De to hypotesene

**Søkematch.** Tittelen sier ikke det folk søker på. Verst på `tann`: alle de
23 søkene inneholder «miste tenner», mens tittelen bare sa «tenner». På `orm`
er 1 261 visninger på «ormar» i flertall mot 230 på «orm» i entall.

**Spenning.** Der tittelen allerede matcher, gir den ingen grunn til å velge
oss. Alle 723 sidene het «Drømmer om X — hva betyr det?». I et søkeresultat der
AI-oversikter tar toppen, er det ingen forskjell fra konkurrentene.

## Hva som ble endret

| Side | Før | Etter |
|---|---|---|
| `tann` | Drømmer om tenner — hva betyr det? | Drømmer om å miste tenner — hva betyr det? |
| `orm` | Drömma om orm — vad betyder det? | Drömma om ormar — varning eller förvandling? |
| `otrohet` | Drömma om otrohet — vad betyder det? | Drömma om otrohet — betyder det att någon är otrogen? |
| `rav` | Drömma om räv — vad betyder det? | Drömma om räv — vem är den listiga i drömmen? |

Metabeskrivelsene er skrevet om på alle fire, alle innenfor 134–160 tegn.
Brødteksten er urørt.

## Målepunkt

Sammenlign **2026-09-12 til 2026-10-24** mot nullpunktet over.

- Lykkes det: CTR over 2,5 % uten at snittplasseringen faller mer enn ett hakk.
- Mislykkes det: plasseringen faller, eller CTR står stille.

Faller plasseringen på en av dem, rulles den ene tilbake — ikke alle fire.

- Målt fra: `________`
- Resultat: `________`

## To feil som ble rettet underveis

**Brikke-etikettene ville brukket.** `symbol-etikett.ts` strippet en fast hale
(« — hva betyr det?»). Med egne spørsmål i tittelen ville hele halen blitt
stående i brikkene. Mønsteret er nå generisk — testet mot alle 723 titler, null
etiketter endret seg.

**Brødsmulene var feil på 225 sider.** `displayTitle` i `Symbol.astro` strippet
«Drömmar om » i flertall, men ikke «Drömma om » i entall — som 225 av 238
svenske titler bruker. Brødsmulen sa «Drömma om hund» i stedet for «Hund», og
det samme sto i BreadcrumbSchema, som Google leser. De norske manglet stor
forbokstav. Begge deler rettet.
