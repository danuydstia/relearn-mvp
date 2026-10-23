<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'learning_path_id',
    'title',
    'sort_order',
])]
class Topic extends Model
{
    use HasFactory;

    public function learningPath(): BelongsTo
    {
        return $this->belongsTo(LearningPath::class);
    }

    public function subtopics(): HasMany
    {
        // Otomatis mengurutkan subtopik berdasarkan sort_order
        return $this->hasMany(Subtopic::class)->orderBy('sort_order', 'asc');
    }
}