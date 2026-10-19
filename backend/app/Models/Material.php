<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Facades\Storage;

#[Fillable([
    'user_id',
    'title',
    'file_path',
    'file_type',
    'status',
])]
class Material extends Model
{
    use HasFactory;

    protected $appends = ['file_url'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    protected function fileUrl(): Attribute
    {
        return Attribute::get(function (): ?string {
            if (! $this->file_path) {
                return null;
            }

            // Gunakan disk supabase_materials
            return Storage::disk('supabase_materials')->url($this->file_path);
        });
    }
}