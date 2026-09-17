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

            'avatar_url' => $this->avatar_url,
            'semester' => $this->semester,

            'skills' => $this->skills,
            'tools' => $this->tools,
            'email_verified_at' => $this->email_verified_at,
            'created_at' => $this->created_at,
            'must_change_password' => $this->must_change_password,
            'current_application' => $this->whenLoaded('currentApplication', fn () => [
                'id' => $this->currentApplication->id,
                'status' => $this->currentApplication->status,
                'periode_id' => $this->currentApplication->periode_id,
            ]),
        ];
    }
}