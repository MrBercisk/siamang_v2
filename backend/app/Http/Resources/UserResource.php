<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role,
            'nim' => $this->nim,
            'institution' => $this->institution,
            'major' => $this->major,
            'phone' => $this->phone,
            'address' => $this->address,
            'avatar_url' => $this->avatar_url,
            'semester' => $this->semester,
            'ipk' => $this->ipk,
            'skills' => $this->skills,
            'tools' => $this->tools,
            'nip' => $this->nip,
            'email_verified_at' => $this->email_verified_at,
            'created_at' => $this->created_at,

            // Status magang saat ini (kalau ada), diambil dari relasi
            // currentApplication yang sudah didefinisikan di model User —
            // hanya dimuat kalau di-eager-load dari controller (whenLoaded),
            // supaya endpoint ringan seperti /login tidak selalu query tambahan.
            'current_application' => $this->whenLoaded('currentApplication', fn () => [
                'id' => $this->currentApplication->id,
                'status' => $this->currentApplication->status,
                'periode_id' => $this->currentApplication->periode_id,
            ]),
        ];
    }
}