<?php

use App\Http\Controllers\Api\Admin\OverviewController as AdminOverviewController;
use App\Http\Controllers\Api\Admin\UserController as AdminUserController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DevPlanController;
use App\Http\Controllers\Api\GoogleController;
use App\Http\Controllers\Api\MaterialController;
use App\Http\Controllers\Api\LearningPathController; // <-- Tambahan Import
use App\Http\Controllers\Api\ProfileController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    // ===== Health check =====
    Route::get('/health', fn () => response()->json(['status' => 'ok']));

    // Autentikasi
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);
    // Google OAuth
    Route::get('/auth/google/redirect', [GoogleController::class, 'redirect']);
    Route::get('/auth/google/callback', [GoogleController::class, 'callback']);

    // ===== Butuh login =====
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        // Profile — the display name shown on the Profile screen.
        Route::patch('/profile', [ProfileController::class, 'update']);
        Route::post('/profile/avatar', [ProfileController::class, 'updateAvatar']);

        // Materials
        Route::get('/materials', [MaterialController::class, 'index']);
        Route::post('/materials', [MaterialController::class, 'store']);
        Route::get('/materials/{material}', [MaterialController::class, 'show']);
        Route::delete('/materials/{material}', [MaterialController::class, 'destroy']);

        // ===== LMS (Learning Path) =====
        // 1. Mengambil data materi (Modul & Topik + Progress)
        Route::get('/materials/{material}/learning-path', [LearningPathController::class, 'show']);
        
        // 2. Menandai topik telah selesai dibaca
        Route::post('/materials/{material}/topics/{topic}/complete', [LearningPathController::class, 'completeTopic']);

        // 3. Endpoint untuk mengambil kuis
        Route::get('/materials/{material}/quiz', [LearningPathController::class, 'getQuiz']);
        Route::post('/materials/{material}/quiz/attempt', [LearningPathController::class, 'saveQuizAttempt']);
        // Admin — desktop console, admin role only.
        Route::middleware('admin')->prefix('admin')->group(function () {
            Route::get('/overview', [AdminOverviewController::class, 'index']);
            Route::get('/users', [AdminUserController::class, 'index']);
        });
    });

    // ===== INTERNAL API (Untuk dipanggil oleh Python/FastAPI) =====
    // Route ini di luar auth:sanctum karena dipanggil oleh server, bukan user langsung.
    // Sebaiknya tambahkan middleware khusus (misal: API Key) agar aman di production.
    Route::post('/materials/{material}/learning-path', [LearningPathController::class, 'store']);

    // ===== Khusus development: ganti plan tanpa pembayaran =====
    // Tidak pernah terdaftar di production, jadi tidak bisa disalahgunakan.
    if (app()->environment(['local', 'testing'])) {
        Route::middleware('auth:sanctum')->group(function () {
            Route::put('/dev/plan', [DevPlanController::class, 'update']);
        });
    }
});