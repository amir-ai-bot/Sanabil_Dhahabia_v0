/**
 * Script pour vérifier et mettre à jour les images des produits en base de données
 * Sans PHP, utilise Node.js avec SQLite ou lecture directe du SQL
 */

const fs = require('fs');
const path = require('path');

// Chemin des images
const imagesDir = path.join(__dirname, 'backend', 'public', 'images', 'products');

console.log('\n═══════════════════════════════════════════');
console.log('🔍 Vérification des images des produits');
console.log('═══════════════════════════════════════════\n');

// Lire les images existantes
const images = fs.readdirSync(imagesDir)
    .filter(f => f.endsWith('.jpg'))
    .sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)[0]);
        const numB = parseInt(b.match(/\d+/)[0]);
        return numA - numB;
    });

console.log(`✓ ${images.length} images trouvées\n`);

// Générer le script SQL de correction
const sqlUpdates = images.map((img, i) => {
    const match = img.match(/product_(\d+)/);
    const productId = match ? match[1] : i + 1;
    return `UPDATE products SET image = '${img}' WHERE id = ${productId};`;
});

// Créer le fichier SQL
const sqlContent = `-- Script SQL pour corriger les images des produits
-- Exécutez ce script dans phpMyAdmin

${sqlUpdates.join('\n')}

-- Vérification
SELECT id, name, image FROM products ORDER BY id;
`;

const sqlFile = path.join(__dirname, 'FIX_ALL_IMAGES.sql');
fs.writeFileSync(sqlFile, sqlContent);

console.log('Fichier généré: FIX_ALL_IMAGES.sql\n');
console.log('═══════════════════════════════════════════');
console.log('Instructions:');
console.log('1. Ouvrez phpMyAdmin');
console.log('2. Sélectionnez la base: sanabel_dhahabia');
console.log('3. Allez à l\'onglet SQL');
console.log('4. Collez le contenu de FIX_ALL_IMAGES.sql');
console.log('5. Cliquez "Exécuter"');
console.log('═══════════════════════════════════════════\n');

// Afficher les updates
console.log('Requêtes SQL:');
sqlUpdates.forEach((sql, i) => {
    console.log(`  [${i + 1}] ${sql}`);
});

console.log('\n✓ Script créé avec succès!');
