<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\LowonganResource;
use App\Models\Lowongan;
use App\Services\LowonganService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LowonganController extends Controller
{
    public function __construct(
        private LowonganService $lowonganService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $lowongan = $this->lowonganService->getAll($request);

        return response()->json([
            'data' => LowonganResource::collection($lowongan),
        ]);
    }

    public function show(Lowongan $lowongan): JsonResponse
    {
        $lowongan = $this->lowonganService->findWithRelations($lowongan);

        return response()->json([
            'data' => new LowonganResource($lowongan),
        ]);
    }
}