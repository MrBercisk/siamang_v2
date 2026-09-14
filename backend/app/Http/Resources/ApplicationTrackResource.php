<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ApplicationTrackResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'registrationNumber' => $this->registration_number,
            'applicantName' => $this->full_name,
            'institution' => $this->university,
            'fieldName' => $this->bidang?->name,
            'kategoriName' => $this->kategori?->name,
            'lowongan' => $this->lowongan?->project,
            'status' => $this->status,
            'submittedAt' => $this->submitted_at?->toIso8601String(),
            'reviewedAt' => $this->reviewed_at?->toIso8601String(),
            'acceptedAt' => $this->accepted_at?->toIso8601String(),
            'notes' => $this->admin_notes,
            'periode' => $this->periode?->name,
            'periodeStart' => $this->periode?->start_date?->toDateString(),
            'periodeEnd' => $this->periode?->end_date?->toDateString(),
        ];
    }
}