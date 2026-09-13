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
  omOss:      { nb: 'src/pages/om-oss.astro',     sv: 'src/pages/sv/om-oss.astro',     da: 'src/pages/da/om-os.astro', en: 'src/pages/en/about.astro' },
  kontakt:    { nb: 'src/pages/kontakt.astro',    sv: 'src/pages/sv/kontakt.astro',    da: 'src/pages/da/kontakt.astro', en: 'src/pages/en/contact.astro' },
  personvern: { nb: 'src/pages/personvern.astro', sv: 'src/pages/sv/integritet.astro', da: 'src/pages/da/privatliv.astro', en: 'src/pages/en/privacy.astro' },
  cookies:    { nb: 'src/pages/cookies.astro',    sv: 'src/pages/sv/cookies.astro',    da: 'src/pages/da/cookies.astro', en: 'src/pages/en/cookies.astro' },
  vilkar:     { nb: 'src/pages/vilkar.astro',     sv: 'src/pages/sv/villkor.astro',    da: 'src/pages/da/vilkar.astro', en: 'src/pages/en/terms.astro' },
  forside:    { nb: 'src/pages/index.astro',      sv: 'src/pages/sv/index.astro',      da: 'src/pages/da/index.astro', en: 'src/pages/en/index.astro' },
  journal:    { nb: 'src/pages/journal.astro',    sv: 'src/pages/sv/journal.astro',    da: 'src/pages/da/journal.astro', en: 'src/pages/en/journal.astro' },
  // Seksjonsforsidene vedlikeholdt settene sine for hand og oppga bare nb+sv.
  // Samme feil som de statiske sidene hadde, og samme rettelse.
  drommerIndex:  { nb: 'src/pages/drommer/index.astro',   sv: 'src/pages/sv/drommar/index.astro',  da: 'src/pages/da/dromme/index.astro',   en: 'src/pages/en/dreams/index.astro' },
  sovnIndex:     { nb: 'src/pages/sovn/index.astro',      sv: 'src/pages/sv/somn/index.astro',     da: 'src/pages/da/sovn/index.astro',     en: 'src/pages/en/sleep/index.astro' },
  guiderIndex:   { nb: 'src/pages/guider/index.astro',    sv: 'src/pages/sv/guider/index.astro',   da: 'src/pages/da/guider/index.astro',   en: 'src/pages/en/guides/index.astro' },
  kategoriIndex: { nb: 'src/pages/kategori/index.astro',  sv: 'src/pages/sv/kategori/index.astro', da: 'src/pages/da/kategori/index.astro', en: 'src/pages/en/category/index.astro' },
  aTilAa:        { nb: 'src/pages/drommer/a-til-aa.astro', sv: 'src/pages/sv/drommar/a-till-o.astro', da: 'src/pages/da/dromme/a-til-aa.astro', en: 'src/pages/en/dreams/a-to-z.astro' },
};

/** Seksjonsforsider: hvilken pathSegments-noekkel URL-en bygges av. */
const SEKSJON: Partial<Record<keyof typeof SIDEFILER, keyof typeof pathSegments.nb>> = {
  drommerIndex: 'drommer',
  sovnIndex: 'sovn',
  guiderIndex: 'guider',
  kategoriIndex: 'kategori',
};

/** A-til-AA har eget sistesegment per spraak og foelger ingen felles noekkel. */
const A_TIL_AA: Record<Lang, string> = {
  nb: '/drommer/a-til-aa/', sv: '/sv/drommar/a-till-o/', da: '/da/dromme/a-til-aa/', en: '/en/dreams/a-to-z/',
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
          : side === 'aTilAa'
            ? `${BASE}${A_TIL_AA[l]}`
            : `${BASE}${pathFor(l, SEKSJON[side] ?? (side as keyof typeof pathSegments.nb))}`,
    }));
}
