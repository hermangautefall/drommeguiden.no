export const languages = {
  nb: {
    code: 'nb',
    locale: 'nb_NO',
    flag: '🇳🇴',
    label: 'Norsk',
    shortLabel: 'NO',
    htmlLang: 'nb',
    basePath: '',
    brand: 'Drømmeguiden',
    dir: 'ltr',
  },
  sv: {
    code: 'sv',
    locale: 'sv_SE',
    flag: '🇸🇪',
    label: 'Svenska',
    shortLabel: 'SV',
    htmlLang: 'sv',
    basePath: '/sv',
    brand: 'Drömguiden',
    dir: 'ltr',
  },
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = 'nb';

export const supportedLangs: Lang[] = ['nb', 'sv'];

export const pathSegments = {
  nb: {
    drommer: 'drommer',
    kategori: 'kategori',
    guider: 'guider',
    sovn: 'sovn',
    omOss: 'om-oss',
    kontakt: 'kontakt',
    personvern: 'personvern',
    cookies: 'cookies',
  },
  sv: {
    drommer: 'drommar',
    kategori: 'kategori',
    guider: 'guider',
    sovn: 'somn',
    omOss: 'om-oss',
    kontakt: 'kontakt',
    personvern: 'integritet',
    cookies: 'cookies',
  },
} as const;
