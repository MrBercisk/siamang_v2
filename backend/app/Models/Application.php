<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'periode_id',
        'lowongan_id',
        'bidang_id',
        'kategori_id',
        'full_name',
        'email',
        'phone',
        'address',
        'university',
        'major',
        'semester',
        'nim',
        'ipk',
        'skills',
        'tools',
        'project_title',
        'registration_type',
        'internship_start',
        'internship_end',
        'status',
        'admin_notes',
        'mentor_id',
        'submitted_at',
        'reviewed_at',
        'accepted_at',
    ];

    protected function casts(): array
    {
        return [
            'internship_start' => 'date',
            'internship_end' => 'date',
            'submitted_at' => 'datetime',
            'reviewed_at' => 'datetime',
            'accepted_at' => 'datetime',
            'ipk' => 'decimal:2',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function periode()
    {
        return $this->belongsTo(Periode::class);
    }

    public function lowongan()
    {
        return $this->belongsTo(Lowongan::class);
    }

    public function bidang()
    {
        return $this->belongsTo(Bidang::class);
    }

    public function kategori()
    {
        return $this->belongsTo(Kategori::class);
    }

    public function mentor()
    {
        return $this->belongsTo(User::class, 'mentor_id');
    }

    public function teamMembers()
    {
        return $this->hasMany(TeamMember::class);
    }

    public function documentFiles()
    {
        return $this->hasMany(DocumentFile::class);
    }

    public function bimbingan()
    {
        return $this->hasOne(Bimbingan::class);
    }
}
