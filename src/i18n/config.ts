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
  en: {
    code: 'en',
    locale: 'en_US',
    flag: '🇬🇧',
    label: 'English',
    shortLabel: 'EN',
    htmlLang: 'en',
    basePath: '/en',
    brand: 'The Dream Guide',
    dir: 'ltr',
  },
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = 'nb';

export const supportedLangs: Lang[] = ['nb', 'sv', 'en'];

export const pathSegments = {
  nb: {
    drommer: 'drommer',
    kategori: 'kategori',
    guider: 'guider',
    sovn: 'sovn',
    omOss: 'om-oss',
    kontakt: 'kontakt',
    personvern: 'personvern',
    vilkar: 'vilkar',
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
    vilkar: 'villkor',
    cookies: 'cookies',
  },
  en: {
    drommer: 'dreams',
    kategori: 'category',
    guider: 'guides',
    sovn: 'sleep',
    omOss: 'about',
    kontakt: 'contact',
    personvern: 'privacy',
    vilkar: 'terms',
    cookies: 'cookies',
  },
} as const;
