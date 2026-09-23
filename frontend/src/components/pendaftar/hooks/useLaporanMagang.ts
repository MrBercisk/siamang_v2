import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '../../../lib/api';
import { showSuccessAlert, showToast } from '../../../utils/swal';
import { fetchLaporanState, submitLaporan } from './laporanApplicantApi';
import type { LaporanFormValues, LaporanState } from '../../../types/laporanPeserta';

export function useLaporanMagang() {
  const [state, setState] = useState<LaporanState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setState(await fetchLaporanState());
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Gagal memuat data laporan.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const submit = useCallback(
    async (values: LaporanFormValues, fileLaporan: File | null, formNilai: File | null) => {
      setSubmitting(true);
      try {
        await submitLaporan(values, fileLaporan, formNilai);
        showSuccessAlert('Laporan Berhasil Disimpan!', 'Laporan magang Anda telah terunggah.');
        await load();
        return true;
      } catch (err) {
        showToast('error', err instanceof ApiError ? err.message : 'Gagal menyimpan laporan.');
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [load]
  );

  return { state, loading, error, submitting, reload: load, submit };
}