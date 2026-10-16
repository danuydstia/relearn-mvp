<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PlanTest extends TestCase
{
    use RefreshDatabase;

    public function test_new_users_default_to_the_free_plan(): void
    {
        $user = User::factory()->create();

        $this->assertSame(User::PLAN_FREE, $user->plan);
        $this->assertFalse($user->isPro());
    }

    public function test_registration_returns_the_free_plan(): void
    {
        $this->postJson('/api/v1/auth/register', [
            'name' => 'Rani',
            'email' => 'rani@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ])
            ->assertCreated()
            ->assertJsonPath('user.plan', User::PLAN_FREE);
    }

    public function test_a_user_can_switch_to_the_pro_plan_in_development(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $this->putJson('/api/v1/dev/plan', ['plan' => User::PLAN_PRO])
            ->assertOk()
            ->assertJsonPath('plan', User::PLAN_PRO);

        $this->assertTrue($user->fresh()->isPro());
    }

    public function test_dev_plan_switch_rejects_an_unknown_plan(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $this->putJson('/api/v1/dev/plan', ['plan' => 'enterprise'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('plan');
    }

    public function test_guest_cannot_use_the_dev_plan_switch(): void
    {
        $this->putJson('/api/v1/dev/plan', ['plan' => User::PLAN_PRO])
            ->assertUnauthorized();
    }

    public function test_the_artisan_command_sets_a_users_plan(): void
    {
        $user = User::factory()->create(['email' => 'pro@example.com']);

        $this->artisan('user:plan', ['email' => $user->email, 'plan' => User::PLAN_PRO])
            ->assertSuccessful();

        $this->assertTrue($user->fresh()->isPro());
    }

    public function test_the_artisan_command_fails_for_an_unknown_user(): void
    {
        $this->artisan('user:plan', ['email' => 'nobody@example.com', 'plan' => User::PLAN_PRO])
            ->assertFailed();
    }

    public function test_the_artisan_command_rejects_an_invalid_plan(): void
    {
        $user = User::factory()->create();

        $this->artisan('user:plan', ['email' => $user->email, 'plan' => 'enterprise'])
            ->assertFailed();

        $this->assertSame(User::PLAN_FREE, $user->fresh()->plan);
    }
}
