<?php

namespace App\Observers;

use App\Models\Application;
use App\Models\Bimbingan;

class ApplicationObserver
{
    /**
     * Satu-satunya tempat yang boleh mengubah `users.role` berdasarkan
     * perubahan status application. Controller / service lain TIDAK boleh
     * meng-update role secara manual saat mengubah status application —
     * cukup ubah `applications.status`, sisanya otomatis di sini.
     */
    public function updated(Application $application): void
    {
        if (! $application->wasChanged('status')) {
            return;
        }

        match ($application->status) {
            'accepted' => $this->handleAccepted($application),
            'rejected' => $this->handleRejected($application),
            default => null, // 'pending', 'reviewing' -> tidak mengubah role
        };
    }

    protected function handleAccepted(Application $application): void
    {
        // Auto-create bimbingan (PRD §11 Fase 3), hanya jika belum ada
        // dan mentor sudah ditugaskan.
        if (! $application->bimbingan && $application->mentor_id) {
            Bimbingan::create([
                'application_id' => $application->id,
                'mentor_id' => $application->mentor_id,
                'judul_project' => $application->project_title,
                'tipe_pendaftaran' => $application->registration_type,
                'status' => 'On Progress',
                'progress_percent' => 0,
            ]);
        }

        if (! $application->accepted_at) {
            $application->saveQuietly(['accepted_at' => now()]);
        }

        $user = $application->user;

        // Jangan timpa role admin/mentor kalau suatu saat admin ikut apply.
        if ($user && in_array($user->role, ['applicant', 'alumni'], true)) {
            $user->update(['role' => 'intern']);
        }
    }

    protected function handleRejected(Application $application): void
    {
        $user = $application->user;

        // Kalau user ini sedang tidak punya application aktif lain yang
        // diterima, pastikan rolenya balik netral (applicant/alumni),
        // jangan nyangkut di 'intern'.
        if ($user && $user->role === 'intern' && ! $this->hasOtherActiveAcceptance($application)) {
            $user->update(['role' => $this->hasEverCompletedInternship($user) ? 'alumni' : 'applicant']);
        }
    }

    protected function hasOtherActiveAcceptance(Application $application): bool
    {
        return Application::where('user_id', $application->user_id)
            ->where('id', '!=', $application->id)
            ->where('status', 'accepted')
            ->exists();
    }

    protected function hasEverCompletedInternship($user): bool
    {
        return Bimbingan::whereHas('application', fn ($q) => $q->where('user_id', $user->id))
            ->where('status', 'Selesai')
            ->exists();
    }
}
