<?php

namespace App\Observers;

use App\Models\Bimbingan;

class BimbinganObserver
{
    /**
     * Setelah bimbingan selesai, ubah role intern menjadi alumni
     * agar user dapat mengikuti periode magang berikutnya
     */
    public function updated(Bimbingan $bimbingan): void
    {
        if (! $bimbingan->wasChanged('status') || $bimbingan->status !== 'Selesai') {
            return;
        }

        $user = $bimbingan->application?->user;

        if ($user && $user->role === 'intern') {
            $user->update(['role' => 'alumni']);
        }
    }
}

