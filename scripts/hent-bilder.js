import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const API_KEY = 't4qG8oSYmg1tPGQLNgEu6NKRcyQWyhy9rH8UbYJ0Jeh0Zxgq2IRYywyd';

const BILDER = {
  'forside': [
    { sok: 'dreamy night sky stars', fil: 'hero.jpg' },
    { sok: 'misty forest morning', fil: 'kategori-natur.jpg' },
    { sok: 'ocean waves calm', fil: 'kategori-vann.jpg' },
    { sok: 'sleeping person peaceful', fil: 'kategori-sovn.jpg' },
    { sok: 'moon reflection water', fil: 'featured.jpg' },
  ],
  'symboler': [
    { sok: 'snake nature', fil: 'slange.jpg' },
    { sok: 'ocean waves', fil: 'hav.jpg' },
    { sok: 'falling leaf', fil: 'falle.jpg' },
    { sok: 'teeth close up', fil: 'tann.jpg' },
    { sok: 'fire flames', fil: 'brann.jpg' },
    { sok: 'dog portrait', fil: 'hund.jpg' },
    { sok: 'cat portrait', fil: 'katt.jpg' },
    { sok: 'baby sleeping', fil: 'baby.jpg' },
    { sok: 'spider web', fil: 'edderkopp.jpg' },
    { sok: 'bear forest', fil: 'bjorn.jpg' },
    { sok: 'wedding ceremony', fil: 'bryllup.jpg' },
    { sok: 'flying bird sky', fil: 'flyging.jpg' },
    { sok: 'dark corridor', fil: 'morkt-rom.jpg' },
    { sok: 'forest path', fil: 'skog.jpg' },
    { sok: 'storm clouds', fil: 'storm.jpg' },
    { sok: 'hands reaching', fil: 'hender.jpg' },
    { sok: 'mirror reflection', fil: 'speil.jpg' },
    { sok: 'wolf howling', fil: 'ulv.jpg' },
    { sok: 'mountain cliff', fil: 'fjell.jpg' },
    { sok: 'rain window', fil: 'regn.jpg' },
    { sok: 'crow raven bird', fil: 'krage.jpg' },
    { sok: 'horse running', fil: 'hest.jpg' },
    { sok: 'water drowning', fil: 'drukne.jpg' },
    { sok: 'car road night', fil: 'bil.jpg' },
    { sok: 'school classroom', fil: 'skole.jpg' },
    { sok: 'hospital bed', fil: 'sykehus.jpg' },
    { sok: 'old house', fil: 'hus.jpg' },
    { sok: 'blood red', fil: 'blod.jpg' },
    { sok: 'naked statue art', fil: 'naken.jpg' },
    { sok: 'ex partner silhouette', fil: 'eksen.jpg' },
  ],
  'guider': [
    { sok: 'sleep dream peaceful', fil: 'hva-er-drommer.jpg' },
    { sok: 'dream journal writing', fil: 'drommejournalen.jpg' },
    { sok: 'lucid dreaming', fil: 'lucid-dromming.jpg' },
    { sok: 'nightmare dark', fil: 'mareritt.jpg' },
    { sok: 'recurring dreams', fil: 'gjentakende.jpg' },
  ],
};

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { Authorization: API_KEY } }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}: ${data.slice(0, 200)}`));
          return;
        }
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
  });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const doRequest = (requestUrl) => {
      https.get(requestUrl, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          doRequest(res.headers.location);
          return;
        }
        if (res.statusCode !== 200) {
          fs.unlinkSync(dest);
          reject(new Error(`Download failed: HTTP ${res.statusCode}`));
          return;
        }
        res.pipe(file);
        file.on('finish', () => { file.close(); resolve(); });
      }).on('error', (e) => {
        fs.unlinkSync(dest);
        reject(e);
      });
    };
    doRequest(url);
  });
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  const creditsPath = path.join(ROOT, 'public', 'bilder', 'credits.json');
  let credits = {};
  if (fs.existsSync(creditsPath)) {
    credits = JSON.parse(fs.readFileSync(creditsPath, 'utf-8'));
  }

  const results = { downloaded: [], skipped: [], failed: [] };

  for (const [mappe, bilder] of Object.entries(BILDER)) {
    const dir = path.join(ROOT, 'public', 'bilder', mappe);
    fs.mkdirSync(dir, { recursive: true });

    for (const { sok, fil } of bilder) {
      const dest = path.join(dir, fil);

      if (fs.existsSync(dest)) {
        console.log(`SKIP  ${mappe}/${fil} (finnes allerede)`);
        results.skipped.push(`${mappe}/${fil}`);
        continue;
      }

      try {
        console.log(`SØK   "${sok}" → ${mappe}/${fil}`);
        const query = encodeURIComponent(sok);
        const apiUrl = `https://api.pexels.com/v1/search?query=${query}&orientation=landscape&per_page=15&size=large`;
        const data = await fetchJSON(apiUrl);

        // Find best landscape image with min 1280px width
        const photo = data.photos?.find(p => p.width >= 1280 && p.width > p.height)
          || data.photos?.[0];

        if (!photo) {
          console.log(`FEIL  Ingen bilder funnet for "${sok}"`);
          results.failed.push({ fil: `${mappe}/${fil}`, grunn: 'Ingen resultater' });
          continue;
        }

        // Use landscape_large size from Pexels (1200px wide)
        const imgUrl = photo.src.landscape || photo.src.large;
        console.log(`LAST  ${photo.photographer} — ${imgUrl.slice(0, 80)}...`);
        await downloadFile(imgUrl, dest);

        credits[fil] = {
          fotograf: photo.photographer,
          fotograf_url: photo.photographer_url,
          bilde_url: photo.url,
          pexels_id: photo.id,
        };

        console.log(`OK    ${mappe}/${fil}`);
        results.downloaded.push(`${mappe}/${fil}`);

        // Rate limit: sequential with delay
        await sleep(350);
      } catch (err) {
        console.log(`FEIL  ${mappe}/${fil}: ${err.message}`);
        results.failed.push({ fil: `${mappe}/${fil}`, grunn: err.message });
      }
    }
  }

  // Save credits
  fs.writeFileSync(creditsPath, JSON.stringify(credits, null, 2));
  console.log(`\nCredits lagret i public/bilder/credits.json`);

  // Summary
  console.log(`\n=== OPPSUMMERING ===`);
  console.log(`Lastet ned: ${results.downloaded.length}`);
  console.log(`Hoppet over: ${results.skipped.length}`);
  console.log(`Feilet: ${results.failed.length}`);
  if (results.failed.length > 0) {
    console.log('\nFeilede bilder:');
    results.failed.forEach(f => console.log(`  - ${f.fil}: ${f.grunn}`));
  }
}

main().catch(console.error);
