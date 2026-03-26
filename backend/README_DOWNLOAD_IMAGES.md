# Product Image Downloader

Robust cURL-based script to download product images and update `products.image` in the database.  
**PHP 8.2, PDO, Windows XAMPP.** No Composer dependencies.

---

## Features

- **cURL**: Follow redirects, connect/transfer timeouts, 3 retries with exponential backoff
- **Validation**: HTTP 200, `Content-Type` image/*, and finfo/magic bytes; correct extension (jpg/png/gif/webp)
- **Atomic save**: Temp file in same dir then `rename()` to `public/images/products/product_{id}.{ext}`; web-readable permissions on Unix
- **DB**: Per-file transaction; on DB failure the saved file is deleted; prepared statements
- **Idempotent**: Skips valid existing files unless `--force`
- **CLI args**: `--start`, `--end`, `--retries`, `--concurrency`, `--force`, `--dry-run` (sequential by default)
- **Output**: Per-item status + JSON summary; log to `backend/logs/download_images.log`

---

## Deployment (Windows XAMPP)

### 1. Target directory

Images are saved to:

```text
C:\xampp\htdocs\sanabel-backend\public\images\products
```

(or your project path: `backend/public/images/products`)

### 2. Make directory writable by Apache

- Ensure the folder exists (the script creates it if missing).
- Give the Apache user (e.g. `SYSTEM` or the user running Apache) **write** permission to that folder:
  - Right‑click `public\images\products` → **Properties** → **Security**
  - Add/Edit so that the Apache user has **Modify** (or at least **Write**) on this folder (and optionally **Create files** / **Create folders**).
- Or run the script once from CLI (your user) so the folder and files are created; then adjust permissions so Apache can overwrite if needed (e.g. for future re-runs via a scheduled task).

### 3. Logs directory

The script writes to `backend/logs/download_images.log`. Ensure `backend/logs` exists and is writable (script creates it; same permission idea as above if you run from Apache).

### 4. PHP requirements

- PHP 8.2, `curl`, PDO MySQL.
- In `php.ini`: `extension=curl` and `extension=pdo_mysql` enabled.

---

## Run

### PowerShell (from project root)

If `php` is not in PATH, use XAMPP’s PHP, e.g.:

```powershell
$php = "C:\xampp\php\php.exe"   # adjust if your XAMPP path differs
# Default: all products, sequential, no force
& $php backend\download_images.php

# Range
& $php backend\download_images.php --start 1 --end 10

# Force re-download even if file exists
& $php backend\download_images.php --force

# Dry run (no writes, no DB updates)
& $php backend\download_images.php --dry-run

# More retries
& $php backend\download_images.php --retries 5

# Concurrency (currently sequential only; option reserved)
& $php backend\download_images.php --concurrency 1
```

Or if `php` is in PATH, you can run `php backend\download_images.php` directly.

### One-shot full run with JSON to file

```powershell
& $php backend\download_images.php 2>&1 | Tee-Object -FilePath backend\download_result.json
```

### Verify one download (test script)

```powershell
& $php backend\test_download_one.php
# Or for product id 5:
& $php backend\test_download_one.php 5
```

The test script downloads one image, saves it as `product_<id>_test.<ext>`, then deletes it. No DB update.

---

## Verify

1. **Log**:  
   `type backend\logs\download_images.log`

2. **Files**:  
   `dir backend\public\images\products`

3. **DB**:  
   ```sql
   SELECT id, image FROM products WHERE image IS NOT NULL AND image != '' LIMIT 10;
   ```
   Values should look like `/images/products/product_1.jpg`.

4. **Browser**:  
   Open e.g.  
   `http://localhost/sanabel-backend/public/images/products/product_1.jpg`  
   (adjust host/path to your setup).

---

## Options summary

| Option         | Description                    | Default   |
|----------------|--------------------------------|-----------|
| `--start N`    | First product ID to process    | min ID    |
| `--end N`      | Last product ID to process     | max ID    |
| `--retries N`  | cURL retries per URL           | 3         |
| `--concurrency N` | Reserved (sequential only)  | 1         |
| `--force`      | Re-download and overwrite      | off       |
| `--dry-run`    | No file/DB writes              | off       |

---

## AuthController fix

`session_destroy()` is only called when a session is active (`session_status() === PHP_SESSION_ACTIVE`), so the warning *"session_destroy() called without session_start()"* is resolved. Session is started in `api/auth.php` before handling login/logout so login can set `$_SESSION`.
