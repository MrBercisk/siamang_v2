<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Bidang;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class BidangController extends Controller
{
    /**
     * Publik — dipakai halaman pendaftaran untuk pilih bidang.
     * Query aman untuk dipakai tanpa login, jadi hanya tampilkan yang aktif
     * kecuali diminta eksplisit oleh admin lewat query ?all=1.
     */
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

    // Method di bawah ini hanya boleh diakses admin — dibatasi lewat
    // middleware 'role:admin' di routes, bukan dicek manual di sini.

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
        // Cegah hapus bidang yang masih punya kategori aktif di bawahnya,
        // supaya tidak meninggalkan kategori/lowongan/application yatim.
        if ($bidang->kategori()->exists()) {
            return response()->json([
                'message' => 'Bidang ini masih punya kategori terkait, hapus/pindahkan kategorinya dulu.',
            ], 422);
        }

        $bidang->delete();

        return response()->json([
            'message' => 'Bidang berhasil dihapus.',
        ]);
    }
}