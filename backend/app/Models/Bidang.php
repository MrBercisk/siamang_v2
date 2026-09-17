<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Bidang extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'bidang';

    protected $fillable = ['name', 'status'];

    public function kategori()
    {
        return $this->hasMany(Kategori::class);
    }

    protected static function booted(): void
    {
   
        static::deleted(function (Bidang $bidang) {
            if (! $bidang->isForceDeleting()) {
                $bidang->kategori()->delete();
            }
        });

        static::restored(function (Bidang $bidang) {
            $bidang->kategori()->onlyTrashed()->restore();
        });
    }
}