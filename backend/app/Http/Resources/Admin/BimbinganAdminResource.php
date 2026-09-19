<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\Bimbingan
 */
class BimbinganAdminResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $application = $this->application;

        return [
            'id' => $this->id,
            'applicationId' => $this->application_id,
            'registrationNumber' => $application?->registration_number,

            'participantName' => $application?->full_name,
            'institution' => $application?->university,
            'bidangName' => $application?->bidang?->name,
            'kategoriName' => $application?->kategori?->name,

            'mentorId' => $this->mentor_id,
            'mentorName' => $this->mentor?->name,

            'projectTitle' => $this->judul_project,
            'registrationType' => $this->tipe_pendaftaran,
            'status' => $this->status,
            'progressPercent' => (int) $this->progress_percent,
            'lastUpdate' => $this->last_update?->toIso8601String(),
        ];
    }
}