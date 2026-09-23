<?php

namespace App\Http\Resources\Pendaftar;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PendaftarDashboardSummaryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'progressPercent' => $this->resource['progressPercent'],
            'judulProject' => $this->resource['judulProject'],
            'internshipEndDate' => $this->resource['internshipEndDate'],
            'remainingDays' => $this->resource['remainingDays'],
            'totalBimbingan' => $this->resource['totalBimbingan'],
            'nextBimbinganDate' => $this->resource['nextBimbinganDate'],
            'nextBimbinganTime' => $this->resource['nextBimbinganTime'],
        ];
    }
}