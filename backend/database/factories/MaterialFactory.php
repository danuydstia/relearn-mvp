<?php

namespace Database\Factories;

use App\Models\Material;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Material>
 */
class MaterialFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'original_name' => fake()->word().'.pdf',
            'stored_name' => fake()->uuid().'.pdf',
            'mime_type' => 'application/pdf',
            'size' => fake()->numberBetween(1024, 5_000_000),
            'disk' => 'local',
            'path' => 'materials/'.fake()->uuid().'.pdf',
            'status' => Material::STATUS_UPLOADED,
        ];
    }

    /**
     * Indicate that the material finished processing.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => Material::STATUS_COMPLETED,
        ]);
    }

    /**
     * Indicate that processing the material failed.
     */
    public function failed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => Material::STATUS_FAILED,
            'failure_reason' => fake()->sentence(),
        ]);
    }
}
