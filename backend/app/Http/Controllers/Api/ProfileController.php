<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $user = $request->user();
        $user->name = $validated['name'];
        $user->save();

        return response()->json($user);
    }
}
