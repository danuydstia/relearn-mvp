<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'user_id',
    'original_name',
    'stored_name',
    'mime_type',
    'size',
    'disk',
    'path',
    'status',
    'failure_reason',
])]
class Material extends Model
{
    use HasFactory;

    // Konstanta status pemrosesan material
    const STATUS_UPLOADED = 'uploaded';

    const STATUS_PROCESSING = 'processing';

    const STATUS_COMPLETED = 'completed';

    const STATUS_FAILED = 'failed';

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'size' => 'integer',
        ];
    }

    // ============ Relations ============

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // ============ Helper Methods ============

    public function isCompleted(): bool
    {
        return $this->status === self::STATUS_COMPLETED;
    }

    public function isFailed(): bool
    {
        return $this->status === self::STATUS_FAILED;
    }
}
