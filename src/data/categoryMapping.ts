// Slug-par mellom NO og SV kategorier. Slug-ene avviker semantisk
// (dyr ↔ djur, gjenstander ↔ foremal osv.) så vi trenger en eksplisitt
// mapping for å bygge hreflang-alternativer mellom språkversjonene.
// Sannhetskilde: nb_slug-feltet i src/content/kategorier-sv/*.md.

export const noToSv: Record<string, string> = {
  aandelig:    'andlig',
  dyr:         'djur',
  gjenstander: 'foremal',
  hendelser:   'handelser',
  kropp:       'kropp',
  mennesker:   'manniskor',
  natur:       'natur',
  steder:      'platser',
  vann:        'vatten',
};

export const svToNo: Record<string, string> = Object.fromEntries(
  Object.entries(noToSv).map(([nb, sv]) => [sv, nb])
);
