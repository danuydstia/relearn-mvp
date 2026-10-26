<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Material;
use App\Models\Topic;
use App\Models\UserProgress;
use App\Models\Quiz;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LearningPathController extends Controller
{
    public function store(Request $request, Material $material): JsonResponse
    {
        if ($request->header('X-Internal-Key') !== env('LARAVEL_INTERNAL_KEY', 'rahasia-antar-server')) {
            return response()->json(['message' => 'Unauthorized Server'], 403);
        }

        $validated = $request->validate([
            'learning_path' => 'required|array',
            'learning_path.title' => 'required|string',
            'learning_path.summary' => 'required|string',
            'learning_path.difficulty' => 'required|string',
            'learning_path.modules' => 'required|array',
            
            'quiz' => 'nullable|array',
            'quiz.title' => 'required_with:quiz|string',
            'quiz.questions' => 'required_with:quiz|array',
        ]);

        $lp = $validated['learning_path'];
        $quizData = $validated['quiz'] ?? null;

        DB::beginTransaction();
        try {
            $material->update([
                'title' => $lp['title'],
                'summary' => $lp['summary'],
                'difficulty' => $lp['difficulty'],
                'status' => 'processed',
            ]);

            $now = now();
            
            // Simpan Modul
            $modulesData = [];
            foreach ($lp['modules'] as $modData) {
                $modulesData[] = [
                    'material_id' => $material->id,
                    'order_index' => $modData['order'],
                    'title' => $modData['title'],
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }
            DB::table('modules')->insert($modulesData);

            // Simpan Topik
            $insertedModules = DB::table('modules')->where('material_id', $material->id)->get()->keyBy('order_index');

            $topicsData = [];
            foreach ($lp['modules'] as $modData) {
                $moduleId = $insertedModules[$modData['order']]->id;
                foreach ($modData['topics'] as $topikData) {
                    $topicsData[] = [
                        'module_id' => $moduleId,
                        'order_index' => $topikData['order'],
                        'title' => $topikData['title'],
                        'content' => $topikData['content'],
                        'estimated_minutes' => $topikData['estimated_minutes'],
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];
                }
            }
            DB::table('topics')->insert($topicsData);

            // Simpan Quiz
            if ($quizData) {
                $quiz = Quiz::create([
                    'material_id' => $material->id,
                    'title' => $quizData['title'],
                ]);

                $questionsData = [];
                foreach ($quizData['questions'] as $q) {
                    $questionsData[] = [
                        'quiz_id' => $quiz->id,
                        'question_text' => $q['question_text'],
                        'options' => json_encode($q['options']),
                        'correct_option' => $q['correct_option'],
                        'explanation' => $q['explanation'] ?? null,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];
                }
                DB::table('questions')->insert($questionsData);
            }

            DB::commit();
            return response()->json(['message' => 'Saved successfully'], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed', 'error' => $e->getMessage()], 500);
        }
    }

    public function show(Request $request, Material $material): JsonResponse
    {
        if ($material->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $material->load(['modules', 'modules.topics']);

        $progress = UserProgress::where('user_id', $request->user()->id)
            ->whereIn('topic_id', $material->modules->flatMap->topics->pluck('id'))
            ->pluck('is_completed', 'topic_id');

        $data = $material->toArray();
        $totalTopics = 0;

        foreach ($data['modules'] as &$module) {
            foreach ($module['topics'] as &$topic) {
                $topic['is_completed'] = (bool) $progress->get($topic['id'], false);
                $totalTopics++;
            }
        }

        return response()->json([
            'id' => $data['id'],
            'title' => $data['title'],
            'summary' => $data['summary'],
            'difficulty' => $data['difficulty'],
            'total_topics' => $totalTopics,
            'modules' => $data['modules']
        ]);
    }

    public function completeTopic(Request $request, Material $material, Topic $topic): JsonResponse
    {
        if ($material->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        UserProgress::updateOrCreate(
            ['user_id' => $request->user()->id, 'topic_id' => $topic->id],
            ['is_completed' => true, 'completed_at' => now()]
        );

        return response()->json(['message' => 'Topic completed']);
    }

    public function getQuiz(Request $request, Material $material): JsonResponse
    {
        if ($material->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $quiz = Quiz::where('material_id', $material->id)->with('questions')->first();

        if (!$quiz) {
            return response()->json(['message' => 'Quiz belum tersedia'], 404);
        }

        return response()->json($quiz);
    }
}