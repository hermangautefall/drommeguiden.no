import { readdirSync } from 'node:fs';
import type { Lang } from '../i18n/config';

/**
 * Hvilke seksjoner som faktisk har innhold på et gitt språk.
 *
 * EN-utgaven har foreløpig ingen søvnartikler eller guider. Å lenke til tomme
 * oversiktssider fra hver eneste side er både dårlig for leseren og et
 * tynt-innhold-signal mot Google. Sjekken er dynamisk, så lenkene dukker opp
 * av seg selv så snart det finnes innhold — ingen hardkodet språkliste å huske
 * å oppdatere.
 *
 * Vi leser katalogen direkte i stedet for å bruke getCollection(): et oppslag
 * mot en tom samling logger en advarsel, og Header/Footer rendres på hver
 * eneste side. Dette kjører bare ved bygg (statisk output).
 */
const suffix: Record<Lang, string> = { nb: '', sv: '-sv', da: '-da', de: '-de', en: '-en' };

function harInnhold(base: string, lang: Lang): boolean {
  try {
    return readdirSync(`./src/content/${base}${suffix[lang]}`)
      .some((f) => f.endsWith('.md'));
  } catch {
    return false;
  }
}

export interface Seksjoner {
  guider: boolean;
  sovn: boolean;
}

/**
 * Hvilke av de oppgitte sluggene som faktisk finnes som artikkel.
 *
 * Fotlenkene var en fast liste per spraak. Da tysk kom til, pekte de fire
 * tyske paa artikler som ikke var skrevet ennaa — 22 sider med doede lenker.
 * Listen kan naa inneholde slugger vi vil ha naar korpuset er ferdig; de som
 * mangler faller stille ut til de er skrevet.
 */
export function finnesSlugger(lang: Lang, slugger: string[]): Set<string> {
  try {
    const filer = new Set(
      readdirSync(`./src/content/drommer${suffix[lang]}`)
        .filter((f) => f.endsWith('.md'))
        .map((f) => f.slice(0, -3)),
    );
    return new Set(slugger.filter((s) => filer.has(s)));
  } catch {
    return new Set();
  }
}

export function seksjonerMedInnhold(lang: Lang): Seksjoner {
  return { guider: harInnhold('guider', lang), sovn: harInnhold('sovn', lang) };
}
