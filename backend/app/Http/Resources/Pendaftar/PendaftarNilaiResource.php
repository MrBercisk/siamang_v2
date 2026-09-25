<?php

namespace App\Http\Resources\Pendaftar;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

/** @mixin \App\Models\Nilai */
class PendaftarNilaiResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'isPublished' => (bool) $this->is_published,
            'predikat' => $this->is_published ? $this->predikat : null,
            'rataRata' => $this->is_published ? (float) $this->rata_rata : null,
            'aspects' => $this->is_published ? [
                ['key' => 'kehadiran', 'label' => 'Kehadiran', 'skor' => (float) $this->kehadiran],
                ['key' => 'kemampuanKerja', 'label' => 'Kemampuan Kerja', 'skor' => (float) $this->kemampuan_kerja],
                ['key' => 'kualitasKerja', 'label' => 'Kualitas Kerja', 'skor' => (float) $this->kualitas_kerja],
                ['key' => 'kerjasama', 'label' => 'Kerjasama', 'skor' => (float) $this->kerjasama],
                ['key' => 'inisiatifKreativitas', 'label' => 'Inisiatif & Kreativitas', 'skor' => (float) $this->inisiatif_kreativitas],
                ['key' => 'disiplin', 'label' => 'Disiplin', 'skor' => (float) $this->disiplin],
            ] : [],
            'suratKeteranganUrl' => $this->is_published && $this->surat_keterangan_path
                ? Storage::disk('public')->url($this->surat_keterangan_path)
                : null,
            'suratKeteranganName' => $this->is_published ? $this->surat_keterangan_name : null,
        ];
    }
}