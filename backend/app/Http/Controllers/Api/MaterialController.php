<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Material;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http; // <-- Tambahan
use Illuminate\Support\Facades\Log;  // <-- Tambahan

class MaterialController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $materials = $request->user()->materials()->latest()->get();
        return response()->json(['data' => $materials]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'file' => ['required', 'file', 'mimes:pdf,doc,docx,ppt,pptx', 'max:10240'],
        ]);

        $user = $request->user();
        $file = $request->file('file');

        $disk = Storage::disk('supabase_materials');
        $filename = $file->hashName();
        $path = 'materials/'.$filename;
        
        // Simpan file ke Supabase
        $disk->putFileAs('materials', $file, $filename, 'public');

        // Ambil Public URL untuk dikirim ke Python
        $publicUrl = $disk->url($path);

        // Simpan metadata ke database
        $material = $user->materials()->create([
            'file_path' => $path,
            'file_type' => $file->getClientOriginalExtension(),
            'status' => 'pending',
        ]);

        // ==========================================
        // TRIGGER PYTHON AI SERVICE
        // ==========================================
        try {
            // Turunkan timeout karena Python sekarang langsung merespons
            $response = Http::timeout(10)->post('http://127.0.0.1:8001/process-material', [
                'material_id' => $material->id,
                'file_url' => $publicUrl,
                'mime_type' => $file->getMimeType(),
            ]);


            if ($response->failed()) {
                // Jika Python error, ubah status jadi failed
                $material->update(['status' => 'failed']);
                Log::error("Python AI Error: " . $response->body());
            }
            
        } catch (\Exception $e) {
            // Jika Python mati atau tidak bisa dihubungi
            $material->update(['status' => 'failed']);
            Log::error("AI Service Connection Error: " . $e->getMessage());
        }

        $material->refresh(); 

        return response()->json([
            'message' => 'Material uploaded and processing started.',
            'data' => $material,
        ], 201);
    }

    public function show(Request $request, Material $material): JsonResponse
    {
        if ($material->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return response()->json($material);
    }

    public function destroy(Request $request, Material $material): JsonResponse
    {
        if ($material->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $disk = Storage::disk('supabase_materials');
        if ($disk->exists($material->file_path)) {
            $disk->delete($material->file_path);
        }

        $material->delete();

        return response()->json(['message' => 'Material deleted successfully']);
    }

}