<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lowongan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LowonganController extends Controller
{
    /**
     * Publik 
     */
    public function index(Request $request): JsonResponse
    {
        $query = Lowongan::query()->with(['periode', 'kategori.bidang']);

        if ($request->filled('periode_id')) {
            $query->where('periode_id', $request->integer('periode_id'));
        }

        if ($request->filled('kategori_id')) {
            $query->where('kategori_id', $request->integer('kategori_id'));
        }

        if ($request->filled('bidang_id')) {
            $query->whereHas('kategori', fn ($q) => $q->where('bidang_id', $request->integer('bidang_id')));
        }

        if (! $request->boolean('all')) {
            $query->where('is_active', true)->whereColumn('filled', '<', 'kuota');
        }

        return response()->json([
            'data' => $query->orderByDesc('created_at')->get(),
        ]);
    }

    public function show(Lowongan $lowongan): JsonResponse
    {
        return response()->json([
            'data' => $lowongan->load(['periode', 'kategori.bidang']),
        ]);
    }

    // store/update/destroy dibatasi middleware 'role:admin' di routes.

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'periode_id' => ['required', 'exists:periode,id'],
            'kategori_id' => ['required', 'exists:kategori,id'],
            'project' => ['nullable', 'string', 'max:255'],
            'definisi' => ['nullable', 'string'],
            'detail_kebutuhan' => ['nullable', 'string'],
            'kuota' => ['required', 'integer', 'min:1'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        // 'filled' selalu mulai dari 0 — tidak boleh di-set manual lewat
        // request, karena nilainya bergantung jumlah application yang di terima
        $lowongan = Lowongan::create([...$validated, 'filled' => 0]);

        return response()->json([
            'message' => 'Lowongan berhasil ditambahkan.',
            'data' => $lowongan->load(['periode', 'kategori.bidang']),
        ], 201);
    }

    public function update(Request $request, Lowongan $lowongan): JsonResponse
    {
        $validated = $request->validate([
            'periode_id' => ['sometimes', 'exists:periodes,id'],
            'kategori_id' => ['sometimes', 'exists:kategori,id'],
            'project' => ['sometimes', 'nullable', 'string', 'max:255'],
            'definisi' => ['sometimes', 'nullable', 'string'],
            'detail_kebutuhan' => ['sometimes', 'nullable', 'string'],
            'kuota' => ['sometimes', 'integer', 'min:1'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $lowongan->update($validated);

        return response()->json([
            'message' => 'Lowongan berhasil diperbarui.',
            'data' => $lowongan->fresh(['periode', 'kategori.bidang']),
        ]);
    }

    public function destroy(Lowongan $lowongan): JsonResponse
    {
        if ($lowongan->applications()->exists()) {
            return response()->json([
                'message' => 'Lowongan ini sudah punya pendaftar, tidak bisa dihapus. Nonaktifkan saja.',
            ], 422);
        }

        $lowongan->delete();

        return response()->json([
            'message' => 'Lowongan berhasil dihapus.',
        ]);
    }
}