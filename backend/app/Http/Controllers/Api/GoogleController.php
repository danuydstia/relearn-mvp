<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;

class GoogleController extends Controller
{
    /**
     * Redirect ke halaman login Google.
     */
    public function redirect()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    /**
     * Handle callback dari Google.
     */
    public function callback()
    {
        $frontendUrl = config('app.frontend_url', 'http://localhost:5173');

        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
        } catch (\Exception $e) {
            // DEBUG: log error asli
            Log::error('Google OAuth Error: ' . $e->getMessage());
            Log::error($e->getTraceAsString());

            return redirect()->to($frontendUrl . '/auth/google-callback?' . http_build_query([
                'status' => 'error',
                'message' => $e->getMessage(),   
            ]));
        }

        // Cari user berdasarkan provider dan provider_id
        $user = User::where('provider', 'google')
                    ->where('provider_id', $googleUser->getId())
                    ->first();

        // Jika belum ada, cek berdasarkan email
        if (!$user) {
            $user = User::where('email', $googleUser->getEmail())->first();

            if ($user) {
                // Email sudah terdaftar, update dengan data Google
                $user->update([
                    'provider' => 'google',
                    'provider_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar(),
                ]);
            } else {
                // Buat user baru
                $user = User::create([
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'password' => null,
                    'role' => User::ROLE_STUDENT,
                    'provider' => 'google',
                    'provider_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar(),
                    'email_verified_at' => now(),
                ]);
            }
        }

        // Buat token Sanctum
        $token = $user->createToken('auth')->plainTextToken;

        // Redirect ke frontend dengan token
        return redirect()->to($frontendUrl . '/auth/google-callback?' . http_build_query([
            'token' => $token,
            'status' => 'success',
        ]));
    }
}