<?php

namespace App\Services;

use App\Models\Bimbingan;
use App\Models\Laporan;
use App\Models\User;
use App\Support\LaporanStatus;
use Illuminate\Support\Collection;

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
            // TODO: 'nilai' dan 'application.teamMembers' — menunggu kolom tabelnya.
        ])
            ->where('mentor_id', $mentor->id)
            ->findOrFail($id);
    }

    /**
     * Setujui / tolak laporan. Alasan penolakan disimpan di catatan_reject
     * dan dikosongkan lagi bila laporan disetujui.
     *
     * @param  string  $apiStatus  'disetujui' | 'ditolak'
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
}