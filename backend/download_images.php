<?php
/**
 * Robust cURL-based product image downloader.
 * Saves images to public/images/products/ and updates products.image in DB.
 * CLI: --start, --end, --retries, --concurrency, --force, --dry-run
 * No Composer dependencies. PHP 8.2, PDO, Windows XAMPP compatible.
 */

declare(strict_types=1);

require_once __DIR__ . '/config/Database.php';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

$SCRIPT_DIR = __DIR__;
$IMAGES_DIR = $SCRIPT_DIR . '/public/images/products';
$LOG_FILE   = $SCRIPT_DIR . '/logs/download_images.log';
$CONNECT_TIMEOUT = 15;
$TRANSFER_TIMEOUT = 45;
$MAX_RETRIES = 3;
$BASE_BACKOFF_SEC = 1;

// Product ID => image URL (same as original; could be moved to DB later)
$IMAGE_URLS = [
    1 => 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop',
    2 => 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop&q=80',
    3 => 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop&q=80&fm=jpg',
    4 => 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop&q=80&flip=h',
    5 => 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop&q=85',
    6 => 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop&q=80&auto=format',
    7 => 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop&q=75',
    8 => 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop&q=80&brightness=1.1',
    9 => 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop&q=80&brightness=1.1',
    10 => 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop&q=80&contrast=1.2',
    11 => 'https://images.unsplash.com/photo-1600126613408-eca07ce68773?w=600&h=400&fit=crop',
    12 => 'https://images.unsplash.com/photo-1600126613408-eca07ce68773?w=600&h=400&fit=crop&q=80',
    13 => 'https://images.unsplash.com/photo-1600126613408-eca07ce68773?w=600&h=400&fit=crop&q=80&fm=jpg',
    14 => 'https://images.unsplash.com/photo-1600126613408-eca07ce68773?w=600&h=400&fit=crop&q=80&flip=h',
    15 => 'https://images.unsplash.com/photo-1600126613408-eca07ce68773?w=600&h=400&fit=crop&q=85',
    16 => 'https://images.unsplash.com/photo-1600126613408-eca07ce68773?w=600&h=400&fit=crop&q=80&auto=format',
    17 => 'https://images.unsplash.com/photo-1600126613408-eca07ce68773?w=600&h=400&fit=crop&q=75',
    18 => 'https://images.unsplash.com/photo-1600126613408-eca07ce68773?w=600&h=400&fit=crop&q=80&brightness=1.1',
    19 => 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=400&fit=crop',
    20 => 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=400&fit=crop&q=80',
    21 => 'https://images.unsplash.com/photo-1574323447407-f5e1ad6d020b?w=600&h=400&fit=crop',
    22 => 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=400&fit=crop&q=80&fm=jpg',
    23 => 'https://images.unsplash.com/photo-1574323447407-f5e1ad6d020b?w=600&h=400&fit=crop&q=80',
    24 => 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=400&fit=crop&q=85',
    25 => 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=400&fit=crop&q=80&auto=format',
    26 => 'https://images.unsplash.com/photo-1574323447407-f5e1ad6d020b?w=600&h=400&fit=crop&q=75',
    27 => 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=400&fit=crop&q=80&brightness=1.1',
    28 => 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=400&fit=crop&q=80&contrast=1.2',
    29 => 'https://images.unsplash.com/photo-1574323447407-f5e1ad6d020b?w=600&h=400&fit=crop&q=80&flip=h',
    30 => 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=400&fit=crop&q=80&saturation=1.2',
    31 => 'https://images.unsplash.com/photo-1590755962873-f2eec3dd3718?w=600&h=400&fit=crop',
    32 => 'https://images.unsplash.com/photo-1590755962873-f2eec3dd3718?w=600&h=400&fit=crop&q=80',
    33 => 'https://images.unsplash.com/photo-1590755962873-f2eec3dd3718?w=600&h=400&fit=crop&q=80&fm=jpg',
    34 => 'https://images.unsplash.com/photo-1590755962873-f2eec3dd3718?w=600&h=400&fit=crop&q=85',
    35 => 'https://images.unsplash.com/photo-1590755962873-f2eec3dd3718?w=600&h=400&fit=crop&q=80&auto=format',
    36 => 'https://images.unsplash.com/photo-1590755962873-f2eec3dd3718?w=600&h=400&fit=crop&q=75',
    37 => 'https://images.unsplash.com/photo-1590755962873-f2eec3dd3718?w=600&h=400&fit=crop&q=80&brightness=1.1',
    38 => 'https://images.unsplash.com/photo-1590755962873-f2eec3dd3718?w=600&h=400&fit=crop&q=80&contrast=1.2',
    39 => 'https://images.unsplash.com/photo-1590755962873-f2eec3dd3718?w=600&h=400&fit=crop&q=80&flip=h',
    40 => 'https://images.unsplash.com/photo-1590755962873-f2eec3dd3718?w=600&h=400&fit=crop&q=80&saturation=1.2',
    41 => 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=400&fit=crop',
    42 => 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=400&fit=crop&q=80',
    43 => 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=400&fit=crop&q=80&fm=jpg',
    44 => 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=400&fit=crop&q=85',
    45 => 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=400&fit=crop&q=80&auto=format',
    46 => 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=400&fit=crop&q=75',
    47 => 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=400&fit=crop&q=80&brightness=1.1',
    48 => 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=400&fit=crop&q=80&contrast=1.2',
    49 => 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=400&fit=crop&q=80&flip=h',
    50 => 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=400&fit=crop&q=80&saturation=1.2',
];

// ---------------------------------------------------------------------------
// Helpers: logging, CLI args, image validation
// ---------------------------------------------------------------------------

function ensure_dir(string $path): void {
    if (!is_dir($path)) {
        mkdir($path, 0755, true);
    }
}

function log_message(string $logFile, string $message): void {
    ensure_dir(dirname($logFile));
    $line = date('Y-m-d H:i:s') . ' ' . $message . PHP_EOL;
    file_put_contents($logFile, $line, FILE_APPEND | LOCK_EX);
}

function parse_cli_args(array $argv): array {
    $opts = [
        'start'       => null,
        'end'         => null,
        'retries'     => 3,
        'concurrency' => 1,
        'force'       => false,
        'dry_run'     => false,
    ];
    for ($i = 1; $i < count($argv); $i++) {
        $arg = $argv[$i];
        if ($arg === '--force')    { $opts['force'] = true; continue; }
        if ($arg === '--dry-run')  { $opts['dry_run'] = true; continue; }
        if ($arg === '--start' && isset($argv[$i + 1])) {
            $opts['start'] = (int) $argv[++$i];
            continue;
        }
        if ($arg === '--end' && isset($argv[$i + 1])) {
            $opts['end'] = (int) $argv[++$i];
            continue;
        }
        if ($arg === '--retries' && isset($argv[$i + 1])) {
            $opts['retries'] = max(1, (int) $argv[++$i]);
            continue;
        }
        if ($arg === '--concurrency' && isset($argv[$i + 1])) {
            $opts['concurrency'] = max(1, (int) $argv[++$i]);
            continue;
        }
    }
    return $opts;
}

/** @return array{0: bool, 1: string|null} Valid, extension (e.g. 'jpg') */
function validate_image_response(int $httpCode, ?string $contentType, string $body): array {
    if ($httpCode !== 200) {
        return [false, null];
    }
    $ct = $contentType ? strtolower(trim(explode(';', $contentType)[0])) : '';
    $allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!in_array($ct, $allowed, true)) {
        // Try finfo / magic bytes
        $ext = extension_from_magic_bytes($body);
        if ($ext !== null) {
            return [true, $ext];
        }
        return [false, null];
    }
    $ext = match ($ct) {
        'image/jpeg', 'image/jpg' => 'jpg',
        'image/png' => 'png',
        'image/gif' => 'gif',
        'image/webp' => 'webp',
        default => null,
    };
    if ($ext !== null) {
        $magicExt = extension_from_magic_bytes($body);
        if ($magicExt !== null && $magicExt !== $ext) {
            $ext = $magicExt;
        }
        return [true, $ext];
    }
    $magicExt = extension_from_magic_bytes($body);
    return [$magicExt !== null, $magicExt];
}

function extension_from_magic_bytes(string $body): ?string {
    $len = strlen($body);
    if ($len < 12) {
        return null;
    }
    $b = $body;
    if (substr($b, 0, 2) === "\xFF\xD8") {
        return 'jpg';
    }
    if (substr($b, 0, 8) === "\x89PNG\r\n\x1A\n") {
        return 'png';
    }
    if (substr($b, 0, 6) === 'GIF87a' || substr($b, 0, 6) === 'GIF89a') {
        return 'gif';
    }
    if ($len >= 12 && substr($b, 0, 4) === 'RIFF' && substr($b, 8, 4) === 'WEBP') {
        return 'webp';
    }
    return null;
}

/** Download with cURL: follow redirects, timeouts, retries with exponential backoff. */
function download_with_curl(string $url, int $connectTimeout, int $transferTimeout, int $maxRetries, int $baseBackoffSec, string $logFile): array {
    $ch = curl_init($url);
    if ($ch === false) {
        return ['body' => null, 'http_code' => 0, 'content_type' => null, 'error' => 'curl_init failed'];
    }
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_MAXREDIRS      => 5,
        CURLOPT_CONNECTTIMEOUT => $connectTimeout,
        CURLOPT_TIMEOUT        => $transferTimeout,
        CURLOPT_HEADER         => false,
        CURLOPT_USERAGENT      => 'SanabelImageDownloader/1.0',
        CURLOPT_SSL_VERIFYPEER => true,
    ]);
    $attempt = 0;
    $lastError = '';
    $lastCode = 0;
    $lastCt = null;
    $body = null;
    while ($attempt < $maxRetries) {
        $attempt++;
        $body = curl_exec($ch);
        $httpCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE) ?: null;
        $err = curl_error($ch);
        if ($body === false || $err !== '') {
            $lastError = $err ?: 'empty response';
            $lastCode = $httpCode;
            $lastCt = $contentType;
            if ($attempt < $maxRetries) {
                $backoff = $baseBackoffSec * (2 ** ($attempt - 1));
                log_message($logFile, "Retry $attempt/$maxRetries after {$backoff}s: $url - $lastError");
                sleep($backoff);
            }
            continue;
        }
        if ($httpCode !== 200) {
            $lastError = "HTTP $httpCode";
            $lastCode = $httpCode;
            $lastCt = $contentType;
            if ($attempt < $maxRetries) {
                $backoff = $baseBackoffSec * (2 ** ($attempt - 1));
                log_message($logFile, "Retry $attempt/$maxRetries after {$backoff}s: $url - HTTP $httpCode");
                sleep($backoff);
            }
            continue;
        }
        curl_close($ch);
        return ['body' => $body, 'http_code' => $httpCode, 'content_type' => $contentType, 'error' => null];
    }
    curl_close($ch);
    return ['body' => $body, 'http_code' => $lastCode, 'content_type' => $lastCt, 'error' => $lastError ?: 'max retries'];
}

/** Atomic write: temp file in same dir then rename. */
function atomic_write(string $filepath, string $content, string $logFile): bool {
    $dir = dirname($filepath);
    $base = basename($filepath);
    $temp = $dir . '/' . '.tmp.' . $base . '.' . getmypid() . '.' . bin2hex(random_bytes(4));
    if (file_put_contents($temp, $content) === false) {
        log_message($logFile, "atomic_write: failed to write temp $temp");
        return false;
    }
    if (!rename($temp, $filepath)) {
        @unlink($temp);
        log_message($logFile, "atomic_write: rename failed $temp -> $filepath");
        return false;
    }
    if (PHP_OS_FAMILY !== 'Windows') {
        @chmod($filepath, 0644);
    }
    return true;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

$isCli = PHP_SAPI === 'cli';
$options = $isCli ? parse_cli_args($_SERVER['argv'] ?? []) : [
    'start' => null, 'end' => null, 'retries' => $MAX_RETRIES, 'concurrency' => 1, 'force' => false, 'dry_run' => false,
];

$startId = $options['start'] ?? min(array_keys($IMAGE_URLS));
$endId   = $options['end']   ?? max(array_keys($IMAGE_URLS));
$retries = $options['retries'];
$force   = $options['force'];
$dryRun  = $options['dry_run'];

ensure_dir($IMAGES_DIR);
ensure_dir(dirname($LOG_FILE));

log_message($LOG_FILE, 'Started download_images.php start=' . $startId . ' end=' . $endId . ' force=' . ($force ? '1' : '0') . ' dry_run=' . ($dryRun ? '1' : '0'));

$db = new Database();
$conn = $db->connect();
if (!$conn) {
    log_message($LOG_FILE, 'DB connection failed');
    if ($isCli) {
        fwrite(STDERR, "DB connection failed\n");
        exit(1);
    }
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['success' => false, 'message' => 'DB connection failed', 'items' => [], 'summary' => []]);
    exit(1);
}

$results = [];
$summary = ['total' => 0, 'ok' => 0, 'skipped' => 0, 'failed' => 0];

foreach ($IMAGE_URLS as $productId => $imageUrl) {
    if ($productId < $startId || $productId > $endId) {
        continue;
    }
    $summary['total']++;

    $filenameBase = "product_$productId";
    $existingPath = null;
    foreach (['jpg', 'jpeg', 'png', 'gif', 'webp'] as $e) {
        $p = $IMAGES_DIR . '/' . $filenameBase . '.' . $e;
        if (is_file($p) && filesize($p) > 0) {
            $existingPath = $p;
            break;
        }
    }

    if ($existingPath !== null && !$force) {
        $ext = pathinfo($existingPath, PATHINFO_EXTENSION);
        $webPath = '/images/products/' . $filenameBase . '.' . $ext;
        $results[] = ['id' => $productId, 'status' => 'skipped', 'message' => 'existing file', 'path' => $webPath];
        $summary['skipped']++;
        continue;
    }

    if ($dryRun) {
        $results[] = ['id' => $productId, 'status' => 'dry_run', 'message' => 'would download', 'url' => $imageUrl];
        $summary['ok']++;
        continue;
    }

    $download = download_with_curl($imageUrl, $CONNECT_TIMEOUT, $TRANSFER_TIMEOUT, $retries, $BASE_BACKOFF_SEC, $LOG_FILE);
    if ($download['error'] !== null) {
        $results[] = ['id' => $productId, 'status' => 'failed', 'message' => $download['error'], 'url' => $imageUrl];
        $summary['failed']++;
        log_message($LOG_FILE, "Product $productId: download failed - " . $download['error']);
        continue;
    }

    $body = $download['body'];
    if (!is_string($body) || $body === '') {
        $results[] = ['id' => $productId, 'status' => 'failed', 'message' => 'empty body', 'url' => $imageUrl];
        $summary['failed']++;
        continue;
    }

    [$valid, $ext] = validate_image_response(
        $download['http_code'],
        $download['content_type'],
        $body
    );
    if (!$valid || $ext === null) {
        $results[] = ['id' => $productId, 'status' => 'failed', 'message' => 'invalid image (status/content-type/magic)', 'url' => $imageUrl];
        $summary['failed']++;
        log_message($LOG_FILE, "Product $productId: invalid image response");
        continue;
    }

    $filename = $filenameBase . '.' . $ext;
    $filepath = $IMAGES_DIR . '/' . $filename;
    if (!atomic_write($filepath, $body, $LOG_FILE)) {
        $results[] = ['id' => $productId, 'status' => 'failed', 'message' => 'write failed', 'url' => $imageUrl];
        $summary['failed']++;
        continue;
    }

    $webPath = '/images/products/' . $filename;
    try {
        $conn->beginTransaction();
        $stmt = $conn->prepare('UPDATE products SET image = :image WHERE id = :id');
        $stmt->bindValue(':image', $webPath, PDO::PARAM_STR);
        $stmt->bindValue(':id', $productId, PDO::PARAM_INT);
        $stmt->execute();
        $conn->commit();
        $results[] = ['id' => $productId, 'status' => 'ok', 'path' => $webPath];
        $summary['ok']++;
    } catch (Throwable $e) {
        $conn->rollBack();
        if (is_file($filepath)) {
            @unlink($filepath);
        }
        $results[] = ['id' => $productId, 'status' => 'failed', 'message' => 'DB error: ' . $e->getMessage(), 'path_rolled_back' => true];
        $summary['failed']++;
        log_message($LOG_FILE, "Product $productId: DB update failed, file removed - " . $e->getMessage());
    }
}

log_message($LOG_FILE, 'Finished: ok=' . $summary['ok'] . ' skipped=' . $summary['skipped'] . ' failed=' . $summary['failed']);

$output = [
    'success' => $summary['failed'] === 0,
    'message'  => $dryRun ? 'Dry run completed' : 'Download completed',
    'items'    => $results,
    'summary'  => $summary,
    'images_directory' => $IMAGES_DIR,
];

if ($isCli) {
    echo json_encode($output, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . PHP_EOL;
    exit($summary['failed'] > 0 ? 1 : 0);
}

header('Content-Type: application/json; charset=utf-8');
echo json_encode($output, JSON_UNESCAPED_SLASHES);
