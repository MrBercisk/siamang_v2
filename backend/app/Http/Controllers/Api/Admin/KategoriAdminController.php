<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreKategoriRequest;
use App\Http\Requests\Admin\UpdateKategoriRequest;
use App\Http\Resources\Admin\KategoriResource;
use App\Models\Kategori;
use App\Services\KategoriService;
use DomainException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class KategoriAdminController extends Controller
{
    public function __construct(
        private KategoriService $kategoriService
    ) {}

    public function trashed(Request $request): JsonResponse
    {
        $kategori = $this->kategoriService->getTrashed(
            $request->integer('bidang_id') ?: null
        );

        return response()->json([
            'data' => KategoriResource::collection($kategori),
        ]);
    }

    public function store(StoreKategoriRequest $request): JsonResponse
    {
        $kategori = $this->kategoriService->create($request->validated());

        return response()->json([
            'message' => 'Kategori berhasil ditambahkan.',
            'data' => new KategoriResource($kategori),
        ], 201);
    }

    public function update(UpdateKategoriRequest $request, Kategori $kategori): JsonResponse
    {
        $kategori = $this->kategoriService->update($kategori, $request->validated());

        return response()->json([
            'message' => 'Kategori berhasil diperbarui.',
            'data' => new KategoriResource($kategori),
        ]);
    }

    public function destroy(Kategori $kategori): JsonResponse
    {
        try {
            $this->kategoriService->delete($kategori);
        } catch (DomainException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        return response()->json([
            'message' => 'Kategori berhasil dipindahkan ke Sampah.',
        ]);
    }

    public function restore(int $id): JsonResponse
    {
        $kategori = $this->kategoriService->restore($id);

        return response()->json([
            'message' => 'Kategori berhasil dipulihkan.',
            'data' => new KategoriResource($kategori),
        ]);
    }

    public function forceDelete(int $id): JsonResponse
    {
        try {
            $this->kategoriService->forceDelete($id);
        } catch (DomainException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        return response()->json([
            'message' => 'Kategori berhasil dihapus permanen.',
        ]);
    }
}