<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Material extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 
        'title', 
        'summary', 
        'difficulty', 
        'file_path', 
        'file_type', 
        'status'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function modules()
    {
        return $this->hasMany(Module::class)->orderBy('order_index');
    }
}