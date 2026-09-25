<?php

namespace App\Http\Resources\Mentor;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;

/**
 * @mixin \App\Models\Bimbingan
 */
class MentorBimbinganListResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $application = $this->application;

        return [
            'id' => $this->id,
            'nama' => $application?->full_name,
            'fotoUrl' => $application?->user?->avatar_url,
            'kategori' => $application?->kategori?->name,
            'judulProject' => $this->judul_project ?: $application?->project_title,
            'tipePendaftaran' => $this->tipe_pendaftaran ?: $application?->registration_type,
            'lastUpdate' => $this->last_update
                ? Carbon::parse($this->last_update)->toIso8601String()
                : null,
            'status' => $this->status,
            'progress' => (int) $this->progress_percent,
        ];
    }
}