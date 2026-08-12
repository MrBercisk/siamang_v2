<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Nilai extends Model
{
    use HasFactory;

    protected $fillable = [
        'bimbingan_id',
        'kehadiran',
        'kemampuan_kerja',
        'kualitas_kerja',
        'kerjasama',
        'inisiatif_kreativitas',
        'disiplin',
        'predikat',
        'is_published',
        'surat_keterangan_path',
        'surat_keterangan_name',
    ];

    // rata_rata adalah generated column (dihitung DB), jangan diisi manual.
    protected $guarded_extra = ['rata_rata'];

    protected function casts(): array
    {
        return [
            'is_published' => 'boolean',
            'kehadiran' => 'decimal:1',
            'kemampuan_kerja' => 'decimal:1',
            'kualitas_kerja' => 'decimal:1',
            'kerjasama' => 'decimal:1',
            'inisiatif_kreativitas' => 'decimal:1',
            'disiplin' => 'decimal:1',
            'rata_rata' => 'decimal:1',
        ];
    }

    public function bimbingan()
    {
        return $this->belongsTo(Bimbingan::class);
    }

    /**
     * Hitung predikat berdasarkan rata_rata, sesuai skala di PRD §4.12.
     */
    public static function predikatFromRataRata(float $rataRata): string
    {
        return match (true) {
            $rataRata >= 8.5 => 'Sangat Baik (A)',
            $rataRata >= 7.0 => 'Baik (B)',
            $rataRata >= 5.5 => 'Cukup (C)',
            default => 'Belum Lulus (D)',
        };
    }
}
