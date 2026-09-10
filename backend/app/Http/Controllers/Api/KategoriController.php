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
     * Publik — dipakai halaman pendaftaran untuk pilih kategori,
     * biasanya di-filter per bidang lewat ?bidang_id=.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Kategori::query()->with('bidang');

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
            'data' => $kategori->load('bidang'),
        ]);
    }

    // store/update/destroy dibatasi middleware 'role:admin' di routes.

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'bidang_id' => ['required', 'exists:bidangs,id'],
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
            'bidang_id' => ['sometimes', 'exists:bidangs,id'],
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
        // Cegah hapus kategori yang masih dipakai lowongan atau sudah
        // pernah dipilih di application (biar riwayat pendaftaran lama
        // tidak kehilangan referensi kategorinya).
        if ($kategori->lowongans()->exists() || $kategori->applications()->exists()) {
            return response()->json([
                'message' => 'Kategori ini masih dipakai lowongan/pendaftaran, tidak bisa dihapus.',
            ], 422);
        }

        $kategori->delete();

        return response()->json([
            'message' => 'Kategori berhasil dihapus.',
        ]);
    }
}