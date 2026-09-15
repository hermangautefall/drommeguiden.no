# Oversettelse til tysk — arbeidsspec

Kontrakten for alle tyske oversettelser. Les den helt før du skriver noe.

---

## Kilden er den engelske utgaven

Du oversetter fra `src/content/drommer-en/`, ikke fra norsk.

Det er et bevisst valg. Den engelske utgaven er en fullstendig oversettelse
(median 103 % av den norske, 211 av 241 med identisk avsnittsstruktur), og den
har allerede generalisert norske kulturreferanser til «Norse/Nordic» — arbeid
som ellers måtte gjøres på nytt. Engelsk→tysk er dessuten et langt sterkere
språkpar enn norsk→tysk.

Det er **oversettelse**, ikke omskriving: samme struktur, samme H2-er, samme
avsnitt, samme kilder, samme lengde (±10 %).

---

## Tiltaleform: `du`

Siden er varm og personlig, ikke klinisk. Bruk `du`, `dir`, `dein` gjennomgående.
Aldri `Sie`, `Ihnen`, `Ihre`. Ett eneste glipp er umiddelbart synlig for en tysk
leser, og skannet fanger det.

## Feil som faktisk skjer på denne strekningen

Norsk→dansk hadde omstaving som hovedfeil. Engelsk→tysk har tre andre:

**Falske venner.** De er grammatisk korrekte og derfor usynlige:

| engelsk | *ikke* | riktig |
|---|---|---|
| eventually | eventuell | schließlich |
| actually | aktuell | eigentlich |
| to become | bekommen | werden |
| sensible | sensibel | vernünftig |
| brave | brav | mutig |
| gift | Gift (= gift) | Geschenk |

**Anglisismer.** `Sinn machen` er oversatt *make sense* — tysk sier `Sinn ergeben`.
`realisieren` betyr virkeliggjøre, ikke innse (`erkennen`). `in 2026` er engelsk
ordstilling; tysk skriver `2026` eller `im Jahr 2026`.

**Engelsk setningsbygning.** Tysk verbplassering er ikke engelsk. Les setningen
høyt før du går videre — det er den eneste testen som fanger det.

---

## Frontmatter — eksakt

```yaml
---
tittel: "<tysk tittel, se under>"
slug: <tysk slug fra slugkartet>
nb_slug: <UENDRET fra den engelske filens nb_slug — limet mellom språkene>
de_slug: <samme som slug>
kategori: <tysk kategoriverdi, se tabell>
kortbeskrivelse: "<134–160 tegn, tysk, ingen linjeskift>"
relaterte:
  - <tysk slug fra slugkartet>
tolkninger_kort:
  - "<tre korte tyske punkter>"
bilde: <kopier uendret fra den engelske filen>
dato: <kopier>
oppdatert: <kopier>
author: 'default'
---
```

`sensitivt: true` kopieres hvis den engelske filen har det. `relaterte_sovn`
sløyfes — det finnes ingen tyske søvnartikler ennå.

### Kategorier — engelsk verdi → tysk verdi

| en | de |
|---|---|
| `animals` | `tiere` |
| `water` | `wasser` |
| `body` | `koerper` |
| `places` | `orte` |
| `events` | `ereignisse` |
| `people` | `menschen` |
| `nature` | `natur` |
| `objects` | `gegenstaende` |
| `spiritual` | `spirituelles` |

Feil her gjør at artikkelen faller ut av kategorisiden sin uten å feile i bygget.

### Slug — ikke finn på din egen

Sluggene ligger i `_prosjekt/slugkart-tysk.tsv`: kolonne 1 = norsk slug,
kolonne 2 = engelsk slug, kolonne 3 = tysk slug. Slå opp der. Sluggen er en
permanent URL.

Transkribering: `ä→ae`, `ö→oe`, `ü→ue`, `ß→ss`.

### Tittel

Ikke bruk samme mal på alle. Hodet skal inneholde det folk søker på
(`Träume von X`), halen skal gi en grunn til å klikke, og den skal være et
spørsmål som slutter med `?` etter ` — ` (tankestrek med mellomrom). Systemet
bruker akkurat det mønsteret til å lage korte etiketter i brødsmuler.

- `Träume von Schlangen — Warnung oder Verwandlung?`
- `Träume vom Zähneverlieren — warum ist er so verbreitet?`
- `Träume von einer verstorbenen Person — Besuch oder Trauer?`

---

## Første overskrift — alltid

```
## Was bedeutet es, von <X> zu träumen?
```

Den skal **legges til** over kildens egen første overskrift, ikke bytte den ut.
Har den engelske artikkelen en egen åpningsoverskrift, blir den stående som
overskrift nummer to, oversatt. Skriv da to–tre setninger som innledning under
malen.

Eneste unntak: starter artikkelen rett på en annen H2 uten innledningsprosa,
la den stå.

---

## Tone og innhold

- Varm, respektfull, nysgjerrig. Ikke akademisk, ikke mystisk.
- Aldri absolutte påstander. `kann bedeuten`, `wird oft gedeutet als` — aldri
  `bedeutet, dass`.
- Behold alle kildehenvisninger. Seksjonen heter `## Quellen und weiterführende Literatur`.
- **Ingen manuelle interne lenker.** Fjern lenkemarkeringen fra alt og la ordene
  stå som vanlig tekst. En remark-plugin legger inn tyske lenker automatisk ved
  bygg, og gjør det på nytt hver gang — så artikler du skriver nå får lenker
  etter hvert som resten kommer til.
- Sier kilden noe om norrøn mytologi (`Norse tradition`), er `nordische
  Mythologie` riktig og presist. Sier den noe om Norge spesifikt, generaliser
  til `nordisch` — ikke oppfinn en tysk påstand.
- H2-ene skal være unike på tvers av hele det tyske korpuset, bortsett fra
  kildeseksjonen.

---

## Før du leverer — kjør dette selv

```bash
python3 _prosjekt/verktoy/germanismer.py src/content/drommer-de/<dine-filer>.md
```

Den skal svare `HARD 0`.

Mener du et hardt treff er korrekt tysk — ikke skriv om teksten for å blidgjøre
skannet. Skriv det i rapporten, så retter jeg regelen. Under den danske runden
byttet en agent helt normal dansk mot et arkaisk ord fordi en regel var for
bred. Regelen var feil, ikke teksten.
