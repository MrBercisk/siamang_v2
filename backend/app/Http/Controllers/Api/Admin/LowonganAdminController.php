<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreLowonganRequest;
use App\Http\Requests\Admin\UpdateLowonganRequest;
use App\Http\Resources\Admin\LowonganResource;
use App\Models\Lowongan;
use App\Services\LowonganService;
use DomainException;
use Illuminate\Http\JsonResponse;

class LowonganAdminController extends Controller
{
    public function __construct(
        private LowonganService $lowonganService
    ) {}

    public function store(StoreLowonganRequest $request): JsonResponse
    {
        $lowongan = $this->lowonganService->create($request->validated());

        return response()->json([
            'message' => 'Lowongan berhasil ditambahkan.',
            'data' => new LowonganResource($lowongan),
        ], 201);
    }

    public function update(UpdateLowonganRequest $request, Lowongan $lowongan): JsonResponse
    {
        $lowongan = $this->lowonganService->update($lowongan, $request->validated());

        return response()->json([
            'message' => 'Lowongan berhasil diperbarui.',
            'data' => new LowonganResource($lowongan),
        ]);
    }

    public function destroy(Lowongan $lowongan): JsonResponse
    {
        try {
            $this->lowonganService->delete($lowongan);
        } catch (DomainException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        return response()->json([
            'message' => 'Lowongan berhasil dihapus.',
        ]);
    }
}