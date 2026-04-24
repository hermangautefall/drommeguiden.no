import { languages, defaultLang, pathSegments, type Lang } from './config';

export function getLangFromUrl(url: URL): Lang {
  const [, first] = url.pathname.split('/');
  if (first && first in languages && first !== 'nb') {
    return first as Lang;
  }
  return defaultLang;
}

export function localizedPath(lang: Lang, path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (lang === defaultLang) return clean;
  return `/${lang}${clean}`;
}

export function pathFor(lang: Lang, section: keyof typeof pathSegments.nb, slug?: string): string {
  const segment = pathSegments[lang][section];
  const base = lang === defaultLang ? `/${segment}` : `/${lang}/${segment}`;
  if (slug) return `${base}/${slug}/`;
  return `${base}/`;
}

export function homePath(lang: Lang): string {
  return lang === defaultLang ? '/' : `/${lang}/`;
}

export function getLanguageConfig(lang: Lang) {
  return languages[lang];
}
