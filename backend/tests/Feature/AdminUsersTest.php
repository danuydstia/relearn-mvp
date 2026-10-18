<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminUsersTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Sign in as an admin and hand back the account that made the request.
     */
    private function actingAsAdmin(): User
    {
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);
        Sanctum::actingAs($admin);

        return $admin;
    }

    public function test_guest_cannot_open_the_users_list(): void
    {
        $this->getJson('/api/v1/admin/users')->assertUnauthorized();
    }

    /**
     * AGENTS_2.md §4 requires the test database to be provably isolated from
     * development and production. phpunit.xml points both settings at an
     * in-memory SQLite database, which cannot reach the development data.
     */
    public function test_the_suite_runs_against_an_isolated_in_memory_database(): void
    {
        $this->assertSame('sqlite', config('database.default'));
        $this->assertSame(':memory:', config('database.connections.sqlite.database'));
    }

    public function test_students_are_forbidden(): void
    {
        Sanctum::actingAs(User::factory()->create(['role' => User::ROLE_STUDENT]));

        $this->getJson('/api/v1/admin/users')->assertForbidden();
    }

    public function test_admins_receive_a_paginated_page_of_accounts(): void
    {
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);
        User::factory()->count(12)->create(['role' => User::ROLE_STUDENT]);

        Sanctum::actingAs($admin);

        $this->getJson('/api/v1/admin/users')
            ->assertOk()
            ->assertJsonCount(10, 'data')
            ->assertJsonPath('meta.total', 13)
            ->assertJsonPath('meta.page', 1)
            ->assertJsonPath('meta.per_page', 10)
            ->assertJsonPath('meta.last_page', 2)
            ->assertJsonPath('meta.from', 1)
            ->assertJsonPath('meta.to', 10);

        $this->getJson('/api/v1/admin/users?page=2')
            ->assertOk()
            ->assertJsonCount(3, 'data');
    }

    public function test_accounts_without_a_stored_status_default_to_active(): void
    {
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);
        $student = User::factory()->create(['role' => User::ROLE_STUDENT]);

        Sanctum::actingAs($admin);

        $this->getJson('/api/v1/admin/users?search='.$student->email)
            ->assertOk()
            ->assertJsonPath('data.0.status', User::STATUS_ACTIVE);
    }

    public function test_list_is_newest_first_by_default(): void
    {
        $admin = User::factory()->create([
            'role' => User::ROLE_ADMIN,
            'created_at' => now()->subDays(10),
        ]);
        $older = User::factory()->create([
            'role' => User::ROLE_STUDENT,
            'created_at' => now()->subDays(5),
        ]);
        $newer = User::factory()->create([
            'role' => User::ROLE_STUDENT,
            'created_at' => now()->subDay(),
        ]);

        Sanctum::actingAs($admin);

        $data = $this->getJson('/api/v1/admin/users')->assertOk()->json('data');

        $this->assertSame(
            [$newer->id, $older->id, $admin->id],
            array_column($data, 'id'),
        );
    }

    public function test_list_can_be_sorted_by_name(): void
    {
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN, 'name' => 'Zoe Admin']);
        User::factory()->create(['role' => User::ROLE_STUDENT, 'name' => 'Bella Student']);
        User::factory()->create(['role' => User::ROLE_STUDENT, 'name' => 'Alice Student']);

        Sanctum::actingAs($admin);

        $data = $this->getJson('/api/v1/admin/users?sort=name&direction=asc')
            ->assertOk()
            ->json('data');

        $this->assertSame(
            ['Alice Student', 'Bella Student', 'Zoe Admin'],
            array_column($data, 'name'),
        );
    }

    public function test_search_matches_name_or_email_ignoring_case(): void
    {
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN, 'email' => 'zoe@relearn.id']);
        User::factory()->create([
            'role' => User::ROLE_STUDENT,
            'name' => 'Nadia Putri',
            'email' => 'nadia.putri@gmail.com',
        ]);
        User::factory()->create([
            'role' => User::ROLE_STUDENT,
            'name' => 'Bima Prakoso',
            'email' => 'bima.p@gmail.com',
        ]);

        Sanctum::actingAs($admin);

        $this->getJson('/api/v1/admin/users?search=NADIA')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Nadia Putri');

        $this->getJson('/api/v1/admin/users?search=bima.p@')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Bima Prakoso');

        $this->getJson('/api/v1/admin/users?search=nobody-here')
            ->assertOk()
            ->assertJsonCount(0, 'data')
            ->assertJsonPath('meta.total', 0);
    }

    public function test_role_plan_and_status_filters_narrow_the_list(): void
    {
        $admin = User::factory()->create([
            'role' => User::ROLE_ADMIN,
            'status' => User::STATUS_ACTIVE,
        ]);
        $proStudent = User::factory()->create([
            'role' => User::ROLE_STUDENT,
            'plan' => User::PLAN_PRO,
            'status' => User::STATUS_ACTIVE,
        ]);
        User::factory()->create([
            'role' => User::ROLE_STUDENT,
            'plan' => User::PLAN_FREE,
            'status' => User::STATUS_ACTIVE,
        ]);
        $suspended = User::factory()->create([
            'role' => User::ROLE_STUDENT,
            'plan' => User::PLAN_FREE,
            'status' => User::STATUS_SUSPENDED,
            'suspended_at' => now(),
        ]);

        Sanctum::actingAs($admin);

        $this->getJson('/api/v1/admin/users?role=admin')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $admin->id);

        $this->getJson('/api/v1/admin/users?plan=pro')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $proStudent->id);

        $this->getJson('/api/v1/admin/users?status=suspended')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $suspended->id);
    }

    public function test_summary_cards_describe_the_platform_rather_than_the_current_filter(): void
    {
        Sanctum::actingAs(User::factory()->create([
            'role' => User::ROLE_ADMIN,
            'status' => User::STATUS_ACTIVE,
        ]));

        User::factory()->count(2)->create([
            'role' => User::ROLE_STUDENT,
            'plan' => User::PLAN_PRO,
            'status' => User::STATUS_ACTIVE,
        ]);
        User::factory()->count(3)->create([
            'role' => User::ROLE_STUDENT,
            'plan' => User::PLAN_FREE,
            'status' => User::STATUS_ACTIVE,
        ]);
        User::factory()->create([
            'role' => User::ROLE_STUDENT,
            'plan' => User::PLAN_FREE,
            'status' => User::STATUS_SUSPENDED,
            'suspended_at' => now(),
        ]);

        $this->getJson('/api/v1/admin/users?status=suspended')
            ->assertOk()
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('summary.total', 7)
            ->assertJsonPath('summary.active', 6)
            ->assertJsonPath('summary.suspended', 1)
            ->assertJsonPath('summary.pro', 2);
    }

    public function test_admins_display_as_pro_without_counting_as_subscribers(): void
    {
        $admin = User::factory()->create([
            'role' => User::ROLE_ADMIN,
            'plan' => User::PLAN_FREE,
        ]);

        Sanctum::actingAs(User::factory()->create(['role' => User::ROLE_ADMIN]));

        $response = $this->getJson('/api/v1/admin/users')->assertOk();

        $response->assertJsonPath('summary.pro', 0);

        $row = collect($response->json('data'))->firstWhere('id', $admin->id);

        $this->assertSame(User::PLAN_PRO, $row['plan']);
    }

    public function test_unsupported_filter_values_are_rejected(): void
    {
        $this->actingAsAdmin();

        // `owner` is a role the design shows but the platform does not have yet.
        $this->getJson('/api/v1/admin/users?role=owner')
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['role']);

        $this->getJson('/api/v1/admin/users?status=deleted')
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['status']);

        $this->getJson('/api/v1/admin/users?plan=enterprise')
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['plan']);

        $this->getJson('/api/v1/admin/users?sort=password')
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['sort']);

        $this->getJson('/api/v1/admin/users?direction=sideways')
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['direction']);

        $this->getJson('/api/v1/admin/users?per_page=500')
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['per_page']);
    }
}
