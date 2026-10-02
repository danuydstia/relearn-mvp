<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\GoogleController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    // ===== Health check =====
    Route::get('/health', fn () => response()->json(['status' => 'ok']));

    //Autentikasi 
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login',    [AuthController::class, 'login']);
    //Google OAuth
    Route::get('/auth/google/redirect', [GoogleController::class, 'redirect']);
    Route::get('/auth/google/callback', [GoogleController::class, 'callback']);

    // ===== Butuh login =====
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/auth/me',      [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);
    });
});