import { useCallback, useEffect, useState } from 'react';
import { apiRequest, ApiError, resolveStorageUrl } from '../../../lib/api';
import { showSuccessAlert, showToast } from '../../../utils/swal';
import {
  AdminApplicationResponse,
  AdminMentorOption,
  ApiCollection,
  ApiItem,
} from '../../../types/internship';
import {
  PendaftarData,
  PendaftarStatus,
  TipeDaftar,
} from '../../../types/pendaftar';

// harus persis sama nilai enum asli kolom `status` di database.
const STATUS_FROM_BACKEND: Record<string, PendaftarStatus> = {
  pending: 'Verifikasi',
  submitted: 'Verifikasi',
  diajukan: 'Verifikasi',
  verifikasi: 'Verifikasi',
  review: 'Verifikasi',
  accepted: 'Diterima',
  diterima: 'Diterima',
  rejected: 'Ditolak',
  ditolak: 'Ditolak',
};

// harus persis sama nilai yang diterima oleh UpdateApplicationStatusRequest
const STATUS_TO_BACKEND: Record<PendaftarStatus, string> = {
  Verifikasi: 'reviewing',
  Diterima: 'accepted',
  Ditolak: 'rejected',
};

function normalizeStatus(raw: string): PendaftarStatus {
  return STATUS_FROM_BACKEND[raw?.toLowerCase?.() ?? ''] ?? 'Verifikasi';
}

function normalizeTipeDaftar(raw: string | null | undefined, teamMemberCount: number): TipeDaftar {
  const value = (raw ?? '').toLowerCase();
  if (value.includes('kelompok') || value.includes('group') || value.includes('team')) {
    return 'Kelompok';
  }
  if (value.includes('individu') || value.includes('individual') || value.includes('solo')) {
    return 'Individu';
  }
  // Fallback: kalau ada anggota tim terdaftar, anggap Kelompok.
  return teamMemberCount > 0 ? 'Kelompok' : 'Individu';
}

function buildBerkas(documents: AdminApplicationResponse['documents'] = []) {
  const has = (type: string) => documents.some((document) => document.documentType === type);
  return {
    pasFoto: has('pas_foto'),
    suratPermohonan: has('surat_permohonan'),
    proposal: has('proposal'),
    nda: has('nda'),
  };
}

function findFotoUrl(item: AdminApplicationResponse, documents: AdminApplicationResponse['documents'] = []): string {
  const fotoDocument = documents.find((document) => document.documentType === 'pas_foto');
  return resolveStorageUrl(fotoDocument?.fileUrl) ?? resolveStorageUrl(item.avatarUrl) ?? '';
}

function mapPendaftar(item: AdminApplicationResponse): PendaftarData {
  const documents = (item.documents ?? []).map((document) => ({
    ...document,
    fileUrl: resolveStorageUrl(document.fileUrl),
  }));
  const teamMembers = item.teamMembers ?? [];

  return {
    id: Number(item.id),
    registrationNumber: item.registrationNumber,
    fotoUrl: findFotoUrl(item, documents),
    nama: item.applicantName,
    email: item.email ?? '',
    phone: item.phone ?? '',
    instansi: item.institution ?? '',
    nim: item.nim ?? '',
    bidang: item.fieldName ?? '',
    kategori: item.kategoriName ?? '',
    projectTitle: item.projectTitle ?? '',
    lowongan: item.lowongan ?? '',
    tanggalDaftar: item.submittedAt ?? '',
    tanggalMulai: item.startDate,
    tanggalSelesai: item.endDate,
    status: normalizeStatus(item.status),
    tipeDaftar: normalizeTipeDaftar(item.registrationType, teamMembers.length),
    jurusan: item.major ?? undefined,
    semester: item.semester != null ? String(item.semester) : undefined,
    keahlian: item.skills ?? undefined,
    tools: item.tools ?? undefined,
    alasanPenolakan: item.notes ?? undefined,
    berkas: buildBerkas(documents),
    documents,
    teamMembers,
  };
}

export function usePendaftarAdmin() {
  const [applicantList, setApplicantList] = useState<PendaftarData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplicants = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest<ApiCollection<AdminApplicationResponse>>('/admin/applications');
      setApplicantList(res.data.map(mapPendaftar));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Gagal memuat data pendaftar.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplicants();
  }, [fetchApplicants]);

  /**
   * Ambil detail pendaftar dari API (GET /admin/applications/{id})
   */
  const fetchApplicantById = useCallback(async (id: number): Promise<PendaftarData | null> => {
    try {
      const res = await apiRequest<ApiItem<AdminApplicationResponse>>(`/admin/applications/${id}`);
      return mapPendaftar(res.data);
    } catch (err) {
      showToast('error', err instanceof ApiError ? err.message : 'Gagal memuat detail pendaftar.');
      return null;
    }
  }, []);

  const fetchAvailableMentors = useCallback(async (id: number): Promise<AdminMentorOption[] | null> => {
    try {
      const res = await apiRequest<ApiCollection<AdminMentorOption>>(
        `/admin/applications/${id}/available-mentors`
      );
      return res.data ?? [];
    } catch (err) {
      showToast('error', err instanceof ApiError ? err.message : 'Gagal memuat daftar mentor.');
      return null;
    }
  }, []);

  /** Update status pendaftar secara langsung ke API, lalu sinkron ke state lokal. */
  const updateStatus = useCallback(
    async (
      id: number,
      newStatus: PendaftarStatus,
      reason?: string,
      mentorId?: number
    ): Promise<boolean> => {
      try {

        const response = await apiRequest<ApiItem<AdminApplicationResponse>>(`/admin/applications/${id}/status`, {
          method: 'PATCH',
          data: {
            status: STATUS_TO_BACKEND[newStatus],
            admin_notes: newStatus === 'Ditolak' ? reason ?? null : null,
            mentor_id: newStatus === 'Diterima' ? mentorId : undefined,
          },
        });
        const updated = mapPendaftar(response.data);
        setApplicantList((prev) => prev.map((a) => (a.id === id ? updated : a)));
        return true;
      } catch (err) {
        showToast('error', err instanceof ApiError ? err.message : 'Gagal memperbarui status pendaftar.');
        return false;
      }
    },
    []
  );

  /** Quick action: terima pendaftar (dipanggil setelah konfirmasi di UI). */
  const terimaApplicant = useCallback(
    async (item: PendaftarData, mentorId: number): Promise<boolean> => {
      const ok = await updateStatus(item.id, 'Diterima', undefined, mentorId);
      if (ok) {
        showSuccessAlert(
          'Pendaftaran Diterima!',
          `Status pendaftaran ${item.nama} berhasil diubah menjadi DITERIMA.`
        );
      }
      return ok;
    },
    [updateStatus]
  );

  /** Quick action: tolak pendaftar dengan alasan wajib diisi. */
  const tolakApplicant = useCallback(
    async (item: PendaftarData, reason: string): Promise<boolean> => {
      const ok = await updateStatus(item.id, 'Ditolak', reason);
      if (ok) {
        showToast('info', `Pendaftaran ${item.nama} telah DITOLAK.`);
      }
      return ok;
    },
    [updateStatus]
  );

  return {
    applicantList,
    loading,
    error,
    refetch: fetchApplicants,
    fetchApplicantById,
    fetchAvailableMentors,
    updateStatus,
    terimaApplicant,
    tolakApplicant,
  };
}