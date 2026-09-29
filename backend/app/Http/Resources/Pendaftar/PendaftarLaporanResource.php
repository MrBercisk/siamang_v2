<?php

namespace App\Http\Resources\Pendaftar;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

/** @mixin \App\Models\Laporan */
class PendaftarLaporanResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $forAi = $request->boolean('for_ai');

        return [
            'id' => $this->id,
            'judulLaporan' => $this->judul_laporan,
            'fileLaporanUrl' => $forAi ? null : ($this->file_laporan
                ? Storage::disk('public')->url($this->file_laporan)
                : null),
            'fileLaporanName' => $this->file_laporan_name,
            'linkGoogleDrive' => $forAi ? null : $this->link_google_drive,
            'formNilaiUrl' => $forAi ? null : ($this->form_nilai
                ? Storage::disk('public')->url($this->form_nilai)
                : null),
            'formNilaiName' => $this->form_nilai_name,
            'status' => $this->status, // pending | ditolak | diterima
            'catatanReject' => $this->catatan_reject,
            'tanggalUpload' => $forAi
                ? $this->tanggal_upload?->toDateString()
                : $this->tanggal_upload?->toIso8601String(),
            'canEdit' => $this->status === 'ditolak'
                || ($this->status === 'pending'
                    && $this->tanggal_upload
                    && $this->tanggal_upload->diffInDays(now()) < 3),
        ];
    }
}