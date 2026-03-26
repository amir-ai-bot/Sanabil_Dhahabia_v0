$imagesDir = ".\backend\public\images\products"

$missingImages = @{
    3 = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop'
    4 = 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=600&h=400&fit=crop'
    7 = 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=400&fit=crop'
    8 = 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=600&h=400&fit=crop'
    13 = 'https://images.unsplash.com/photo-1585070526059-27e674e3fef2?w=600&h=400&fit=crop'
    14 = 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=600&h=400&fit=crop'
    24 = 'https://images.unsplash.com/photo-1434389847735-0c27e25364e5?w=600&h=400&fit=crop'
}

Write-Host "Telechargement des images manquantes..."
Write-Host "----------------------------------------"

[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$successCount = 0

foreach ($productId in $missingImages.Keys | Sort-Object) {
    $url = $missingImages[$productId]
    $filename = "product_$productId.jpg"
    $filepath = Join-Path $imagesDir $filename
    
    Write-Host "[$productId] $filename... " -NoNewline
    
    try {
        Invoke-WebRequest -Uri $url -OutFile $filepath -TimeoutSec 30 -ErrorAction Stop
        Write-Host "OK" -ForegroundColor Green
        $successCount++
    } catch {
        Write-Host "ERREUR" -ForegroundColor Red
    }
    
    Start-Sleep -Milliseconds 300
}

Write-Host ""
Write-Host "Complete: $successCount/$($missingImages.Count) images" -ForegroundColor Green
