import type { Lang } from './config';

export const ui = {
  nb: {
    'nav.symboler': 'Symboler',
    'nav.kategorier': 'Kategorier',
    'nav.guider': 'Guider',
    'nav.sovn': 'Søvn',
    'nav.omOss': 'Om oss',
    'nav.kontakt': 'Kontakt',
    'nav.personvern': 'Personvern',

    'cta.utforskSymboler': 'Utforsk symboler',
    'cta.lesMer': 'Les mer',
    'cta.tilbake': 'Tilbake',
    'cta.lesGuidene': 'Les guidene',

    'hero.undertittel': 'Utforsk den norske drømmeguiden',
    'hero.beskrivelse': 'Søk blant over 200 drømmesymboler — fra slanger og hav til tenner og flyging. Basert på både forskning og folketradisjon.',

    'sok.placeholder': 'Søk etter et drømmesymbol...',

    'footer.tagline': 'Den norske guiden til drømmer og deres betydning.',
    'footer.utforsk': 'Utforsk',
    'footer.populart': 'Populært',
    'footer.info': 'Info',
    'footer.copyright': 'Alle rettigheter reservert.',

    'symbol.tolkningerTittel': 'Vanlige tolkninger',
    'symbol.tlDr': 'Kjapp tolkning',
    'symbol.metaPublisert': 'Publisert',
    'symbol.lesetid': 'min lesetid',
    'symbol.relaterte': 'Relaterte drømmesymboler',
    'symbol.utforskVidere': 'Utforsk videre',

    'sovn.tittel': 'Søvn',
    'sovn.subtitle': 'Vitenskap, vaner og bedre netter — alt du trenger å vite om søvn, basert på forskning.',
    'sovn.artikler': 'artikler',
    'sovn.seksjon': 'Søvnseksjonen',
    'sovn.forbindelsen': 'Forbindelsen',
    'sovn.bridgeTittel': 'Søvn og drømmer henger sammen',
    'sovn.bridgeTekst': 'Drømmene skjer under REM-søvn — og søvnkvaliteten påvirker direkte hva du drømmer. Utforsk over 200 drømmesymboler i vår komplette drømmeguide.',
    'sovn.bridgeCta': 'Utforsk drømmesymboler',

    'sitemap.alle': 'Alle drømmesymboler',
    'sitemap.alleSovn': 'Alle søvnartikler',
    'sitemap.alleGuider': 'Alle guider',
    'sitemap.alleKategorier': 'Alle kategorier',

    'lang.label': 'Språk',
    'lang.bytt': 'Bytt språk',

    'dato.publisert': 'Publisert',
    'dato.oppdatert': 'Oppdatert',
  },
  sv: {
    'nav.symboler': 'Symboler',
    'nav.kategorier': 'Kategorier',
    'nav.guider': 'Guider',
    'nav.sovn': 'Sömn',
    'nav.omOss': 'Om oss',
    'nav.kontakt': 'Kontakt',
    'nav.personvern': 'Integritet',

    'cta.utforskSymboler': 'Utforska symboler',
    'cta.lesMer': 'Läs mer',
    'cta.tilbake': 'Tillbaka',
    'cta.lesGuidene': 'Läs guiderna',

    'hero.undertittel': 'Utforska den svenska drömguiden',
    'hero.beskrivelse': 'Sök bland över 200 drömsymboler — från ormar och hav till tänder och flygning. Baserat på både forskning och folktradition.',

    'sok.placeholder': 'Sök efter en drömsymbol...',

    'footer.tagline': 'Den svenska guiden till drömmar och deras betydelse.',
    'footer.utforsk': 'Utforska',
    'footer.populart': 'Populärt',
    'footer.info': 'Info',
    'footer.copyright': 'Alla rättigheter förbehållna.',

    'symbol.tolkningerTittel': 'Vanliga tolkningar',
    'symbol.tlDr': 'Snabb tolkning',
    'symbol.metaPublisert': 'Publicerad',
    'symbol.lesetid': 'min läsning',
    'symbol.relaterte': 'Relaterade drömsymboler',
    'symbol.utforskVidere': 'Utforska vidare',

    'sovn.tittel': 'Sömn',
    'sovn.subtitle': 'Vetenskap, vanor och bättre nätter — allt du behöver veta om sömn, baserat på forskning.',
    'sovn.artikler': 'artiklar',
    'sovn.seksjon': 'Sömnsektionen',
    'sovn.forbindelsen': 'Sambandet',
    'sovn.bridgeTittel': 'Sömn och drömmar hänger ihop',
    'sovn.bridgeTekst': 'Drömmarna sker under REM-sömn — och sömnkvaliteten påverkar direkt vad du drömmer. Utforska över 200 drömsymboler i vår kompletta drömguide.',
    'sovn.bridgeCta': 'Utforska drömsymboler',

    'sitemap.alle': 'Alla drömsymboler',
    'sitemap.alleSovn': 'Alla sömnartiklar',
    'sitemap.alleGuider': 'Alla guider',
    'sitemap.alleKategorier': 'Alla kategorier',

    'lang.label': 'Språk',
    'lang.bytt': 'Byt språk',

    'dato.publisert': 'Publicerad',
    'dato.oppdatert': 'Uppdaterad',
  },
} as const satisfies Record<Lang, Record<string, string>>;

export type UIKey = keyof typeof ui.nb;

export function useTranslations(lang: Lang) {
  return function t(key: UIKey): string {
    return ui[lang][key] ?? ui.nb[key] ?? key;
  };
}
