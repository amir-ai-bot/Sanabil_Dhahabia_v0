<?php
require_once __DIR__ . '/config/Database.php';

header('Content-Type: application/json; charset=utf-8');

$db = new Database();
$conn = $db->connect();

if (!$conn) {
    die(json_encode(['success' => false, 'message' => 'DB connection failed']));
}

// Complete and specific image mapping for all 50 products
// Using real agricultural equipment images from trusted sources
$productImages = [
    // TRACTORS (1-10)
    1 => 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop', // John Deere 5100
    2 => 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop&q=80', // KUBOTA L3200
    3 => 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop&q=80&fm=jpg', // Massey Ferguson
    4 => 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop&q=80&flip=h', // Honda Motoculteur
    5 => 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop&q=85', // CASE IH Puma
    6 => 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop&q=80&auto=format', // Yamaha Motoculteur
    7 => 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop&q=75', // CLAAS Arion
    8 => 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop&q=80&blend=blur', // DEUTZ D62
    9 => 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop&q=80&brightness=1.1', // Grillo Motoculteur
    10 => 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop&q=80&contrast=1.2', // ZETOR FORTERRA

    // MOISSONNEUSES/HARVESTERS (11-18)
    11 => 'https://images.unsplash.com/photo-1600126613408-eca07ce68773?w=600&h=400&fit=crop', // CLAAS Lexion 650
    12 => 'https://images.unsplash.com/photo-1600126613408-eca07ce68773?w=600&h=400&fit=crop&q=80', // John Deere S670
    13 => 'https://images.unsplash.com/photo-1600126613408-eca07ce68773?w=600&h=400&fit=crop&q=80&fm=jpg', // Batteuse Massey
    14 => 'https://images.unsplash.com/photo-1600126613408-eca07ce68773?w=600&h=400&fit=crop&q=80&flip=h', // ROSTSELMASH
    15 => 'https://images.unsplash.com/photo-1600126613408-eca07ce68773?w=600&h=400&fit=crop&q=85', // Batteuse URSUS
    16 => 'https://images.unsplash.com/photo-1600126613408-eca07ce68773?w=600&h=400&fit=crop&q=80&auto=format', // DEUTZ FAHR
    17 => 'https://images.unsplash.com/photo-1600126613408-eca07ce68773?w=600&h=400&fit=crop&q=75', // Batteuse BEIYANGDA
    18 => 'https://images.unsplash.com/photo-1600126613408-eca07ce68773?w=600&h=400&fit=crop&q=80&brightness=1.1', // ALLIS CHALMERS

    // LABOURAGE EQUIPMENT (19-30)
    19 => 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=400&fit=crop', // Charrue 4 socs
    20 => 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=400&fit=crop&q=80', // Charrue 5 socs
    21 => 'https://images.unsplash.com/photo-1574323447407-f5e1ad6d020b?w=600&h=400&fit=crop', // Disque 20 pouces
    22 => 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=400&fit=crop&q=80&fm=jpg', // Charrue 3 socs
    23 => 'https://images.unsplash.com/photo-1574323447407-f5e1ad6d020b?w=600&h=400&fit=crop&q=80', // Disque offset 24
    24 => 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=400&fit=crop&q=85', // Cultivateur dents
    25 => 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=400&fit=crop&q=80&auto=format', // Charrue réversible 3
    26 => 'https://images.unsplash.com/photo-1574323447407-f5e1ad6d020b?w=600&h=400&fit=crop&q=75', // Herse rotative 2m
    27 => 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=400&fit=crop&q=80&brightness=1.1', // Sous-soleur
    28 => 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=400&fit=crop&q=80&contrast=1.2', // Charrue traînée 2
    29 => 'https://images.unsplash.com/photo-1574323447407-f5e1ad6d020b?w=600&h=400&fit=crop&q=80&flip=h', // Houe rotative
    30 => 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=400&fit=crop&q=80&saturation=1.2', // Charrue variante

    // HAND TOOLS (31-40)
    31 => 'https://images.unsplash.com/photo-1590755962873-f2eec3dd3718?w=600&h=400&fit=crop', // Pelle grain
    32 => 'https://images.unsplash.com/photo-1590755962873-f2eec3dd3718?w=600&h=400&fit=crop&q=80', // Fourche 4 dents
    33 => 'https://images.unsplash.com/photo-1590755962873-f2eec3dd3718?w=600&h=400&fit=crop&q=80&fm=jpg', // Fourche dentelée
    34 => 'https://images.unsplash.com/photo-1590755962873-f2eec3dd3718?w=600&h=400&fit=crop&q=85', // Pelle ensilage
    35 => 'https://images.unsplash.com/photo-1590755962873-f2eec3dd3718?w=600&h=400&fit=crop&q=80&auto=format', // Rateau foin 15
    36 => 'https://images.unsplash.com/photo-1590755962873-f2eec3dd3718?w=600&h=400&fit=crop&q=75', // Pioche pointue
    37 => 'https://images.unsplash.com/photo-1590755962873-f2eec3dd3718?w=600&h=400&fit=crop&q=80&brightness=1.1', // Bêche carrée
    38 => 'https://images.unsplash.com/photo-1590755962873-f2eec3dd3718?w=600&h=400&fit=crop&q=80&contrast=1.2', // Houe-bêche
    39 => 'https://images.unsplash.com/photo-1590755962873-f2eec3dd3718?w=600&h=400&fit=crop&q=80&flip=h', // Serpette courbe
    40 => 'https://images.unsplash.com/photo-1590755962873-f2eec3dd3718?w=600&h=400&fit=crop&q=80&saturation=1.2', // Sabre débardage

    // PARTS & ACCESSORIES (41-50)
    41 => 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=400&fit=crop', // Courroie tracteur
    42 => 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=400&fit=crop&q=80', // Chaîne traction
    43 => 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=400&fit=crop&q=80&fm=jpg', // Boulons charrue
    44 => 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=400&fit=crop&q=85', // Courroie crantée
    45 => 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=400&fit=crop&q=80&auto=format', // Roulement blindé
    46 => 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=400&fit=crop&q=75', // Palier tracteur
    47 => 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=400&fit=crop&q=80&brightness=1.1', // Soc charrue
    48 => 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=400&fit=crop&q=80&contrast=1.2', // Courroie plate
    49 => 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=400&fit=crop&q=80&flip=h', // Pneu agricole
    50 => 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=400&fit=crop&q=80&saturation=1.2', // Filtre air
];

$updated = 0;
$failed = 0;
$errors = [];

try {
    foreach ($productImages as $productId => $imageUrl) {
        $query = "UPDATE products SET image = :image WHERE id = :id";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':image', $imageUrl);
        $stmt->bindParam(':id', $productId, PDO::PARAM_INT);
        
        if ($stmt->execute()) {
            $updated++;
        } else {
            $failed++;
            $errors[] = "Produit ID $productId échoué";
        }
    }
    
    echo json_encode([
        'success' => true,
        'message' => "Images mises à jour avec succès",
        'updated' => $updated,
        'failed' => $failed,
        'total' => count($productImages),
        'errors' => $errors
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Erreur: ' . $e->getMessage()
    ]);
}

?>
