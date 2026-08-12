<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Logbook extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'log_date', 'activity', 'status', 'reviewer_notes'];

    protected function casts(): array
    {
        return [
            'log_date' => 'date',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
