<?php

namespace App\Http\Resources\Pendaftar;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

/** @mixin \App\Models\ProgressItem */
class PendaftarProgressItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'judulProject' => $this->judul_project,
            'tanggalBimbingan' => $this->tanggal_bimbingan?->toDateString(),
            'pencapaian' => $this->pencapaian,
            'catatan' => $this->catatan,
            'filePresentasiUrl' => $this->file_presentasi
                ? Storage::disk('public')->url($this->file_presentasi)
                : null,
            'fileName' => $this->file_name,
            'tanggalUpload' => $this->tanggal_upload?->toIso8601String(),
        ];
    }
}