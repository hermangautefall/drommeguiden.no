// Remark-plugin som injiserer et affiliate-banner rett etter foerste H2.
//
//   droemmeartikler  → soulmate
//   soevnartikler    → yusleep
//
// Bannerne ligger IKKE i .ad-container. Den beholderen inneholder en ekte
// <ins class="adsbygoogle"> med kontoens client-ID, og aa legge en
// affiliate-lenke inni den ville blandet egen annonsering med
// AdSense-inventar i én og samme boks.
//
// Lenkene har rel="sponsored" — Google Search Essentials krever at betalte
// lenker merkes. Uten det ville hver eneste artikkel baaret en umerket
// affiliate-lenke.

import { affiliateHtml } from './affiliate-html.mjs';

const REGLER = [
  { mnst: /[/\\]content[/\\]drommer(?:-sv|-en)?[/\\]/, annonse: 'soulmate' },
  { mnst: /[/\\]content[/\\]sovn(?:-sv|-en)?[/\\]/, annonse: 'yusleep' },
];

export default function remarkAffiliate() {
  return function transformer(tree, file) {
    const filePath = String(file?.path || file?.history?.[0] || '');
    const regel = REGLER.find((r) => r.mnst.test(filePath));
    if (!regel) return;

    const lang = /-sv[/\\]/.test(filePath) ? 'sv' : /-en[/\\]/.test(filePath) ? 'en' : 'nb';

    const children = tree.children || [];
    const i = children.findIndex((n) => n.type === 'heading' && n.depth === 2);
    if (i === -1) return;

    children.splice(i + 1, 0, {
      type: 'html',
      value: affiliateHtml({ annonse: regel.annonse, format: 'in-content', lang }),
    });
  };
}
