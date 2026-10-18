<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;
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

    // Account status — shown by the admin Users screen (design 10:62689).
    const STATUS_ACTIVE = 'active';

    const STATUS_SUSPENDED = 'suspended';

    /**
     * The model's default attribute values.
     *
     * Mirrors the `users.plan` and `users.status` column defaults so freshly
     * instantiated models (registration responses, factory-made models) already
     * report them rather than serializing null.
     *
     * @var array<string, mixed>
     */
    protected $attributes = [
        'plan' => self::PLAN_FREE,
        'status' => self::STATUS_ACTIVE,
    ];

    /**
     * Atribut virtual yang ikut keluar di JSON.
     *
     * @var list<string>
     */
    protected $appends = ['avatar_url'];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'suspended_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Effective plan for this account.
     *
     * Admins always have Pro access and never hold a subscription, so their
     * stored `plan` column is ignored. Everyone else reports the stored value,
     * which keeps subscription queries (`where('plan', 'pro')`) limited to
     * students without needing an extra role filter.
     */
    protected function plan(): Attribute
    {
        return Attribute::get(
            fn (): string => $this->isAdmin()
                ? self::PLAN_PRO
                : ($this->attributes['plan'] ?? self::PLAN_FREE)
        );
    }

    /**
     * URL penuh avatar: foto Google (URL) atau file upload lokal (path di disk public).
     */
    protected function avatarUrl(): Attribute
    {
        return Attribute::get(function (): ?string {
            $avatar = $this->avatar;

            if (! $avatar) {
                return null;
            }

            if (str_starts_with($avatar, 'http')) {
                // foto Google: naikin resolusi dari s96 ke s256 biar nggak pecah di 52px
                return preg_replace('/=s\d+-c$/', '=s256-c', $avatar);
            }

            return Storage::disk('supabase')->url($avatar);
        });
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
