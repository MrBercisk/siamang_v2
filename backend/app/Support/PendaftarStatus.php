<?php

namespace App\Support;

/**
 * Menjembatani istilah status pendaftar antara API (frontend, PendaftarData.status)
 * dan kolom applications.status.
 *
 * Frontend selalu memakai: Verifikasi | Diterima | Ditolak (lihat types/pendaftar.ts).
 * Kolom applications.status memakai istilah lain (lihat TrackedApplication di lib/api.ts):
 * 'pending' | 'reviewing' | 'accepted' | 'rejected'. 'pending' dan 'reviewing'
 * sama-sama dipetakan ke 'Verifikasi' karena frontend hanya mengenal 3 status.
 */
final class PendaftarStatus
{
    public static function toApi(?string $status): string
    {
        return match (strtolower(trim((string) $status))) {
            'accepted', 'diterima' => 'Diterima',
            'rejected', 'ditolak' => 'Ditolak',
            default => 'Verifikasi', // pending, reviewing, atau nilai lain
        };
    }
}