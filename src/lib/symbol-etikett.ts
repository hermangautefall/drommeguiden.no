import { readdirSync, readFileSync } from 'node:fs';
import type { Lang } from '../i18n/config';

/**
 * Kort, lesbar etikett per symbol-slug — til «Relaterte drømmesymboler».
 *
 * Boksen skrev tidligere ut sluggen direkte (`slug.replace(/-/g, ' ')`), og
 * siden slugger er transkribert uten norske tegn, sto det «avdod person»,
 * «oyne», «saar» og «morkt rom» på hver eneste side. Kombinert med
 * `text-transform: capitalize` ble det «Avdod Person». Etiketten utledes nå
 * fra artikkelens egen tittel.
 */
const MAPPE: Record<Lang, string> = { nb: 'drommer', sv: 'drommer-sv', en: 'drommer-en' };

const HALE: Record<Lang, RegExp> = {
  nb: / — hva betyr det\?$/,
  sv: / — vad betyder det\?$/,
  en: / — what does it mean\?$/,
};

const HODE: Record<Lang, RegExp> = {
  nb: /^Drømmer om |^Drømme om |^Drømt om /,
  sv: /^Drömmar om |^Drömma om |^Drömt om /,
  en: /^Dreaming (?:of|about) |^Dream about /,
};

/**
 * Engelsk trenger ett steg til. Titlene heter «Dreaming of a beach», og naar
 * bare «Dreaming of » fjernes blir etiketten «A beach». 95 av 215 engelske
 * symboler starter slik, saa bade brikkene og enhver alfabetisk liste klumper
 * seg under A. Artikkelen sier ingenting i en etikett, og fjernes.
 */
const ARTIKKEL_EN = /^(?:a|an|the) (?=\S)/i;

/** Titler som ikke følger standardmønsteret, og som blir klumpete uten hjelp. */
const OVERSTYR: Record<Lang, Record<string, string>> = {
  nb: {
    'vaere-gravid-mann': 'gravid mann',
    'baby-gutt': 'gutt eller jente',
    'utroskap-partner': 'partneren er utro',
    'fremmed-sex': 'sex med fremmed',
    'drukne-barn': 'barn som drukner',
    'fremmed': 'en fremmed',
  },
  sv: {
    'vara-gravid-man': 'gravid man',
    'baby-pojke': 'pojke eller flicka',
    'otrohet-partner': 'partnern är otrogen',
    'gravid': 'gravid',
    'drunkna-barn': 'barn som drunknar',
    'forlora-barn': 'förlora ett barn',
    'frammande-sex': 'sex med främling',
    'frammande': 'en främling',
  },
  en: {},
};

function storForbokstav(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const cache = new Map<Lang, Map<string, string>>();

export function symbolEtiketter(lang: Lang): Map<string, string> {
  let m = cache.get(lang);
  if (m) return m;
  m = new Map<string, string>();
  try {
    for (const fil of readdirSync(`./src/content/${MAPPE[lang]}`)) {
      if (!fil.endsWith('.md')) continue;
      const slug = fil.slice(0, -3);
      const overstyrt = OVERSTYR[lang][slug];
      if (overstyrt) {
        m.set(slug, storForbokstav(overstyrt));
        continue;
      }
      const rå = readFileSync(`./src/content/${MAPPE[lang]}/${fil}`, 'utf8');
      const t = rå.match(/^tittel: *"(.+)"$/m)?.[1];
      let etikett = t
        ? t.replace(HALE[lang], '').replace(HODE[lang], '')
        : slug.replace(/-/g, ' ');
      if (lang === 'en') etikett = etikett.replace(ARTIKKEL_EN, '');
      m.set(slug, storForbokstav(etikett));
    }
  } catch {
    /* tom samling — boksen filtrerer uansett bort ukjente slugger */
  }
  cache.set(lang, m);
  return m;
}
