<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kategori extends Model
{
    use HasFactory;

    protected $fillable = ['bidang_id', 'name', 'quota', 'description'];

    public function bidang()
    {
        return $this->belongsTo(Bidang::class);
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
