<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\JadwalBimbingan
 */
class JadwalBimbinganResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,

            'studentUserId' => $this->student_user_id,
            'studentName' => $this->student?->name,
            'studentInstitution' => $this->student_institution,

            'mentorUserId' => $this->mentor_user_id,
            'mentorName' => $this->mentor?->name,

            'date' => $this->event_date?->format('Y-m-d'),
            'time' => $this->event_time,

            'location' => $this->location,
            'meetLink' => $this->meet_link,
            'notes' => $this->notes,

            'googleCalendarSynced' => (bool) $this->google_calendar_synced,
            'googleCalendarEventId' => $this->google_calendar_event_id,
        ];
    }
}