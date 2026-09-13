<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ApplicationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,

            'applicantName' => $this->full_name,
            'institution' => $this->university,
            'major' => $this->major,
            'nim' => $this->nim,
            'phone' => $this->phone,
            'email' => $this->email,
            'address' => $this->address,

            'projectTitle' => $this->project_title,
            'skills' => $this->skills,
            'tools' => $this->tools,
            'semester' => $this->semester,

            'startDate' => $this->internship_start?->toDateString(),
            'endDate' => $this->internship_end?->toDateString(),

            'fieldId' => (string) $this->bidang_id,
            'fieldName' => $this->bidang?->name,
            'kategoriName' => $this->kategori?->name,

            'lowonganId' => $this->lowongan_id,
            'lowongan' => $this->lowongan?->project,

            'registrationType' => $this->registration_type,
            'status' => $this->status,

            'submittedAt' => $this->submitted_at?->toIso8601String(),
            'declaredAt' => $this->declared_at?->toIso8601String(),
            'reviewedAt' => $this->reviewed_at?->toIso8601String(),
            'acceptedAt' => $this->accepted_at?->toIso8601String(),

            'notes' => $this->admin_notes,

            'periode' => $this->periode?->name,
            'periodeStart' => $this->periode?->start_date?->toDateString(),
            'periodeEnd' => $this->periode?->end_date?->toDateString(),

            'documents' => DocumentFileResource::collection(
                $this->whenLoaded('documentFiles')
            ),

            'teamMembers' => TeamMemberResource::collection(
                $this->whenLoaded('teamMembers')
            ),
        ];
    }
}