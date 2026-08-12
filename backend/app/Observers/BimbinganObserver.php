<?php

namespace App\Observers;

use App\Models\Bimbingan;

class BimbinganObserver
{
    /**
     * Saat mentor menandai bimbingan 'Selesai', kembalikan role user
     * dari 'intern' ke 'alumni' — supaya dia bisa daftar periode
     * magang berikutnya tanpa nyangkut status 'intern' selamanya.
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
