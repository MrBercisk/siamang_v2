<?php

namespace App\Http\Resources\Mentor;

use App\Support\LaporanStatus;
use Illuminate\Http\Request;

/**
 * @mixin \App\Models\Bimbingan
 */
class MentorBimbinganDetailResource extends MentorBimbinganListResource
{
    public function toArray(Request $request): array
    {
        return array_merge(parent::toArray($request), [
            'anggota' => [],

            'progressList' => $this->progressItems->map(fn ($item) => [
                'id' => $item->id,
                'tanggal' => $item->tanggal_bimbingan?->format('Y-m-d'),
                'pencapaian' => $item->pencapaian,
                'catatan' => $item->catatan,
                'filePresentasiUrl' => $item->file_presentasi,
            ])->values(),

            // satu laporan per bimbingan.
            'laporanList' => $this->laporan ? [[
                'id' => $this->laporan->id,
                'judulLaporan' => $this->laporan->judul_laporan,
                'fileLaporanUrl' => $this->laporan->file_laporan,
                'linkProject' => $this->laporan->link_google_drive,
                'formNilaiUrl' => $this->laporan->form_nilai,
                'status' => LaporanStatus::toApi($this->laporan->status),
                'catatan_reject' => $this->laporan->catatan_reject,
            ]] : [],

            'nilai' => $this->nilai ? [
                'kehadiran' => (float) $this->nilai->kehadiran,
                'kemampuanKerja' => (float) $this->nilai->kemampuan_kerja,
                'kualitasKerja' => (float) $this->nilai->kualitas_kerja,
                'kerjasama' => (float) $this->nilai->kerjasama,
                'inisiatifKreativitas' => (float) $this->nilai->inisiatif_kreativitas,
                'disiplin' => (float) $this->nilai->disiplin,
                'suratKeteranganName' => $this->nilai->surat_keterangan_name,
                'suratKeteranganUrl' => $this->nilai->surat_keterangan_path,
            ] : null,
        ]);
    }
}