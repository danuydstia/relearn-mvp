<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $user = $request->user();
        $user->name = $validated['name'];
        $user->save();

        return response()->json($user);
    }

    public function updateAvatar(Request $request): JsonResponse
    {
        $request->validate([
            'avatar' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        $user = $request->user();
        // Menggunakan disk supabase_avatars
        $disk = Storage::disk('supabase_avatars');

        // Hapus avatar lama dari Supabase jika ada
        if ($user->avatar) {
            $oldPath = $this->resolveAvatarPath($user->avatar);
            if ($oldPath && $disk->exists($oldPath)) {
                $disk->delete($oldPath);
            }
        }

        $file = $request->file('avatar');
        $filename = $file->hashName();
        $path = 'avatars/' . $filename;

        $disk->putFileAs('avatars', $file, $filename, 'public');

        $user->avatar = $path;
        $user->save();

        return response()->json([
            'avatar_url' => $disk->url($path),
        ]);
    }

    private function resolveAvatarPath(?string $avatar): ?string
    {
        if (! $avatar) {
            return null;
        }

        if (str_starts_with($avatar, 'http')) {
            return null;
        }

        return str_contains($avatar, '/') ? $avatar : 'avatars/' . $avatar;
    }
}