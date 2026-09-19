import { useCallback, useEffect, useState } from 'react';
import { apiRequest, ApiError } from '../../../lib/api';
import { BimbinganItem } from '../../../types/bimbingan';

/**
 * Lokasi file: src/components/admin/hooks/useBimbinganAdmin.ts
 *
 * Kontrak API dari App\Http\Controllers\Api\Admin\BimbinganAdminController:
 * - GET /admin/bimbingans -> index(), semua record model Bimbingan (satu per
 *                            application yang sudah 'accepted'), terbaru dulu.
 *                            Filter opsional: status, periode_id.
 *
 * Read-only: Bimbingan dibuat oleh ApplicationObserver saat application
 * diterima, dan mentor diganti lewat ApplicationService::assignMentor().
 * Karena itu hook ini tidak punya create/update/delete.
 */

const BIMBINGAN_ENDPOINT = '/admin/bimbingans';

interface ApiCollection<T> {
  data: T[];
}

interface BackendBimbingan {
  id: number | string;
  applicationId: number | string;
  registrationNumber?: string | null;
  participantName?: string | null;
  institution?: string | null;
  bidangName?: string | null;
  kategoriName?: string | null;
  mentorId?: number | string | null;
  mentorName?: string | null;
  projectTitle?: string | null;
  registrationType?: string | null;
  status?: string | null;
  progressPercent?: number | null;
  lastUpdate?: string | null;
}

function mapBimbingan(b: BackendBimbingan): BimbinganItem {
  return {
    id: String(b.id),
    applicationId: String(b.applicationId),
    registrationNumber: b.registrationNumber || '-',
    participantName: b.participantName || 'Peserta tidak ditemukan',
    institution: b.institution || '',
    bidangName: b.bidangName || undefined,
    kategoriName: b.kategoriName || undefined,
    mentorId: b.mentorId ? String(b.mentorId) : undefined,
    mentorName: b.mentorName || 'Belum ada mentor',
    projectTitle: b.projectTitle || '-',
    registrationType: b.registrationType || undefined,
    status: b.status?.trim() || 'belum ada status',
    progressPercent: Math.min(100, Math.max(0, Number(b.progressPercent) || 0)),
    lastUpdate: b.lastUpdate || null,
  };
}

/** Status yang dianggap "sedang berjalan". Sesuaikan bila nilai di kolom status berbeda. */
const ACTIVE_STATUSES = ['berjalan', 'aktif', 'active', 'ongoing', 'berlangsung', 'proses'];

export function isActiveBimbingan(status: string): boolean {
  return ACTIVE_STATUSES.includes(status.toLowerCase());
}

export function useBimbinganAdmin() {
  const [items, setItems] = useState<BimbinganItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBimbingans = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest<ApiCollection<BackendBimbingan>>(BIMBINGAN_ENDPOINT);
      setItems(res.data.map(mapBimbingan));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Gagal memuat data bimbingan.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBimbingans();
  }, [fetchBimbingans]);

  return {
    items,
    loading,
    error,
    refetch: fetchBimbingans,
  };
}