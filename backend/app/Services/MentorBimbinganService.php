<?php

namespace App\Services;

use App\Models\Bimbingan;
use App\Models\Laporan;
use App\Models\Nilai;
use App\Models\User;
use App\Support\LaporanStatus;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class MentorBimbinganService
{
    /**
     * Semua query dibatasi ke mentor yang login (mentor_id), sama seperti
     * MentorDashboardService, supaya mentor tidak bisa melihat bimbingan mentor lain.
     */
    public function list(User $mentor): Collection
    {
        return Bimbingan::with(['application.user', 'application.kategori'])
            ->where('mentor_id', $mentor->id)
            ->latest('last_update')
            ->latest('id')
            ->get();
    }

    /** 404 kalo bimbingan tidak ada atau bukan milik mentor ini */
    public function find(User $mentor, int $id): Bimbingan
    {
        return Bimbingan::with([
            'application.user',
            'application.kategori',
            'progressItems' => fn ($query) => $query->orderBy('tanggal_bimbingan')->orderBy('id'),
            'laporan',
            'nilai',
        ])
            ->where('mentor_id', $mentor->id)
            ->findOrFail($id);
    }

   
    public function updateLaporanStatus(
        Bimbingan $bimbingan,
        int $laporanId,
        string $apiStatus,
        ?string $catatan = null
    ): Laporan {
        // Dicari lewat relasi laporan milik bimbingan lain -> 404.
        $laporan = $bimbingan->laporan()->findOrFail($laporanId);

        $laporan->update([
            'status' => LaporanStatus::toDatabase($apiStatus),
            'catatan_reject' => $apiStatus === 'ditolak' ? $catatan : null,
        ]);

        return $laporan;
    }

    /* Nilai magang */
    public function saveNilai(Bimbingan $bimbingan, array $scores, ?UploadedFile $suratFile = null): Nilai
    {
        return DB::transaction(function () use ($bimbingan, $scores, $suratFile) {
            $rataRata = round(array_sum($scores) / count($scores), 1);

            $payload = [
                ...$scores,
                'predikat' => Nilai::predikatFromRataRata($rataRata),
                'is_published' => true,
            ];

            if ($suratFile) {
                // Hapus file lama dulu
                $existing = $bimbingan->nilai;
                if ($existing?->surat_keterangan_path) {
                    Storage::disk('public')->delete($existing->surat_keterangan_path);
                }

                // directory folder
                $directory = 'applications/' . $bimbingan->application->registration_number . '/nilai';

                $payload['surat_keterangan_path'] = $suratFile->store($directory, 'public');
                $payload['surat_keterangan_name'] = $suratFile->getClientOriginalName();
            }

            $nilai = Nilai::updateOrCreate(['bimbingan_id' => $bimbingan->id], $payload);

            // Nilai sudah diisi mentor bimbingan dianggap selesai.
            $bimbingan->update([
                'status' => 'Selesai',
                'last_update' => now(),
            ]);

            return $nilai->refresh();
        });
    }
}