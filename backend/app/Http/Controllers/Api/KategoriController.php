<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Kategori;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class KategoriController extends Controller
{
    /**
     * Publik 
     */
    public function index(Request $request): JsonResponse
    {
        $query = Kategori::query()->with('bidang')->withCount('applications');

        if ($request->filled('bidang_id')) {
            $query->where('bidang_id', $request->integer('bidang_id'));
        }

        if (! $request->boolean('all')) {
            $query->whereHas('bidang', fn ($q) => $q->where('status', 'Aktif'));
        }

        return response()->json([
            'data' => $query->orderBy('name')->get(),
        ]);
    }

    public function show(Kategori $kategori): JsonResponse
    {
        return response()->json([
            'data' => $kategori->load('bidang')->loadCount('applications'),
        ]);
    }

    /**
     * Admin 
     */
    public function trashed(Request $request): JsonResponse
    {
        $query = Kategori::onlyTrashed()->with('bidang')->withCount('applications');

        if ($request->filled('bidang_id')) {
            $query->where('bidang_id', $request->integer('bidang_id'));
        }

        return response()->json([
            'data' => $query->orderByDesc('deleted_at')->get(),
        ]);
    }

    // store/update/destroy dibatasi middleware 'role:admin' di routes.

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'bidang_id' => ['required', 'exists:bidang,id'],
            'name' => ['required', 'string', 'max:255'],
            'quota' => ['nullable', 'integer', 'min:0'],
            'description' => ['nullable', 'string'],
        ]);

        $kategori = Kategori::create($validated);

        return response()->json([
            'message' => 'Kategori berhasil ditambahkan.',
            'data' => $kategori->load('bidang'),
        ], 201);
    }

    public function update(Request $request, Kategori $kategori): JsonResponse
    {
        $validated = $request->validate([
            'bidang_id' => ['sometimes', 'exists:bidang,id'],
            'name' => ['sometimes', 'string', 'max:255'],
            'quota' => ['sometimes', 'nullable', 'integer', 'min:0'],
            'description' => ['sometimes', 'nullable', 'string'],
        ]);

        $kategori->update($validated);

        return response()->json([
            'message' => 'Kategori berhasil diperbarui.',
            'data' => $kategori->load('bidang'),
        ]);
    }

    public function destroy(Kategori $kategori): JsonResponse
    {
        if ($kategori->lowongans()->exists() || $kategori->applications()->exists()) {
            return response()->json([
                'message' => 'Kategori ini masih dipakai lowongan/pendaftaran, tidak bisa dihapus.',
            ], 422);
        }

        $kategori->delete();

        return response()->json([
            'message' => 'Kategori berhasil dipindahkan ke Sampah.',
        ]);
    }
    public function restore(int $id): JsonResponse
    {
        $kategori = Kategori::onlyTrashed()->findOrFail($id);
        $kategori->restore();

        return response()->json([
            'message' => 'Kategori berhasil dipulihkan.',
            'data' => $kategori->fresh()->load('bidang'),
        ]);
    }

    public function forceDelete(int $id): JsonResponse
    {
        $kategori = Kategori::onlyTrashed()->findOrFail($id);

        if ($kategori->lowongans()->exists() || $kategori->applications()->exists()) {
            return response()->json([
                'message' => 'Kategori ini masih terkait lowongan/pendaftaran, tidak bisa dihapus permanen.',
            ], 422);
        }

        $kategori->forceDelete();

        return response()->json([
            'message' => 'Kategori berhasil dihapus permanen.',
        ]);
    }
}