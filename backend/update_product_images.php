<?php
require_once __DIR__ . '/config/Database.php';

header('Content-Type: application/json; charset=utf-8');

$db = new Database();
$conn = $db->connect();

if (!$conn) {
    die(json_encode(['success' => false, 'message' => 'DB connection failed']));
}

// Relevant agricultural images for each product type
$imageMap = [
    1 => 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop', // John Deere Tracteur
    2 => 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop', // KUBOTA
    3 => 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop', // Massey Ferguson
    4 => 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop', // Honda Motoculteur
    5 => 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop', // CASE IH
    6 => 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop', // Yamaha Motoculteur
    7 => 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop', // CLAAS Arion
    8 => 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop', // DEUTZ
    9 => 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop', // Grillo Motoculteur
    10 => 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop', // ZETOR
    11 => 'https://images.unsplash.com/photo-1600126613408-eca07ce68773?w=600&h=400&fit=crop', // Moissonneuse CLAAS
    12 => 'https://images.unsplash.com/photo-1600126613408-eca07ce68773?w=600&h=400&fit=crop', // John Deere Moissonneuse
    13 => 'https://images.unsplash.com/photo-1600126613408-eca07ce68773?w=600&h=400&fit=crop', // Batteuse Massey
    14 => 'https://images.unsplash.com/photo-1600126613408-eca07ce68773?w=600&h=400&fit=crop', // Moissonneuse ROSTSELMASH
    15 => 'https://images.unsplash.com/photo-1600126613408-eca07ce68773?w=600&h=400&fit=crop', // Batteuse URSUS
    16 => 'https://images.unsplash.com/photo-1600126613408-eca07ce68773?w=600&h=400&fit=crop', // Moissonneuse DEUTZ
    17 => 'https://images.unsplash.com/photo-1600126613408-eca07ce68773?w=600&h=400&fit=crop', // Batteuse BEIYANGDA
    18 => 'https://images.unsplash.com/photo-1600126613408-eca07ce68773?w=600&h=400&fit=crop', // Moissonneuse ALLIS
    19 => 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=400&fit=crop', // Charrue
    20 => 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=400&fit=crop', // Charrue 5 socs
    21 => 'https://images.unsplash.com/photo-1574323447407-f5e1ad6d020b?w=600&h=400&fit=crop', // Disque agricole
    22 => 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=400&fit=crop', // Charrue 3 socs
    23 => 'https://images.unsplash.com/photo-1574323447407-f5e1ad6d020b?w=600&h=400&fit=crop', // Disque offset
    24 => 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=400&fit=crop', // Cultivateur
    25 => 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=400&fit=crop', // Charrue réversible
    26 => 'https://images.unsplash.com/photo-1574323447407-f5e1ad6d020b?w=600&h=400&fit=crop', // Herse rotative
    27 => 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=400&fit=crop', // Sous-soleur
    28 => 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=400&fit=crop', // Charrue traînée
    29 => 'https://images.unsplash.com/photo-1574323447407-f5e1ad6d020b?w=600&h=400&fit=crop', // Houe rotative
    30 => 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=400&fit=crop', // Charrue variante
    31 => 'https://images.unsplash.com/photo-1590755962873-f2eec3dd3718?w=600&h=400&fit=crop', // Pelle grain
    32 => 'https://images.unsplash.com/photo-1590755962873-f2eec3dd3718?w=600&h=400&fit=crop', // Fourche
    33 => 'https://images.unsplash.com/photo-1590755962873-f2eec3dd3718?w=600&h=400&fit=crop', // Fourche dentelée
    34 => 'https://images.unsplash.com/photo-1590755962873-f2eec3dd3718?w=600&h=400&fit=crop', // Pelle ensilage
    35 => 'https://images.unsplash.com/photo-1590755962873-f2eec3dd3718?w=600&h=400&fit=crop', // Rateau foin
    36 => 'https://images.unsplash.com/photo-1590755962873-f2eec3dd3718?w=600&h=400&fit=crop', // Pioche
    37 => 'https://images.unsplash.com/photo-1590755962873-f2eec3dd3718?w=600&h=400&fit=crop', // Bêche
    38 => 'https://images.unsplash.com/photo-1590755962873-f2eec3dd3718?w=600&h=400&fit=crop', // Houe-bêche
    39 => 'https://images.unsplash.com/photo-1590755962873-f2eec3dd3718?w=600&h=400&fit=crop', // Serpette
    40 => 'https://images.unsplash.com/photo-1590755962873-f2eec3dd3718?w=600&h=400&fit=crop', // Sabre
    41 => 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=400&fit=crop', // Courroie
    42 => 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=400&fit=crop', // Chaîne
    43 => 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=400&fit=crop', // Boulons
    44 => 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=400&fit=crop', // Courroie crantée
    45 => 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=400&fit=crop', // Roulement
    46 => 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=400&fit=crop', // Palier
    47 => 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=400&fit=crop', // Soc
    48 => 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=400&fit=crop', // Courroie plate
    49 => 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=400&fit=crop', // Pneu
    50 => 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=400&fit=crop', // Filtre
];

$updated = 0;
$failed = 0;

try {
    foreach ($imageMap as $productId => $imageUrl) {
        $query = "UPDATE products SET image = :image WHERE id = :id";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':image', $imageUrl);
        $stmt->bindParam(':id', $productId, PDO::PARAM_INT);
        
        if ($stmt->execute()) {
            $updated++;
        } else {
            $failed++;
        }
    }
    
    echo json_encode([
        'success' => true,
        'message' => "Images mises à jour avec succès",
        'updated' => $updated,
        'failed' => $failed,
        'total' => count($imageMap)
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Erreur: ' . $e->getMessage()
    ]);
}

?>
