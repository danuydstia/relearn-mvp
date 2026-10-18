<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /** Rows per page when the request does not ask for a size. */
    private const PER_PAGE_DEFAULT = 10;

    /**
     * Largest page the admin table may request.
     *
     * The design offers "10 per page"; a few larger sizes keep the control
     * useful without letting one request pull the whole table.
     */
    private const PER_PAGE_MAX = 50;

    /**
     * Paginated account list for the admin Users screen (design 10:62689).
     *
     * `data` is the filtered page the table renders. `summary` is deliberately
     * unfiltered: the four cards describe the whole platform, while the table
     * beneath them narrows.
     */
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
            'role' => ['nullable', Rule::in([User::ROLE_STUDENT, User::ROLE_ADMIN])],
            'plan' => ['nullable', Rule::in([User::PLAN_FREE, User::PLAN_PRO])],
            'status' => ['nullable', Rule::in([User::STATUS_ACTIVE, User::STATUS_SUSPENDED])],
            'sort' => ['nullable', Rule::in(['name', 'email', 'created_at'])],
            'direction' => ['nullable', Rule::in(['asc', 'desc'])],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:'.self::PER_PAGE_MAX],
        ]);

        $query = User::query();

        $this->applySearch($query, $validated['search'] ?? null);

        if (! empty($validated['role'])) {
            $query->where('role', $validated['role']);
        }

        // `plan` is matched against the stored column, so the Pro filter returns
        // actual subscriptions. Admins display as Pro but hold none.
        if (! empty($validated['plan'])) {
            $query->where('plan', $validated['plan']);
        }

        if (! empty($validated['status'])) {
            $query->where('status', $validated['status']);
        }

        $sort = $validated['sort'] ?? 'created_at';
        $direction = $validated['direction'] ?? ($sort === 'created_at' ? 'desc' : 'asc');

        $paginator = $query
            ->orderBy($sort, $direction)
            ->orderBy('id')
            ->paginate($validated['per_page'] ?? self::PER_PAGE_DEFAULT);

        return response()->json([
            'data' => $paginator->items(),
            'meta' => [
                'total' => $paginator->total(),
                'page' => $paginator->currentPage(),
                'per_page' => $paginator->perPage(),
                'last_page' => $paginator->lastPage(),
                'from' => $paginator->firstItem(),
                'to' => $paginator->lastItem(),
            ],
            'summary' => [
                'total' => User::query()->count(),
                'active' => User::query()->where('status', User::STATUS_ACTIVE)->count(),
                'suspended' => User::query()->where('status', User::STATUS_SUSPENDED)->count(),
                'pro' => User::query()
                    ->where('role', User::ROLE_STUDENT)
                    ->where('plan', User::PLAN_PRO)
                    ->count(),
            ],
        ]);
    }

    /**
     * Narrow the list to accounts whose name or email contains the needle.
     *
     * Written with LOWER(...) LIKE so the same query runs on PostgreSQL and on
     * the SQLite database the test suite uses; PostgreSQL's ILIKE has no
     * equivalent there.
     */
    private function applySearch(Builder $query, ?string $search): void
    {
        $needle = Str::lower(trim((string) $search));

        if ($needle === '') {
            return;
        }

        $query->where(function (Builder $query) use ($needle): void {
            $query->whereRaw('LOWER(name) LIKE ?', ["%{$needle}%"])
                ->orWhereRaw('LOWER(email) LIKE ?', ["%{$needle}%"]);
        });
    }
}
