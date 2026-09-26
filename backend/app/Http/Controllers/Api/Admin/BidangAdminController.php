<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreBidangRequest;
use App\Http\Requests\Admin\UpdateBidangRequest;
use App\Http\Resources\Admin\BidangResource;
use App\Models\Bidang;
use App\Services\BidangService;
use DomainException;
use Illuminate\Http\JsonResponse;

class BidangAdminController extends Controller
{
    public function __construct(
        private BidangService $bidangService
    ) {}

    public function trashed(): JsonResponse
    {
        return response()->json([
            'data' => BidangResource::collection($this->bidangService->getTrashed()),
        ]);
    }

    public function store(StoreBidangRequest $request): JsonResponse
    {
        $bidang = $this->bidangService->create($request->validated());

        return response()->json([
            'message' => 'Bidang berhasil ditambahkan.',
            'data' => new BidangResource($bidang),
        ], 201);
    }

    public function update(UpdateBidangRequest $request, Bidang $bidang): JsonResponse
    {
        $bidang = $this->bidangService->update($bidang, $request->validated());

        return response()->json([
            'message' => 'Bidang berhasil diperbarui.',
            'data' => new BidangResource($bidang),
        ]);
    }

    public function destroy(Bidang $bidang): JsonResponse
    {
        $this->bidangService->delete($bidang);

        return response()->json([
            'message' => 'Bidang berhasil dipindahkan ke Sampah. Kategori di bawahnya ikut diarsipkan dan bisa dipulihkan bersamaan.',
        ]);
    }

    public function restore(int $id): JsonResponse
    {
        $bidang = $this->bidangService->restore($id);

        return response()->json([
            'message' => 'Bidang berhasil dipulihkan beserta kategorinya.',
            'data' => new BidangResource($bidang),
        ]);
    }

    public function forceDelete(int $id): JsonResponse
    {
        try {
            $this->bidangService->forceDelete($id);
        } catch (DomainException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        return response()->json([
            'message' => 'Bidang berhasil dihapus permanen.',
        ]);
    }
}