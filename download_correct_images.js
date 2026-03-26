const https = require('https');
const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, 'backend', 'public', 'images', 'products');

const productSeeds = {
  1: 100, 2: 101, 3: 102, 4: 103, 5: 104,
  6: 105, 7: 106, 8: 107, 9: 108, 10: 109,
  11: 200, 12: 201, 13: 202, 14: 203, 15: 204,
  16: 205, 17: 206, 18: 207,
  19: 300, 20: 301, 21: 302, 22: 303, 23: 304,
  24: 305, 25: 306, 26: 307, 27: 308, 28: 309,
  29: 310, 30: 311,
  31: 400, 32: 401, 33: 402, 34: 403, 35: 404,
  36: 405, 37: 406, 38: 407, 39: 408, 40: 409,
  41: 500, 42: 501, 43: 502, 44: 503, 45: 504,
  46: 505, 47: 506, 48: 507, 49: 508, 50: 509,
};

function downloadImage(productId, seed) {
  return new Promise((resolve) => {
    const dest = path.join(imgDir, `product_${productId}.jpg`);
    
    // Skip if already exists and has reasonable size
    if (fs.existsSync(dest)) {
      const size = fs.statSync(dest).size;
      if (size > 5000) { // > 5KB means it's a real image
        console.log(`→ skip product_${productId}.jpg (exists, ${size} bytes)`);
        return resolve();
      }
    }

    const url = `https://picsum.photos/seed/${seed}/400/400`;
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        https.get(res.headers.location, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res2 => {
          const file = fs.createWriteStream(dest);
          res2.pipe(file);
          file.on('finish', () => { file.close(); console.log(`✓ product_${productId}.jpg (seed ${seed})`); resolve(); });
        }).on('error', () => { console.log(`✗ product_${productId}: redirect error`); resolve(); });
      } else if (res.statusCode === 200) {
        const file = fs.createWriteStream(dest);
        res.pipe(file);
        file.on('finish', () => { file.close(); console.log(`✓ product_${productId}.jpg (seed ${seed})`); resolve(); });
      } else {
        console.log(`✗ product_${productId}: HTTP ${res.statusCode}`);
        resolve();
      }
    });
    req.on('error', (e) => { console.log(`✗ product_${productId}: ${e.message}`); resolve(); });
    req.setTimeout(20000, () => { req.destroy(); console.log(`✗ product_${productId}: timeout`); resolve(); });
  });
}

async function run() {
  const ids = Object.keys(productSeeds).map(Number).sort((a, b) => a - b);
  // Download sequentially to avoid overwhelming picsum
  let downloaded = 0, skipped = 0;
  for (const id of ids) {
    await downloadImage(id, productSeeds[id]);
  }
  
  // Verify all are present
  const missing = ids.filter(id => {
    const p = path.join(imgDir, `product_${id}.jpg`);
    return !fs.existsSync(p) || fs.statSync(p).size < 5000;
  });
  
  if (missing.length === 0) {
    console.log('\n✅ All 50 images are present and valid!');
  } else {
    console.log(`\n⚠ Still missing: ${missing.join(', ')}`);
  }
}

run();
