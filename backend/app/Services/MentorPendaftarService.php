<?php

namespace App\Services;

use App\Models\Application;
use App\Models\User;
use Illuminate\Support\Collection;

class MentorPendaftarService
{
    public function list(User $mentor): Collection
    {
        $kategoriIds = $mentor->kategoriDiampu()->pluck('kategori.id');

        return Application::with(['user', 'kategori', 'bidang', 'lowongan', 'documentFiles', 'teamMembers'])
            ->whereIn('kategori_id', $kategoriIds)
            ->latest('submitted_at')
            ->get();
    }
}