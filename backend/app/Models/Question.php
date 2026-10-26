<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $fillable = ['quiz_id', 'question_text', 'options', 'correct_option', 'explanation'];
    
    protected $casts = [
        'options' => 'array', // Otomatis konversi JSON ke Array di Laravel
    ];
}

?>