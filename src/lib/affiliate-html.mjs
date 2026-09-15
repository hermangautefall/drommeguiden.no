// Felles HTML-bygger for affiliate-bannere. Brukes baade av
// remark-pluginene (som injiserer i markdown) og av AffiliateSlot.astro.
// Én sannhetskilde for markupen, slik ad-slot-html.ts er det for AdSense.
//
// Bannerne ligger IKKE i .ad-container. Den beholderen inneholder en ekte
// <ins class="adsbygoogle"> med kontoens client-ID, og aa blande egen
// annonsering med AdSense-inventar i samme boks er ikke noe vi gjoer.
//
// Lenkene har rel="sponsored": Google Search Essentials krever at betalte
// lenker merkes.

const ANNONSER = {
  soulmate: {
    lenke: 'https://01fb2ammwf1ctd3jmbkc78dm1o.hop.clickbank.net',
    bilde: '/bilder/annonser/soulmate',
    bredde: 800,
    hoyde: 1071,
    alt: {
      nb: 'Annonse: tjeneste som tegner et portrett av din fremtidige partner',
      sv: 'Annons: tjänst som ritar ett porträtt av din framtida partner',
      da: 'Annonce: tjeneste der tegner et portræt af din fremtidige partner',
      en: 'Advertisement: service that draws a portrait of your future partner',
    },
  },
  yusleep: {
    lenke: 'https://d3cc3egethvfwh6w9r01nk7q3c.hop.clickbank.net',
    bilde: '/bilder/annonser/yusleep',
    bredde: 700,
    hoyde: 700,
    alt: {
      nb: 'Annonse: kosttilskudd som markedsføres for bedre nattesøvn',
      sv: 'Annons: kosttillskott som marknadsförs för bättre nattsömn',
      da: 'Annonce: kosttilskud der markedsføres for bedre nattesøvn',
      en: 'Advertisement: supplement marketed for better sleep at night',
    },
  },
};

const MERKING = { nb: 'Annonse', sv: 'Annons', da: 'Annonce', de: 'Anzeige', en: 'Advertisement' };

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function affiliateHtml({ annonse, format = 'in-content', lang = 'nb' }) {
  const a = ANNONSER[annonse];
  if (!a) throw new Error(`Ukjent annonse: ${annonse}`);
  const label = MERKING[lang] ?? MERKING.nb;
  const alt = a.alt[lang] ?? a.alt.nb;
  return [
    `<aside class="affil affil-${esc(format)}" aria-label="${esc(label)}">`,
    `<span class="affil-label">${esc(label)}</span>`,
    `<a class="affil-link" href="${a.lenke}" target="_blank" rel="sponsored noopener nofollow">`,
    `<picture>`,
    `<source srcset="${a.bilde}.webp" type="image/webp">`,
    `<img src="${a.bilde}.jpg" width="${a.bredde}" height="${a.hoyde}" alt="${esc(alt)}" loading="lazy" decoding="async">`,
    `</picture>`,
    `</a>`,
    `</aside>`,
  ].join('');
}
