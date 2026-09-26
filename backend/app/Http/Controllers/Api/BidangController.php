<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\BidangResource;
use App\Models\Bidang;
use App\Services\BidangService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BidangController extends Controller
{
    public function __construct(
        private BidangService $bidangService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $bidang = $this->bidangService->getAll($request->boolean('all'));

        return response()->json([
            'data' => BidangResource::collection($bidang),
        ]);
    }

    public function show(Bidang $bidang): JsonResponse
    {
        $bidang = $this->bidangService->findWithKategori($bidang);

        return response()->json([
            'data' => new BidangResource($bidang),
        ]);
    }
}