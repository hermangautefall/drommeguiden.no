// Remark-plugin som auto-linker første forekomst av andre symbolnavn
// i brødteksten på drommer-sider. Hopper over overskrifter, blockquotes,
// kodeblokker og innen 100 tegn fra forrige lenke (manuell eller automatisk).
//
// Bruk: registreres i astro.config.mjs som remarkPlugin.
//
// Konfig:
//   contentDir    — mappe å lese slugs fra (default src/content/drommer)
//   maxLinks      — maks lenker per artikkel (default 7)
//   minDistance   — min antall tegn mellom lenker (default 100)
//   onComplete    — callback({ slug, count }) når en fil er ferdig prosessert

import { readdirSync, readFileSync } from 'node:fs';
import { join, basename } from 'node:path';

const SKIP_AND_BOUNDARY = new Set(['link', 'linkReference']);
const SKIP_ONLY = new Set(['heading', 'blockquote', 'code', 'inlineCode']);

function countText(node) {
  if (node.type === 'text') return node.value.length;
  if (node.type === 'code' || node.type === 'inlineCode') return (node.value || '').length;
  if (!node.children) return 0;
  return node.children.reduce((sum, c) => sum + countText(c), 0);
}

// Slugs som er for tvetydige til auto-linking (kolliderer med
// vanlige norske ord/grammatikk).
const DENY_LIST = new Set([
  'har',  // kolliderer med hjelpeverbet "har"
]);

function loadSymbols(contentDir) {
  const files = readdirSync(contentDir).filter(f => f.endsWith('.md'));
  const symbols = [];
  for (const f of files) {
    const content = readFileSync(join(contentDir, f), 'utf8');
    const slugMatch = content.match(/^slug:\s*(.+)$/m);
    const slug = (slugMatch?.[1] || basename(f, '.md')).trim().replace(/^["']|["']$/g, '');
    if (DENY_LIST.has(slug)) continue;
    const searchWords = slug.replace(/-/g, ' ');
    const escaped = searchWords.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Suffiks-listen avhenger av stammeending — ellers får vi falske
    // treff som "far" + "t" → "fart" (hastighet, ikke far).
    //   Konsonant-stamme:  -en, -et, -er, -ene, -s
    //     (bil → bilen, hus → huset, biler, bilene, sykkels)
    //   Vokal-stamme:      -n, -t, -r, -ne, -s
    //     (slange → slangen, hode → hodet, drager, dragene)
    const lastChar = searchWords[searchWords.length - 1].toLowerCase();
    const endsInVowel = 'aeiouyæøå'.includes(lastChar);
    const suffix = endsInVowel ? '(?:n|t|r|ne|s)?' : '(?:en|et|er|ene|s)?';
    const pattern = new RegExp(`\\b${escaped}${suffix}\\b`, 'i');
    symbols.push({ slug, pattern });
  }
  return symbols;
}

export default function remarkAutoLinkSymbols(options = {}) {
  const {
    contentDir = 'src/content/drommer',
    maxLinks = 7,
    minDistance = 100,
    onComplete,
  } = options;

  let symbolsCache = null;
  function getSymbols() {
    if (!symbolsCache) symbolsCache = loadSymbols(contentDir);
    return symbolsCache;
  }

  return function transformer(tree, file) {
    const filePath = String(file?.path || file?.history?.[0] || '');
    // Kjør kun på NO drommer-kollektion
    if (!/[/\\]content[/\\]drommer[/\\][^/\\]+\.md$/.test(filePath)) return;
    if (filePath.includes('drommer-sv')) return;

    const ownSlug = basename(filePath, '.md');
    const candidates = getSymbols().filter(s => s.slug !== ownSlug);

    const linkedSlugs = new Set();
    let linkCount = 0;
    let cumOffset = 0;
    let lastLinkEnd = -Infinity;

    // Forhåndsamle eksisterende lenker til /drommer/X/ slik at vi ikke
    // dupliserer dem.
    let manualCount = 0;
    (function collectExisting(node) {
      if (node.type === 'link' && typeof node.url === 'string') {
        const m = node.url.match(/^\/drommer\/([^/]+)\/?$/);
        if (m) {
          linkedSlugs.add(m[1]);
          manualCount++;
        }
      }
      if (node.children) for (const c of node.children) collectExisting(c);
    })(tree);

    function tryReplace(node) {
      const value = node.value;
      for (const sym of candidates) {
        if (linkedSlugs.has(sym.slug) || linkCount >= maxLinks) continue;
        const m = sym.pattern.exec(value);
        if (!m) continue;

        const matchStart = m.index;
        const matchText = m[0];
        const globalStart = cumOffset + matchStart;

        if (globalStart - lastLinkEnd < minDistance) continue;

        const before = value.slice(0, matchStart);
        const after = value.slice(matchStart + matchText.length);

        const linkNode = {
          type: 'link',
          url: `/drommer/${sym.slug}/`,
          title: null,
          data: { hProperties: { 'data-auto-link': 'symbol' } },
          children: [{ type: 'text', value: matchText }],
        };

        const newNodes = [];
        if (before) newNodes.push({ type: 'text', value: before });
        newNodes.push(linkNode);
        if (after) newNodes.push({ type: 'text', value: after });

        cumOffset = globalStart + matchText.length;
        lastLinkEnd = cumOffset;
        linkedSlugs.add(sym.slug);
        linkCount++;

        return { newNodes, hasBefore: !!before };
      }

      cumOffset += value.length;
      return null;
    }

    function walk(node) {
      if (SKIP_AND_BOUNDARY.has(node.type)) {
        cumOffset += countText(node);
        lastLinkEnd = cumOffset;
        return;
      }
      if (SKIP_ONLY.has(node.type)) {
        cumOffset += countText(node);
        return;
      }
      if (node.type === 'text') {
        cumOffset += node.value.length;
        return;
      }
      if (!node.children) return;

      let i = 0;
      while (i < node.children.length) {
        const child = node.children[i];
        if (child.type === 'text' && linkCount < maxLinks) {
          const result = tryReplace(child);
          if (result) {
            node.children.splice(i, 1, ...result.newNodes);
            i += result.hasBefore ? 2 : 1;
          } else {
            i++;
          }
        } else {
          walk(child);
          i++;
        }
      }
    }

    walk(tree);

    if (onComplete) onComplete({ slug: ownSlug, count: linkCount, manual: manualCount });
  };
}
