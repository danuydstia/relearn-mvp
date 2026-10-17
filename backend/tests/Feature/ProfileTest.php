<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ProfileTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_update_a_profile(): void
    {
        $this->patchJson('/api/v1/profile', ['name' => 'Alex Lee'])->assertUnauthorized();
    }

    public function test_user_can_update_their_display_name(): void
    {
        $user = User::factory()->create(['name' => 'Alex']);

        $this->actingAsStudent($user)
            ->patchJson('/api/v1/profile', ['name' => 'Alex Lee'])
            ->assertOk()
            ->assertJsonPath('name', 'Alex Lee');

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Alex Lee',
        ]);
    }

    public function test_profile_response_does_not_leak_private_attributes(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAsStudent($user)
            ->patchJson('/api/v1/profile', ['name' => 'Alex Lee'])
            ->assertOk();

        $this->assertArrayNotHasKey('password', $response->json());
        $this->assertArrayNotHasKey('remember_token', $response->json());
        $this->assertArrayNotHasKey('provider_id', $response->json());
    }

    public function test_name_is_required(): void
    {
        $user = User::factory()->create();

        $this->actingAsStudent($user)
            ->patchJson('/api/v1/profile', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('name');
    }

    public function test_whitespace_only_name_is_rejected(): void
    {
        $user = User::factory()->create(['name' => 'Alex']);

        $this->actingAsStudent($user)
            ->patchJson('/api/v1/profile', ['name' => '   '])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('name');

        $this->assertDatabaseHas('users', ['id' => $user->id, 'name' => 'Alex']);
    }

    public function test_name_is_trimmed_before_saving(): void
    {
        $user = User::factory()->create();

        $this->actingAsStudent($user)
            ->patchJson('/api/v1/profile', ['name' => '  Alex Lee  '])
            ->assertOk()
            ->assertJsonPath('name', 'Alex Lee');

        $this->assertDatabaseHas('users', ['id' => $user->id, 'name' => 'Alex Lee']);
    }

    public function test_name_longer_than_the_column_is_rejected(): void
    {
        $user = User::factory()->create();

        $this->actingAsStudent($user)
            ->patchJson('/api/v1/profile', ['name' => str_repeat('a', 256)])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('name');
    }

    public function test_updating_a_profile_cannot_change_email_role_or_plan(): void
    {
        $user = User::factory()->create([
            'email' => 'alex@example.com',
            'role' => User::ROLE_STUDENT,
            'plan' => User::PLAN_FREE,
        ]);

        $this->actingAsStudent($user)
            ->patchJson('/api/v1/profile', [
                'name' => 'Alex Lee',
                'email' => 'attacker@example.com',
                'role' => User::ROLE_ADMIN,
                'plan' => User::PLAN_PRO,
            ])
            ->assertOk();

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Alex Lee',
            'email' => 'alex@example.com',
            'role' => User::ROLE_STUDENT,
            'plan' => User::PLAN_FREE,
        ]);
    }

    /**
     * Authenticate as the given user through the Sanctum guard.
     */
    private function actingAsStudent(User $user): static
    {
        Sanctum::actingAs($user);

        return $this;
    }
}
