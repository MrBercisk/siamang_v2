<?php

namespace App\Http\Controllers\Api\Pendaftar\Concerns;

use App\Models\Bimbingan;
use Illuminate\Http\Request;

trait ResolvesOwnBimbingan
{
    /**
     * Mengambil bimbingan milik pendaftar yang sedang login.
     *
     * Pendaftar tidak perlu mengirim ID bimbingan karena
     * data bisa ditelusuri dari application miliknya
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