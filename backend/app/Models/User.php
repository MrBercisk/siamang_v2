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
use Illuminate\Auth\Notifications\ResetPassword as ResetPasswordNotification;

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
    public function sendPasswordResetNotification($token): void
    {
        $frontendUrl = rtrim(config('app.frontend_url'), '/');
        $url = "{$frontendUrl}/reset-password?token={$token}&email=" . urlencode($this->email);

        $this->notify(new class($url) extends ResetPasswordNotification {
            protected string $url;

            public function __construct(string $url)
            {
                parent::__construct('');
                $this->url = $url;
            }

            public function toMail($notifiable)
            {
                return (new \Illuminate\Notifications\Messages\MailMessage)
                    ->subject('Reset Password - SIAMANG')
                    ->line('Anda menerima email ini karena ada permintaan reset password untuk akun Anda.')
                    ->action('Reset Password', $this->url)
                    ->line('Link ini akan kedaluwarsa dalam 60 menit.')
                    ->line('Jika Anda tidak meminta reset password, abaikan email ini.');
            }
        });
    }
}