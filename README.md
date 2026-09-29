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
git clone https://github.com/certifiedsteven/Re-Learn.git
cd Re-Learn
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

**Terminal 3 — Queue worker (opsional untuk saat ini)**

Jalankan ini ketika fitur seperti ekstraksi dokumen atau generate AI sudah berjalan sebagai background job:

```bash
cd backend
php artisan queue:work
```

Restart worker setiap kali kode job berubah.

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
Re-Learn/
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