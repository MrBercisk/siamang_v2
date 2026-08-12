<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Laporan extends Model
{
    use HasFactory;

    protected $fillable = [
        'bimbingan_id',
        'judul_laporan',
        'file_laporan',
        'file_laporan_name',
        'link_google_drive',
        'form_nilai',
        'form_nilai_name',
        'status',
        'catatan_reject',
        'tanggal_upload',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_upload' => 'datetime',
        ];
    }

    public function bimbingan()
    {
        return $this->belongsTo(Bimbingan::class);
    }
}
