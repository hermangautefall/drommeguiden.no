// Registry over forfattere/avsendere. Frontmatter-feltet `author` peker på
// en nøkkel her ('default' → redaksjonen). Schema-genereringen i
// Symbol.astro og Sovn.astro slår opp via getAuthor().
//
// MERK om `type`: innholdet er redaksjonelt arbeid av Drømmeguiden som
// utgiver, ikke av én navngitt privatperson. Derfor deklareres avsenderen
// som Organization i schema.org — å oppgi en redaksjon som Person ville
// vært feilaktige strukturerte data.

export interface Author {
  name: string;
  /** Navn per sprak. Bylinen og schema.org skal ikke vise et norsk
   *  redaksjonsnavn pa svenske og engelske sider. */
  navnPerSprak?: Record<string, string>;
  url: string;
  /** schema.org-type. Redaksjonen er Organization; enkeltpersoner er Person. */
  type: 'Organization' | 'Person';
  /** Kort linje som vises i bylinen under tittelen. */
  byline: string;
  /** Biografi/beskrivelse (norsk). Brukes på /om-oss/. */
  bio: string[];
  /** Eksterne profiler — brukes i schema.org sameAs */
  sameAs: string[];
}

export const authors: Record<string, Author> = {
  default: {
    name: 'Drømmeguidens redaksjon',
    navnPerSprak: {
      nb: 'Drømmeguidens redaksjon',
      sv: 'Drömguidens redaktion',
      en: 'The Dream Guide editorial team',
    },
    url: '/om-oss/',
    type: 'Organization',
    byline: 'Drømmeguidens redaksjon',
    bio: [
      'Drømmeguiden redigeres av en liten norsk redaksjon som skriver om drømmer, symboler og søvn. Vi er ikke psykologer eller terapeuter, og vi presenterer oss ikke som det. Vi er lesere av drømmelitteratur som mener feltet fortjener bedre norsk formidling enn det som finnes i dag.',
      'Symbolsidene bygger på tre kilder vi oppgir åpent: klassisk drømmelitteratur (Artemidoros, Freud, Jung), nyere drømmeforskning (blant andre Revonsuo, Hall og Van de Castle, Domhoff), og komparativ kultur- og religionshistorie. Søvnseksjonen bygger på fagfellevurdert forskning og offentlige helsekilder, som er lenket direkte i hver artikkel.',
      'Vi skriver aldri at en drøm «betyr» noe bestemt. Drømmer er personlige, og tolkningen er alltid din egen — vi tilbyr rammene, ikke fasiten.',
    ],
    sameAs: [],
  },
};

export function getAuthor(key?: string): Author {
  return (key && authors[key]) || authors.default;
}
