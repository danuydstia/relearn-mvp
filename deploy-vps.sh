#!/bin/bash
# ==============================================================================
# Script Otomasi Build & Deploy Frontend ReLearn ke Single VPS
# ==============================================================================
set -e

# --- Konfigurasi VPS ---
VPS_USER="${VPS_USER:-root}"
VPS_HOST="${VPS_HOST:-43.128.101.32}"
VPS_TARGET_DIR="${VPS_TARGET_DIR:-/var/www/relearn-frontend}"
FRONTEND_DIR="frontend"

echo "=========================================="
echo "🚀 Memulai Build & Deploy Frontend ReLearn"
echo "Target VPS : ${VPS_USER}@${VPS_HOST}:${VPS_TARGET_DIR}"
echo "=========================================="

# 1. Pastikan folder frontend ada
if [ ! -d "$FRONTEND_DIR" ]; then
    echo "❌ Error: Direktori $FRONTEND_DIR tidak ditemukan!"
    exit 1
fi

# 2. Build Frontend React + Vite
echo ""
echo "📦 [1/3] Menjalankan npm run build di folder $FRONTEND_DIR..."
cd "$FRONTEND_DIR"
npm run build
cd ..

if [ ! -d "$FRONTEND_DIR/dist" ]; then
    echo "❌ Error: Folder $FRONTEND_DIR/dist tidak terbentuk!"
    exit 1
fi

echo "✅ Build selesai dengan sukses!"

# 3. Siapkan direktori remote di VPS
echo ""
echo "📁 [2/3] Memastikan direktori remote ada di VPS..."
ssh -o StrictHostKeyChecking=no "${VPS_USER}@${VPS_HOST}" "mkdir -p ${VPS_TARGET_DIR}"

# 4. Upload file dist ke VPS
echo ""
echo "📤 [3/3] Mengunggah file dist/ ke VPS via rsync/scp..."
if command -v rsync >/dev/null 2>&1; then
    rsync -avz --delete "$FRONTEND_DIR/dist/" "${VPS_USER}@${VPS_HOST}:${VPS_TARGET_DIR}/"
else
    echo "⚠️ rsync tidak ditemukan di mesin lokal, menggunakan scp..."
    scp -r "$FRONTEND_DIR/dist/"* "${VPS_USER}@${VPS_HOST}:${VPS_TARGET_DIR}/"
fi

# 5. Sesuaikan hak akses di VPS
echo ""
echo "🔒 Mengatur hak akses www-data pada direktori frontend di VPS..."
ssh -o StrictHostKeyChecking=no "${VPS_USER}@${VPS_HOST}" "chown -R www-data:www-data ${VPS_TARGET_DIR} && chmod -R 755 ${VPS_TARGET_DIR}"

echo ""
echo "=========================================="
echo "🎉 DEPLOY FRONTEND SUKSES!"
echo "Akses web Anda di: https://relearn-api.duckdns.org"
echo "=========================================="

