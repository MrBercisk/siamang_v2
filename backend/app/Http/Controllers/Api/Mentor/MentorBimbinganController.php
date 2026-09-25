<?php

namespace App\Http\Controllers\Api\Mentor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Mentor\StoreNilaiRequest;
use App\Http\Requests\Mentor\UpdateLaporanStatusRequest;
use App\Http\Resources\Mentor\MentorBimbinganDetailResource;
use App\Http\Resources\Mentor\MentorBimbinganListResource;
use App\Services\MentorBimbinganService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MentorBimbinganController extends Controller
{
    public function __construct(
        private MentorBimbinganService $bimbinganService
    ) {}

    /** Daftar mahasiswa bimbingan milik mentor yang login. */
    public function index(Request $request): JsonResponse
    {
        return ApiResponse::data(
            MentorBimbinganListResource::collection(
                $this->bimbinganService->list($request->user())
            )
        );
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $bimbingan = $this->bimbinganService->find($request->user(), $id);

        return ApiResponse::data(new MentorBimbinganDetailResource($bimbingan));
    }

    public function updateLaporan(UpdateLaporanStatusRequest $request, int $id, int $laporanId): JsonResponse
    {
        $bimbingan = $this->bimbinganService->find($request->user(), $id);

        $this->bimbinganService->updateLaporanStatus(
            $bimbingan,
            $laporanId,
            $request->validated('status'),
            $request->validated('catatan')
        );

        return response()->json([
            'message' => 'Status laporan berhasil diperbarui.',
        ]);
    }

    /** Simpan 6 nilai magang + (opsional) surat keterangan untuk satu bimbingan. */
    public function storeNilai(StoreNilaiRequest $request, int $id): JsonResponse
    {
        $bimbingan = $this->bimbinganService->find($request->user(), $id);

        $this->bimbinganService->saveNilai(
            $bimbingan,
            $request->scores(),
            $request->file('suratKeterangan')
        );

        // Muat ulang resource membawa relasi nilai yang baru disimpan
        $bimbingan = $this->bimbinganService->find($request->user(), $id);

        return ApiResponse::data(new MentorBimbinganDetailResource($bimbingan));
    }
}