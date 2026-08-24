import { readdirSync } from 'node:fs';
import type { Lang } from '../i18n/config';

/**
 * Hvilke symbol-slugger som faktisk finnes per språk.
 *
 * `relaterte:`-lista i frontmatter er håndskrevet, og den har over tid samlet
 * opp slugger som ikke finnes — norske slugger i svenske filer, symboler som
 * aldri ble skrevet. De ble rendret som lenker uansett, så leseren (og
 * Googles crawler) traff 404. Her filtrerer vi dem bort ved bygg, slik at en
 * feilskrevet slug blir en manglende chip i stedet for en død lenke.
 */
const mappe: Record<Lang, string> = {
  nb: 'drommer',
  sv: 'drommer-sv',
  en: 'drommer-en',
};

const cache = new Map<Lang, Set<string>>();

export function symbolerSomFinnes(lang: Lang): Set<string> {
  let s = cache.get(lang);
  if (!s) {
    try {
      s = new Set(
        readdirSync(`./src/content/${mappe[lang]}`)
          .filter((f) => f.endsWith('.md'))
          .map((f) => f.slice(0, -3)),
      );
    } catch {
      s = new Set<string>();
    }
    cache.set(lang, s);
  }
  return s;
}
