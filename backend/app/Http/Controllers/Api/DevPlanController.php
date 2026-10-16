<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

/**
 * Development-only helper that flips the authenticated user's plan.
 *
 * The route is registered in routes/api.php exclusively for the `local` and
 * `testing` environments, so it is unreachable in production. Real plan changes
 * must go through the payment webhook flow (see ReLearn_TechStack.md §13.1).
 */
class DevPlanController extends Controller
{
    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'plan' => ['required', Rule::in([User::PLAN_FREE, User::PLAN_PRO])],
        ]);

        $user = $request->user();
        $user->update(['plan' => $validated['plan']]);

        return response()->json($user->fresh());
    }
}
