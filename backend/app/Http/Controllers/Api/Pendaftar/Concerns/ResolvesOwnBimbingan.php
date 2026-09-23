<?php

namespace App\Http\Controllers\Api\Pendaftar\Concerns;

use App\Models\Bimbingan;
use Illuminate\Http\Request;

trait ResolvesOwnBimbingan
{
    /**
     * Pendaftar hanya punya satu bimbingan aktif, jadi tidak perlu id dari
     * request. Sesuaikan kolom `user_id` kalau relasi Bimbingan -> User
     * sebenarnya lewat nama kolom lain atau ditelusuri lewat relasi lain
     * ke model Application.
     */
    private function findOwnBimbingan(Request $request): Bimbingan
    {
        return Bimbingan::whereHas('application', fn ($application) =>
            $application->where('user_id', $request->user()->id)
        )
            ->latest()
            ->firstOrFail();
    }
}