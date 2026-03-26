/**
 * Script Node.js pour associer les images téléchargées aux produits
 * Utilise l'API backend directement via SQLite ou MySQL
 */

const fs = require('fs');
const path = require('path');

// Configuration simple - lecture du fichier database.sql pour extrait
const imagesDir = path.join(__dirname, 'backend', 'public', 'images', 'products');

console.log('\n═══════════════════════════════════════════');
console.log('📸 Vérification des images téléchargées');
console.log('═══════════════════════════════════════════\n');

// Vérifier les images
if (!fs.existsSync(imagesDir)) {
    console.error('❌ Dossier images non trouvé: ' + imagesDir);
    process.exit(1);
}

const images = fs.readdirSync(imagesDir).filter(f => f.endsWith('.jpg'));
console.log(`✓ ${images.length} images trouvées\n`);

images.forEach((img, i) => {
    const stat = fs.statSync(path.join(imagesDir, img));
    console.log(`  [${i + 1}] ${img} (${(stat.size / 1024).toFixed(1)} KB)`);
});

console.log('\n═══════════════════════════════════════════');
console.log(`✓ ${images.length} images prêtes pour la base de données`);
console.log('═══════════════════════════════════════════\n');

console.log('Pour mettre à jour la base de données:');
console.log('  Option 1: Utiliser phpmyadmin');
console.log('  Option 2: Exécuter un script PHP (voir update_images_to_db.php)');
console.log('  Option 3: Via l\'API Angular (admin panel)\n');
