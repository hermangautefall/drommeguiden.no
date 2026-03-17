import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const drommer = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/drommer' }),
  schema: z.object({
    tittel: z.string(),
    slug: z.string(),
    kategori: z.string(),
    kortbeskrivelse: z.string(),
    relaterte: z.array(z.string()).optional(),
    tolkninger_kort: z.array(z.string()),
    dato: z.coerce.date(),
  }),
});

const kategorier = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/kategorier' }),
  schema: z.object({
    tittel: z.string(),
    slug: z.string(),
    kortbeskrivelse: z.string(),
    ikonfil: z.string().optional(),
    antall_symboler: z.number().optional(),
    dato: z.coerce.date(),
  }),
});

const guider = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guider' }),
  schema: z.object({
    tittel: z.string(),
    slug: z.string(),
    kortbeskrivelse: z.string(),
    leseminutter: z.number().optional(),
    dato: z.coerce.date(),
    oppdatert: z.coerce.date().optional(),
  }),
});

export const collections = { drommer, kategorier, guider };
