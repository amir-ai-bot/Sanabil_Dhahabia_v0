/**
 * Test pour vérifier l'accès aux images via l'API
 */

const http = require('http');

const testUrls = [
    'http://localhost/sanabel-backend/api/image.php?id=1',
    'http://localhost:80/sanabel-backend/api/image.php?id=1',
    'http://127.0.0.1/sanabel-backend/api/image.php?id=1',
];

console.log('\n═══════════════════════════════════════════');
console.log('🔍 Test d\'accès aux images via l\'API');
console.log('═══════════════════════════════════════════\n');

async function testUrl(url) {
    return new Promise((resolve) => {
        const req = http.get(url, { timeout: 3000 }, (res) => {
            const status = res.statusCode;
            const contentType = res.headers['content-type'] || 'unknown';
            resolve({ 
                url, 
                status, 
                contentType,
                success: status === 200 && contentType.includes('image')
            });
        });
        
        req.on('error', (err) => {
            resolve({ 
                url, 
                error: err.message,
                success: false
            });
        });
        
        req.on('timeout', () => {
            req.destroy();
            resolve({ 
                url, 
                error: 'Timeout',
                success: false
            });
        });
    });
}

async function runTests() {
    for (const url of testUrls) {
        const result = await testUrl(url);
        if (result.success) {
            console.log(`✓ ${url}`);
            console.log(`  Status: ${result.status}, Type: ${result.contentType}\n`);
        } else {
            console.log(`✗ ${url}`);
            console.log(`  Erreur: ${result.error || result.status}\n`);
        }
    }
    
    console.log('═══════════════════════════════════════════');
    console.log('Si une URL fonctionne (✓), utilisez cet URL');
    console.log('dans la config Angular: environment.ts\n');
}

runTests();
