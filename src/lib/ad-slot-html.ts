// Felles HTML-bygger for annonse-slots. Brukt av AdSlot.astro-komponenten
// og av remark-ad-slots-pluginen (som injiserer in-content-slotter etter
// første H2 i drommer/sovn-markdown). Én sannhetskilde for markupen.

export interface AdSlotOptions {
  format: 'in-content' | 'bottom' | 'sidebar';
  slotId?: string;
  dataAdFormat?: string;
  lang?: 'nb' | 'sv' | 'en';
}

const CLIENT_ID = 'ca-pub-6610380824794050';

function escape(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function adSlotHtml(opts: AdSlotOptions): string {
  const { format, slotId = 'placeholder', dataAdFormat = 'auto', lang = 'nb' } = opts;
  const labelByLang: Record<string, string> = { nb: 'Annonse', sv: 'Annons', en: 'Advertisement' };
  const label = labelByLang[lang] ?? labelByLang.nb;
  const isPlaceholder = slotId === 'placeholder';

  // Inline-CSS holder reservert plass — sikrer at CLS-måling
  // er gyldig allerede før ekte slot-ID-er er på plass.
  const minHeight = format === 'sidebar' ? 620 : 280;

  const insAttrs = [
    'class="adsbygoogle"',
    'style="display:block"',
    `data-ad-client="${CLIENT_ID}"`,
    `data-ad-slot="${escape(slotId)}"`,
    `data-ad-format="${escape(dataAdFormat)}"`,
    `data-loading="lazy"`,
    'data-full-width-responsive="true"',
  ].join(' ');

  // Push-skriptet rendres KUN når slotId er ekte (ikke 'placeholder').
  // Sånn unngår vi å pinge AdSense før godkjenning.
  const pushScript = isPlaceholder
    ? ''
    : `<script>(adsbygoogle=window.adsbygoogle||[]).push({});</script>`;

  return [
    `<aside class="ad-container ad-${format}" data-ad-format="${format}" aria-label="${escape(label)}" style="min-height:${minHeight}px">`,
    `  <span class="ad-label">${escape(label)}</span>`,
    `  <ins ${insAttrs}></ins>`,
    pushScript,
    `</aside>`,
  ].filter(Boolean).join('');
}
