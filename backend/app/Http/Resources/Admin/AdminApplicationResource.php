<?php

namespace App\Http\Resources\Admin;

use App\Http\Resources\DocumentFileResource;
use App\Http\Resources\TeamMemberResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class AdminApplicationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'registrationNumber' => $this->registration_number,
            'applicantName' => $this->full_name,
            'userId' => $this->user_id,

            'avatarUrl' => $this->user?->avatar_url
                ? Storage::url($this->user->avatar_url)
                : null,

            'institution' => $this->university,
            'major' => $this->major,
            'nim' => $this->nim,
            'phone' => $this->phone,
            'email' => $this->email,
            'projectTitle' => $this->project_title,
            'skills' => $this->skills,
            'tools' => $this->tools,
            'semester' => $this->semester,

            'startDate' => $this->internship_start?->toDateString(),
            'endDate' => $this->internship_end?->toDateString(),

            'fieldId' => (string) $this->bidang_id,
            'fieldName' => $this->bidang?->name,
            'kategoriId' => $this->kategori_id,
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

            'mentor' => $this->when(
                $this->bimbingan?->mentor,
                fn () => [
                    'id' => $this->bimbingan->mentor->id,
                    'name' => $this->bimbingan->mentor->name,
                    'email' => $this->bimbingan->mentor->email,
                ],
                $this->when(
                    $this->mentor_id,
                    fn () => [
                        'id' => $this->mentor_id,
                        'name' => null,
                        'email' => null,
                        'note' => 'Mentor di-assign, menunggu status accepted untuk membuat bimbingan.',
                    ]
                )
            ),

            'bimbingan' => $this->when(
                $this->bimbingan,
                fn () => [
                    'id' => $this->bimbingan->id,
                    'status' => $this->bimbingan->status,
                    'progressPercent' => $this->bimbingan->progress_percent,
                ]
            ),

            'documents' => DocumentFileResource::collection(
                $this->whenLoaded('documentFiles')
            ),

            'teamMembers' => TeamMemberResource::collection(
                $this->whenLoaded('teamMembers')
            ),
        ];
    }
}