<?php

namespace App\Http\Controllers\Api\Pendaftar;

use App\Http\Controllers\Api\Pendaftar\Concerns\ResolvesOwnBimbingan;
use App\Http\Controllers\Controller;
use App\Http\Requests\Pendaftar\PendaftarLaporanStoreRequest;
use App\Http\Resources\Pendaftar\PendaftarLaporanResource;
use App\Http\Resources\Pendaftar\PendaftarNilaiResource;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PendaftarLaporanController extends Controller
{
    use ResolvesOwnBimbingan;

    // GET /intern/laporan
    public function index(Request $request): JsonResponse
    {
        $bimbingan = $this->findOwnBimbingan($request);
        $laporan = $bimbingan->laporan;

        $accessStatus = match (true) {
            (int) $bimbingan->progress_percent < 100 => 'locked',
            $laporan === null => 'belum_upload',
            default => $laporan->status,
        };

        return ApiResponse::data([
            'accessStatus' => $accessStatus,
            'progressPercent' => (int) $bimbingan->progress_percent,
            'laporan' => $laporan ? new PendaftarLaporanResource($laporan) : null,
            'nilai' => $bimbingan->nilai ? new PendaftarNilaiResource($bimbingan->nilai) : null,
        ]);
    }

    // POST /intern/laporan
    public function store(PendaftarLaporanStoreRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $bimbingan = $this->findOwnBimbingan($request);

        if ((int) $bimbingan->progress_percent < 100) {
            return ApiResponse::error('Progress magang belum 100%, laporan belum bisa diupload.', 422);
        }

        $existing = $bimbingan->laporan;

        if ($existing && $existing->status !== 'ditolak') {
            $canEdit = $existing->tanggal_upload && $existing->tanggal_upload->diffInDays(now()) < 3;
            if (!$canEdit) {
                return ApiResponse::error('Batas waktu 3 hari untuk mengedit laporan sudah lewat.', 422);
            }
        }

        if (!$existing && !$request->hasFile('file_laporan')) {
            return ApiResponse::error('File laporan wajib diunggah.', 422);
        }

        $data = [
            'judul_laporan' => $validated['judul_laporan'],
            'link_google_drive' => $validated['link_google_drive'],
            'status' => 'pending',
            'catatan_reject' => null,
            'tanggal_upload' => now(),
        ];

        if ($request->hasFile('file_laporan')) {
            if ($existing?->file_laporan) {
                Storage::disk('public')->delete($existing->file_laporan);
            }
            $file = $request->file('file_laporan');
            $data['file_laporan'] = $file->store('laporan', 'public');
            $data['file_laporan_name'] = $file->getClientOriginalName();
        }

        if ($request->hasFile('form_nilai')) {
            if ($existing?->form_nilai) {
                Storage::disk('public')->delete($existing->form_nilai);
            }
            $file = $request->file('form_nilai');
            $data['form_nilai'] = $file->store('form-nilai', 'public');
            $data['form_nilai_name'] = $file->getClientOriginalName();
        }

        $laporan = $existing
            ? tap($existing)->update($data)
            : $bimbingan->laporan()->create($data);

        return ApiResponse::data(new PendaftarLaporanResource($laporan->fresh()), $existing ? 200 : 201);
    }
}