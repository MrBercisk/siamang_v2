<?php

namespace App\Http\Resources\Pendaftar;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\JadwalBimbingan */
class PendaftarJadwalBimbinganResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'date' => $this->event_date->toDateString(),
            'time' => $this->event_time,
            'location' => $this->location,
            'meetLink' => $this->meet_link,
            'notes' => $this->notes,
        ];
    }
}