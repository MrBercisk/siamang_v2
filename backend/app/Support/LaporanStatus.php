<?php

namespace App\Support;

/**
 * Menjembatani istilah status laporan antara API (frontend) dan kolom laporan.status.
 *
 * API selalu memakai: pending | diterima | ditolak.
 * Konstanta di bawah adalah nilai yang DITULIS ke database; sesuaikan bila tabel
 * laporan memakai istilah lain (mis. 'approved' / 'rejected').
 */
final class LaporanStatus
{
    public const PENDING = 'pending';
    public const APPROVED = 'diterima';
    public const REJECTED = 'ditolak';

    /** Nilai database -> istilah API. Toleran terhadap istilah bahasa Inggris. */
    public static function toApi(?string $status): string
    {
        $value = strtolower(trim((string) $status));

        if (in_array($value, ['diterima', 'approved', 'accepted'], true)) {
            return 'diterima';
        }

        if (in_array($value, ['ditolak', 'rejected', 'declined'], true)) {
            return 'ditolak';
        }

        return 'pending';
    }

    /** Istilah API ('diterima' | 'ditolak') -> nilai yang disimpan di database. */
    public static function toDatabase(string $apiStatus): string
    {
        return $apiStatus === 'diterima' ? self::APPROVED : self::REJECTED;
    }
}