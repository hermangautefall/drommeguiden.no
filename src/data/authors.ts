// Registry over forfattere. Frontmatter-feltet `author` peker på en
// nøkkel her ('default' → Isac Levine). Schema-genereringen i
// Symbol.astro og Sovn.astro slår opp via getAuthor().

export interface Author {
  name: string;
  url: string;
  sameAs: string[];
}

export const authors: Record<string, Author> = {
  default: {
    name: 'Isac Levine',
    url: '/om-oss/',
    sameAs: [],
  },
};

export function getAuthor(key?: string): Author {
  return (key && authors[key]) || authors.default;
}
