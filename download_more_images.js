const https = require('https');
const fs = require('fs');
const path = require('path');

const startId = 1;
const endId = 48; // number of products
const imagesDir = path.join(__dirname, 'backend', 'public', 'images', 'products');
const xamppDir = 'C:/xampp/htdocs/sanabel-backend/public/images/products';
const updateUrl = 'http://localhost/sanabel-backend/update_images_to_db.php';

if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });
if (!fs.existsSync(xamppDir)) fs.mkdirSync(xamppDir, { recursive: true });

function downloadImage(id) {
  return new Promise((resolve, reject) => {
    const url = `https://picsum.photos/seed/product${id}/800/600`;
    const dest = path.join(imagesDir, `product_${id}.jpg`);

    const req = https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // Follow redirect
        https.get(res.headers.location, (r2) => {
          const file = fs.createWriteStream(dest);
          r2.pipe(file);
          file.on('finish', () => {
            file.close(() => {
              // copy to xampp
              try { fs.copyFileSync(dest, path.join(xamppDir, `product_${id}.jpg`)); } catch(e){}
              resolve(id);
            });
          });
        }).on('error', reject);
      } else if (res.statusCode === 200) {
        const file = fs.createWriteStream(dest);
        res.pipe(file);
        file.on('finish', () => {
          file.close(() => {
            try { fs.copyFileSync(dest, path.join(xamppDir, `product_${id}.jpg`)); } catch(e){}
            resolve(id);
          });
        });
      } else {
        reject(new Error('Status ' + res.statusCode));
      }
    });

    req.on('error', reject);
  });
}

(async () => {
  console.log('Downloading images for products', startId, 'to', endId);
  for (let i = startId; i <= endId; i++) {
    try {
      await downloadImage(i);
      process.stdout.write(`.${i}`);
    } catch (e) {
      console.error('\nFailed to download', i, e.message);
    }
  }
  console.log('\nDownloads complete. Calling update script on server...');

  // Call update_images_to_db.php
  https.get(updateUrl, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('Update script response:');
      console.log(data.substring(0, 1000));
      console.log('Done. Please reload the Angular app (Ctrl+F5).');
    });
  }).on('error', (err) => {
    console.error('Error calling update script:', err.message);
  });
})();
