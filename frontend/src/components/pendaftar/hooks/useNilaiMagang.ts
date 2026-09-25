import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '../../../lib/api';
import { fetchNilaiState } from './nilaiApplicantApi';
import type { NilaiState } from '../../../types/nilaiPeserta';

export function useNilaiMagang() {
  const [state, setState] = useState<NilaiState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setState(await fetchNilaiState());
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Gagal memuat data nilai.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { state, loading, error, reload: load };
}