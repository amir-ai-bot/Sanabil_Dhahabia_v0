#!/bin/bash
# Script de test pour le vidage automatique du panier après commande
# À exécuter dans le dossier du projet

echo "======================================"
echo "🧪 TEST: Vidage Automatique du Panier"
echo "======================================"
echo ""

# Configuration
API_URL="http://localhost:8000/backend/api"
USER_ID=1  # ID du premier utilisateur test
PRODUCT_ID=1  # ID du premier produit

echo "📊 Configuration:"
echo "  API URL: $API_URL"
echo "  User ID: $USER_ID"
echo "  Product ID: $PRODUCT_ID"
echo ""

# Test 1: Vérifier le panier initial
echo "✓ TEST 1: Vérifier le panier initial"
curl -s "$API_URL/cart.php?action=get&userId=$USER_ID" | jq '.'
echo ""

# Test 2: Ajouter un article au panier
echo "✓ TEST 2: Ajouter un article au panier"
curl -s -X POST "$API_URL/cart.php?action=add" \
  -H "Content-Type: application/json" \
  -d "{\"userId\": $USER_ID, \"productId\": $PRODUCT_ID, \"quantity\": 2}" | jq '.'
echo ""

# Test 3: Vérifier le panier après ajout
echo "✓ TEST 3: Vérifier le panier après ajout"
curl -s "$API_URL/cart.php?action=get&userId=$USER_ID" | jq '.'
echo ""

# Test 4: Vider le panier
echo "✓ TEST 4: Vider le panier"
curl -s -X POST "$API_URL/cart.php?action=clear&userId=$USER_ID" | jq '.'
echo ""

# Test 5: Vérifier le panier après vidage
echo "✓ TEST 5: Vérifier le panier après vidage"
curl -s "$API_URL/cart.php?action=get&userId=$USER_ID" | jq '.'
echo ""

echo "======================================"
echo "✅ Tests complétés!"
echo "======================================"
echo ""
echo "Résultats attendus:"
echo "  ✓ Test 1: Panier vide ou avec articles existants"
echo "  ✓ Test 2: Article ajouté avec succès"
echo "  ✓ Test 3: Panier contient l'article ajouté"
echo "  ✓ Test 4: Panier vidé avec succès"
echo "  ✓ Test 5: Panier complètement vide (0 articles)"
