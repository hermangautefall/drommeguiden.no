// Custom sitemap-generator som erstatter @astrojs/sitemap.
//
// Genererer:
//   - dist/sitemap-no.xml  (alle norske URLer)
//   - dist/sitemap-sv.xml  (alle svenske URLer)
//   - dist/sitemap-da.xml  (alle danske URLer)
//   - dist/sitemap-en.xml  (alle engelske URLer)
//   - dist/sitemap-index.xml (referer til alle)
//
// Per URL:
//   - <loc> (absolutt)
//   - <lastmod> (oppdatert ?? dato, eller fil-mtime for statiske sider)
//   - <xhtml:link rel="alternate" hreflang="nb|sv|en|x-default"> når
//     språkversjon finnes på de andre språkene (alle URL-er listes
//     i alle sitemaps)
//   - <image:image><image:loc> for symbolsider når bilde finnes
//
// Kryss-språk-mapping for innhold går via nb_slug/sv_slug/en_slug
// frontmatter-felter; for statiske sider hardkodes parene.

import { readFileSync, readdirSync, writeFileSync, existsSync, statSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';

const SITE = 'https://drommeguiden.no';

// ---------------- Frontmatter-leser ----------------
function parseFrontmatter(content) {
  const m = content.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const fm = {};
  for (const line of m[1].split('\n')) {
    const km = line.match(/^([a-zA-Z_]+):\s*(.*)$/);
    if (km) {
      let val = km[2].trim().replace(/^["']|["']$/g, '');
      fm[km[1]] = val;
    }
  }
  return fm;
}

function loadCollection(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .map(f => {
      const content = readFileSync(join(dir, f), 'utf8');
      const fm = parseFrontmatter(content);
      return {
        slug: fm.slug || f.replace(/\.md$/, ''),
        dato: fm.dato || null,
        oppdatert: fm.oppdatert || null,
        bilde: fm.bilde || null,
        nb_slug: fm.nb_slug || null,
        sv_slug: fm.sv_slug || null,
        en_slug: fm.en_slug || null,
      };
    });
}

function toIsoDate(value) {
  if (!value) return null;
  // YAML dates: 2026-03-18 or ISO strings
  const d = new Date(value);
  if (isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
}

function fileMtimeIso(path) {
  try {
    return statSync(path).mtime.toISOString().slice(0, 10);
  } catch {
    return null;
  }
}

function escXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// ---------------- Bygg URL-liste ----------------
// Spraakene sitemap-en dekker. Brukes baade naar oppfoeringene bygges og
// naar filene skrives, saa den maa ligge paa modulnivaa.
const SPRAAK = ['nb', 'sv', 'da', 'de', 'en'];
// Norsk sitemap heter «no», ikke «nb».
const FILNAVN = { nb: 'no', sv: 'sv', da: 'da', de: 'de', en: 'en' };

function buildAllEntries(srcDir = 'src') {
  const drommer    = loadCollection(`${srcDir}/content/drommer`);
  const drommerSv  = loadCollection(`${srcDir}/content/drommer-sv`);
  const drommerEn  = loadCollection(`${srcDir}/content/drommer-en`);
  const sovn       = loadCollection(`${srcDir}/content/sovn`);
  const sovnSv     = loadCollection(`${srcDir}/content/sovn-sv`);
  const sovnEn     = loadCollection(`${srcDir}/content/sovn-en`);
  const guider     = loadCollection(`${srcDir}/content/guider`);
  const guiderSv   = loadCollection(`${srcDir}/content/guider-sv`);
  const guiderEn   = loadCollection(`${srcDir}/content/guider-en`);
  const symboler     = loadCollection(`${srcDir}/content/symboler`);
  const symbolerSv   = loadCollection(`${srcDir}/content/symboler-sv`);
  const symbolerEn   = loadCollection(`${srcDir}/content/symboler-en`);
  const drommerDa    = loadCollection(`${srcDir}/content/drommer-da`);
  const drommerDe    = loadCollection(`${srcDir}/content/drommer-de`);
  const sovnDa       = loadCollection(`${srcDir}/content/sovn-da`);
  const sovnDe    = loadCollection(`${srcDir}/content/sovn-de`);
  const guiderDa     = loadCollection(`${srcDir}/content/guider-da`);
  const guiderDe    = loadCollection(`${srcDir}/content/guider-de`);
  const kategorierDa = loadCollection(`${srcDir}/content/kategorier-da`);
  const kategorierDe    = loadCollection(`${srcDir}/content/kategorier-de`);
  const symbolerDa   = loadCollection(`${srcDir}/content/symboler-da`);
  const symbolerDe    = loadCollection(`${srcDir}/content/symboler-de`);
  const kategorier   = loadCollection(`${srcDir}/content/kategorier`);
  const kategorierSv = loadCollection(`${srcDir}/content/kategorier-sv`);
  const kategorierEn = loadCollection(`${srcDir}/content/kategorier-en`);

  // Cross-language maps (NB er kanonisk nav; SV/EN peker tilbake via nb_slug)
  function buildLangMaps(nbItems, altItems, altKey) {
    const nbBySlug  = Object.fromEntries(nbItems.map(s => [s.slug, s]));
    const altBySlug = Object.fromEntries(altItems.map(s => [s.slug, s]));
    const noToAlt = {};
    for (const s of nbItems)  if (s[altKey] && altBySlug[s[altKey]]) noToAlt[s.slug] = s[altKey];
    for (const s of altItems) if (s.nb_slug && nbBySlug[s.nb_slug]) noToAlt[s.nb_slug] = s.slug;
    const altToNo = Object.fromEntries(Object.entries(noToAlt).map(([n, a]) => [a, n]));
    return { noToAlt, altToNo };
  }

  const { noToAlt: noDrommerToSv, altToNo: svDrommerToNo } = buildLangMaps(drommer, drommerSv, 'sv_slug');
  const { noToAlt: noDrommerToEn, altToNo: enDrommerToNo } = buildLangMaps(drommer, drommerEn, 'en_slug');
  const { noToAlt: noSovnToSv,    altToNo: svSovnToNo }    = buildLangMaps(sovn, sovnSv, 'sv_slug');
  const { noToAlt: noSovnToEn,    altToNo: enSovnToNo }    = buildLangMaps(sovn, sovnEn, 'en_slug');
  const { noToAlt: noGuiderToSv,  altToNo: svGuiderToNo }  = buildLangMaps(guider, guiderSv, 'sv_slug');
  const { noToAlt: noGuiderToEn,  altToNo: enGuiderToNo }  = buildLangMaps(guider, guiderEn, 'en_slug');

  // Kategori: hardkodede par siden slug-ene avviker mye
  const noToSvKat = {
    dyr: 'djur', vann: 'vatten', kropp: 'kropp', steder: 'platser',
    hendelser: 'handelser', mennesker: 'manniskor', natur: 'natur',
    gjenstander: 'foremal', aandelig: 'andlig',
  };
  const svToNoKat = Object.fromEntries(Object.entries(noToSvKat).map(([n, s]) => [s, n]));
  const noToEnKat = {
    dyr: 'animals', vann: 'water', kropp: 'body', steder: 'places',
    hendelser: 'events', mennesker: 'people', natur: 'nature',
    gjenstander: 'objects', aandelig: 'spiritual',
  };
  const enToNoKat = Object.fromEntries(Object.entries(noToEnKat).map(([n, s]) => [s, n]));

  // Bygg alternates-objekt med de språkversjonene som finnes.
  // x-default peker alltid til NB når NB finnes.
  // Spraakgenerisk oppbygging. Tidligere hadde hver seksjon én loekke per
  // spraak som hardkodet de andre to — tolv loekker for tre spraak, seksten
  // for fire. Naa defineres hver seksjon én gang, og spraakene kommer fra
  // supportedLangs-ekvivalenten under. nb_slug er ryggraden, som ellers paa
  // siden; norske filer har den ikke selv, saa der brukes slug.

  const SEKSJONER = [
    {
      navn: 'drommer', bilde: true,
      data: { nb: drommer, sv: drommerSv, da: drommerDa, de: drommerDe, en: drommerEn },
      url: { nb: (s) => `/drommer/${s}/`, sv: (s) => `/sv/drommar/${s}/`, da: (s) => `/da/dromme/${s}/`, de: (s) => `/de/traeume/${s}/`, en: (s) => `/en/dreams/${s}/` },
    },
    {
      navn: 'symboler', bilde: true,
      data: { nb: symboler, sv: symbolerSv, da: symbolerDa, de: symbolerDe, en: symbolerEn },
      url: { nb: (s) => `/symboler/${s}/`, sv: (s) => `/sv/symboler/${s}/`, da: (s) => `/da/symboler/${s}/`, de: (s) => `/de/symbole/${s}/`, en: (s) => `/en/symbols/${s}/` },
    },
    {
      navn: 'sovn', bilde: false,
      data: { nb: sovn, sv: sovnSv, da: sovnDa, de: sovnDe, en: sovnEn },
      url: { nb: (s) => `/sovn/${s}/`, sv: (s) => `/sv/somn/${s}/`, da: (s) => `/da/sovn/${s}/`, de: (s) => `/de/schlaf/${s}/`, en: (s) => `/en/sleep/${s}/` },
    },
    {
      navn: 'guider', bilde: false,
      data: { nb: guider, sv: guiderSv, da: guiderDa, de: guiderDe, en: guiderEn },
      url: { nb: (s) => `/guider/${s}/`, sv: (s) => `/sv/guider/${s}/`, da: (s) => `/da/guider/${s}/`, de: (s) => `/de/ratgeber/${s}/`, en: (s) => `/en/guides/${s}/` },
    },
    {
      navn: 'kategorier', bilde: false,
      data: { nb: kategorier, sv: kategorierSv, da: kategorierDa, de: kategorierDe, en: kategorierEn },
      url: { nb: (s) => `/kategori/${s}/`, sv: (s) => `/sv/kategori/${s}/`, da: (s) => `/da/kategori/${s}/`, de: (s) => `/de/kategorie/${s}/`, en: (s) => `/en/category/${s}/` },
    },
  ];

  // Statiske sider: én rad per side, med URL og kildefil per spraak.
  const statiske = [
    { nb: ['/', 'src/pages/index.astro'], sv: ['/sv/', 'src/pages/sv/index.astro'], da: ['/da/', 'src/pages/da/index.astro'], de: ['/de/', 'src/pages/de/index.astro'], en: ['/en/', 'src/pages/en/index.astro'] },
    { nb: ['/drommer/', 'src/pages/drommer/index.astro'], sv: ['/sv/drommar/', 'src/pages/sv/drommar/index.astro'], da: ['/da/dromme/', 'src/pages/da/dromme/index.astro'], de: ['/de/traeume/', 'src/pages/de/traeume/index.astro'], en: ['/en/dreams/', 'src/pages/en/dreams/index.astro'] },
    { nb: ['/kategori/', 'src/pages/kategori/index.astro'], sv: ['/sv/kategori/', 'src/pages/sv/kategori/index.astro'], da: ['/da/kategori/', 'src/pages/da/kategori/index.astro'], de: ['/de/kategorie/', 'src/pages/de/kategorie/index.astro'], en: ['/en/category/', 'src/pages/en/category/index.astro'] },
    { nb: ['/guider/', 'src/pages/guider/index.astro'], sv: ['/sv/guider/', 'src/pages/sv/guider/index.astro'], da: ['/da/guider/', 'src/pages/da/guider/index.astro'], de: ['/de/ratgeber/', 'src/pages/de/ratgeber/index.astro'], en: ['/en/guides/', 'src/pages/en/guides/index.astro'] },
    { nb: ['/sovn/', 'src/pages/sovn/index.astro'], sv: ['/sv/somn/', 'src/pages/sv/somn/index.astro'], da: ['/da/sovn/', 'src/pages/da/sovn/index.astro'], de: ['/de/schlaf/', 'src/pages/de/schlaf/index.astro'], en: ['/en/sleep/', 'src/pages/en/sleep/index.astro'] },
    { nb: ['/om-oss/', 'src/pages/om-oss.astro'], sv: ['/sv/om-oss/', 'src/pages/sv/om-oss.astro'], da: ['/da/om-os/', 'src/pages/da/om-os.astro'], de: ['/de/ueber-uns/', 'src/pages/de/ueber-uns.astro'], en: ['/en/about/', 'src/pages/en/about.astro'] },
    { nb: ['/kontakt/', 'src/pages/kontakt.astro'], sv: ['/sv/kontakt/', 'src/pages/sv/kontakt.astro'], da: ['/da/kontakt/', 'src/pages/da/kontakt.astro'], de: ['/de/kontakt/', 'src/pages/de/kontakt.astro'], en: ['/en/contact/', 'src/pages/en/contact.astro'] },
    { nb: ['/personvern/', 'src/pages/personvern.astro'], sv: ['/sv/integritet/', 'src/pages/sv/integritet.astro'], da: ['/da/privatliv/', 'src/pages/da/privatliv.astro'], de: ['/de/datenschutz/', 'src/pages/de/datenschutz.astro'], en: ['/en/privacy/', 'src/pages/en/privacy.astro'] },
    { nb: ['/vilkar/', 'src/pages/vilkar.astro'], sv: ['/sv/villkor/', 'src/pages/sv/villkor.astro'], da: ['/da/vilkar/', 'src/pages/da/vilkar.astro'], de: ['/de/nutzungsbedingungen/', 'src/pages/de/nutzungsbedingungen.astro'], en: ['/en/terms/', 'src/pages/en/terms.astro'] },
    { nb: ['/cookies/', 'src/pages/cookies.astro'], sv: ['/sv/cookies/', 'src/pages/sv/cookies.astro'], da: ['/da/cookies/', 'src/pages/da/cookies.astro'], de: ['/de/cookies/', 'src/pages/de/cookies.astro'], en: ['/en/cookies/', 'src/pages/en/cookies.astro'] },
    { nb: ['/journal/', 'src/pages/journal.astro'], sv: ['/sv/journal/', 'src/pages/sv/journal.astro'], da: ['/da/journal/', 'src/pages/da/journal.astro'], de: ['/de/traumtagebuch/', 'src/pages/de/traumtagebuch.astro'], en: ['/en/journal/', 'src/pages/en/journal.astro'] },
  ];

  const entries = [];

  // Tomme listesider holdes ute av sitemapen — vi ber ikke Google indeksere
  // en oversiktsside uten innhold bak seg.
  // Utledes fra SEKSJONER i stedet for en haandholdt liste. Den gamle listen
  // maatte utvides for hvert nye spraak, og det ble glemt: tyske /ratgeber/ og
  // /schlaf/ havnet i sitemapen selv om samlingene var tomme.
  const tommeSeksjoner = new Set();
  for (const sek of SEKSJONER) {
    for (const l of SPRAAK) {
      const liste = sek.data[l];
      if (!liste || liste.length) continue;
      // Seksjonsforsiden er lenken uten slug: /de/schlaf/ av /de/schlaf/${s}/
      tommeSeksjoner.add(sek.url[l] ? sek.url[l]('').replace(/\/+$/, '/') : '');
    }
  }

  for (const rad of statiske) {
    const finnes = {};
    for (const l of SPRAAK) {
      const [url, src] = rad[l] || [];
      if (url && existsSync(src) && !tommeSeksjoner.has(url)) finnes[l] = { url, src };
    }
    if (!finnes.nb) continue;
    const alternates = {};
    for (const l of SPRAAK) if (finnes[l]) alternates[l] = finnes[l].url;
    alternates['x-default'] = finnes.nb.url;
    for (const l of SPRAAK) {
      if (!finnes[l]) continue;
      entries.push({ url: finnes[l].url, lang: l, lastmod: fileMtimeIso(finnes[l].src), alternates });
    }
  }

  for (const sek of SEKSJONER) {
    // nb_slug → slug per spraak
    const kart = {};
    for (const l of SPRAAK) {
      for (const x of sek.data[l] || []) {
        const nb = x.nb_slug || x.slug;
        (kart[nb] ||= {})[l] = x;
      }
    }
    for (const [nb, perLang] of Object.entries(kart)) {
      const alternates = {};
      for (const l of SPRAAK) if (perLang[l]) alternates[l] = sek.url[l](perLang[l].slug);
      const flere = Object.keys(alternates).length > 1;
      if (perLang.nb) alternates['x-default'] = sek.url.nb(perLang.nb.slug);
      for (const l of SPRAAK) {
        const x = perLang[l];
        if (!x) continue;
        entries.push({
          url: sek.url[l](x.slug),
          lang: l,
          lastmod: toIsoDate(x.oppdatert || x.dato),
          image: sek.bilde ? x.bilde || null : null,
          alternates: flere && perLang.nb ? alternates : null,
        });
      }
    }
  }

  return entries;
}

// ---------------- XML-bygging ----------------
function renderUrlEntry(entry) {
  const parts = [];
  parts.push('  <url>');
  parts.push(`    <loc>${escXml(SITE + entry.url)}</loc>`);
  if (entry.lastmod) parts.push(`    <lastmod>${entry.lastmod}</lastmod>`);
  if (entry.alternates) {
    for (const [hreflang, href] of Object.entries(entry.alternates)) {
      parts.push(`    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${escXml(SITE + href)}"/>`);
    }
  }
  if (entry.image) {
    parts.push('    <image:image>');
    parts.push(`      <image:loc>${escXml(SITE + entry.image)}</image:loc>`);
    parts.push('    </image:image>');
  }
  parts.push('  </url>');
  return parts.join('\n');
}

function renderSitemap(entries) {
  const head = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">';
  const body = entries.map(renderUrlEntry).join('\n');
  return `${head}\n${body}\n</urlset>\n`;
}

function renderIndex(maps, lastmod) {
  const head = '<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const body = maps.map(m => `  <sitemap>\n    <loc>${escXml(SITE + '/' + m)}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </sitemap>`).join('\n');
  return `${head}\n${body}\n</sitemapindex>\n`;
}

// ---------------- Astro-integration ----------------
export default function customSitemap() {
  return {
    name: 'custom-sitemap',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const outDir = dir.pathname.endsWith('/') ? dir.pathname : dir.pathname + '/';
        const entries = buildAllEntries();

        const byLang = lang => entries.filter(e => e.lang === lang).sort((a, b) => a.url.localeCompare(b.url));
        // Filnavnet foelger ikke spraakkoden overalt: norsk heter «no».
        // Tomme spraak utelates, saa vi aldri publiserer en tom sitemap i
        // indeksen. Blokken stod tidligere utskrevet per spraak, og et nytt
        // spraak maatte huskes fire steder.
        const perSpraak = Object.fromEntries(SPRAAK.map(x => [x, byLang(x)]));

        const maps = [];
        for (const x of SPRAAK) {
          if (!perSpraak[x].length) continue;
          const fil = `sitemap-${FILNAVN[x]}.xml`;
          writeFileSync(outDir + fil, renderSitemap(perSpraak[x]));
          maps.push(fil);
        }

        const today = new Date().toISOString().slice(0, 10);
        writeFileSync(outDir + 'sitemap-index.xml', renderIndex(maps, today));

        // Fjern den gamle @astrojs/sitemap-utdataen hvis den ligger der
        for (const old of ['sitemap-0.xml']) {
          try { unlinkSync(outDir + old); } catch {}
        }

        console.log('[custom-sitemap] '
          + SPRAAK.map(x => `${FILNAVN[x].toUpperCase()}: ${perSpraak[x].length}`).join(', ')
          + `, sum ${entries.length}`);
      },
    },
  };
}
