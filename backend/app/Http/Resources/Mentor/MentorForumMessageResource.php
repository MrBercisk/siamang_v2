<?php

namespace App\Http\Resources\Mentor;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\ForumMessage */
class MentorForumMessageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'bimbinganId' => $this->bimbingan_id,
            'senderId' => $this->sender_id,
            'sender' => $this->sender?->name ?? 'Pengguna',
            'role' => $this->is_mentor ? 'mentor' : 'applicant',
            'message' => $this->message,
            'timestamp' => $this->created_at?->toIso8601String(),
        ];
    }
}