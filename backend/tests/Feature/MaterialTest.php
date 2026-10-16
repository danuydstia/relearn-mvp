<?php

namespace Tests\Feature;

use App\Models\Material;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class MaterialTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_list_materials(): void
    {
        $this->getJson('/api/v1/materials')->assertUnauthorized();
    }

    public function test_user_only_sees_their_own_materials(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        Material::factory()->for($user)->create();
        Material::factory()->for($otherUser)->create();

        $this->actingAsStudent($user)
            ->getJson('/api/v1/materials')
            ->assertOk()
            ->assertJsonCount(1, 'data');
    }

    public function test_user_can_upload_a_pdf_material(): void
    {
        Storage::fake('local');

        $user = User::factory()->create();

        $response = $this->actingAsStudent($user)
            ->postJson('/api/v1/materials', [
                'file' => UploadedFile::fake()->create('lecture-04.pdf', 512, 'application/pdf'),
            ]);

        $response
            ->assertCreated()
            ->assertJsonPath('data.status', Material::STATUS_UPLOADED)
            ->assertJsonPath('data.original_name', 'lecture-04.pdf');

        $this->assertDatabaseHas('materials', [
            'user_id' => $user->id,
            'original_name' => 'lecture-04.pdf',
        ]);

        Storage::disk('local')->assertExists($response->json('data.path'));
    }

    public function test_unsupported_file_type_is_rejected(): void
    {
        Storage::fake('local');

        $user = User::factory()->create();

        $this->actingAsStudent($user)
            ->postJson('/api/v1/materials', [
                'file' => UploadedFile::fake()->create('notes.txt', 10, 'text/plain'),
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('file');
    }

    public function test_material_is_required(): void
    {
        $user = User::factory()->create();

        $this->actingAsStudent($user)
            ->postJson('/api/v1/materials', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('file');
    }

    public function test_user_cannot_view_another_users_material(): void
    {
        $user = User::factory()->create();
        $material = Material::factory()->for(User::factory())->create();

        $this->actingAsStudent($user)
            ->getJson("/api/v1/materials/{$material->id}")
            ->assertForbidden();
    }

    public function test_user_can_view_their_own_material(): void
    {
        $user = User::factory()->create();
        $material = Material::factory()->for($user)->completed()->create();

        $this->actingAsStudent($user)
            ->getJson("/api/v1/materials/{$material->id}")
            ->assertOk()
            ->assertJsonPath('data.status', Material::STATUS_COMPLETED);
    }

    public function test_user_can_delete_their_material_and_its_file(): void
    {
        Storage::fake('local');

        $user = User::factory()->create();
        $material = Material::factory()->for($user)->create([
            'path' => 'materials/to-delete.pdf',
        ]);
        Storage::disk('local')->put('materials/to-delete.pdf', 'contents');

        $this->actingAsStudent($user)
            ->deleteJson("/api/v1/materials/{$material->id}")
            ->assertOk();

        $this->assertDatabaseMissing('materials', ['id' => $material->id]);
        Storage::disk('local')->assertMissing('materials/to-delete.pdf');
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
