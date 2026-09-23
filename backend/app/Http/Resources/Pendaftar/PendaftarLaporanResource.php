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
        return [
            'id' => $this->id,
            'judulLaporan' => $this->judul_laporan,
            'fileLaporanUrl' => $this->file_laporan
                ? Storage::disk('public')->url($this->file_laporan)
                : null,
            'fileLaporanName' => $this->file_laporan_name,
            'linkGoogleDrive' => $this->link_google_drive,
            'formNilaiUrl' => $this->form_nilai
                ? Storage::disk('public')->url($this->form_nilai)
                : null,
            'formNilaiName' => $this->form_nilai_name,
            'status' => $this->status, // pending | ditolak | diterima
            'catatanReject' => $this->catatan_reject,
            'tanggalUpload' => $this->tanggal_upload?->toIso8601String(),
            'canEdit' => $this->status === 'ditolak'
                || ($this->status === 'pending'
                    && $this->tanggal_upload
                    && $this->tanggal_upload->diffInDays(now()) < 3),
        ];
    }
}