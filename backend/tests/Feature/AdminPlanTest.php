<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminPlanTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_reports_pro_without_storing_a_subscription(): void
    {
        $admin = User::factory()->create([
            'role' => User::ROLE_ADMIN,
            'plan' => User::PLAN_FREE,
        ]);

        $this->assertSame(User::PLAN_PRO, $admin->plan);

        Sanctum::actingAs($admin);

        $this->getJson('/api/v1/auth/me')
            ->assertOk()
            ->assertJsonPath('plan', User::PLAN_PRO);

        $this->assertDatabaseHas('users', [
            'id' => $admin->id,
            'plan' => User::PLAN_FREE,
        ]);
    }

    public function test_students_report_their_stored_plan(): void
    {
        $free = User::factory()->create([
            'role' => User::ROLE_STUDENT,
            'plan' => User::PLAN_FREE,
        ]);
        $pro = User::factory()->create([
            'role' => User::ROLE_STUDENT,
            'plan' => User::PLAN_PRO,
        ]);

        $this->assertSame(User::PLAN_FREE, $free->plan);
        $this->assertSame(User::PLAN_PRO, $pro->plan);
    }

    public function test_promoting_a_student_grants_pro_access_immediately(): void
    {
        $user = User::factory()->create([
            'role' => User::ROLE_STUDENT,
            'plan' => User::PLAN_FREE,
        ]);

        $this->assertSame(User::PLAN_FREE, $user->plan);

        $user->role = User::ROLE_ADMIN;

        $this->assertSame(User::PLAN_PRO, $user->plan);
    }
}
