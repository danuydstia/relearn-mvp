<?php
namespace App\Models;
use App\Models\Question;
use Illuminate\Database\Eloquent\Model;

class Quiz extends Model
{
    protected $fillable = ['material_id', 'title'];
    
    public function questions()
    {
        return $this->hasMany(Question::class);
    }
}
?>