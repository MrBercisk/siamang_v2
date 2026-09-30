<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LowonganResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        if ($request->boolean('for_ai')) {
            return [
                'id' => $this->resource->id,
                'project' => $this->resource->project,
                'kategori' => $this->resource->kategori?->name,
                'bidang' => $this->resource->kategori?->bidang?->name,
                'sisaKuota' => $this->resource->kuota - $this->resource->filled,
            ];
        }

        return $this->resource->toArray();
    }
}