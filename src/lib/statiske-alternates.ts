import { existsSync } from 'node:fs';
import { supportedLangs, type Lang, pathSegments } from '../i18n/config';
import { pathFor, homePath } from '../i18n/utils';

/**
 * Fullt sett hreflang-alternativer for en statisk side.
 *
 * Hver side i et hreflang-sett ma liste alle versjoner, ogsa seg selv.
 * Sidene vedlikeholdt listene for hand, og de fleste oppga bare den
 * svenske — uten selvreferanse, uten engelsk og uten x-default. Google
 * ignorerer ensidige annoteringer, sa settene virket ikke.
 *
 * Her utledes settet i stedet fra hvilke sidefiler som faktisk finnes,
 * slik at et nytt sprak kommer med av seg selv.
 */
const SIDEFILER: Record<string, Record<Lang, string>> = {
  omOss:      { nb: 'src/pages/om-oss.astro',     sv: 'src/pages/sv/om-oss.astro',     en: 'src/pages/en/about.astro' },
  kontakt:    { nb: 'src/pages/kontakt.astro',    sv: 'src/pages/sv/kontakt.astro',    en: 'src/pages/en/contact.astro' },
  personvern: { nb: 'src/pages/personvern.astro', sv: 'src/pages/sv/integritet.astro', en: 'src/pages/en/privacy.astro' },
  cookies:    { nb: 'src/pages/cookies.astro',    sv: 'src/pages/sv/cookies.astro',    en: 'src/pages/en/cookies.astro' },
  vilkar:     { nb: 'src/pages/vilkar.astro',     sv: 'src/pages/sv/villkor.astro',    en: 'src/pages/en/terms.astro' },
  forside:    { nb: 'src/pages/index.astro',      sv: 'src/pages/sv/index.astro',      en: 'src/pages/en/index.astro' },
};

const BASE = 'https://drommeguiden.no';

export interface Alternate {
  lang: Lang;
  url: string;
}

export function alternatesFor(side: keyof typeof SIDEFILER): Alternate[] {
  const filer = SIDEFILER[side];
  return supportedLangs
    .filter((l) => existsSync(filer[l]))
    .map((l) => ({
      lang: l,
      url:
        side === 'forside'
          ? `${BASE}${homePath(l)}`
          : `${BASE}${pathFor(l, side as keyof typeof pathSegments.nb)}`,
    }));
}
