<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JadwalBimbingan extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'student_user_id',
        'student_institution',
        'mentor_user_id',
        'event_date',
        'event_time',
        'location',
        'meet_link',
        'google_calendar_synced',
        'google_calendar_event_id',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'event_date' => 'date',
            'google_calendar_synced' => 'boolean',
        ];
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_user_id');
    }

    public function mentor()
    {
        return $this->belongsTo(User::class, 'mentor_user_id');
    }
}
