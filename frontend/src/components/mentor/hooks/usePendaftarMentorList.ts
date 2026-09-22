import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '../../../lib/api';
import type { PendaftarData } from '../../../types/pendaftar';
import { fetchPendaftarList } from './pendaftarMentorApi';

/**
 * Lokasi file: src/components/mentor/hooks/usePendaftarMentorList.ts
 *
 * Daftar pendaftar pada kategori yang diampu mentor yang sedang login.
 * Pencarian & filter dilakukan di komponen (client-side), sama seperti
 * halaman admin.
 */
export function usePendaftarMentorList() {
  const [applicantList, setApplicantList] = useState<PendaftarData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setApplicantList(await fetchPendaftarList());
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Gagal memuat data pendaftar.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return { applicantList, loading, error, refetch: fetchList };
}