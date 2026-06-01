// Remark-plugin som injiserer en in-content annonse-slot rett etter
// første H2 i artikkelens markdown-body. Kjører kun for filer under
// src/content/drommer/ og src/content/sovn/ (begge språk).
//
// Markupen som injiseres må matche AdSlot.astro for format='in-content'
// så CSS-en treffer (deler felles is:global-regler i AdSlot.astro).

const CLIENT_ID = 'ca-pub-6610380824794050';

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function buildHtml(lang) {
  const label = lang === 'sv' ? 'Annons' : 'Annonse';
  const slotId = 'placeholder';
  const dataAdFormat = 'auto';
  // Push-skriptet utelates når slotId === 'placeholder' (ingen AdSense-
  // anrop før godkjenning). Identisk logikk som ad-slot-html.ts.
  return [
    `<aside class="ad-container ad-in-content" data-ad-format="in-content" aria-label="${escapeHtml(label)}" style="min-height:280px">`,
    `<span class="ad-label">${escapeHtml(label)}</span>`,
    `<ins class="adsbygoogle" style="display:block" data-ad-client="${CLIENT_ID}" data-ad-slot="${slotId}" data-ad-format="${dataAdFormat}" data-loading="lazy" data-full-width-responsive="true"></ins>`,
    `</aside>`,
  ].join('');
}

export default function remarkAdSlots() {
  return function transformer(tree, file) {
    const filePath = String(file?.path || file?.history?.[0] || '');
    // Bare drommer- og sovn-kollektioner (alle språk)
    const inDrommer = /[/\\]content[/\\]drommer(?:-sv)?[/\\]/.test(filePath);
    const inSovn = /[/\\]content[/\\]sovn(?:-sv)?[/\\]/.test(filePath);
    if (!inDrommer && !inSovn) return;

    const lang = /-sv[/\\]/.test(filePath) ? 'sv' : 'nb';

    // Finn første H2 (depth=2) på toppnivå av treet
    const children = tree.children || [];
    let firstH2Idx = -1;
    for (let i = 0; i < children.length; i++) {
      const node = children[i];
      if (node.type === 'heading' && node.depth === 2) {
        firstH2Idx = i;
        break;
      }
    }
    if (firstH2Idx === -1) return; // Ingen H2 → ingen injeksjon

    const html = buildHtml(lang);
    const adNode = { type: 'html', value: html };
    // Sett inn rett etter første H2
    children.splice(firstH2Idx + 1, 0, adNode);
  };
}
