import { getCollection } from 'astro:content';
import { supportedLangs, type Lang } from '../i18n/config';
import { pathFor } from '../i18n/utils';

/**
 * Fullt hreflang-sett for en symbolartikkel, utledet fra `nb_slug`.
 *
 * Hver [slug].astro bygget tidligere sin egen liste og hardkodet de andre
 * spraakene. Med tre spraak var det tre filer som kjente to andre; med fire
 * blir det fire som kjenner tre, og settene sklir fra hverandre. Den samme
 * asymmetrien maatte allerede rettes én gang for de statiske sidene.
 *
 * `nb_slug` er ryggraden i hele spraakkoblingen paa siden. Norske filer har
 * den ikke selv, saa der brukes `slug`.
 */
const SAMLING: Record<Lang, string> = {
  nb: 'drommer',
  sv: 'drommer-sv',
  da: 'drommer-da',
  en: 'drommer-en',
};

const BASE = 'https://drommeguiden.no';

export interface Alternate {
  lang: Lang;
  url: string;
}

export async function symbolAlternates(nbSlug: string | undefined): Promise<Alternate[]> {
  if (!nbSlug) return [];
  const ut: Alternate[] = [];
  for (const l of supportedLangs) {
    let samling: any[] = [];
    try {
      samling = await getCollection(SAMLING[l] as any);
    } catch {
      continue;
    }
    const treff = samling.find((x: any) => (x.data.nb_slug ?? x.data.slug) === nbSlug);
    if (treff) ut.push({ lang: l, url: `${BASE}${pathFor(l, 'drommer', treff.data.slug)}` });
  }
  return ut;
}
