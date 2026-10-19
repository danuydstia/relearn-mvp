<?php

return [

    'default' => env('FILESYSTEM_DISK', 'local'),

    'disks' => [

        'local' => [
            'driver' => 'local',
            'root' => storage_path('app/private'),
            'serve' => true,
            'throw' => false,
            'report' => false,
        ],

        'public' => [
            'driver' => 'local',
            'root' => storage_path('app/public'),
            'url' => rtrim(env('APP_URL', 'http://localhost'), '/').'/storage',
            'visibility' => 'public',
            'throw' => false,
            'report' => false,
        ],

        's3' => [
            'driver' => 's3',
            'key' => env('AWS_ACCESS_KEY_ID'),
            'secret' => env('AWS_SECRET_ACCESS_KEY'),
            'region' => env('AWS_DEFAULT_REGION'),
            'bucket' => env('AWS_BUCKET'),
            'url' => env('AWS_URL'),
            'endpoint' => env('AWS_ENDPOINT'),
            'use_path_style_endpoint' => env('AWS_USE_PATH_STYLE_ENDPOINT', false),
            'throw' => false,
            'report' => false,
        ],

        // 1. DISK UNTUK AVATAR
        'supabase_avatars' => [
            'driver' => 's3',
            'key' => env('SUPABASE_S3_ACCESS_KEY_ID'),
            'secret' => env('SUPABASE_S3_SECRET_ACCESS_KEY'),
            'region' => env('SUPABASE_S3_REGION'),
            'bucket' => env('SUPABASE_AVATARS_BUCKET'),
            'endpoint' => env('SUPABASE_S3_ENDPOINT'),
            'use_path_style_endpoint' => true,
            'visibility' => 'public',
            'throw' => false,
            'url' => env('SUPABASE_URL') . '/storage/v1/object/public/' . env('SUPABASE_AVATARS_BUCKET'),
        ],

        // 2. DISK UNTUK MATERI
        'supabase_materials' => [
            'driver' => 's3',
            'key' => env('SUPABASE_S3_ACCESS_KEY_ID'),
            'secret' => env('SUPABASE_S3_SECRET_ACCESS_KEY'),
            'region' => env('SUPABASE_S3_REGION'),
            'bucket' => env('SUPABASE_MATERIALS_BUCKET'),
            'endpoint' => env('SUPABASE_S3_ENDPOINT'),
            'use_path_style_endpoint' => true,
            'visibility' => 'public',
            'throw' => false,
            'url' => env('SUPABASE_URL') . '/storage/v1/object/public/' . env('SUPABASE_MATERIALS_BUCKET'),
        ],

    ],

    'links' => [
        public_path('storage') => storage_path('app/public'),
    ],

];