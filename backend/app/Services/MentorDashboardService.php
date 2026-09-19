<?php

namespace App\Services;

use App\Models\Application;
use App\Models\Bimbingan;
use App\Models\JadwalBimbingan;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;

class MentorDashboardService
{
    /**
     * Semua data di sini dibatasi ke mentor yang login, supaya mentor tidak
     * bisa melihat jadwal atau mahasiswa mentor lain.
     */
    public function getDashboard(User $mentor): array
    {
        return [
            'stats' => $this->getStats($mentor),
            'schedules' => $this->getSchedules($mentor),
            'students' => $this->getStudents($mentor),
        ];
    }

    /**
     * Statistik pendaftar pada kategori yang diampu mentor
     * (pivot kategori_mentor, sama seperti getAvailableMentors()).
     */
    private function getStats(User $mentor): array
    {
        $kategoriIds = $mentor->kategoriDiampu()->pluck('kategori.id');

        $counts = Application::whereIn('kategori_id', $kategoriIds)
            ->selectRaw('status, COUNT(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        return [
            'totalPendaftar' => (int) $counts->sum(),
            'diterima' => (int) ($counts['accepted'] ?? 0),
            'ditolak' => (int) ($counts['rejected'] ?? 0),
        ];
    }

    /** Semua jadwal milik mentor; kalender & agenda mendatang dihitung di frontend. */
    private function getSchedules(User $mentor): Collection
    {
        return JadwalBimbingan::with(['student', 'mentor'])
            ->where('mentor_user_id', $mentor->id)
            ->orderBy('event_date')
            ->orderBy('event_time')
            ->get();
    }

    private function getStudents(User $mentor): Collection
    {
        return Bimbingan::with('application.user')
            ->where('mentor_id', $mentor->id)
            ->latest('last_update')
            ->latest('id')
            ->get()
            ->map(function (Bimbingan $bimbingan) {
                $application = $bimbingan->application;
                $avatarPath = $application?->user?->avatar_url;

                return [
                    'id' => $bimbingan->id,
                    'name' => $application?->full_name,
                    'avatarUrl' => $avatarPath
                        ? Storage::disk('public')->url($avatarPath)
                        : null,
                    'progressPercent' => (int) $bimbingan->progress_percent,
                    'status' => $bimbingan->status,
                ];
            });
    }
}