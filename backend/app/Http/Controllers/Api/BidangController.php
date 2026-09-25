<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Bidang;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class BidangController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Bidang::query()->withCount('kategori');

        if (! $request->boolean('all')) {
            $query->where('status', 'Aktif');
        }

        return response()->json([
            'data' => $query->orderBy('name')->get(),
        ]);
    }

    public function show(Bidang $bidang): JsonResponse
    {
        return response()->json([
            'data' => $bidang->load('kategori'),
        ]);
    }

    public function trashed(): JsonResponse
    {
        return response()->json([
            'data' => Bidang::onlyTrashed()
                ->withCount(['kategori' => fn ($query) => $query->withTrashed()])
                ->orderByDesc('deleted_at')
                ->get(),
        ]);
    }

    // Method hanya boleh diakses admin

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:bidang,name'],
            'status' => ['nullable', Rule::in(['Aktif', 'Nonaktif'])],
        ]);

        $bidang = Bidang::create($validated);

        return response()->json([
            'message' => 'Bidang berhasil ditambahkan.',
            'data' => $bidang,
        ], 201);
    }

    public function update(Request $request, Bidang $bidang): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255', Rule::unique('bidang', 'name')->ignore($bidang->id)],
            'status' => ['sometimes', Rule::in(['Aktif', 'Nonaktif'])],
        ]);

        $bidang->update($validated);

        return response()->json([
            'message' => 'Bidang berhasil diperbarui.',
            'data' => $bidang,
        ]);
    }

    public function destroy(Bidang $bidang): JsonResponse
    {
        $bidang->delete();

        return response()->json([
            'message' => 'Bidang berhasil dipindahkan ke Sampah. Kategori di bawahnya ikut diarsipkan dan bisa dipulihkan bersamaan.',
        ]);
    }

    public function restore(int $id): JsonResponse
    {
        $bidang = Bidang::onlyTrashed()->findOrFail($id);
        $bidang->restore();

        return response()->json([
            'message' => 'Bidang berhasil dipulihkan beserta kategorinya.',
            'data' => $bidang->fresh(),
        ]);
    }

    public function forceDelete(int $id): JsonResponse
    {
        $bidang = Bidang::onlyTrashed()->findOrFail($id);

        if ($bidang->kategori()->withTrashed()->exists()) {
            return response()->json([
                'message' => 'Bidang ini masih punya kategori (termasuk yang ada di Sampah). Hapus permanen kategorinya dulu.',
            ], 422);
        }

        $bidang->forceDelete();

        return response()->json([
            'message' => 'Bidang berhasil dihapus permanen.',
        ]);
    }
}