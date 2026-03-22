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
    bilde: z.string().optional(),
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
    emoji: z.string().optional(),
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
    bilde: z.string().optional(),
    leseminutter: z.number().optional(),
    dato: z.coerce.date(),
    oppdatert: z.coerce.date().optional(),
  }),
});

const sovn = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/sovn' }),
  schema: z.object({
    tittel: z.string(),
    slug: z.string(),
    seksjon: z.literal('sovn'),
    kategori: z.string(),
    kortbeskrivelse: z.string(),
    leseminutter: z.number(),
    dato: z.coerce.date(),
    oppdatert: z.coerce.date().optional(),
    bilde: z.string().optional(),
    relaterte_sovn: z.array(z.string()).optional(),
    relaterte_drommer: z.array(z.string()).optional(),
  }),
});

export const collections = { drommer, kategorier, guider, sovn };
