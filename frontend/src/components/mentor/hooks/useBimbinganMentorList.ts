import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '../../../lib/api';
import type { BimbinganListItem } from '../../../types/bimbinganMentor';
import { fetchBimbinganList } from './bimbinganMentorApi';

/**
 * Lokasi file: src/components/mentor/hooks/useBimbinganMentorList.ts
 *
 * Daftar bimbingan milik mentor yang sedang login. Hook ini hanya mengurus state;
 * pemanggilan API ada di bimbinganMentorApi.ts. Pencarian & pagination dilakukan
 * di komponen (client-side).
 */
export function useBimbinganMentorList() {
  const [items, setItems] = useState<BimbinganListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setItems(await fetchBimbinganList());
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Gagal memuat data bimbingan.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return { items, loading, error, refetch: fetchList };
}