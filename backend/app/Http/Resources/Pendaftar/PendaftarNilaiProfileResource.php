<?php

namespace App\Http\Resources\Pendaftar;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Application */
class PendaftarNilaiProfileResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $forAi = $request->boolean('for_ai');

        return [
            'nama' => $this->full_name,
            'email' => $forAi ? null : $this->email,
            'nim' => $forAi ? null : $this->nim,
            'instansi' => $this->university,
            'kategori' => $this->kategori?->nama,
            'judulProject' => $this->bimbingan?->judul_project ?? $this->project_title,
            'periodeStart' => $this->internship_start?->toDateString(),
            'periodeEnd' => $this->internship_end?->toDateString(),
            'mentorNama' => $this->mentor?->name,
            'mentorNip' => $forAi ? null : $this->mentor?->nip,
        ];
    }
}