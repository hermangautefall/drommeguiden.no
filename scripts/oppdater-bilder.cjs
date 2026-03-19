const fs = require('fs');
const path = require('path');
const https = require('https');

const API_KEY = 't4qG8oSYmg1tPGQLNgEu6NKRcyQWyhy9rH8UbYJ0Jeh0Zxgq2IRYywyd';

const SEARCH_MAP = {
  // Batch 1 — mennesker
  mor: 'mother portrait',
  far: 'father portrait',
  'avdod-person': 'memorial candle',
  barn: 'child sleeping',
  kjaereste: 'couple silhouette',
  fremmed: 'stranger shadow',
  sjef: 'office authority',
  gravid: 'pregnancy abstract',
  har: 'hair close up',
  oyne: 'eyes close up',
  // Batch 2 — hendelser
  do: 'peaceful transition light',
  drepe: 'dark abstract',
  forfulgt: 'running shadow night',
  eksamen: 'test paper anxiety',
  sen: 'missing train',
  'miste-noe': 'lost keys bag',
  sykdom: 'hospital bed soft',
  // Batch 3 — steder og ting
  fengsel: 'prison bars light',
  kirke: 'norwegian church wooden',
  penger: 'coins notes abundance',
  strand: 'norwegian beach shore',
  tog: 'train tracks journey',
  utlandet: 'foreign city streets',
  telefon: 'phone broken lost',
  nokler: 'keys old wooden',
  mat: 'food table abundance',
  // Batch 4 — natur og nisje
  krig: 'war silhouette abstract',
  'fly-styrter': 'plane crash concept',
  sno: 'snow norway winter',
  jordskjelv: 'earthquake cracked ground',
  orken: 'desert empty',
  flom: 'flood water rising',
  alkohol: 'wine glass blur',
  musikk: 'music notes abstract',
  // Batch 5 — høyt søkte
  sex: 'intimate silhouette abstract',
  utroskap: 'couple apart shadow',
  'bli-fortapt': 'lost forest fog',
  innbruddstyv: 'door lock broken',
  soester: 'sisters together',
  bror: 'brothers together',
  'gammel-venn': 'old friends reunion',
  bestemor: 'grandmother portrait',
  ring: 'wedding ring close',
  blomst: 'flower bloom close',
  // Batch 6 — kropp
  hode: 'human head silhouette',
  hjerte: 'heart concept light',
  rygg: 'back silhouette',
  mage: 'stomach abstract',
  ore: 'ear close up',
  munn: 'mouth lips close',
  bein: 'legs walking path',
  fingre: 'fingers piano keys',
  // Batch 7 — himmel og natur
  himmel: 'heaven clouds light',
  helvete: 'dark red abstract',
  engler: 'angel light abstract',
  sol: 'sun rays morning',
  mane: 'moon night reflection',
  stjerner: 'stars night sky norway',
  lynet: 'lightning storm',
  tornado: 'tornado abstract dark',
  // Batch 8 — dyr
  orm: 'worm earth soil',
  fugl: 'bird flying sky',
  mus: 'mouse close up',
  sau: 'sheep norway mountain',
  veps: 'wasp close up',
  gullfisk: 'goldfish bowl',
  ku: 'cow norway meadow',
  gris: 'pig farm',
};

const CREDITS_PATH = path.join(__dirname, '..', 'public', 'bilder', 'credits.json');
const SYMBOLER_DIR = path.join(__dirname, '..', 'public', 'bilder', 'symboler');
const DROMMER_DIR = path.join(__dirname, '..', 'src', 'content', 'drommer');

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { Authorization: API_KEY } }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error(`JSON parse error: ${data.slice(0, 200)}`)); }
      });
    });
    req.on('error', reject);
  });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlinkSync(dest);
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (err) => { fs.unlinkSync(dest); reject(err); });
  });
}

function addImageToFrontmatter(slug, imagePath) {
  const mdPath = path.join(DROMMER_DIR, `${slug}.md`);
  if (!fs.existsSync(mdPath)) return;
  let content = fs.readFileSync(mdPath, 'utf-8');
  if (content.includes('bilde:')) return;
  // Add bilde field before dato field
  content = content.replace(/^(dato:)/m, `bilde: ${imagePath}\n$1`);
  fs.writeFileSync(mdPath, content, 'utf-8');
}

async function main() {
  // Load existing credits
  let credits = {};
  if (fs.existsSync(CREDITS_PATH)) {
    credits = JSON.parse(fs.readFileSync(CREDITS_PATH, 'utf-8'));
  }

  fs.mkdirSync(SYMBOLER_DIR, { recursive: true });

  const slugs = Object.keys(SEARCH_MAP);
  let downloaded = 0;
  let skipped = 0;
  let failed = [];

  for (const slug of slugs) {
    const destPath = path.join(SYMBOLER_DIR, `${slug}.jpg`);
    const imagePath = `/bilder/symboler/${slug}.jpg`;

    // Skip if image already exists
    if (fs.existsSync(destPath)) {
      console.log(`SKIP ${slug} — image exists`);
      skipped++;
      // Still ensure frontmatter has bilde field
      addImageToFrontmatter(slug, imagePath);
      continue;
    }

    const query = SEARCH_MAP[slug];
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`;

    try {
      const data = await fetchJSON(url);
      if (!data.photos || data.photos.length === 0) {
        // Try simpler query
        const simpleQuery = query.split(' ')[0];
        const url2 = `https://api.pexels.com/v1/search?query=${encodeURIComponent(simpleQuery)}&per_page=1&orientation=landscape`;
        const data2 = await fetchJSON(url2);
        if (!data2.photos || data2.photos.length === 0) {
          console.log(`FAIL ${slug} — no results for "${query}" or "${simpleQuery}"`);
          failed.push(slug);
          continue;
        }
        data.photos = data2.photos;
      }

      const photo = data.photos[0];
      const imgUrl = photo.src.large2x || photo.src.large || photo.src.original;

      await downloadFile(imgUrl, destPath);

      credits[slug] = {
        fotograf: photo.photographer,
        url: photo.url,
        pexels_id: photo.id,
      };

      addImageToFrontmatter(slug, imagePath);
      downloaded++;
      console.log(`OK ${slug} — ${photo.photographer}`);

      // Rate limit: small delay
      await new Promise((r) => setTimeout(r, 250));
    } catch (err) {
      console.log(`FAIL ${slug} — ${err.message}`);
      failed.push(slug);
    }
  }

  // Save credits
  fs.writeFileSync(CREDITS_PATH, JSON.stringify(credits, null, 2), 'utf-8');

  console.log(`\n=== DONE ===`);
  console.log(`Downloaded: ${downloaded}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Failed: ${failed.length} — ${failed.join(', ')}`);
}

main().catch(console.error);
