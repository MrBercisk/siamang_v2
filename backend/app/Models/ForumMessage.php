<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ForumMessage extends Model
{
    use HasFactory;

    protected $fillable = ['bimbingan_id', 'sender_id', 'message', 'is_mentor'];

    protected function casts(): array
    {
        return [
            'is_mentor' => 'boolean',
        ];
    }

    public function bimbingan()
    {
        return $this->belongsTo(Bimbingan::class);
    }

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }
}
