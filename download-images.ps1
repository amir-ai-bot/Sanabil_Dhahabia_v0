$imagesDir = ".\backend\public\images\products"

if (-not (Test-Path $imagesDir)) {
    New-Item -ItemType Directory -Path $imagesDir -Force | Out-Null
    Write-Host "Dossier images cree: $imagesDir"
}

$imageUrls = @{
    1 = 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop'
    2 = 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop&q=80'
    3 = 'https://images.unsplash.com/photo-1600126613408-eca07ce68773?w=600&h=400&fit=crop'
    4 = 'https://images.unsplash.com/photo-1600126613408-eca07ce68773?w=600&h=400&fit=crop&q=80'
    5 = 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=400&fit=crop'
    6 = 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=400&fit=crop&q=80'
    7 = 'https://images.unsplash.com/photo-1574323447407-f5e1ad6d020b?w=600&h=400&fit=crop'
    8 = 'https://images.unsplash.com/photo-1574323447407-f5e1ad6d020b?w=600&h=400&fit=crop&q=80'
    9 = 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=600&h=400&fit=crop'
    10 = 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=600&h=400&fit=crop&q=80'
    11 = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop'
    12 = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop&q=80'
    13 = 'https://images.unsplash.com/photo-1585070526059-27e674e3fef2?w=600&h=400&fit=crop'
    14 = 'https://images.unsplash.com/photo-1585070526059-27e674e3fef2?w=600&h=400&fit=crop&q=80'
    15 = 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=400&fit=crop'
    16 = 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=400&fit=crop&q=80'
    17 = 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=600&h=400&fit=crop'
    18 = 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=600&h=400&fit=crop&q=80'
    19 = 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=600&h=400&fit=crop'
    20 = 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=600&h=400&fit=crop&q=80'
    21 = 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=400&fit=crop'
    22 = 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&h=400&fit=crop'
    23 = 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&h=400&fit=crop&q=80'
    24 = 'https://images.unsplash.com/photo-1434389847735-0c27e25364e5?w=600&h=400&fit=crop'
}

Write-Host "Telechargement des images..."
Write-Host "----------------------------"

[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$successCount = 0
$failCount = 0

foreach ($productId in $imageUrls.Keys | Sort-Object) {
    $url = $imageUrls[$productId]
    $filename = "product_$productId.jpg"
    $filepath = Join-Path $imagesDir $filename
    
    Write-Host "[$productId] $filename... " -NoNewline
    
    try {
        Invoke-WebRequest -Uri $url -OutFile $filepath -TimeoutSec 30 -ErrorAction Stop
        Write-Host "OK" -ForegroundColor Green
        $successCount++
    } catch {
        Write-Host "ERREUR" -ForegroundColor Red
        $failCount++
    }
    
    Start-Sleep -Milliseconds 300
}

Write-Host ""
Write-Host "----------------------------"
Write-Host "Succes: $successCount" -ForegroundColor Green
Write-Host "Erreurs: $failCount" -ForegroundColor Red
Write-Host "Images dans: $imagesDir" -ForegroundColor Cyan
