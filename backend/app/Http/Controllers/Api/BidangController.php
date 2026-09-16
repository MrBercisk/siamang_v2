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
     *
     * Soft-deleted bidang otomatis tidak ikut ke sini (global scope bawaan
     * SoftDeletes), jadi tidak perlu filter tambahan.
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

    /**
     * Admin — daftar bidang yang sudah di-soft-delete (Sampah).
     * kategori_count dihitung TERMASUK kategori yang ikut ter-arsip, supaya
     * admin tahu berapa kategori yang akan ikut pulih kalau bidang direstore.
     */
    public function trashed(): JsonResponse
    {
        return response()->json([
            'data' => Bidang::onlyTrashed()
                ->withCount(['kategori' => fn ($query) => $query->withTrashed()])
                ->orderByDesc('deleted_at')
                ->get(),
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

    /**
     * Soft delete: bidang dipindahkan ke Sampah, kategori di bawahnya ikut
     * diarsipkan otomatis (lihat Bidang::booted()), dan semuanya bisa
     * dipulihkan lewat restore().
     */
    public function destroy(Bidang $bidang): JsonResponse
    {
        $bidang->delete();

        return response()->json([
            'message' => 'Bidang berhasil dipindahkan ke Sampah. Kategori di bawahnya ikut diarsipkan dan bisa dipulihkan bersamaan.',
        ]);
    }

    /**
     * Pulihkan bidang dari Sampah. Route model binding standar tidak dipakai
     * di sini (pakai int $id + onlyTrashed()) karena binding implisit Laravel
     * akan 404 untuk record yang sudah soft-deleted.
     */
    public function restore(int $id): JsonResponse
    {
        $bidang = Bidang::onlyTrashed()->findOrFail($id);
        $bidang->restore();

        return response()->json([
            'message' => 'Bidang berhasil dipulihkan beserta kategorinya.',
            'data' => $bidang->fresh(),
        ]);
    }

    /**
     * Hapus permanen dari Sampah — tidak bisa dibatalkan/dipulihkan lagi.
     * Ditolak kalau masih ada kategori terkait (termasuk yang masih di
     * Sampah), supaya tidak meninggalkan data kategori yang datang tanpa
     * bidang induk dan tidak bisa direstore lagi.
     */
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