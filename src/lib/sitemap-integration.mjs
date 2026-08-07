// Custom sitemap-generator som erstatter @astrojs/sitemap.
//
// Genererer:
//   - dist/sitemap-no.xml  (alle norske URLer)
//   - dist/sitemap-sv.xml  (alle svenske URLer)
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
  function mkAlternates(nbUrl, svUrl, enUrl) {
    if (!svUrl && !enUrl) return null;
    const alt = {};
    if (nbUrl) alt.nb = nbUrl;
    if (svUrl) alt.sv = svUrl;
    if (enUrl) alt.en = enUrl;
    if (nbUrl) alt['x-default'] = nbUrl;
    return alt;
  }

  // Statiske sider: hardkodede tripler
  const staticPairs = [
    { no: '/',            sv: '/sv/',            en: '/en/',          noSrc: 'src/pages/index.astro',           svSrc: 'src/pages/sv/index.astro',           enSrc: 'src/pages/en/index.astro' },
    { no: '/drommer/',    sv: '/sv/drommar/',    en: '/en/dreams/',   noSrc: 'src/pages/drommer/index.astro',   svSrc: 'src/pages/sv/drommar/index.astro',   enSrc: 'src/pages/en/dreams/index.astro' },
    { no: '/kategori/',   sv: '/sv/kategori/',   en: '/en/category/', noSrc: 'src/pages/kategori/index.astro',  svSrc: 'src/pages/sv/kategori/index.astro',  enSrc: 'src/pages/en/category/index.astro' },
    { no: '/guider/',     sv: '/sv/guider/',     en: '/en/guides/',   noSrc: 'src/pages/guider/index.astro',    svSrc: 'src/pages/sv/guider/index.astro',    enSrc: 'src/pages/en/guides/index.astro' },
    { no: '/sovn/',       sv: '/sv/somn/',       en: '/en/sleep/',    noSrc: 'src/pages/sovn/index.astro',      svSrc: 'src/pages/sv/somn/index.astro',      enSrc: 'src/pages/en/sleep/index.astro' },
    { no: '/om-oss/',     sv: '/sv/om-oss/',     en: '/en/about/',    noSrc: 'src/pages/om-oss.astro',          svSrc: 'src/pages/sv/om-oss.astro',          enSrc: 'src/pages/en/about.astro' },
    { no: '/kontakt/',    sv: '/sv/kontakt/',    en: '/en/contact/',  noSrc: 'src/pages/kontakt.astro',         svSrc: 'src/pages/sv/kontakt.astro',         enSrc: 'src/pages/en/contact.astro' },
    { no: '/personvern/', sv: '/sv/integritet/', en: '/en/privacy/',  noSrc: 'src/pages/personvern.astro',      svSrc: 'src/pages/sv/integritet.astro',      enSrc: 'src/pages/en/privacy.astro' },
    { no: '/cookies/',    sv: '/sv/cookies/',    en: '/en/cookies/',  noSrc: 'src/pages/cookies.astro',         svSrc: 'src/pages/sv/cookies.astro',         enSrc: 'src/pages/en/cookies.astro' },
  ];

  const entries = [];

  // Statiske sider (EN-oppføring bare hvis siden faktisk finnes)
  for (const p of staticPairs) {
    const enExists = existsSync(p.enSrc);
    const enUrl = enExists ? p.en : null;
    const alternates = { nb: p.no, sv: p.sv, ...(enUrl ? { en: enUrl } : {}), 'x-default': p.no };
    entries.push({ url: p.no, lang: 'nb', lastmod: fileMtimeIso(p.noSrc), alternates });
    entries.push({ url: p.sv, lang: 'sv', lastmod: fileMtimeIso(p.svSrc), alternates });
    if (enExists) {
      entries.push({ url: enUrl, lang: 'en', lastmod: fileMtimeIso(p.enSrc), alternates });
    }
  }

  // Drommer (symbol-sider — får image)
  for (const s of drommer) {
    const url = `/drommer/${s.slug}/`;
    const svUrl = noDrommerToSv[s.slug] ? `/sv/drommar/${noDrommerToSv[s.slug]}/` : null;
    const enUrl = noDrommerToEn[s.slug] ? `/en/dreams/${noDrommerToEn[s.slug]}/` : null;
    entries.push({
      url, lang: 'nb',
      lastmod: toIsoDate(s.oppdatert || s.dato),
      image: s.bilde || null,
      alternates: mkAlternates(url, svUrl, enUrl),
    });
  }
  for (const s of drommerSv) {
    const nbSlug = svDrommerToNo[s.slug];
    const url = `/sv/drommar/${s.slug}/`;
    const nbUrl = nbSlug ? `/drommer/${nbSlug}/` : null;
    const enUrl = nbSlug && noDrommerToEn[nbSlug] ? `/en/dreams/${noDrommerToEn[nbSlug]}/` : null;
    entries.push({
      url, lang: 'sv',
      lastmod: toIsoDate(s.oppdatert || s.dato),
      image: s.bilde || null,
      alternates: nbUrl ? mkAlternates(nbUrl, url, enUrl) : null,
    });
  }
  for (const s of drommerEn) {
    const nbSlug = enDrommerToNo[s.slug];
    const url = `/en/dreams/${s.slug}/`;
    const nbUrl = nbSlug ? `/drommer/${nbSlug}/` : null;
    const svUrl = nbSlug && noDrommerToSv[nbSlug] ? `/sv/drommar/${noDrommerToSv[nbSlug]}/` : null;
    entries.push({
      url, lang: 'en',
      lastmod: toIsoDate(s.oppdatert || s.dato),
      image: s.bilde || null,
      alternates: nbUrl ? mkAlternates(nbUrl, svUrl, url) : null,
    });
  }

  // Sovn
  for (const s of sovn) {
    const url = `/sovn/${s.slug}/`;
    const svUrl = noSovnToSv[s.slug] ? `/sv/somn/${noSovnToSv[s.slug]}/` : null;
    const enUrl = noSovnToEn[s.slug] ? `/en/sleep/${noSovnToEn[s.slug]}/` : null;
    entries.push({
      url, lang: 'nb',
      lastmod: toIsoDate(s.oppdatert || s.dato),
      alternates: mkAlternates(url, svUrl, enUrl),
    });
  }
  for (const s of sovnSv) {
    const nbSlug = svSovnToNo[s.slug];
    const url = `/sv/somn/${s.slug}/`;
    const nbUrl = nbSlug ? `/sovn/${nbSlug}/` : null;
    const enUrl = nbSlug && noSovnToEn[nbSlug] ? `/en/sleep/${noSovnToEn[nbSlug]}/` : null;
    entries.push({
      url, lang: 'sv',
      lastmod: toIsoDate(s.oppdatert || s.dato),
      alternates: nbUrl ? mkAlternates(nbUrl, url, enUrl) : null,
    });
  }
  for (const s of sovnEn) {
    const nbSlug = enSovnToNo[s.slug];
    const url = `/en/sleep/${s.slug}/`;
    const nbUrl = nbSlug ? `/sovn/${nbSlug}/` : null;
    const svUrl = nbSlug && noSovnToSv[nbSlug] ? `/sv/somn/${noSovnToSv[nbSlug]}/` : null;
    entries.push({
      url, lang: 'en',
      lastmod: toIsoDate(s.oppdatert || s.dato),
      alternates: nbUrl ? mkAlternates(nbUrl, svUrl, url) : null,
    });
  }

  // Guider
  for (const g of guider) {
    const url = `/guider/${g.slug}/`;
    const svUrl = noGuiderToSv[g.slug] ? `/sv/guider/${noGuiderToSv[g.slug]}/` : null;
    const enUrl = noGuiderToEn[g.slug] ? `/en/guides/${noGuiderToEn[g.slug]}/` : null;
    entries.push({
      url, lang: 'nb',
      lastmod: toIsoDate(g.oppdatert || g.dato),
      alternates: mkAlternates(url, svUrl, enUrl),
    });
  }
  for (const g of guiderSv) {
    const nbSlug = svGuiderToNo[g.slug];
    const url = `/sv/guider/${g.slug}/`;
    const nbUrl = nbSlug ? `/guider/${nbSlug}/` : null;
    const enUrl = nbSlug && noGuiderToEn[nbSlug] ? `/en/guides/${noGuiderToEn[nbSlug]}/` : null;
    entries.push({
      url, lang: 'sv',
      lastmod: toIsoDate(g.oppdatert || g.dato),
      alternates: nbUrl ? mkAlternates(nbUrl, url, enUrl) : null,
    });
  }
  for (const g of guiderEn) {
    const nbSlug = enGuiderToNo[g.slug];
    const url = `/en/guides/${g.slug}/`;
    const nbUrl = nbSlug ? `/guider/${nbSlug}/` : null;
    const svUrl = nbSlug && noGuiderToSv[nbSlug] ? `/sv/guider/${noGuiderToSv[nbSlug]}/` : null;
    entries.push({
      url, lang: 'en',
      lastmod: toIsoDate(g.oppdatert || g.dato),
      alternates: nbUrl ? mkAlternates(nbUrl, svUrl, url) : null,
    });
  }

  // Kategori
  for (const k of kategorier) {
    const url = `/kategori/${k.slug}/`;
    const svUrl = noToSvKat[k.slug] ? `/sv/kategori/${noToSvKat[k.slug]}/` : null;
    const enSlug = noToEnKat[k.slug];
    const enUrl = enSlug && kategorierEn.some(e => e.slug === enSlug) ? `/en/category/${enSlug}/` : null;
    entries.push({
      url, lang: 'nb',
      lastmod: toIsoDate(k.oppdatert || k.dato),
      alternates: mkAlternates(url, svUrl, enUrl),
    });
  }
  for (const k of kategorierSv) {
    const nbSlug = svToNoKat[k.slug];
    const url = `/sv/kategori/${k.slug}/`;
    const nbUrl = nbSlug ? `/kategori/${nbSlug}/` : null;
    const enSlug = nbSlug ? noToEnKat[nbSlug] : null;
    const enUrl = enSlug && kategorierEn.some(e => e.slug === enSlug) ? `/en/category/${enSlug}/` : null;
    entries.push({
      url, lang: 'sv',
      lastmod: toIsoDate(k.oppdatert || k.dato),
      alternates: nbUrl ? mkAlternates(nbUrl, url, enUrl) : null,
    });
  }
  for (const k of kategorierEn) {
    const nbSlug = enToNoKat[k.slug];
    const url = `/en/category/${k.slug}/`;
    const nbUrl = nbSlug ? `/kategori/${nbSlug}/` : null;
    const svUrl = nbSlug && noToSvKat[nbSlug] ? `/sv/kategori/${noToSvKat[nbSlug]}/` : null;
    entries.push({
      url, lang: 'en',
      lastmod: toIsoDate(k.oppdatert || k.dato),
      alternates: nbUrl ? mkAlternates(nbUrl, svUrl, url) : null,
    });
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
        const noEntries = byLang('nb');
        const svEntries = byLang('sv');
        const enEntries = byLang('en');

        const maps = [];
        writeFileSync(outDir + 'sitemap-no.xml', renderSitemap(noEntries));
        maps.push('sitemap-no.xml');
        writeFileSync(outDir + 'sitemap-sv.xml', renderSitemap(svEntries));
        maps.push('sitemap-sv.xml');
        // EN-sitemap skrives bare når det faktisk finnes engelske sider,
        // så vi ikke publiserer en tom sitemap i indeksen.
        if (enEntries.length > 0) {
          writeFileSync(outDir + 'sitemap-en.xml', renderSitemap(enEntries));
          maps.push('sitemap-en.xml');
        }

        const today = new Date().toISOString().slice(0, 10);
        writeFileSync(outDir + 'sitemap-index.xml', renderIndex(maps, today));

        // Fjern den gamle @astrojs/sitemap-utdataen hvis den ligger der
        for (const old of ['sitemap-0.xml']) {
          try { unlinkSync(outDir + old); } catch {}
        }

        console.log(`[custom-sitemap] NO: ${noEntries.length}, SV: ${svEntries.length}, EN: ${enEntries.length}, sum ${entries.length}`);
      },
    },
  };
}
