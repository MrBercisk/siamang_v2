<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePeriodeRequest;
use App\Http\Requests\Admin\UpdatePeriodeRequest;
use App\Http\Resources\Admin\PeriodeResource;
use App\Models\Periode;
use App\Services\PeriodeService;
use DomainException;
use Illuminate\Http\JsonResponse;

class PeriodeAdminController extends Controller
{
    public function __construct(
        private PeriodeService $periodeService
    ) {}

    public function store(StorePeriodeRequest $request): JsonResponse
    {
        $periode = $this->periodeService->create($request->validated());

        return response()->json([
            'message' => 'Periode berhasil ditambahkan.',
            'data' => new PeriodeResource($periode),
        ], 201);
    }

    public function update(UpdatePeriodeRequest $request, Periode $periode): JsonResponse
    {
        $periode = $this->periodeService->update($periode, $request->validated());

        return response()->json([
            'message' => 'Periode berhasil diperbarui.',
            'data' => new PeriodeResource($periode),
        ]);
    }

    public function destroy(Periode $periode): JsonResponse
    {
        try {
            $this->periodeService->delete($periode);
        } catch (DomainException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        return response()->json([
            'message' => 'Periode berhasil dihapus.',
        ]);
    }
}