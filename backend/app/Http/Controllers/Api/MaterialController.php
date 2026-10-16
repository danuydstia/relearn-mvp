<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Material;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MaterialController extends Controller
{
    /**
     * Accepted document formats for MVP (see ReLearn_TechStack.md §6.1).
     */
    private const MIME_TYPES = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ];

    /**
     * List the authenticated user's materials.
     */
    public function index(Request $request)
    {
        $materials = $request->user()
            ->materials()
            ->latest()
            ->get();

        return response()->json(['data' => $materials]);
    }

    /**
     * Store a newly uploaded material.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'file' => [
                'required',
                'file',
                'max:20480',
                'mimes:pdf,docx,pptx',
                'mimetypes:'.implode(',', self::MIME_TYPES),
            ],
        ]);

        $file = $validated['file'];
        $path = $file->store("materials/{$request->user()->id}", 'local');

        $material = $request->user()->materials()->create([
            'original_name' => $file->getClientOriginalName(),
            'stored_name' => $file->hashName(),
            'mime_type' => $file->getClientMimeType(),
            'size' => $file->getSize(),
            'disk' => 'local',
            'path' => $path,
            'status' => Material::STATUS_UPLOADED,
        ]);

        return response()->json(['data' => $material], 201);
    }

    /**
     * Show a single material.
     */
    public function show(Request $request, Material $material)
    {
        abort_unless($material->user_id === $request->user()->id, 403);

        return response()->json(['data' => $material]);
    }

    /**
     * Remove a material and its stored file.
     */
    public function destroy(Request $request, Material $material)
    {
        abort_unless($material->user_id === $request->user()->id, 403);

        Storage::disk($material->disk)->delete($material->path);
        $material->delete();

        return response()->json(['message' => 'Material deleted']);
    }
}
