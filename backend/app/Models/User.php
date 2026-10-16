<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable([
    'name',
    'email',
    'password',
    'role',
    'plan',
    'provider',
    'provider_id',
    'avatar',
])]
#[Hidden([
    'password',
    'remember_token',
    'provider_id',
])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    // Konstanta role
    const ROLE_ADMIN = 'admin';

    const ROLE_STUDENT = 'student';

    // Konstanta plan
    const PLAN_FREE = 'free';

    const PLAN_PRO = 'pro';

    /**
     * The model's default attribute values.
     *
     * Mirrors the `users.plan` column default so freshly instantiated models
     * (registration responses, factory-made models) already report their plan.
     *
     * @var array<string, mixed>
     */
    protected $attributes = [
        'plan' => self::PLAN_FREE,
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // ============ Relations ============

    public function materials(): HasMany
    {
        return $this->hasMany(Material::class);
    }

    // ============ Helper Methods ============

    public function isAdmin(): bool
    {
        return $this->role === self::ROLE_ADMIN;
    }

    public function isStudent(): bool
    {
        return $this->role === self::ROLE_STUDENT;
    }

    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }

    public function isPro(): bool
    {
        return $this->plan === self::PLAN_PRO;
    }
}
