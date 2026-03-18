#!/usr/bin/env node
/**
 * Downloads Pexels images for symbol pages that are missing images.
 * Also updates frontmatter and credits.json.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const PEXELS_API_KEY = 't4qG8oSYmg1tPGQLNgEu6NKRcyQWyhy9rH8UbYJ0Jeh0Zxgq2IRYywyd';
const DROMMER_DIR = path.join(__dirname, '..', 'src', 'content', 'drommer');
const SYMBOLER_IMG_DIR = path.join(__dirname, '..', 'public', 'bilder', 'symboler');
const CREDITS_PATH = path.join(__dirname, '..', 'public', 'bilder', 'credits.json');

const SEARCH_TERMS = {
  drage: 'dragon fantasy',
  rev: 'red fox',
  orn: 'eagle flying',
  love: 'lion portrait',
  tiger: 'tiger',
  elefant: 'elephant',
  hai: 'shark underwater',
  maur: 'ant macro',
  sommerfugl: 'butterfly colorful',
  krokodille: 'crocodile',
  papegoy: 'parrot colorful',
  frosk: 'frog green',
  hjort: 'deer forest',
  pingvin: 'penguin',
};

function fetch(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetch(res.headers.location, headers).then(resolve).catch(reject);
      }
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ data: Buffer.concat(chunks), headers: res.headers, status: res.statusCode });
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${Buffer.concat(chunks).toString()}`));
        }
      });
    });
    req.on('error', reject);
  });
}

async function searchPexels(query) {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`;
  const res = await fetch(url, { Authorization: PEXELS_API_KEY });
  const json = JSON.parse(res.data.toString());
  if (!json.photos || json.photos.length === 0) return null;
  return json.photos[0];
}

async function downloadImage(url, dest) {
  const res = await fetch(url);
  fs.writeFileSync(dest, res.data);
}

function addBildeToFrontmatter(filePath, bildePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  if (content.includes('bilde:')) return; // already has it
  // Insert bilde field before the closing ---
  const parts = content.split('---');
  // parts[0] is empty, parts[1] is frontmatter, parts[2] is body
  parts[1] = parts[1].trimEnd() + `\nbilde: ${bildePath}\n`;
  fs.writeFileSync(filePath, parts.join('---'));
}

async function main() {
  const credits = JSON.parse(fs.readFileSync(CREDITS_PATH, 'utf-8'));
  const slugs = Object.keys(SEARCH_TERMS);

  let downloaded = 0;
  let failed = [];

  for (const slug of slugs) {
    const imgPath = path.join(SYMBOLER_IMG_DIR, `${slug}.jpg`);
    if (fs.existsSync(imgPath)) {
      console.log(`✓ ${slug}.jpg already exists, skipping`);
      continue;
    }

    const query = SEARCH_TERMS[slug];
    console.log(`Searching Pexels for "${query}" (${slug})...`);

    try {
      const photo = await searchPexels(query);
      if (!photo) {
        console.log(`  ✗ No results for "${query}"`);
        failed.push(slug);
        continue;
      }

      // Download landscape medium size
      const imgUrl = photo.src.landscape || photo.src.large;
      console.log(`  Downloading from ${photo.photographer}...`);
      await downloadImage(imgUrl, imgPath);

      // Update credits
      credits[`${slug}.jpg`] = {
        fotograf: photo.photographer,
        fotograf_url: photo.photographer_url,
        bilde_url: photo.url,
        pexels_id: photo.id,
      };

      // Update frontmatter
      const mdPath = path.join(DROMMER_DIR, `${slug}.md`);
      if (fs.existsSync(mdPath)) {
        addBildeToFrontmatter(mdPath, `/bilder/symboler/${slug}.jpg`);
      }

      downloaded++;
      console.log(`  ✓ ${slug}.jpg saved`);

      // Rate limit: wait 200ms between requests
      await new Promise(r => setTimeout(r, 200));
    } catch (err) {
      console.error(`  ✗ Error for ${slug}: ${err.message}`);
      failed.push(slug);
    }
  }

  // Write updated credits
  fs.writeFileSync(CREDITS_PATH, JSON.stringify(credits, null, 2));

  console.log(`\n=== DONE ===`);
  console.log(`Downloaded: ${downloaded}`);
  console.log(`Failed: ${failed.length > 0 ? failed.join(', ') : 'none'}`);
}

main().catch(console.error);
