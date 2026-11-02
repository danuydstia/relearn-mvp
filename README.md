<<<<<<< HEAD
# Re:Learn — Panduan Setup Repository

Panduan ini menjelaskan cara menyiapkan repository Re:Learn untuk pengembangan lokal. Ada dua jalur:

- **Inisialisasi pertama kali** dilakukan sekali saja oleh satu orang untuk membuat project Laravel dan React, lalu meng-commit-nya.
- **Onboarding** diikuti oleh semua anggota tim lainnya setelah meng-clone repository yang sudah diinisialisasi.

Jika folder `backend/` dan `frontend/` sudah ada di repository, lewati bagian 3 dan langsung ikuti bagian 4.

## 1. Prasyarat

Install tools berikut:

- [PHP](https://www.php.net/) **8.3 atau lebih baru** (dibutuhkan Laravel 13)
- [Composer](https://getcomposer.org/) 2.x
- [Node.js](https://nodejs.org/) **22 LTS** (Vite membutuhkan versi Node yang cukup baru)
- [PostgreSQL](https://www.postgresql.org/) 16 atau lebih baru
- [Git](https://git-scm.com/)
- [Visual Studio Code](https://code.visualstudio.com/) (atau code editor lain)

### XAMPP / Laragon tidak diperlukan

Project ini tidak membutuhkan XAMPP maupun Laragon. Web server bawaan Laravel (`php artisan serve`) sudah cukup, dan database yang dipakai adalah PostgreSQL, bukan MySQL/MariaDB bawaan XAMPP. Yang penting, perintah `php -v`, `composer -V`, `node -v`, dan `psql --version` semuanya bisa dijalankan dari terminal.

Jika kamu memakai XAMPP atau Laragon hanya sebagai sumber PHP, pastikan versi PHP-nya 8.3 atau lebih baru dan folder PHP tersebut ada di PATH sistem. Di Windows, [Laravel Herd](https://herd.laravel.com) adalah cara termudah untuk mendapatkan PHP dan Composer.

### Ekstensi PHP yang dibutuhkan

Aktifkan ekstensi berikut: `pdo_pgsql`, `pgsql`, `zip`, `mbstring`, `curl`, `openssl`, `fileinfo`, `xml`, dan `tokenizer`.

Cek ekstensi yang sudah aktif:

```bash
php -m
```

Di Windows, beberapa ekstensi ini nonaktif secara default. Buka `php.ini` (cari lokasinya dengan `php --ini`), hapus tanda `;` di depan baris seperti `extension=pdo_pgsql`, `extension=pgsql`, dan `extension=zip`, lalu buka terminal baru. Jika dilewati, `php artisan migrate` akan gagal dengan error "could not find driver".

## 2. Clone Repository

```bash
git clone https://github.com/certifiedsteven/ReLearn.git
cd ReLearn
```

## 3. Inisialisasi Pertama Kali (satu orang saja)

Lewati bagian ini jika `backend/` dan `frontend/` sudah ada di repository.

### 3.1 Buat `.gitignore` di root repository

Kita memakai **satu `.gitignore` di root** untuk seluruh project. Buat file bernama `.gitignore` di root repository (sejajar dengan folder `backend` dan `frontend`) dengan isi berikut:

```text
# Dependencies
node_modules/
vendor/

# Environment (rahasia), tetapi template tetap di-commit
.env
.env.*
!.env.example

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Frontend build
dist/
dist-ssr/
*.local
.fleet/

# Laravel build / generated files
backend/public/build/
backend/public/hot
backend/public/storage
backend/public/fonts-manifest.dev.json

# Laravel storage
backend/storage/*.key
backend/storage/pail

# Laravel
auth.json
_ide_helper.php
Homestead.json
Homestead.yaml

# PHP / PHPUnit
.phpunit.result.cache
.phpunit.cache

# Database lokal
*.sqlite

# IDE / Editor
.vscode/*
!.vscode/extensions.json
.idea/
.nova/
.zed/
.cursor/
.phpactor.json

# OS
.DS_Store
Thumbs.db

# Visual Studio
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Lain-lain
/.codex
```

Catatan penting tentang file ini:

- Path Laravel diawali `backend/` karena pola yang mengandung `/` hanya berlaku dari lokasi file `.gitignore` tersebut. Pola tanpa `/` seperti `vendor/`, `node_modules/`, dan `*.log` berlaku di semua kedalaman folder.
- `.vscode/*` (bukan `.vscode/`) dipakai agar pengecualian `!.vscode/extensions.json` bisa bekerja. Git tidak bisa mengecualikan file di dalam folder yang di-ignore secara utuh.
- `!.env.example` wajib ada. Tanpa baris ini, `.env.*` juga akan meng-ignore template `.env.example`, sehingga anggota tim lain tidak bisa menyalinnya.

### 3.2 Backend

Dari root repository, buat project Laravel di folder `backend`:

```bash
composer create-project laravel/laravel backend
cd backend
```

`create-project` sudah membuat `.env` dan meng-generate app key, jadi tidak perlu menyalin manual. Perintah ini juga bisa membuat file `database/database.sqlite`; file ini di-ignore oleh git dan boleh dihapus.

Install dukungan API (ini juga meng-install Laravel Sanctum):

```bash
php artisan install:api
```

Lalu buka `app/Models/User.php` dan pastikan model tersebut memakai trait `Laravel\Sanctum\HasApiTokens` agar token bisa dibuat untuk user.

konfigurasi google auth



### 3.3 Frontend

Kembali ke root repository, lalu buat aplikasi React dengan Vite:

```bash
cd ..
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm install axios react-router-dom lucide-react
```

### 3.4 Hapus `.gitignore` bawaan di `backend/` dan `frontend/`

Karena sudah memakai `.gitignore` root, hapus dua file berikut:

- `backend/.gitignore`
- `frontend/.gitignore`

**Hapus hanya kedua file tersebut**, yaitu yang letaknya langsung di dalam `backend/` dan `frontend/`, sejajar dengan `composer.json` dan `package.json`. **Jangan hapus** file `.gitignore` kecil yang ada di dalam subfolder Laravel:

- `backend/storage/` (termasuk `app/`, `framework/`, dan `logs/`)
- `backend/bootstrap/cache/`
- `backend/database/`

File-file kecil itu berfungsi menjaga folder kosong tetap ada di git sambil meng-ignore isinya (cache, view yang dikompilasi, log, dan `database.sqlite`). Aturan di `.gitignore` root tidak mencakup hal tersebut.

### 3.5 Siapkan template environment untuk tim

Langkah ini yang membuat onboarding berjalan mulus bagi anggota tim lain.

**Backend.** Di `backend/.env.example`, ubah `APP_NAME` dan ganti pengaturan database dengan PostgreSQL, lalu tambahkan variabel AI. Nilai rahasia dibiarkan kosong:

```env
APP_NAME=Relearn
APP_URL=http://localhost:8000

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=relearn
DB_USERNAME=
DB_PASSWORD=

SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database
FILESYSTEM_DISK=local

AI_PROVIDER=openrouter
OPENROUTER_API_KEY=
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=
```

Baris lain dari bawaan Laravel boleh dibiarkan. Baris `VITE_APP_NAME="${APP_NAME}"` tidak dipakai karena frontend adalah project terpisah, jadi boleh dihapus. Variabel `MEMCACHED_*`, `REDIS_*`, dan `AWS_*` juga belum dipakai dan boleh dibiarkan kosong sampai fiturnya dibutuhkan.

**Frontend.** Template Vite tidak membuat `.env.example`, jadi buat sendiri. Di dalam folder `frontend/` (sejajar dengan `package.json`), buat file baru bernama `.env.example` dengan isi:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

Lalu buat salinan kerjanya:

```bash
cd frontend
cp .env.example .env
```

> Di Windows Command Prompt, gunakan `copy .env.example .env` sebagai pengganti `cp`.

Pastikan nama file persis `.env`, bukan `.env.txt`. Windows kadang menambahkan ekstensi tanpa memberi tahu.

### 3.6 Tambahkan prefix versi API dan route health check

`install:api` membuat `backend/routes/api.php` dengan prefix `/api`. Frontend memakai `/api/v1`, jadi bungkus route dalam grup `v1`. Tambahkan ini di `routes/api.php`:

```php
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::get('/health', fn () => response()->json(['status' => 'ok']));

    // Route v1 berikutnya ditulis di dalam grup ini.
});
```

### 3.7 Buat API client bersama

Buat file `frontend/src/lib/api.js` agar semua pemanggilan API memakai base URL yang sama dan meminta respons JSON dari Laravel. Template Vite tidak menyertakan folder `lib`, jadi buat dulu (klik kanan folder `src` di VS Code lalu New Folder, atau jalankan `mkdir src/lib` dari dalam `frontend/`), kemudian tambahkan file berikut:

```js
import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { Accept: 'application/json' },
})
```

Header `Accept: application/json` penting: tanpanya, Laravel bisa membalas error validasi dan autentikasi dengan redirect atau HTML, bukan JSON.

Nama folder tidak baku. Banyak project React memakai `services/` atau `api/`. Jika kamu mengganti nama folder, sesuaikan path import-nya.

### 3.8 Commit

Sebelum commit, jalankan pengecekan berikut dari root repository:

```bash
git status
git ls-files --others --exclude-standard
```

Yang muncul seharusnya hanya file yang memang ingin ditambahkan: source code, lockfile (`composer.lock` dan `package-lock.json`), dan file `.env.example`. Jika muncul isi `backend/storage/framework/`, `backend/bootstrap/cache/`, atau file `.sqlite`, berarti `.gitignore` di subfolder Laravel terhapus atau aturan di 3.1 kurang.

Setelah itu commit dan push. Anggota tim lain bisa mengikuti bagian 4.

## 4. Onboarding (anggota tim lainnya)

Gunakan bagian ini setelah meng-clone repository yang sudah berisi `backend/` dan `frontend/`. Jangan jalankan `composer create-project` atau `npm create vite` lagi.

Backend:

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Frontend:

```bash
cd ../frontend
npm install
cp .env.example .env
```

> Di Windows Command Prompt, gunakan `copy .env.example .env` sebagai pengganti `cp`.

## 5. Konfigurasi Database

Setiap developer memakai database lokalnya masing-masing. Buat database PostgreSQL bernama `relearn`, misalnya lewat `psql`:

```sql
CREATE DATABASE relearn;
```

Lalu isi kredensial milikmu sendiri di `backend/.env`:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=relearn
DB_USERNAME=username_postgres_kamu
DB_PASSWORD=password_postgres_kamu
```

Jalankan migrasi dari folder `backend`:

```bash
php artisan migrate
```

Perintah ini juga membuat tabel `jobs`, `cache`, dan `sessions` yang dipakai oleh queue, cache, dan session Laravel.

## 6. Konfigurasi Environment Variables

Di `backend/.env`, isi API key OpenRouter milikmu. Model belum diputuskan, jadi `OPENROUTER_MODEL` boleh dikosongkan sampai tim memilih:

```env
AI_PROVIDER=openrouter
OPENROUTER_API_KEY=api_key_openrouter_kamu
```

`frontend/.env` seharusnya sudah berisi URL API hasil salinan dari template:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

### Kenapa ada dua file `.env`?

Backend dan frontend adalah dua aplikasi terpisah, dan masing-masing membaca file environment-nya sendiri:

- **`backend/.env`** dibaca oleh Laravel di server. Isinya rahasia seperti password database, API key OpenRouter, dan nantinya kunci server Midtrans. Nilai ini tidak boleh sampai ke browser.
- **`frontend/.env`** dibaca oleh Vite. Semua variabel berawalan `VITE_` akan ikut masuk ke JavaScript yang dikirim ke browser setiap pengguna, jadi file ini hanya boleh berisi nilai publik seperti URL API.

Memisahkan keduanya melindungi rahasia dari kebocoran tak sengaja. **Jangan menyalin isi `backend/.env` ke `frontend/.env`.**

Aturan untuk file environment:

- Simpan kunci rahasia hanya di file `.env`. Jangan pernah commit file `.env`.
- Jangan pernah menaruh kunci rahasia di `frontend/.env`.
- Setiap kali menambah variabel baru di `.env`, tambahkan juga (tanpa nilai rahasianya) ke `.env.example` yang sesuai dalam commit yang sama.

## 7. Pendekatan Autentikasi

Untuk saat ini project memakai **Laravel Sanctum dengan bearer token**: frontend login, menerima token, lalu mengirimkannya lewat header `Authorization: Bearer`. Cara ini cocok karena frontend dan backend berjalan di port yang berbeda, dan tidak butuh konfigurasi cookie atau CSRF tambahan saat development.

Jika nanti tim beralih ke autentikasi SPA berbasis cookie, dibutuhkan pengaturan Sanctum stateful domains, credentials pada konfigurasi CORS, dan `withCredentials` di axios. Catat keputusannya di sini jika berubah.

##  Setup Google OAuth

### Prasyarat

- Akun Google (boleh akun pribadi atau akun khusus project)
- Akses ke [Google Cloud Console](https://console.cloud.google.com/)

> **Catatan:** Untuk development, akun pribadi sudah cukup. Untuk production, disarankan pakai akun Google khusus project (misal `relearn.dev@gmail.com`) agar email pribadi tidak terekspos ke user.

### 1 Buat Project di Google Cloud Console

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Login dengan akun Google
3. Klik dropdown project di atas → **NEW PROJECT**
4. Isi:
   - **Project name**: `ReLearn`
   - **Location**: `No organization` (kecuali kamu punya Google Workspace)
5. Klik **CREATE**
6. Tunggu beberapa detik, lalu **pilih project** yang baru dibuat

### 2 Setup OAuth Consent Screen

1. Di sidebar kiri, buka **APIs & Services** → **OAuth consent screen**
2. Pilih **User Type**:
   - **External** ← pilih ini untuk development
   - Internal (hanya jika kamu punya Google Workspace)
3. Klik **CREATE**
4. Isi **App Information**:
   - **App name**: `ReLearn`
   - **User support email**: pilih emailmu dari dropdown
5. Isi **Developer contact information**:
   - **Email addresses**: emailmu
6. Klik **SAVE AND CONTINUE**
7. Di step **Scopes**, klik **SAVE AND CONTINUE** (biarkan default)
8. Di step **Test users**, klik **SAVE AND CONTINUE** (kita tambahkan nanti)
9. Di step **Summary**, klik **BACK TO DASHBOARD**

### 3 Tambahkan Test Users (WAJIB!)

Selama OAuth masih berstatus **Testing**, hanya akun yang terdaftar sebagai Test Users yang bisa login. Tanpa langkah ini, login Google akan gagal dengan error `access_denied`.

1. Masih di halaman **OAuth consent screen**
2. Scroll ke bagian **Test users**
3. Klik **+ ADD USERS**
4. Masukkan **email Google yang akan dipakai login** (emailmu sendiri, dan email anggota tim)
5. Klik **SAVE**


### 4 Buat OAuth Client ID

1. Di sidebar kiri, buka **APIs & Services** → **Credentials**
2. Klik **+ CREATE CREDENTIALS** di atas → pilih **OAuth client ID**
3. **Application type**: pilih **Web application**
4. **Name**: `ReLearn Web` (atau nama bebas)
5. Di bagian **Authorized JavaScript origins**, klik **+ ADD URI**, isi:
   ```
   http://localhost:5173
   ```
6. Di bagian **Authorized redirect URIs**, klik **+ ADD URI**, isi:
   ```
   http://localhost:8000/api/v1/auth/google/callback
   ```
7. Klik **CREATE**

### 5 Salin Client ID & Client Secret

Setelah klik **CREATE**, akan muncul popup berisi:

- **Client ID** — contoh: `123456789-abc.apps.googleusercontent.com`
- **Client Secret** — contoh: `GOCSPX-xxxxxxxxxxxxxxxx`

**Salin keduanya sekarang.** Client Secret hanya ditampilkan sekali.

> **Kalau lupa menyimpan:** Buka **Credentials** → klik OAuth Client ID-mu → klik **RESET SECRET** untuk generate secret baru.

### 6 Isi `.env` Laravel

1. Copy `backend/.env.example` menjadi `backend/.env` (kalau belum ada):
   ```bash
   cd backend
   copy .env.example .env
   ```
   (Git Bash: `cp .env.example .env`)

2. Buka `backend/.env`, isi:
   ```env
   GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxx
   GOOGLE_REDIRECT_URI=http://localhost:8000/api/v1/auth/google/callback
   FRONTEND_URL=http://localhost:5173
   ```

3. Clear config cache:
   ```bash
   php artisan config:clear
   ```

4. Restart backend (`Ctrl+C` di terminal `php artisan serve`, lalu jalankan lagi).



## Install CA Certificate (Windows)

Tanpa CA certificate, PHP akan gagal verifikasi SSL saat mengakses API Google, dengan error:

```
cURL error 60: SSL certificate problem: unable to get local issuer certificate
```

### 1 Cek Lokasi PHP

Jalankan di terminal:

```bash
php --ini
```

Output menunjukkan lokasi `php.ini`, contoh:
```
Loaded Configuration File: C:\php\php-8.4.26\php.ini
```

Catat folder PHP-nya (contoh: `C:\php\php-8.4.26`).

### 2 Download `cacert.pem`

**Cara A — Manual:**
1. Buka https://curl.se/ca/cacert.pem
2. Klik kanan di halaman → **Save As...**
3. Simpan ke: `C:\php\php-8.4.26\extras\ssl\cacert.pem`
   (buat folder `extras\ssl` dulu jika belum ada)

> Sesuaikan path `C:\php\php-8.4.26` dengan lokasi PHP-mu.


### 3 Edit `php.ini`

1. Buka `php.ini` dengan Notepad atau VS Code (jalankan sebagai Administrator jika perlu)
2. Cari baris `;curl.cainfo =` (biasanya nonaktif dengan `;` di depan)
3. Ubah menjadi:
   ```ini
   curl.cainfo = "C:\php\php-8.4.26\extras\ssl\cacert.pem"
   ```
4. Cari baris `;openssl.cafile =`
5. Ubah menjadi:
   ```ini
   openssl.cafile = "C:\php\php-8.4.26\extras\ssl\cacert.pem"
   ```
6. **Save** file

### 4 Restart Terminal & Backend

1. **Tutup semua terminal** (CMD, PowerShell, VS Code, terminal `php artisan serve`)
2. Buka terminal baru
3. Cek konfigurasi:
   ```bash
   php -i | findstr "cainfo cafile"
   ```
   Harus muncul:
   ```
   curl.cainfo => C:\php\php-8.4.26\extras\ssl\cacert.pem
   openssl.cafile => C:\php\php-8.4.26\extras\ssl\cacert.pem
   ```
4. Jalankan backend:
   ```bash
   cd backend
   php artisan config:clear
   php artisan serve
   ```


##  Setup Supabase
1. jalankan perintah 
   ```bash
   composer require league/flysystem-aws-s3-v3 "^3.0" --with-all-dependencies
   ```
2. sesuaikan konfig di .env


## 🐍 AI Service Setup (Python FastAPI)

Folder `ai-service` adalah microservice berbasis Python yang bertugas menerima file, memprosesnya menggunakan Google Gemini AI, dan mengirimkan hasilnya kembali ke Laravel.

### Prasyarat
- Python 3.10 atau versi lebih baru.
- API Key Google Gemini (dapatkan di [Google AI Studio](https://aistudio.google.com/)).
- Pastikan server Laravel (Backend) sudah berjalan di `http://127.0.0.1:8000`.

### Langkah-langkah Instalasi

**1. Masuk ke folder ai-service**
```bash
cd ai-service
```


**2. Buat dan aktifkan Virtual Environment**
```bash 
   python -m venv venv
   venv\Scripts\activate
```


**3. Install semua dependencies**
```bash 
   pip install -r requirements.txt
```

**4. Konfigurasi Environment Variables (.env)**
isi GEMINI_API_KEY dengan API Key dari [google](https://aistudio.google.com/)
dan isi LARAVEL_INTERNAL_KEY


**5. Jalankan Server AI**
```bash
uvicorn ai_service:app --host 127.0.0.1 --port 8001 --reload
```


## 8. Menjalankan Aplikasi

Buka dua terminal dari root repository.

**Terminal 1 — Backend**

```bash
cd backend
php artisan serve
```

API Laravel akan tersedia di `http://localhost:8000`.

**Terminal 2 — Frontend**

```bash
cd frontend
npm run dev
```

Server development Vite akan tersedia di `http://localhost:5173`.

**Terminal 3 — AI**
```bash
uvicorn ai_service:app --host 127.0.0.1 --port 8001 --reload
```


### Buka link yang mana?

**Selalu buka frontend di `http://localhost:5173`.** Itu adalah aplikasi yang dilihat pengguna.

Backend di `http://localhost:8000` hanya API. Aplikasi React memanggilnya di belakang layar, jadi backend tidak dibuka sebagai halaman. Jika dibuka langsung, kamu hanya akan melihat halaman welcome bawaan Laravel, dan route API seperti `/api/v1/health` mengembalikan JSON mentah (berguna untuk debugging, tetapi bukan aplikasinya).

Kedua server tetap harus berjalan karena frontend tidak bisa memuat data tanpa API.

### Pengecekan cepat

Buka `http://localhost:8000/api/v1/health` di browser. Hasilnya harus `{"status":"ok"}`. Untuk memastikan frontend bisa menjangkau backend, panggil `api.get('/health')` dari salah satu komponen dan cek tab Network di browser: harus ada respons 200.

## 9. Masalah Umum

- **"could not find driver" saat migrate:** ekstensi `pdo_pgsql` belum aktif. Lihat bagian 1.
- **404 di `/api/v1/...`:** route belum dibungkus grup prefix `v1`. Lihat bagian 3.6.
- **Error CORS di browser:** jalankan `php artisan config:publish cors` di `backend/`, lalu pastikan `http://localhost:5173` diizinkan di `config/cors.php`.
- **Frontend masih memakai URL API lama:** Vite hanya membaca `.env` saat dijalankan. Hentikan dan jalankan ulang `npm run dev` setelah mengubahnya.
- **Laravel membalas halaman HTML, bukan error JSON:** request tidak memiliki header `Accept: application/json`. Gunakan `api` client dari bagian 3.7.
- **File `.env` muncul di `git status`:** cek apakah `.gitignore` root sudah benar dan apakah `.env` pernah ter-commit sebelumnya. Jika sudah pernah ter-commit, `.gitignore` tidak akan menghapusnya dari git; jalankan `git rm --cached backend/.env`. Kunci rahasia yang sempat ter-push ke repository harus dianggap bocor dan diganti (rotate).

## 10. Struktur Repository

Setelah setup, struktur repository kurang lebih seperti ini:

```text
ReLearn/
├── .gitignore
├── backend/
│   ├── app/
│   ├── bootstrap/
│   ├── config/
│   ├── database/
│   ├── routes/
│   ├── .env.example
│   └── ...
├── frontend/
│   ├── public/
│   ├── src/
│   │   └── lib/
│   │       └── api.js
│   ├── .env.example
│   ├── package.json
│   └── ...
└── README.md
```

## 11. Panduan Git

- Jangan commit file `.env` atau API key.
- Commit file `.env.example` dan selalu perbarui isinya.
- Commit source code dan lockfile dependensi (`composer.lock` dan `package-lock.json`).
- Gunakan satu `.gitignore` di root. Jangan menghapus `.gitignore` kecil di dalam `backend/storage/`, `backend/bootstrap/cache/`, dan `backend/database/`.
- Rapikan perubahan backend dan frontend di folder masing-masing.
- Gunakan feature branch dan pull request, bukan commit langsung ke branch utama.

## 12. Akan Datang

Hal-hal berikut bagian dari rencana Re:Learn tetapi belum dibutuhkan untuk menjalankan aplikasi saat ini. Tambahkan langkah setup di sini ketika modulnya mulai dikerjakan:

- **Penyimpanan file:** disk lokal cukup di awal; pindah ke disk S3-compatible (MinIO, Cloudflare R2, atau AWS S3) lewat `.env` saat fitur upload materi dibuat.
- **Ekstraksi teks:** `smalot/pdfparser` untuk PDF, `phpoffice/phpword` untuk DOCX, dan `ZipArchive` bawaan PHP untuk PPTX.
- **AI Service Layer:** file `config/ai.php` dan satu class client OpenRouter yang dilewati semua fitur AI, beserta pencatatan penggunaan dan kuota.
- **Real-time:** Laravel Reverb untuk kuis kolaboratif.
- **Pembayaran:** kunci Midtrans sandbox dan URL tunnel publik (misalnya ngrok) untuk menguji webhook.
=======
# relearn-mvp
>>>>>>> 61f317d41c7a04dc7df14648c39e825e39e2d843
