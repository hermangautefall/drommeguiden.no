// Astro 6+ content collection schemas using the explicit `glob` loader.
// Uten loader bruker Astro implisitt legacy-modus som inferer skjemaet
// fra filer ved første lese, og kan ende opp med å ignorere nye felt
// som ble lagt til etter at skjemaet ble cachet.

import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const drommerSchema = z
  .object({
    tittel: z.string(),
    slug: z.string(),
    kategori: z.string(),
    kortbeskrivelse: z.string(),
    relaterte: z.array(z.string()).optional(),
    tolkninger_kort: z.array(z.string()).optional(),
    bilde: z.string().optional(),
    dato: z.coerce.date().optional(),
    oppdatert: z.coerce.date().optional(),
    sv_slug: z.string().optional(),
    nb_slug: z.string().optional(),
    en_slug: z.string().optional(),
    author: z.string().optional(),
    sensitivt: z.boolean().optional(),
    relaterte_sovn: z.array(z.string()).optional(),
  })
  .passthrough();

const sovnSchema = z
  .object({
    tittel: z.string(),
    slug: z.string(),
    seksjon: z.string().optional(),
    kategori: z.string().optional(),
    kortbeskrivelse: z.string(),
    leseminutter: z.number().optional(),
    dato: z.coerce.date().optional(),
    oppdatert: z.coerce.date().optional(),
    bilde: z.string().optional(),
    sv_slug: z.string().optional(),
    nb_slug: z.string().optional(),
    en_slug: z.string().optional(),
    author: z.string().optional(),
    relaterte_sovn: z.array(z.string()).optional(),
    relaterte_drommer: z.array(z.string()).optional(),
    relaterte_guider: z.array(z.string()).optional(),
  })
  .passthrough();

const looseSchema = z.object({}).passthrough();

export const collections = {
  drommer: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/drommer' }),
    schema: drommerSchema,
  }),
  'drommer-sv': defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/drommer-sv' }),
    schema: drommerSchema,
  }),
  sovn: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/sovn' }),
    schema: sovnSchema,
  }),
  'sovn-sv': defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/sovn-sv' }),
    schema: sovnSchema,
  }),
  guider: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/guider' }),
    schema: looseSchema,
  }),
  'guider-sv': defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/guider-sv' }),
    schema: looseSchema,
  }),
  kategorier: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/kategorier' }),
    schema: looseSchema,
  }),
  'kategorier-sv': defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/kategorier-sv' }),
    schema: looseSchema,
  }),
  'drommer-en': defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/drommer-en' }),
    schema: drommerSchema,
  }),
  'sovn-en': defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/sovn-en' }),
    schema: sovnSchema,
  }),
  'guider-en': defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/guider-en' }),
    schema: looseSchema,
  }),
  'kategorier-en': defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/kategorier-en' }),
    schema: looseSchema,
  }),
};
