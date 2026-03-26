<?php
/**
 * Script pour télécharger des images de produits réelles depuis internet
 * Utilise des sources libres comme Wikimedia Commons
 */

// Configuration
$imagesDir = __DIR__ . '/public/images';
$dbFile = __DIR__ . '/config/Database.php';

// Inclure la configuration
require_once $dbFile;

// Créer le dossier s'il n'existe pas
if (!is_dir($imagesDir)) {
    mkdir($imagesDir, 0755, true);
    echo "✓ Dossier images créé: $imagesDir\n";
}

// Base d'URLs d'images pour différents types de produits
$imageUrls = [
    // Tracteurs
    1 => 'https://upload.wikimedia.org/wikipedia/commons/1/1a/John_Deere_5100R_Traktor_mit_Frontlader_543R.jpg', // John Deere 5100
    2 => 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Kubota_LX-351%2C_Agritechnica_2023%2C_Hanover_%28P1160238%29.jpg', // Kubota L3200 (similar)
    3 => 'https://upload.wikimedia.org/wikipedia/commons/7/7f/Massey_Ferguson_MF_165.jpg', // Massey Ferguson 385 (similar)
    4 => 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Honda_tiller_FT500.jpg/800px-Honda_tiller_FT500.jpg', // Honda F720 (tiller)
    5 => 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Case_IH_Puma_200_CV.jpg/800px-Case_IH_Puma_200_CV.jpg', // Case IH Puma
    6 => 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Yamaha_tiller.jpg/800px-Yamaha_tiller.jpg', // Yamaha MZ360
    7 => 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Claas_Arion_400.jpg/800px-Claas_Arion_400.jpg', // Claas Arion
    8 => 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Deutz_D62.jpg/800px-Deutz_D62.jpg', // Deutz D62
    9 => 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Grillo_G131.jpg/800px-Grillo_G131.jpg', // Grillo G131
    10 => 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Zetor_Forterra.jpg/800px-Zetor_Forterra.jpg', // Zetor Forterra

    // Moissonneuses
    11 => 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Claas_Lexion_650.jpg/800px-Claas_Lexion_650.jpg', // Claas Lexion 650
    12 => 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/John_Deere_S670.jpg/800px-John_Deere_S670.jpg', // John Deere S670
    13 => 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/AGCO_Massey_Ferguson_8S.jpg/800px-AGCO_Massey_Ferguson_8S.jpg', // AGCO Massey 8S
    14 => 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Rostselmash_RSM140.jpg/800px-Rostselmash_RSM140.jpg', // Rostselmash RSM140
    15 => 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Ursus_2-14.jpg/800px-Ursus_2-14.jpg', // Ursus 2-14
    16 => 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Deutz_Fahr_5690.jpg/800px-Deutz_Fahr_5690.jpg', // Deutz Fahr 5690
    17 => 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Beiyangda_BY-200.jpg/800px-Beiyangda_BY-200.jpg', // Beiyangda BY-200
    18 => 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Allis_Chalmers_harvester.jpg/800px-Allis_Chalmers_harvester.jpg', // Allis Chalmers

    // Charrues et outils
    19 => 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/4_socs_reversible_plow.jpg/800px-4_socs_reversible_plow.jpg', // Charrue 4 socs
    20 => 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/5_socs_semi_portee.jpg/800px-5_socs_semi_portee.jpg', // Charrue 5 socs
    21 => 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/20_pouces_disk_harrow.jpg/800px-20_pouces_disk_harrow.jpg', // Disque 20 pouces
    22 => 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/3_socs_portee_plow.jpg/800px-3_socs_portee_plow.jpg', // Charrue 3 socs portée
    23 => 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/24_pouces_offset_disk.jpg/800px-24_pouces_offset_disk.jpg', // Disque offset 24 pouces
    24 => 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Dents_cultivator.jpg/800px-Dents_cultivator.jpg', // Cultivateur à dents
    25 => 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Reversible_3_socs.jpg/800px-Reversible_3_socs.jpg', // Charrue réversible 3 socs
    26 => 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/2m_rotary_harrow.jpg/800px-2m_rotary_harrow.jpg', // Herse rotative 2m
    27 => 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Simple_subsoiler.jpg/800px-Simple_subsoiler.jpg', // Sous-soleur simple
    28 => 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Traîne_plow_2_socs.jpg/800px-Traîne_plow_2_socs.jpg', // Charrue traînée 2 socs
    29 => 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Rotary_hoe.jpg/800px-Rotary_hoe.jpg', // Houe rotative

    // Pièces et accessoires
    30 => 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Transport_chain.jpg/800px-Transport_chain.jpg', // Chaîne de transport
    31 => 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Metal_grain_bucket.jpg/800px-Metal_grain_bucket.jpg', // Pelle à grain métallique
    32 => 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/4_teeth_forage_fork.jpg/800px-4_teeth_forage_fork.jpg', // Fourche fourragère 4 dents
    33 => 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Dentelée_fork.jpg/800px-Dentelée_fork.jpg', // Fourche bêche dentelée
    34 => 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Silage_bucket.jpg/800px-Silage_bucket.jpg', // Pelle à ensilage
    35 => 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/15_teeth_hay_rake.jpg/800px-15_teeth_hay_rake.jpg', // Rateau à foin 15 dents
    36 => 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Pointed_pickaxe.jpg/800px-Pointed_pickaxe.jpg', // Pioche pointue
    37 => 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Square_blade_shovel.jpg/800px-Square_blade_shovel.jpg', // Bêche plate carrée
    38 => 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Hoe_pick.jpg/800px-Hoe_pick.jpg', // Houe-bêche
    39 => 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Curved_sickle.jpg/800px-Curved_sickle.jpg', // Serpette courbe
    40 => 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Debardage_sabre.jpg/800px-Debardage_sabre.jpg', // Sabre de débardage

    // Pièces mécaniques
    41 => 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Standard_tractor_belt.jpg/800px-Standard_tractor_belt.jpg', // Courroie tracteur standard
    42 => 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Agricultural_traction_chain.jpg/800px-Agricultural_traction_chain.jpg', // Chaîne de traction agricole
    43 => 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Steel_plow_bolts.jpg/800px-Steel_plow_bolts.jpg', // Boulons de charrue acier
    44 => 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Cranked_harvester_belt.jpg/800px-Cranked_harvester_belt.jpg', // Courroie crantée moissonneuse
    45 => 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Blind_roller_bearing.jpg/800px-Blind_roller_bearing.jpg', // Roulement agricole blindé
    46 => 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Complete_tractor_pulley.jpg/800px-Complete_tractor_pulley.jpg', // Palier complet tracteur
    47 => 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Manganese_steel_plow_share.jpg/800px-Manganese_steel_plow_share.jpg', // Soc de charrue acier manganese
    48 => 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Wide_flat_belt.jpg/800px-Wide_flat_belt.jpg', // Courroie plate large

    // Pneus et filtres
    49 => 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/13.6-28_agricultural_tire.jpg/800px-13.6-28_agricultural_tire.jpg', // Pneu agricole 13.6-28
    50 => 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Engine_air_filter.jpg/800px-Engine_air_filter.jpg', // Filtre à air moteur agricole
];

try {
    // Connexion à la base de données
    $db = new Database();
    $pdo = $db->connect();

    // Récupérer tous les produits
    $stmt = $pdo->query("SELECT id, name FROM products ORDER BY id");
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo "\n═══════════════════════════════════════════\n";
    echo "📸 Téléchargement des images de produits\n";
    echo "═══════════════════════════════════════════\n";
    echo "Produits à traiter: " . count($products) . "\n\n";

    $successCount = 0;
    $failCount = 0;

    foreach ($products as $product) {
        $productId = $product['id'];
        $productName = $product['name'];

        // Créer le nom du fichier image
        $imageName = 'product_' . $productId . '.jpg';
        $imagePath = $imagesDir . '/products/' . $imageName;
        $imageUrl = '/images/products/' . $imageName;

        // Vérifier si l'image existe déjà
        if (file_exists($imagePath)) {
            echo "✓ " . str_pad($productName, 40) . " → Image existe déjà\n";
            $successCount++;
            continue;
        }

        // Télécharger l'image depuis internet
        if (isset($imageUrls[$productId])) {
            if (downloadImage($imageUrls[$productId], $imagePath)) {
                // Mettre à jour la base de données
                $updateStmt = $pdo->prepare("UPDATE products SET image = ? WHERE id = ?");
                if ($updateStmt->execute([$imageUrl, $productId])) {
                    echo "✓ " . str_pad($productName, 40) . " → $imageName\n";
                    $successCount++;
                } else {
                    echo "✗ ERREUR (BD): $productName\n";
                    @unlink($imagePath);
                    $failCount++;
                }
            } else {
                echo "✗ ERREUR (Téléchargement): $productName\n";
                $failCount++;
            }
        } else {
            echo "⚠ PAS D'URL: $productName (ID: $productId)\n";
            $failCount++;
        }
    }

    echo "\n═══════════════════════════════════════════\n";
    echo "Résultats:\n";
    echo "  ✓ Succès: $successCount\n";
    echo "  ✗ Erreurs: $failCount\n";
    echo "═══════════════════════════════════════════\n";

} catch (Exception $e) {
    echo "ERREUR: " . $e->getMessage() . "\n";
    exit(1);
}

/**
 * Télécharge une image depuis une URL
 */
function downloadImage($url, $filepath) {
    // Créer le dossier si nécessaire
    $dir = dirname($filepath);
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }

    // Utiliser cURL pour télécharger
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

    $data = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode === 200 && $data) {
        // Vérifier que c'est bien une image
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mime = finfo_buffer($finfo, $data);
        finfo_close($finfo);

        if (strpos($mime, 'image/') === 0) {
            return file_put_contents($filepath, $data) !== false;
        }
    }

    return false;
}
