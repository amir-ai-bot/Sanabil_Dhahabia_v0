$imagesDir = ".\backend\public\images\products"

$missingImages = @{
    13 = 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&h=400&fit=crop'
    24 = 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=400&fit=crop'
}

Write-Host "Tentative finale..."
Write-Host "-------------------"

[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

foreach ($productId in $missingImages.Keys | Sort-Object) {
    $url = $missingImages[$productId]
    $filename = "product_$productId.jpg"
    $filepath = Join-Path $imagesDir $filename
    
    Write-Host "[$productId] $filename... " -NoNewline
    
    try {
        Invoke-WebRequest -Uri $url -OutFile $filepath -TimeoutSec 30 -ErrorAction Stop
        Write-Host "OK" -ForegroundColor Green
    } catch {
        Write-Host "ERREUR" -ForegroundColor Red
    }
    
    Start-Sleep -Milliseconds 300
}

Write-Host ""
$count = (Get-ChildItem $imagesDir).Count
Write-Host "Total final: $count/24 images" -ForegroundColor Cyan
