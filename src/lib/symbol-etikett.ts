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
const MAPPE: Record<Lang, string> = { nb: 'drommer', sv: 'drommer-sv', da: 'drommer-da', de: 'drommer-de', en: 'drommer-en' };

/**
 * Halen er en spoersmaalsformulering etter tankestrek. Moenstret er generisk
 * fordi titler naa kan ha egne spoersmaal — «Droemma om ormar — varning eller
 * foervandling?» — og en fast streng ville latt hele halen bli staaende i
 * brikke-etiketten. Testet mot alle 723 titler: ingen etikett endrer seg.
 */
const HALE: Record<Lang, RegExp> = {
  nb: / — [^—]*\?$/,
  sv: / — [^—]*\?$/,
  da: / — [^—]*\?$/,
  de: / — [^—]*\?$/,
  en: / — [^—]*\?$/,
};

const HODE: Record<Lang, RegExp> = {
  nb: /^Drømmer om |^Drømme om |^Drømt om /,
  sv: /^Drömmar om |^Drömma om |^Drömt om /,
  da: /^Drømme om |^Drømmer om |^Drømt om /,
  // Tysk: «Träume von» styrer dativ, «Träumen von» og «Vom … träumen» finnes ogsaa.
  de: /^Träume vom |^Träumen vom |^Träume von |^Träumen von |^Vom |^Von /,
  en: /^Dreaming (?:of|about) |^Dream about /,
};

/**
 * Engelsk trenger ett steg til. Titlene heter «Dreaming of a beach», og naar
 * bare «Dreaming of » fjernes blir etiketten «A beach». 95 av 215 engelske
 * symboler starter slik, saa bade brikkene og enhver alfabetisk liste klumper
 * seg under A. Artikkelen sier ingenting i en etikett, og fjernes.
 */
const ARTIKKEL_EN = /^(?:a|an|the) (?=\S)/i;

/** Tysk boeyer artikkelen etter kasus: «Traeume von einer …» gir «einer …». */
const ARTIKKEL_DE = /^(?:der|die|das|den|dem|des|ein|eine|einer|einem|einen|eines) (?=\S)/i;

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
  da: {},
  de: {
    // Tysk boeyer etter «von», saa dativen henger igjen naar preposisjonen
    // fjernes: «Traeume von Haaren» gir «Haaren», «von Voegeln» gir «Voegeln».
    // En etikett som staar for seg selv skal vaere nominativ. Dativ flertall
    // paa -n kan ikke strippes mekanisk — «Schlangen» er korrekt nominativ.
    'verstorbene-person': 'verstorbene Person',
    'haare': 'Haare',
    'vogel': 'Vögel',
    // Verbfraser blir hele setninger uten hjelp.
    'jemanden-toeten': 'jemanden töten',
  },
  en: {},
};

function storForbokstav(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Tysk dativ → nominativ for etiketter som staar for seg selv.
 *
 * «Traeume von Haaren» gir «Haaren» naar preposisjonen fjernes, men en etikett
 * i en broedsmule eller paa et kort skal vaere nominativ. Dativ flertall paa -n
 * kan ikke strippes mekanisk — «Schlangen» og «Voegeln» ser like ut, men bare
 * den andre er boeyd. Derfor en liste.
 *
 * Ligger her fordi tre steder trenger den: symbolEtiketter, displayTitle i
 * Symbol.astro og kortNavn i DagensSymbol.astro.
 */
const DE_NOMINATIV: Record<string, string> = {
  'Haaren': 'Haare',
  'Vögeln': 'Vögel',
  'Verstorbenen Person': 'Verstorbene Person',
  'Verstorbenen person': 'Verstorbene Person',
};

/** Tyske titler som er verbfraser og trenger et eget, kort navn. */
const DE_KORTFORM: Record<string, string> = {
  'Träume davon, jemanden zu töten': 'jemanden töten',
};

export function deNominativ(s: string): string {
  return DE_KORTFORM[s] ?? DE_NOMINATIV[s] ?? s;
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
      if (lang === 'de') etikett = etikett.replace(ARTIKKEL_DE, '');
      m.set(slug, storForbokstav(etikett));
    }
  } catch {
    /* tom samling — boksen filtrerer uansett bort ukjente slugger */
  }
  cache.set(lang, m);
  return m;
}
