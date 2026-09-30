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

    public function aiDetail(Lowongan $lowongan): JsonResponse
    {
        $lowongan->load(['periode', 'kategori.bidang']);

        abort_unless(
            $lowongan->is_active && $lowongan->filled < $lowongan->kuota,
            404,
            'Lowongan tidak tersedia.'
        );

        return response()->json([
            'data' => [
                'id' => $lowongan->id,
                'project' => $lowongan->project,
                'definisi' => $lowongan->definisi,
                'detailKebutuhan' => $lowongan->detail_kebutuhan,
                'kategori' => $lowongan->kategori?->name,
                'bidang' => $lowongan->kategori?->bidang?->name,
                'periode' => $lowongan->periode?->name,
                'periodeMulai' => $lowongan->periode?->start_date?->toDateString(),
                'periodeSelesai' => $lowongan->periode?->end_date?->toDateString(),
                'kuota' => $lowongan->kuota,
                'terisi' => $lowongan->filled,
                'sisaKuota' => max($lowongan->kuota - $lowongan->filled, 0),
            ],
        ]);
    }
}