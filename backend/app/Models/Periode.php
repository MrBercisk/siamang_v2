<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Periode extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'start_date',
        'end_date',
        'announcement_date',
        'internship_start',
        'internship_end',
        'duration_info',
        'system_type',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'announcement_date' => 'date',
            'internship_start' => 'date',
            'internship_end' => 'date',
            'is_active' => 'boolean',
        ];
    }

    public function lowongans()
    {
        return $this->hasMany(Lowongan::class);
    }

    public function applications()
    {
        return $this->hasMany(Application::class);
    }
}
