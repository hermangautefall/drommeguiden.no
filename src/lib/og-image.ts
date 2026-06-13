// Build-time helper som validerer dimensjonene på et hero-bilde og
// bestemmer om det er stort nok til å brukes som og:image. Bilder under
// 1200×600 (litt under FB-anbefaling 1200×630, men aksepterer våre
// 1200×627-hero-bilder) faller tilbake til branded standardbilde.
import sharp from 'sharp';
import { join } from 'node:path';

const SITE = 'https://drommeguiden.no';
const MIN_W = 1200;
const MIN_H = 600;

type Meta = { width: number; height: number } | null;
const cache = new Map<string, Meta>();

async function readMeta(absPath: string): Promise<Meta> {
  if (cache.has(absPath)) return cache.get(absPath)!;
  try {
    const m = await sharp(absPath).metadata();
    const result = m.width && m.height ? { width: m.width, height: m.height } : null;
    cache.set(absPath, result);
    return result;
  } catch {
    cache.set(absPath, null);
    return null;
  }
}

export interface ResolvedOg {
  url: string;
  width: number;
  height: number;
}

/**
 * Returnerer absolutt og:image-URL + faktiske dimensjoner hvis bildet
 * finnes og er minst 1200×630. Ellers null (layout faller tilbake til
 * branded standard).
 */
export async function resolveOgImage(bilde?: string | null): Promise<ResolvedOg | null> {
  if (!bilde) return null;
  // Behandle bare /-rooted public-stier
  if (!bilde.startsWith('/')) return null;
  const absFsPath = join(process.cwd(), 'public', bilde.replace(/^\//, ''));
  const meta = await readMeta(absFsPath);
  if (!meta) return null;
  if (meta.width < MIN_W || meta.height < MIN_H) return null;
  return { url: `${SITE}${bilde}`, width: meta.width, height: meta.height };
}
