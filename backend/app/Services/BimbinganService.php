<?php

namespace App\Services;

use App\Models\Bimbingan;
use Illuminate\Support\Collection;

class BimbinganService
{
    /**
     * Daftar bimbingan untuk monitoring admin. Tidak dipaginasi karena tab
     * monitoring menghitung ringkasan status dari seluruh data.
     *
     * Filter opsional: status, periode_id (lewat application).
     */
    public function getAllForAdmin(array $filters = []): Collection
    {
        $query = Bimbingan::with([
            'application.bidang',
            'application.kategori',
            'mentor',
        ]);

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['periode_id'])) {
            $query->whereHas(
                'application',
                fn ($q) => $q->where('periode_id', $filters['periode_id'])
            );
        }

        return $query
            ->latest('last_update')
            ->latest('id')
            ->get();
    }
}