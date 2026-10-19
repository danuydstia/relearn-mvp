<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Material;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MaterialController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $materials = $request->user()->materials()->latest()->get();
        return response()->json($materials);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'file' => ['required', 'file', 'mimes:pdf,doc,docx,ppt,pptx', 'max:10240'],
        ]);

        $user = $request->user();
        $file = $request->file('file');
        
        // Menggunakan disk supabase_materials
        $disk = Storage::disk('supabase_materials');

        $filename = $file->hashName();
        $path = 'materials/' . $filename;

        $disk->putFileAs('materials', $file, $filename, 'public');

        $material = $user->materials()->create([
            'title' => $validated['title'],
            'file_path' => $path,
            'file_type' => $file->getClientOriginalExtension(),
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Material uploaded successfully',
            'data' => $material
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

        // Menggunakan disk supabase_materials
        $disk = Storage::disk('supabase_materials');
        if ($disk->exists($material->file_path)) {
            $disk->delete($material->file_path);
        }

        $material->delete();

        return response()->json(['message' => 'Material deleted successfully']);
    }
}