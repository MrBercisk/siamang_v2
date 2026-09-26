<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\PeriodeResource;
use App\Models\Periode;
use App\Services\PeriodeService;
use Illuminate\Http\JsonResponse;

class PeriodeController extends Controller
{
    public function __construct(
        private PeriodeService $periodeService
    ) {}

    public function index(): JsonResponse
    {
        return response()->json([
            'data' => PeriodeResource::collection($this->periodeService->getAll()),
        ]);
    }

    public function active(): JsonResponse
    {
        $periode = $this->periodeService->getActive();

        if (! $periode) {
            return response()->json([
                'data' => null,
                'message' => 'Belum ada periode pendaftaran yang aktif.',
            ]);
        }

        return response()->json(['data' => new PeriodeResource($periode)]);
    }

    public function show(Periode $periode): JsonResponse
    {
        return response()->json(['data' => new PeriodeResource($periode)]);
    }
}