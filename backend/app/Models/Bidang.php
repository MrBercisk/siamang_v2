<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bidang extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'status'];

    public function kategoris()
    {
        return $this->hasMany(Kategori::class);
    }
}
