<?php

namespace App\Services;

use App\Models\Bimbingan;
use App\Models\Laporan;
use App\Models\Nilai;
use App\Models\User;
use App\Support\LaporanStatus;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;
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

    /** 404 bila bimbingan tidak ada atau bukan milik mentor ini. */
    public function find(User $mentor, int $id): Bimbingan
    {
        return Bimbingan::with([
            'application.user',
            'application.kategori',
            'progressItems' => fn ($query) => $query->orderBy('tanggal_bimbingan')->orderBy('id'),
            'laporan',
            'nilai',
            // TODO: 'application.teamMembers' — menunggu kolom tabelnya.
        ])
            ->where('mentor_id', $mentor->id)
            ->findOrFail($id);
    }

    /**
     * Setujui / tolak laporan. Alasan penolakan disimpan di catatan_reject
     * dan dikosongkan lagi bila laporan diterima.
     *
     * @param  string  $apiStatus  'diterima' | 'ditolak'
     */
    public function updateLaporanStatus(
        Bimbingan $bimbingan,
        int $laporanId,
        string $apiStatus,
        ?string $catatan = null
    ): Laporan {
        // Dicari lewat relasi: laporan milik bimbingan lain -> 404.
        $laporan = $bimbingan->laporan()->findOrFail($laporanId);

        $laporan->update([
            'status' => LaporanStatus::toDatabase($apiStatus),
            'catatan_reject' => $apiStatus === 'ditolak' ? $catatan : null,
        ]);

        return $laporan;
    }

    /**
     * Simpan/perbarui nilai magang mentor untuk satu bimbingan (upsert 1-1).
     *
     * @param  array{kehadiran:float,kemampuan_kerja:float,kualitas_kerja:float,kerjasama:float,inisiatif_kreativitas:float,disiplin:float}  $scores
     *         Sudah dalam key snake_case sesuai kolom tabel `nilai` (dipetakan di controller).
     */
    public function saveNilai(Bimbingan $bimbingan, array $scores, ?UploadedFile $suratFile = null): Nilai
    {
        $rataRata = round(array_sum($scores) / count($scores), 1);

        $payload = [
            ...$scores,
            'predikat' => Nilai::predikatFromRataRata($rataRata),
            'is_published' => true,
        ];

        if ($suratFile) {
            // Hapus file lama dulu supaya tidak menumpuk di storage.
            $existing = $bimbingan->nilai;
            if ($existing?->surat_keterangan_path) {
                Storage::disk('public')->delete($existing->surat_keterangan_path);
            }

            // Disimpan satu folder dengan berkas application lain
            // (lihat ApplicationService::storeDocuments/storeProfilePhoto),
            // supaya semua berkas satu peserta terkumpul rapi di satu tempat.
            $directory = 'applications/' . $bimbingan->application->registration_number . '/nilai';

            $payload['surat_keterangan_path'] = $suratFile->store($directory, 'public');
            $payload['surat_keterangan_name'] = $suratFile->getClientOriginalName();
        }

        $nilai = Nilai::updateOrCreate(['bimbingan_id' => $bimbingan->id], $payload);

        // 'rata_rata' adalah generated column di MySQL (dihitung otomatis dari
        // 6 kolom nilai) — tidak boleh di-set manual, jadi cukup refresh
        // supaya nilai terbaru yang dihitung MySQL ikut terbaca.
        return $nilai->refresh();
    }
}