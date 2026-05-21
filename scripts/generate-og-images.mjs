// Genererer 1200×630 PNG-deling sbilder for Open Graph / Twitter.
// Kjør én gang ved branding-endringer: `node scripts/generate-og-images.mjs`
// Output: public/og-no.png og public/og-sv.png. Sharp brukes via librsvg
// for SVG→PNG-rasterisering. Sluttfilstørrelsen bør ligge under 100 KB.

import sharp from 'sharp';
import { writeFileSync, statSync } from 'node:fs';

const W = 1200;
const H = 630;

function svgFor(lang) {
  const brand = lang === 'sv' ? 'Drömguiden' : 'Drømmeguiden';
  const tagline = lang === 'sv'
    ? 'Drömsymboler &amp; drömtydning'
    : 'Drømmesymboler &amp; drømmetolkning';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1a2340"/>
      <stop offset="55%" stop-color="#0f1328"/>
      <stop offset="100%" stop-color="#0a0e1f"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="32%" r="38%">
      <stop offset="0%" stop-color="rgba(192,128,112,0.18)"/>
      <stop offset="100%" stop-color="rgba(192,128,112,0)"/>
    </radialGradient>
    <radialGradient id="moonShade" cx="35%" cy="35%" r="60%">
      <stop offset="0%" stop-color="#f2ede6"/>
      <stop offset="100%" stop-color="#c9c0b3"/>
    </radialGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>

  <!-- Stjerner -->
  <g fill="#f2ede6" opacity="0.6">
    <circle cx="180"  cy="110" r="1.8"/>
    <circle cx="280"  cy="430" r="1.4"/>
    <circle cx="980"  cy="180" r="2.2"/>
    <circle cx="1060" cy="480" r="1.6"/>
    <circle cx="640"  cy="90"  r="1.2"/>
    <circle cx="430"  cy="540" r="1.8"/>
    <circle cx="860"  cy="560" r="1.2"/>
    <circle cx="150"  cy="320" r="1.4"/>
  </g>

  <!-- Måne -->
  <g transform="translate(600 220)">
    <circle r="64" fill="url(#moonShade)"/>
    <circle r="64" fill="none" stroke="rgba(242,237,230,0.25)" stroke-width="1"/>
    <circle cx="-18" cy="-12" r="6" fill="rgba(0,0,0,0.06)"/>
    <circle cx="14"  cy="6"   r="8" fill="rgba(0,0,0,0.05)"/>
    <circle cx="-8"  cy="22"  r="5" fill="rgba(0,0,0,0.07)"/>
  </g>

  <!-- Brand -->
  <text x="600" y="420" text-anchor="middle"
        font-family="Georgia, 'Times New Roman', serif"
        font-size="86" fill="#f2ede6" font-weight="400" letter-spacing="-1">
    ${brand}
  </text>

  <!-- Tagline -->
  <text x="600" y="480" text-anchor="middle"
        font-family="Helvetica, Arial, sans-serif"
        font-size="22" fill="rgba(242,237,230,0.6)" letter-spacing="3"
        style="text-transform: uppercase">
    ${tagline}
  </text>

  <!-- Aksent-linje -->
  <line x1="540" y1="510" x2="660" y2="510" stroke="#c08070" stroke-width="2"/>
</svg>`;
}

async function generate(lang, outPath) {
  const svg = svgFor(lang);
  // PNG med palette + komprimering for liten filstørrelse
  await sharp(Buffer.from(svg))
    .png({ compressionLevel: 9, palette: true, quality: 90, effort: 10 })
    .toFile(outPath);
  const kb = (statSync(outPath).size / 1024).toFixed(1);
  console.log(`${outPath}: ${kb} KB`);
}

await generate('nb', 'public/og-no.png');
await generate('sv', 'public/og-sv.png');
