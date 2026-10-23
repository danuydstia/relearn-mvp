<?php

namespace App\Models;

use App\Models\Topic;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'material_id',
    'title',
    'summary',
    'status',
    'model_used',
])]
class LearningPath extends Model
{
    use HasFactory;

    const STATUS_PENDING = 'pending';

    const STATUS_GENERATING = 'generating';

    const STATUS_COMPLETED = 'completed';

    const STATUS_FAILED = 'failed';

    public function material(): BelongsTo
    {
        return $this->belongsTo(Material::class);
    }

    public function topics(): HasMany
    {
        // Otomatis mengurutkan topik berdasarkan sort_order
        return $this->hasMany(Topic::class)->orderBy('sort_order', 'asc');
    }
}