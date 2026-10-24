<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Module extends Model
{
    use HasFactory;

    protected $fillable = ['material_id', 'order_index', 'title'];

    public function material()
    {
        return $this->belongsTo(Material::class);
    }

    public function topics()
    {
        return $this->hasMany(Topic::class)->orderBy('order_index');
    }
}