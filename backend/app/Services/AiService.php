<?php
namespace App\Services;

use Gemini\Laravel\Facades\Gemini;

class AiService
{
    public function generateLearningPath(string $materi): array
    {
        // Gunakan model yang lebih kuat untuk learning path
        $result = Gemini::generativeModel(model: 'gemini-3.8-flash')
            ->generateContent($prompt);
        
        return json_decode($result->text(), true);
    }

    public function generateQuiz(string $materi): array
    {
        // Gunakan model yang lebih murah untuk quiz
        $result = Gemini::generativeModel(model: 'gemini-3.5-flash-lite')
            ->generateContent($prompt);
        
        return json_decode($result->text(), true);
    }
}

?>