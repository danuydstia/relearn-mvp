<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Material;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;

class OverviewController extends Controller
{
    /**
     * Aggregates for the admin dashboard.
     *
     * Only figures that have a backing table are returned: accounts, the monthly
     * growth series and material processing state. Revenue, AI token usage and
     * reports stay as illustrative content on the frontend until those tables
     * exist.
     */
    public function index(): JsonResponse
    {
        $now = Carbon::now();

        $students = User::query()->where('role', User::ROLE_STUDENT);

        $growth = $this->monthlyGrowth($now);
        $previousMonthTotal = $growth[count($growth) - 2]['total'] ?? 0;
        $currentTotal = $growth[count($growth) - 1]['total'] ?? 0;

        return response()->json([
            'generated_at' => $now->toIso8601String(),
            'users' => [
                'total' => User::query()->count(),
                'free' => (clone $students)->where('plan', User::PLAN_FREE)->count(),
                'pro' => (clone $students)->where('plan', User::PLAN_PRO)->count(),
                'new_this_month' => User::query()
                    ->where('created_at', '>=', $now->copy()->startOfMonth())
                    ->count(),
                'growth_percent' => $previousMonthTotal > 0
                    ? round((($currentTotal - $previousMonthTotal) / $previousMonthTotal) * 100, 1)
                    : 0.0,
            ],
            'user_growth' => $growth,
            'materials' => [
                'total' => Material::query()->count(),
                'processing' => Material::query()
                    ->where('status', Material::STATUS_PROCESSING)
                    ->count(),
                'failed' => Material::query()
                    ->where('status', Material::STATUS_FAILED)
                    ->count(),
            ],
        ]);
    }

    /**
     * Cumulative account totals for the trailing six months.
     *
     * Aggregated in PHP so the same code runs on PostgreSQL and on the SQLite
     * database the test suite uses.
     *
     * @return list<array{month: string, label: string, total: int}>
     */
    private function monthlyGrowth(Carbon $now): array
    {
        $start = $now->copy()->startOfMonth()->subMonths(5);

        $buckets = User::query()
            ->where('created_at', '>=', $start)
            ->get(['created_at'])
            ->countBy(fn (User $user): string => $user->created_at->format('Y-m'));

        $total = User::query()
            ->where('created_at', '<', $start)
            ->count();

        $growth = [];

        for ($offset = 0; $offset < 6; $offset++) {
            $month = $start->copy()->addMonths($offset);
            $key = $month->format('Y-m');
            $total += $buckets->get($key, 0);

            $growth[] = [
                'month' => $key,
                'label' => $month->format('M'),
                'total' => $total,
            ];
        }

        return $growth;
    }
}
