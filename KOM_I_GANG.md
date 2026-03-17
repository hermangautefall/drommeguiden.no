# Kom i gang — drommeguiden.no

## Steg 1: Installer og sett opp prosjektet med Claude Code

Åpne Terminal, naviger til denne mappen, og start Claude Code:

```
claude
```

Lim inn denne startprompten:

```
Les CLAUDE.md grundig. Sett deretter opp et komplett Astro-prosjekt
for drommeguiden.no med følgende:

1. Astro med Tailwind CSS og Content Collections
2. Tre content-mapper allerede opprettet: drommer/, kategorier/, guider/
3. CSS-variablene fra CLAUDE.md implementert i en global styles.css
4. Google Fonts lastet: Cormorant Garamond (overskrifter) og Inter (brødtekst)
5. Base.astro layout med header, footer og plass til Ezoic-annonser
6. Symbol.astro layout som bruker frontmatter-feltene fra _MAL_SYMBOL.md:
   - TL;DR-boks med tolkninger_kort
   - Brødtekst fra Markdown
   - Relaterte symboler-seksjon nederst
7. Dynamisk side: src/pages/drommer/[slug].astro
8. En enkel forside (index.astro) med søkefelt og kategorikort
9. sitemap.xml og robots.txt auto-generert

Testfil som allerede finnes: src/content/drommer/slange.md
Bruk denne til å teste at Symbol.astro-layouten fungerer.

Start dev-serveren når alt er klart så jeg kan forhåndsvise siden.
```

---

## Steg 2: Deploy til Cloudflare Pages

Når siden ser bra ut lokalt:

```
Push dette prosjektet til GitHub og sett opp automatisk deployment
til Cloudflare Pages. Lag en GitHub Actions workflow som bygger og
deployer ved push til main-branchen.
```

---

## Steg 3: Generer innhold

Bruk promptene i `_INNHOLDSPROMPTS.md` i Claude Chat.
Start med de 30 mest søkte symbolene (listen er i bunnen av filen).

---

## Nyttige Claude Code-kommandoer underveis

```
# Legg til søkefunksjon
"Legg til en søkefunksjon på forsiden som søker gjennom alle symbolsider"

# Optimaliser bilder
"Sjekk at alle bilder bruker Astros innebygde bildeoptimalisering"

# Legg til schema markup
"Legg til FAQPage-schema på alle symbolsider basert på tolkninger_kort-feltet"

# Sjekk SEO
"Gå gjennom alle sider og sjekk at meta-tags, canonical-URL og OG-tags er riktige"

# Legg til nyhetsbrev
"Legg til et enkelt nyhetsbrev-skjema nederst på alle symbolsider som sender
til Mailchimp [API-nøkkel]"
```
