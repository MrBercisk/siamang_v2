<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProgressItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'bimbingan_id',
        'judul_project',
        'tanggal_bimbingan',
        'pencapaian',
        'catatan',
        'file_presentasi',
        'file_name',
        'tanggal_upload',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_bimbingan' => 'date',
            'tanggal_upload' => 'datetime',
        ];
    }

    public function bimbingan()
    {
        return $this->belongsTo(Bimbingan::class);
    }
}
