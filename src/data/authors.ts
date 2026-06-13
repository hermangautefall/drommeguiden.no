// Registry over forfattere. Frontmatter-feltet `author` peker på en
// nøkkel her ('default' → Isac Levine). Schema-genereringen i
// Symbol.astro og Sovn.astro slår opp via getAuthor().

export interface Author {
  name: string;
  url: string;
  /** Biografi (norsk). Brukes på /om-oss/ for å introdusere redaktøren. */
  bio: string[];
  /** Eksterne profiler — brukes i schema.org Person.sameAs */
  sameAs: string[];
}

export const authors: Record<string, Author> = {
  default: {
    name: 'Isac Levine',
    url: '/om-oss/',
    bio: [
      'Isac Levine er en norsk pianist og komponist som skriver neoklassisk pianomusikk for hvile, avslapning og søvn. Med et dempet, melodisk uttrykk lager han stille klangrom der tankene får senke seg – musikk skapt for de rolige timene før natten tar over.',
      'Utgivelser som Stillhet, Over Havet, Reflections og Clarity bærer alle det samme kjennetegnet: enkle, nære pianomelodier uten unødvendig støy, der pausene betyr like mye som tonene. Musikken er en naturlig følgesvenn til drømmene og søvnen vi skriver om her på Drømmeguiden.',
    ],
    sameAs: [
      'https://open.spotify.com/artist/0I2RrDsZcicco0gVG8YwHA',
    ],
  },
};

export function getAuthor(key?: string): Author {
  return (key && authors[key]) || authors.default;
}
