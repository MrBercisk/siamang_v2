<?php

namespace App\Http\Resources\Pendaftar;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Nilai */
class PendaftarNilaiResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'isPublished' => (bool) $this->is_published,
            'predikat' => $this->is_published ? $this->predikat : null,
            'rataRata' => $this->is_published ? (float) $this->rata_rata : null,
        ];
    }
}