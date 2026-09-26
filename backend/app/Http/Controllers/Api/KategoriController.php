<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\KategoriResource;
use App\Models\Kategori;
use App\Services\KategoriService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class KategoriController extends Controller
{
    public function __construct(
        private KategoriService $kategoriService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $kategori = $this->kategoriService->getAll(
            $request->integer('bidang_id') ?: null,
            $request->boolean('all')
        );

        return response()->json([
            'data' => KategoriResource::collection($kategori),
        ]);
    }

    public function show(Kategori $kategori): JsonResponse
    {
        $kategori = $this->kategoriService->findWithBidang($kategori);

        return response()->json([
            'data' => new KategoriResource($kategori),
        ]);
    }
}