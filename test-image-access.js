/**
 * Script pour vérifier l'accès aux images via HTTP
 */

const http = require('http');
const https = require('https');

const baseUrls = [
    'http://localhost/sanabel-backend/public/images/products/product_1.jpg',
    'http://localhost/images/products/product_1.jpg',
    'http://127.0.0.1:8000/public/images/products/product_1.jpg',
    'http://localhost:3000/public/images/products/product_1.jpg',
];

console.log('\n═══════════════════════════════════════════');
console.log('🔍 Vérification de l\'accès aux images');
console.log('═══════════════════════════════════════════\n');

async function checkUrl(url) {
    return new Promise((resolve) => {
        const client = url.startsWith('https') ? https : http;
        const request = client.head(url, (res) => {
            resolve({
                url,
                status: res.statusCode,
                accessible: res.statusCode === 200
            });
        });
        
        request.on('error', () => {
            resolve({
                url,
                status: 'ERROR',
                accessible: false
            });
        });
        
        request.setTimeout(3000);
    });
}

async function testAllUrls() {
    for (const url of baseUrls) {
        const result = await checkUrl(url);
        const icon = result.accessible ? '✓' : '✗';
        const color = result.accessible ? '\x1b[32m' : '\x1b[31m';
        console.log(`${color}${icon}\x1b[0m ${result.url} [${result.status}]`);
    }
    
    console.log('\n═══════════════════════════════════════════');
    console.log('Solution: Utilisez le chemin qui retourne 200\n');
}

testAllUrls();
