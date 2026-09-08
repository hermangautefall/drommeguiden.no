// Remark-plugin som injiserer affiliate-banneret rett etter foerste H2 i
// droemmeartiklene (alle tre spraak).
//
// Banneret erstatter AdSense-slotten som stod i samme posisjon. De to skal
// IKKE ligge i samme beholder: .ad-container inneholder en ekte
// <ins class="adsbygoogle">, og aa legge en affiliate-lenke inni den ville
// blandet egen annonsering med AdSense-inventar i én og samme boks. Bunn-
// og sidebar-slottene staar urort.
//
// Lenken maa ha rel="sponsored" — Google Search Essentials krever at
// betalte lenker merkes, og uten det ville 645 sider baere en umerket
// affiliate-lenke hver.

const LENKE = 'https://01fb2ammwf1ctd3jmbkc78dm1o.hop.clickbank.net';
const BILDE = '/bilder/annonser/soulmate';
const BREDDE = 800;
const HOYDE = 1071;

const TEKST = {
  nb: { label: 'Annonse', alt: 'Annonse: tjeneste som tegner et portrett av din fremtidige partner' },
  sv: { label: 'Annons',  alt: 'Annons: tjänst som ritar ett porträtt av din framtida partner' },
  en: { label: 'Advertisement', alt: 'Advertisement: service that draws a portrait of your future partner' },
};

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function bygg(lang) {
  const t = TEKST[lang] ?? TEKST.nb;
  return [
    `<aside class="affil" aria-label="${esc(t.label)}">`,
    `<span class="affil-label">${esc(t.label)}</span>`,
    `<a class="affil-link" href="${LENKE}" target="_blank" rel="sponsored noopener nofollow">`,
    `<picture>`,
    `<source srcset="${BILDE}.webp" type="image/webp">`,
    `<img src="${BILDE}.jpg" width="${BREDDE}" height="${HOYDE}" alt="${esc(t.alt)}" loading="lazy" decoding="async">`,
    `</picture>`,
    `</a>`,
    `</aside>`,
  ].join('');
}

export default function remarkAffiliate() {
  return function transformer(tree, file) {
    const filePath = String(file?.path || file?.history?.[0] || '');
    if (!/[/\\]content[/\\]drommer(?:-sv|-en)?[/\\]/.test(filePath)) return;

    const lang = /-sv[/\\]/.test(filePath) ? 'sv' : /-en[/\\]/.test(filePath) ? 'en' : 'nb';

    const children = tree.children || [];
    let i = children.findIndex((n) => n.type === 'heading' && n.depth === 2);
    if (i === -1) return;

    children.splice(i + 1, 0, { type: 'html', value: bygg(lang) });
  };
}
