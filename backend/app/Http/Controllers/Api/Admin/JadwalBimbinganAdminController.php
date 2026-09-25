<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\JadwalBimbinganRequest;
use App\Http\Resources\Admin\JadwalBimbinganResource;
use App\Models\JadwalBimbingan;
use App\Services\JadwalBimbinganService;
use App\Support\ApiResponse;
use Google\Service\Exception as GoogleServiceException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use RuntimeException;

class JadwalBimbinganAdminController extends Controller
{
    public function __construct(
        private JadwalBimbinganService $jadwalService
    ) {}

    /**
     * menampilkan daftar jadwal bimbingan
     * bisa difilter
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

    /** Menyediakan data pilihan form jadwal
     * mahasiswa yang sudah diterima dan mentor aktif
    */
    public function options(): JsonResponse
    {
        return ApiResponse::data($this->jadwalService->options());
    }

   /** 
    * Menyinkronkan agenda dari Google Calendar ke database 
    * Hanya data yang perlu dibuat, diperbarui, atau dihapus yang akan diproses oleh service */
    public function sync(): JsonResponse
    {
        try {
            $result = $this->jadwalService->syncFromGoogle();
        } catch (RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 503);
        } catch (GoogleServiceException $e) {
            report($e);

            return response()->json(['message' => $this->googleErrorMessage($e)], 502);
        }

        return ApiResponse::data($result);
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

    private function googleErrorMessage(GoogleServiceException $e): string
    {
        return match ($e->getCode()) {
            401, 403 => 'Google menolak akses. Pastikan kalender dibagikan ke service account dengan izin yang cukup.',
            404 => 'Kalender Google tidak ditemukan. Periksa GOOGLE_CALENDAR_ID.',
            default => 'Gagal terhubung ke Google Calendar. Coba lagi beberapa saat.',
        };
    }
}