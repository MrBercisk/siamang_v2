<?php

namespace App\Support;

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