<?php

namespace App\Http\Resources\Mentor;

use App\Support\PendaftarStatus;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\Application
 *
 * Bentuk respons mengikuti PendaftarData (frontend types/pendaftar.ts) —
 * satu endpoint membawa semua field termasuk dokumen & anggota kelompok,
 * sama seperti pola admin (tidak ada GET detail terpisah).
 *
 * Beberapa pemetaan kolom masih ASUMSI (belum dikonfirmasi):
 * - fotoUrl        : user->avatar_url (sama seperti MentorDashboardService::getStudents())
 * - alasanPenolakan: admin_notes (diisi manual saat admin menolak — perlu dikonfirmasi)
 * - documents[]     : documentFiles->document_type, ->file_path
 * - teamMembers[]   : teamMembers->full_name, ->nim
 * - bidang / kategori / lowongan: relasi ->name (Bidang, Kategori) dan ->title (Lowongan)
 * Lihat PENDAFTAR_MENTOR_API.md untuk cara memverifikasi & memperbaikinya.
 */
class MentorPendaftarResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nama' => $this->full_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'fotoUrl' => $this->user?->avatar_url,

            'registrationNumber' => $this->registration_number,
            'tanggalDaftar' => $this->submitted_at?->toIso8601String(),
            'tipeDaftar' => $this->registration_type,
            'status' => PendaftarStatus::toApi($this->status),
            'alasanPenolakan' => $this->admin_notes,

            'instansi' => $this->university,
            'jurusan' => $this->major,
            'nim' => $this->nim,
            'semester' => $this->semester,

            'kategori' => $this->kategori?->name,
            'bidang' => $this->bidang?->name,
            'projectTitle' => $this->project_title,
            'lowongan' => $this->lowongan?->project,
            'keahlian' => $this->skills,
            'tools' => $this->tools,
            'tanggalMulai' => $this->internship_start?->format('Y-m-d'),
            'tanggalSelesai' => $this->internship_end?->format('Y-m-d'),

            'documents' => $this->documentFiles->map(fn ($doc) => [
                'id' => $doc->id,
                'documentType' => $doc->document_type,
                'fileUrl' => $doc->file_path,
            ])->values(),

            'teamMembers' => $this->teamMembers->map(fn ($member) => [
                'id' => $member->id,
                'fullName' => $member->full_name,
                'nim' => $member->nim,
            ])->values(),
        ];
    }
}