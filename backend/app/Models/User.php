<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable([
    'name',
    'email',
    'password',
    'role',
    'phone',
    'avatar_url',

    // mentor data
    'nip',
    'position',
    'status',
    'must_change_password'
])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'must_change_password' => 'boolean',
        ];
    }

    public function applications()
    {
        return $this->hasMany(Application::class);
    }

    public function currentApplication()
    {
        return $this->hasOne(Application::class)->latestOfMany();
    }

    public function kategoriDiampu()
    {
        return $this->belongsToMany(Kategori::class, 'kategori_mentor', 'user_id', 'kategori_id')
            ->withTimestamps();
    }

    public function bimbinganSebagaiMentor()
    {
        return $this->hasMany(Bimbingan::class, 'mentor_id');
    }

    public function scopeMentors($query)
    {
        return $query->where('role', 'mentor');
    }

    public function scopePendaftar($query)
    {
        return $query->where('role', 'pendaftar');
    }

    public function scopeAdmins($query)
    {
        return $query->where('role', 'admin');
    }
}