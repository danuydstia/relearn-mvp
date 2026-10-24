<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Material;
use App\Models\Topic;
use App\Models\UserProgress;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LearningPathController extends Controller
{
    /**
     * Dipanggil oleh Python setelah AI selesai generate.
     */
    public function store(Request $request, Material $material): JsonResponse
    {
        // Validasi Internal Key
        if ($request->header('X-Internal-Key') !== env('LARAVEL_INTERNAL_KEY', 'rahasia-antar-server')) {
            return response()->json(['message' => 'Unauthorized Server'], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string',
            'summary' => 'required|string',
            'difficulty' => 'required|string',
            'modules' => 'required|array',
            'modules.*.order' => 'required|integer',
            'modules.*.title' => 'required|string',
            'modules.*.topics' => 'required|array',
            'modules.*.topics.*.order' => 'required|integer',
            'modules.*.topics.*.title' => 'required|string',
            'modules.*.topics.*.content' => 'required|string',
            'modules.*.topics.*.estimated_minutes' => 'required|integer',
        ]);

        DB::beginTransaction();
        try {
            // 1. Update Material
            $material->update([
                'title' => $validated['title'],
                'summary' => $validated['summary'],
                'difficulty' => $validated['difficulty'],
                'status' => 'processed',
            ]);

            $now = now();
            $modulesData = [];
            
            // Siapkan data modul
            foreach ($validated['modules'] as $modData) {
                $modulesData[] = [
                    'material_id' => $material->id,
                    'order_index' => $modData['order'],
                    'title' => $modData['title'],
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }
            
            // Bulk Insert Modul
            DB::table('modules')->insert($modulesData);

            // Ambil kembali ID modul yang baru di-insert
            $insertedModules = DB::table('modules')
                ->where('material_id', $material->id)
                ->get()
                ->keyBy('order_index');

            // Siapkan data topik
            $topicsData = [];
            foreach ($validated['modules'] as $modData) {
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

            // Bulk Insert Topik
            DB::table('topics')->insert($topicsData);

            DB::commit();

            return response()->json([
                'message' => 'Learning path saved successfully',
                'data' => $material->load('modules.topics')
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to save learning path',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Dipanggil oleh Frontend untuk menampilkan materi LMS.
     */
    public function show(Request $request, Material $material): JsonResponse
    {
        if ($material->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        // Load relasi modules dan topics
        $material->load(['modules', 'modules.topics']);

        // Ambil data progress user
        $progress = UserProgress::where('user_id', $request->user()->id)
            ->whereIn('topic_id', $material->modules->flatMap->topics->pluck('id'))
            ->pluck('is_completed', 'topic_id');

        $data = $material->toArray();
        $totalTopics = 0;

        // Sisipkan status is_completed ke tiap topik
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

    /**
     * Dipanggil Frontend saat user selesai membaca 1 topik.
     */
    public function completeTopic(Request $request, Material $material, Topic $topic): JsonResponse
    {
        if ($material->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        UserProgress::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'topic_id' => $topic->id,
            ],
            [
                'is_completed' => true,
                'completed_at' => now(),
            ]
        );

        return response()->json(['message' => 'Topic completed']);
    }
}