<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lowongan extends Model
{
    use HasFactory;

    protected $table = 'lowongan';

    protected $fillable = [
        'periode_id',
        'kategori_id',
        'project',
        'definisi',
        'detail_kebutuhan',
        'kuota',
        'filled',
        'is_active',
    ];

    protected function casts(): array
    {
         return [
            'kuota' => 'integer',
            'filled' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function periode()
    {
        return $this->belongsTo(Periode::class);
    }

    public function kategori()
    {
        return $this->belongsTo(Kategori::class);
    }

    public function applications()
    {
        return $this->hasMany(Application::class);
    }
}
