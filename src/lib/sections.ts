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
const suffix: Record<Lang, string> = { nb: '', sv: '-sv', en: '-en' };

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

export function seksjonerMedInnhold(lang: Lang): Seksjoner {
  return { guider: harInnhold('guider', lang), sovn: harInnhold('sovn', lang) };
}
