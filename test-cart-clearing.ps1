# Script de test pour le vidage automatique du panier après commande
# À exécuter sur Windows PowerShell

Write-Host "======================================" -ForegroundColor Green
Write-Host "🧪 TEST: Vidage Automatique du Panier" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host ""

# Configuration
$API_URL = "http://localhost:8000/backend/api"
$USER_ID = 1  # ID du premier utilisateur test
$PRODUCT_ID = 1  # ID du premier produit

Write-Host "📊 Configuration:" -ForegroundColor Blue
Write-Host "  API URL: $API_URL"
Write-Host "  User ID: $USER_ID"
Write-Host "  Product ID: $PRODUCT_ID"
Write-Host ""

# Test 1: Vérifier le panier initial
Write-Host "✓ TEST 1: Vérifier le panier initial" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$API_URL/cart.php?action=get&userId=$USER_ID" -Method Get -ContentType "application/json" -ErrorAction SilentlyContinue
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Erreur: $_" -ForegroundColor Red
}
Write-Host ""

# Test 2: Ajouter un article au panier
Write-Host "✓ TEST 2: Ajouter un article au panier" -ForegroundColor Yellow
$body = @{
    userId = $USER_ID
    productId = $PRODUCT_ID
    quantity = 2
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$API_URL/cart.php?action=add" -Method Post -ContentType "application/json" -Body $body -ErrorAction SilentlyContinue
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Erreur: $_" -ForegroundColor Red
}
Write-Host ""

# Test 3: Vérifier le panier après ajout
Write-Host "✓ TEST 3: Vérifier le panier après ajout" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$API_URL/cart.php?action=get&userId=$USER_ID" -Method Get -ContentType "application/json" -ErrorAction SilentlyContinue
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Erreur: $_" -ForegroundColor Red
}
Write-Host ""

# Test 4: Vider le panier
Write-Host "✓ TEST 4: Vider le panier" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$API_URL/cart.php?action=clear&userId=$USER_ID" -Method Post -ContentType "application/json" -Body "{}" -ErrorAction SilentlyContinue
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Erreur: $_" -ForegroundColor Red
}
Write-Host ""

# Test 5: Vérifier le panier après vidage
Write-Host "✓ TEST 5: Vérifier le panier après vidage" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$API_URL/cart.php?action=get&userId=$USER_ID" -Method Get -ContentType "application/json" -ErrorAction SilentlyContinue
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Erreur: $_" -ForegroundColor Red
}
Write-Host ""

Write-Host "======================================" -ForegroundColor Green
Write-Host "✅ Tests complétés!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host ""
Write-Host "Résultats attendus:" -ForegroundColor Cyan
Write-Host "  ✓ Test 1: Panier vide ou avec articles existants"
Write-Host "  ✓ Test 2: Article ajouté avec succès"
Write-Host "  ✓ Test 3: Panier contient l'article ajouté"
Write-Host "  ✓ Test 4: Panier vidé avec succès"
Write-Host "  ✓ Test 5: Panier complètement vide (0 articles)"
Write-Host ""
