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
            'title' => fake()->sentence(3),
            'file_path' => 'materials/'.fake()->uuid().'.pdf',
            'file_type' => 'pdf',
            'status' => Material::STATUS_PENDING,
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
        ]);
    }
}
