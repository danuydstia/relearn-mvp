# Gunakan base image resmi PHP 8.3 CLI sesuai spesifikasi composer.json ("php": "^8.3")
FROM php:8.3-cli

# Set working directory di dalam container
WORKDIR /var/www/html

# Install dependensi sistem yang dibutuhkan (libpq-dev untuk PostgreSQL, zip, git, curl, dll.)
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    curl \
    unzip \
    libpq-dev \
    libzip-dev \
    libicu-dev \
    libpng-dev \
    libonig-dev \
    && rm -rf /var/lib/apt/lists/*

# Install ekstensi PHP yang dibutuhkan (pdo_pgsql & pgsql untuk Vercel Postgres, zip, bcmath, pcntl, intl, opcache)
RUN docker-php-ext-install -j$(nproc) \
    pdo_pgsql \
    pgsql \
    zip \
    bcmath \
    pcntl \
    intl \
    opcache

# Salin Composer binary resmi
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Salin file konfigurasi dependensi terlebih dahulu untuk memanfaatkan Docker layer caching
COPY composer.json composer.lock ./

# Install dependensi PHP tanpa dev & generate autoloader
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist --no-interaction

# Salin seluruh source code project backend
COPY . .

# Jalankan composer install final dengan optimize autoloader
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Berikan hak akses (permissions) agar folder storage dan bootstrap/cache writeable
RUN mkdir -p storage/framework/cache/data \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Expose default port (Render akan menggunakan environment variable $PORT secara dinamis)
EXPOSE 8000

# Perintah CMD untuk menjalankan server Laravel pada host 0.0.0.0 dan mendengarkan port dari $PORT Render
CMD ["sh", "-c", "php artisan serve --host=0.0.0.0 --port=${PORT:-8000}"]

