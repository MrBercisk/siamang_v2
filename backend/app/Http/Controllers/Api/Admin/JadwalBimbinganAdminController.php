<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\JadwalBimbinganRequest;
use App\Http\Resources\Admin\JadwalBimbinganResource;
use App\Models\JadwalBimbingan;
use App\Services\JadwalBimbinganService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class JadwalBimbinganAdminController extends Controller
{
    public function __construct(
        private JadwalBimbinganService $jadwalService
    ) {}

    /**
     * Filter opsional: month, year, student_user_id, mentor_user_id.
     * Tidak dipaginasi karena kalender butuh semua jadwal pada rentang yang dilihat.
     */
    public function index(Request $request): JsonResponse
    {
        $jadwals = $this->jadwalService->list(
            $request->only(['month', 'year', 'student_user_id', 'mentor_user_id'])
        );

        return ApiResponse::data(
            JadwalBimbinganResource::collection($jadwals)
        );
    }

    /** Pilihan untuk form tambah jadwal: mahasiswa (application accepted) & mentor aktif. */
    public function options(): JsonResponse
    {
        return ApiResponse::data($this->jadwalService->options());
    }

    public function store(JadwalBimbinganRequest $request): JsonResponse
    {
        $jadwal = $this->jadwalService->create($request->validated());

        return ApiResponse::success(
            new JadwalBimbinganResource($jadwal),
            'Jadwal bimbingan berhasil ditambahkan.',
            201
        );
    }

    public function update(JadwalBimbinganRequest $request, int $id): JsonResponse
    {
        $jadwal = JadwalBimbingan::findOrFail($id);

        $jadwal = $this->jadwalService->update($jadwal, $request->validated());

        return ApiResponse::success(
            new JadwalBimbinganResource($jadwal),
            'Jadwal bimbingan berhasil diperbarui.'
        );
    }

    public function destroy(int $id): JsonResponse
    {
        $jadwal = JadwalBimbingan::findOrFail($id);

        $this->jadwalService->delete($jadwal);

        return response()->json([
            'message' => 'Jadwal bimbingan berhasil dihapus.',
        ]);
    }
}