<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $fillable = ['material_id', 'title', 'summary', 'difficulty'];

    public function material()
    {
        return $this->belongsTo(Material::class);
    }

    public function modules()
    {
        return $this->hasMany(Module::class)->orderBy('order_index');
    }
}