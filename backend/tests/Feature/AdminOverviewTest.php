<?php

namespace Tests\Feature;

use App\Models\Material;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminOverviewTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_open_the_admin_overview(): void
    {
        $this->getJson('/api/v1/admin/overview')->assertUnauthorized();
    }

    public function test_students_are_forbidden(): void
    {
        Sanctum::actingAs(User::factory()->create(['role' => User::ROLE_STUDENT]));

        $this->getJson('/api/v1/admin/overview')->assertForbidden();
    }

    public function test_admins_receive_the_dashboard_aggregates(): void
    {
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);

        User::factory()->count(3)->create(['role' => User::ROLE_STUDENT, 'plan' => User::PLAN_FREE]);
        User::factory()->count(2)->create(['role' => User::ROLE_STUDENT, 'plan' => User::PLAN_PRO]);

        Material::factory()->count(2)->create([
            'user_id' => $admin->id,
            'status' => Material::STATUS_COMPLETED,
        ]);
        Material::factory()->create([
            'user_id' => $admin->id,
            'status' => Material::STATUS_FAILED,
        ]);
        Material::factory()->create([
            'user_id' => $admin->id,
            'status' => Material::STATUS_PROCESSING,
        ]);

        Sanctum::actingAs($admin);

        $response = $this->getJson('/api/v1/admin/overview')
            ->assertOk()
            ->assertJsonPath('users.total', 6)
            ->assertJsonPath('users.free', 3)
            ->assertJsonPath('users.pro', 2)
            ->assertJsonPath('materials.total', 4)
            ->assertJsonPath('materials.failed', 1)
            ->assertJsonPath('materials.processing', 1)
            ->assertJsonCount(6, 'user_growth');

        $this->assertIsNumeric($response->json('users.growth_percent'));
    }

    public function test_admin_accounts_do_not_count_as_free_or_pro_subscribers(): void
    {
        User::factory()->count(2)->create(['role' => User::ROLE_ADMIN, 'plan' => User::PLAN_FREE]);
        User::factory()->create(['role' => User::ROLE_STUDENT, 'plan' => User::PLAN_FREE]);

        Sanctum::actingAs(User::factory()->create(['role' => User::ROLE_ADMIN]));

        $this->getJson('/api/v1/admin/overview')
            ->assertOk()
            ->assertJsonPath('users.total', 4)
            ->assertJsonPath('users.free', 1)
            ->assertJsonPath('users.pro', 0);
    }

    public function test_growth_series_is_cumulative_and_ends_with_the_total(): void
    {
        User::factory()->create([
            'created_at' => now()->subMonths(3),
        ]);
        User::factory()->create([
            'created_at' => now()->subMonth(),
        ]);

        Sanctum::actingAs(User::factory()->create(['role' => User::ROLE_ADMIN]));

        $series = $this->getJson('/api/v1/admin/overview')
            ->assertOk()
            ->json('user_growth');

        $this->assertCount(6, $series);
        $this->assertSame(
            $series[count($series) - 1]['total'],
            User::query()->where('created_at', '<=', now()->endOfMonth())->count()
        );
    }
}
