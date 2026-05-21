// Custom sitemap-generator som erstatter @astrojs/sitemap.
//
// Genererer:
//   - dist/sitemap-no.xml  (alle norske URLer)
//   - dist/sitemap-sv.xml  (alle svenske URLer)
//   - dist/sitemap-index.xml (referer til begge)
//
// Per URL:
//   - <loc> (absolutt)
//   - <lastmod> (oppdatert ?? dato, eller fil-mtime for statiske sider)
//   - <xhtml:link rel="alternate" hreflang="nb|sv|x-default"> når
//     språkversjon finnes på den andre siden (begge URL-er listes
//     i begge sitemaps)
//   - <image:image><image:loc> for symbolsider når bilde finnes
//
// Kryss-språk-mapping for innhold går via nb_slug/sv_slug frontmatter-
// felter; for statiske sider hardkodes parene.

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
  const sovn       = loadCollection(`${srcDir}/content/sovn`);
  const sovnSv     = loadCollection(`${srcDir}/content/sovn-sv`);
  const guider     = loadCollection(`${srcDir}/content/guider`);
  const guiderSv   = loadCollection(`${srcDir}/content/guider-sv`);
  const kategorier   = loadCollection(`${srcDir}/content/kategorier`);
  const kategorierSv = loadCollection(`${srcDir}/content/kategorier-sv`);

  // Cross-language maps
  const noDrommerBySlug   = Object.fromEntries(drommer.map(s => [s.slug, s]));
  const svDrommerBySlug   = Object.fromEntries(drommerSv.map(s => [s.slug, s]));
  const noDrommerToSv = {};
  for (const s of drommer)   if (s.sv_slug && svDrommerBySlug[s.sv_slug]) noDrommerToSv[s.slug] = s.sv_slug;
  for (const s of drommerSv) if (s.nb_slug && noDrommerBySlug[s.nb_slug]) noDrommerToSv[s.nb_slug] = s.slug;
  const svDrommerToNo = Object.fromEntries(Object.entries(noDrommerToSv).map(([n, s]) => [s, n]));

  const svSovnBySlug   = Object.fromEntries(sovnSv.map(s => [s.slug, s]));
  const noSovnBySlug   = Object.fromEntries(sovn.map(s => [s.slug, s]));
  const noSovnToSv = {};
  for (const s of sovnSv) if (s.nb_slug && noSovnBySlug[s.nb_slug]) noSovnToSv[s.nb_slug] = s.slug;
  const svSovnToNo = Object.fromEntries(Object.entries(noSovnToSv).map(([n, s]) => [s, n]));

  const svGuiderBySlug = Object.fromEntries(guiderSv.map(s => [s.slug, s]));
  const noGuiderBySlug = Object.fromEntries(guider.map(s => [s.slug, s]));
  const noGuiderToSv = {};
  for (const s of guiderSv) if (s.nb_slug && noGuiderBySlug[s.nb_slug]) noGuiderToSv[s.nb_slug] = s.slug;
  const svGuiderToNo = Object.fromEntries(Object.entries(noGuiderToSv).map(([n, s]) => [s, n]));

  // Kategori: hardkodet par siden slug-ene avviker mye
  const noToSvKat = {
    dyr: 'djur', vann: 'vatten', kropp: 'kropp', steder: 'platser',
    hendelser: 'handelser', mennesker: 'manniskor', natur: 'natur',
    gjenstander: 'foremal', aandelig: 'andlig',
  };
  const svToNoKat = Object.fromEntries(Object.entries(noToSvKat).map(([n, s]) => [s, n]));

  // Statiske sider: hardkodet par
  const staticPairs = [
    { no: '/',            sv: '/sv/',           noSrc: 'src/pages/index.astro',           svSrc: 'src/pages/sv/index.astro' },
    { no: '/drommer/',    sv: '/sv/drommar/',   noSrc: 'src/pages/drommer/index.astro',   svSrc: 'src/pages/sv/drommar/index.astro' },
    { no: '/kategori/',   sv: '/sv/kategori/',  noSrc: 'src/pages/kategori/index.astro',  svSrc: 'src/pages/sv/kategori/index.astro' },
    { no: '/guider/',     sv: '/sv/guider/',    noSrc: 'src/pages/guider/index.astro',    svSrc: 'src/pages/sv/guider/index.astro' },
    { no: '/sovn/',       sv: '/sv/somn/',      noSrc: 'src/pages/sovn/index.astro',      svSrc: 'src/pages/sv/somn/index.astro' },
    { no: '/om-oss/',     sv: '/sv/om-oss/',    noSrc: 'src/pages/om-oss.astro',          svSrc: 'src/pages/sv/om-oss.astro' },
    { no: '/kontakt/',    sv: '/sv/kontakt/',   noSrc: 'src/pages/kontakt.astro',         svSrc: 'src/pages/sv/kontakt.astro' },
    { no: '/personvern/', sv: '/sv/integritet/', noSrc: 'src/pages/personvern.astro',     svSrc: 'src/pages/sv/integritet.astro' },
    { no: '/cookies/',    sv: '/sv/cookies/',   noSrc: 'src/pages/cookies.astro',         svSrc: 'src/pages/sv/cookies.astro' },
  ];

  const entries = [];

  // Statiske sider
  for (const p of staticPairs) {
    entries.push({
      url: p.no, lang: 'nb',
      lastmod: fileMtimeIso(p.noSrc),
      alternates: { nb: p.no, sv: p.sv, 'x-default': p.no },
    });
    entries.push({
      url: p.sv, lang: 'sv',
      lastmod: fileMtimeIso(p.svSrc),
      alternates: { nb: p.no, sv: p.sv, 'x-default': p.no },
    });
  }

  // Drommer (symbol-sider — får image)
  for (const s of drommer) {
    const altSv = noDrommerToSv[s.slug];
    const url = `/drommer/${s.slug}/`;
    const altSvUrl = altSv ? `/sv/drommar/${altSv}/` : null;
    entries.push({
      url, lang: 'nb',
      lastmod: toIsoDate(s.oppdatert || s.dato),
      image: s.bilde || null,
      alternates: altSvUrl ? { nb: url, sv: altSvUrl, 'x-default': url } : null,
    });
  }
  for (const s of drommerSv) {
    const altNo = svDrommerToNo[s.slug];
    const url = `/sv/drommar/${s.slug}/`;
    const altNoUrl = altNo ? `/drommer/${altNo}/` : null;
    entries.push({
      url, lang: 'sv',
      lastmod: toIsoDate(s.oppdatert || s.dato),
      image: s.bilde || null,
      alternates: altNoUrl ? { nb: altNoUrl, sv: url, 'x-default': altNoUrl } : null,
    });
  }

  // Sovn
  for (const s of sovn) {
    const altSv = noSovnToSv[s.slug];
    const url = `/sovn/${s.slug}/`;
    const altSvUrl = altSv ? `/sv/somn/${altSv}/` : null;
    entries.push({
      url, lang: 'nb',
      lastmod: toIsoDate(s.oppdatert || s.dato),
      alternates: altSvUrl ? { nb: url, sv: altSvUrl, 'x-default': url } : null,
    });
  }
  for (const s of sovnSv) {
    const altNo = svSovnToNo[s.slug];
    const url = `/sv/somn/${s.slug}/`;
    const altNoUrl = altNo ? `/sovn/${altNo}/` : null;
    entries.push({
      url, lang: 'sv',
      lastmod: toIsoDate(s.oppdatert || s.dato),
      alternates: altNoUrl ? { nb: altNoUrl, sv: url, 'x-default': altNoUrl } : null,
    });
  }

  // Guider
  for (const g of guider) {
    const altSv = noGuiderToSv[g.slug];
    const url = `/guider/${g.slug}/`;
    const altSvUrl = altSv ? `/sv/guider/${altSv}/` : null;
    entries.push({
      url, lang: 'nb',
      lastmod: toIsoDate(g.oppdatert || g.dato),
      alternates: altSvUrl ? { nb: url, sv: altSvUrl, 'x-default': url } : null,
    });
  }
  for (const g of guiderSv) {
    const altNo = svGuiderToNo[g.slug];
    const url = `/sv/guider/${g.slug}/`;
    const altNoUrl = altNo ? `/guider/${altNo}/` : null;
    entries.push({
      url, lang: 'sv',
      lastmod: toIsoDate(g.oppdatert || g.dato),
      alternates: altNoUrl ? { nb: altNoUrl, sv: url, 'x-default': altNoUrl } : null,
    });
  }

  // Kategori
  for (const k of kategorier) {
    const altSv = noToSvKat[k.slug];
    const url = `/kategori/${k.slug}/`;
    const altSvUrl = altSv ? `/sv/kategori/${altSv}/` : null;
    entries.push({
      url, lang: 'nb',
      lastmod: toIsoDate(k.oppdatert || k.dato),
      alternates: altSvUrl ? { nb: url, sv: altSvUrl, 'x-default': url } : null,
    });
  }
  for (const k of kategorierSv) {
    const altNo = svToNoKat[k.slug];
    const url = `/sv/kategori/${k.slug}/`;
    const altNoUrl = altNo ? `/kategori/${altNo}/` : null;
    entries.push({
      url, lang: 'sv',
      lastmod: toIsoDate(k.oppdatert || k.dato),
      alternates: altNoUrl ? { nb: altNoUrl, sv: url, 'x-default': altNoUrl } : null,
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

        const noEntries = entries.filter(e => e.lang === 'nb').sort((a, b) => a.url.localeCompare(b.url));
        const svEntries = entries.filter(e => e.lang === 'sv').sort((a, b) => a.url.localeCompare(b.url));

        writeFileSync(outDir + 'sitemap-no.xml', renderSitemap(noEntries));
        writeFileSync(outDir + 'sitemap-sv.xml', renderSitemap(svEntries));
        const today = new Date().toISOString().slice(0, 10);
        writeFileSync(outDir + 'sitemap-index.xml', renderIndex(['sitemap-no.xml', 'sitemap-sv.xml'], today));

        // Fjern den gamle @astrojs/sitemap-utdataen hvis den ligger der
        for (const old of ['sitemap-0.xml']) {
          try { unlinkSync(outDir + old); } catch {}
        }

        console.log(`[custom-sitemap] NO: ${noEntries.length}, SV: ${svEntries.length}, sum ${entries.length}`);
      },
    },
  };
}
