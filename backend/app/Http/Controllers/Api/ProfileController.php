<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    /**
     * Update the authenticated student's profile.
     *
     * Only the display name is editable: the Edit Profile design has a name
     * field plus an avatar proposal that explicitly defines no upload, and its
     * spec approves no length or character rules beyond "non-empty after
     * trimming spaces". Laravel's `required` rule already rejects whitespace-only
     * strings and TrimStrings runs before validation, so `required|string`
     * expresses exactly the approved rule; `max:255` is the users.name column
     * limit, not an invented one.
     */
    public function update(Request $request): JsonResponse
    {
        $validated =$request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $user = $request->user();$user->name = $validated['name'];$user->save();

        return response()->json($user);
    }

    /**
     * Upload and update the authenticated student's avatar.
     */
    public function updateAvatar(Request $request): JsonResponse
    {
        $request->validate([
            'avatar' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        $user =$request->user();

        // hapus file lama kalau lokal (bukan URL Google)
        if ($user->avatar && ! str_starts_with($user->avatar, 'http')) {
            @unlink(public_path($user->avatar));
        }

        $file =$request->file('avatar');
        $filename =$file->hashName();
        $file->move(public_path('avatars'),$filename);

        $user->avatar = 'avatars/' .$filename;
        $user->save();

        return response()->json(['avatar_url' => $user->avatar_url]);
    }
}