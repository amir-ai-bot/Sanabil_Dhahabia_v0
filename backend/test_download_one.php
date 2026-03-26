<?php
/**
 * Test script: validate one product image download (cURL, validation, atomic write).
 * Run from backend: php test_download_one.php [product_id]
 * Default product_id = 1.
 * No DB update; writes to public/images/products/product_<id>_test.<ext> and then deletes it.
 */

declare(strict_types=1);

$productId = isset($argv[1]) ? (int) $argv[1] : 1;
$testUrl = 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop';

$SCRIPT_DIR = __DIR__;
$IMAGES_DIR = $SCRIPT_DIR . '/public/images/products';
$CONNECT_TIMEOUT = 15;
$TRANSFER_TIMEOUT = 45;

function ensure_dir(string $path): void {
    if (!is_dir($path)) {
        mkdir($path, 0755, true);
    }
}

function extension_from_magic_bytes(string $body): ?string {
    $len = strlen($body);
    if ($len < 12) return null;
    if (substr($body, 0, 2) === "\xFF\xD8") return 'jpg';
    if (substr($body, 0, 8) === "\x89PNG\r\n\x1A\n") return 'png';
    if (substr($body, 0, 6) === 'GIF87a' || substr($body, 0, 6) === 'GIF89a') return 'gif';
    if (substr($body, 0, 4) === 'RIFF' && substr($body, 8, 4) === 'WEBP') return 'webp';
    return null;
}

echo "Test: download one image (product_id=$productId)\n";
echo "URL: $testUrl\n";

ensure_dir($IMAGES_DIR);

$ch = curl_init($testUrl);
if ($ch === false) {
    echo "FAIL: curl_init failed\n";
    exit(1);
}
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_MAXREDIRS      => 5,
    CURLOPT_CONNECTTIMEOUT => $CONNECT_TIMEOUT,
    CURLOPT_TIMEOUT        => $TRANSFER_TIMEOUT,
    CURLOPT_USERAGENT      => 'SanabelImageDownloader/1.0',
    CURLOPT_SSL_VERIFYPEER => true,
]);

$body = curl_exec($ch);
$httpCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
$contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE) ?: null;
$err = curl_error($ch);
curl_close($ch);

if ($body === false || $err !== '') {
    echo "FAIL: cURL error - " . ($err ?: 'empty response') . "\n";
    exit(1);
}

if ($httpCode !== 200) {
    echo "FAIL: HTTP status $httpCode (expected 200)\n";
    exit(1);
}

$ext = extension_from_magic_bytes($body);
if ($ext === null) {
    echo "FAIL: unknown image type (magic bytes)\n";
    exit(1);
}

$contentTypeOk = $contentType && (
    stripos($contentType, 'image/jpeg') !== false ||
    stripos($contentType, 'image/png') !== false ||
    stripos($contentType, 'image/gif') !== false ||
    stripos($contentType, 'image/webp') !== false
);
echo "HTTP $httpCode, Content-Type: " . ($contentType ?? 'null') . ", magic ext: $ext\n";

$filename = "product_{$productId}_test.$ext";
$filepath = $IMAGES_DIR . '/' . $filename;
$tempPath = $IMAGES_DIR . '/.tmp.' . $filename . '.' . getmypid();

if (file_put_contents($tempPath, $body) === false) {
    echo "FAIL: could not write temp file\n";
    exit(1);
}
if (!rename($tempPath, $filepath)) {
    @unlink($tempPath);
    echo "FAIL: could not rename temp to final\n";
    exit(1);
}

$size = filesize($filepath);
echo "OK: saved $filepath ($size bytes)\n";

// Cleanup: remove test file
if (unlink($filepath)) {
    echo "OK: test file removed\n";
} else {
    echo "WARN: could not remove test file $filepath\n";
}

echo "Test passed.\n";
exit(0);
