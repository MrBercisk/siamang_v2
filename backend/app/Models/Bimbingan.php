<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bimbingan extends Model
{
    use HasFactory;

    protected $fillable = [
        'application_id',
        'mentor_id',
        'judul_project',
        'tipe_pendaftaran',
        'status',
        'progress_percent',
        'last_update',
    ];

    protected function casts(): array
    {
        return [
            'last_update' => 'datetime',
        ];
    }

    public function application()
    {
        return $this->belongsTo(Application::class);
    }

    public function mentor()
    {
        return $this->belongsTo(User::class, 'mentor_id');
    }

    public function progressItems()
    {
        return $this->hasMany(ProgressItem::class);
    }

    public function laporan()
    {
        return $this->hasOne(Laporan::class);
    }

    public function nilai()
    {
        return $this->hasOne(Nilai::class);
    }

    public function forumMessages()
    {
        return $this->hasMany(ForumMessage::class);
    }
}
