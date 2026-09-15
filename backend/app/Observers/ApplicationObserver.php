<?php

namespace App\Observers;

use App\Models\Application;
use App\Models\Bimbingan;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class ApplicationObserver
{
    /**
     * Satu-satunya tempat yang boleh mengubah `users.role` berdasarkan
     * perubahan status application. Controller / service lain TIDAK boleh
     * meng-update role secara manual saat mengubah status application —
     * cukup ubah `applications.status`, sisanya otomatis di sini.
     */
     public function updating(Application $application): void
    {
        // Fail fast: jangan biarkan status berubah jadi 'accepted' kalau
        // mentor belum di-assign atau mentor-nya invalid. Lebih baik error
        // eksplisit di sini daripada Bimbingan diam-diam gagal terbentuk.
        if ($application->isDirty('status') && $application->status === 'accepted') {
            $this->assertMentorIsValid($application);
        }
    }
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
    protected function assertMentorIsValid(Application $application): void
    {
        if (! $application->mentor_id) {
            throw new \InvalidArgumentException(
                'Application tidak bisa diterima tanpa mentor_id. Assign mentor terlebih dahulu.'
            );
        }

        $mentor = User::find($application->mentor_id);

        if (! $mentor || $mentor->role !== 'mentor') {
            throw new \InvalidArgumentException(
                'mentor_id pada application ini bukan user dengan role mentor yang valid.'
            );
        }
    }

    protected function handleAccepted(Application $application): void
    {
        DB::transaction(function () use ($application) {
            if (! $application->bimbingan) {
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
                $application->accepted_at = now();
                $application->saveQuietly();
            }

            $user = $application->user;

            if ($user && in_array($user->role, ['applicant', 'alumni'], true)) {
                $user->update(['role' => 'intern']);
            }
        });
    }
    protected function handleRejected(Application $application): void
    {
        DB::transaction(function () use ($application) {
            $user = $application->user;

            if ($user && $user->role === 'intern' && ! $this->hasOtherActiveAcceptance($application)) {
                $user->update([
                    'role' => $this->hasEverCompletedInternship($user) ? 'alumni' : 'applicant',
                ]);
            }
        });
    }

    protected function hasOtherActiveAcceptance(Application $application): bool
    {
        return Application::where('user_id', $application->user_id)
            ->where('id', '!=', $application->id)
            ->where('status', 'accepted')
            ->exists();
    }

     protected function hasEverCompletedInternship(User $user): bool
    {
        return Bimbingan::whereHas('application', fn ($q) => $q->where('user_id', $user->id))
            ->where('status', 'Selesai')
            ->exists();
    }
}
