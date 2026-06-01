import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import remarkAutoLinkSymbols from './src/lib/remark-auto-link-symbols.mjs';
import remarkAdSlots from './src/lib/remark-ad-slots.mjs';
import remarkStripRecommendations from './src/lib/remark-strip-recommendations.mjs';
import customSitemap from './src/lib/sitemap-integration.mjs';

const autoLinkStats = new Map();

const autoLinkReport = {
  name: 'auto-link-report',
  hooks: {
    'astro:build:done': () => {
      if (autoLinkStats.size === 0) return;
      const entries = [...autoLinkStats.entries()]
        .map(([slug, s]) => [slug, s.count, s.manual, s.count + s.manual])
        .sort((a, b) => b[3] - a[3]);
      const totalAuto = entries.reduce((s, [, a]) => s + a, 0);
      const totalManual = entries.reduce((s, [, , m]) => s + m, 0);
      const totalCombined = totalAuto + totalManual;
      const dist = entries.reduce((acc, [, , , t]) => {
        acc[t] = (acc[t] || 0) + 1;
        return acc;
      }, {});
      const inRange = entries.filter(([, , , t]) => t >= 3 && t <= 7).length;
      const below = entries.filter(([, , , t]) => t < 3).length;
      const above = entries.filter(([, , , t]) => t > 7).length;
      console.log('\n[auto-link-symbols] Debug-rapport:');
      console.log(`  Sider behandlet:      ${entries.length}`);
      console.log(`  Auto-lenker lagt til: ${totalAuto}`);
      console.log(`  Manuelle lenker:      ${totalManual}`);
      console.log(`  Sum interne lenker:   ${totalCombined}  (snitt ${(totalCombined / entries.length).toFixed(2)} per side)`);
      console.log(`  I 3-7-mål (sum):      ${inRange} (${((inRange / entries.length) * 100).toFixed(0)}%)`);
      console.log(`  Under 3 lenker:       ${below}`);
      console.log(`  Over 7 lenker:        ${above}`);
      console.log(`  Fordeling (sum):      ${JSON.stringify(dist)}`);
      console.log('  Topp 10 sider (sum / auto / manuell):');
      for (const [slug, auto, manual, total] of entries.slice(0, 10)) {
        console.log(`    ${String(total).padStart(2)} / ${String(auto).padStart(2)} / ${String(manual).padStart(2)}   /drommer/${slug}/`);
      }
    },
  },
};

export default defineConfig({
  site: 'https://drommeguiden.no',
  trailingSlash: 'always',
  integrations: [customSitemap(), autoLinkReport],
  markdown: {
    remarkPlugins: [
      remarkStripRecommendations,
      [
        remarkAutoLinkSymbols,
        {
          onComplete: ({ slug, count, manual }) => {
            autoLinkStats.set(slug, { count, manual });
          },
        },
      ],
      remarkAdSlots,
    ],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
