import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '../../../lib/api';
import { showSuccessAlert, showToast } from '../../../utils/swal';
import { createProgressItem, fetchProgressList, updateProgressItem } from './progressApplicantApi';
import type { ProgressFormValues, ProgressItem } from '../../../types/progressPeserta';

export function useProgressMagang() {
  const [items, setItems] = useState<ProgressItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setItems(await fetchProgressList());
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Gagal memuat data progress.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const submitCreate = useCallback(async (values: ProgressFormValues, file: File) => {
    setSubmitting(true);
    try {
      const created = await createProgressItem(values, file);
      setItems((prev) => [created, ...prev]);
      showSuccessAlert('Progress Tersimpan!', 'Data progress magang berhasil ditambahkan.');
      return true;
    } catch (err) {
      showToast('error', err instanceof ApiError ? err.message : 'Gagal menyimpan progress.');
      return false;
    } finally {
      setSubmitting(false);
    }
  }, []);

  const submitUpdate = useCallback(
    async (id: string, values: ProgressFormValues, file: File | null) => {
      setSubmitting(true);
      try {
        const updated = await updateProgressItem(id, values, file);
        setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
        showSuccessAlert('Progress Diperbarui!', 'Data progress magang berhasil diperbarui.');
        return true;
      } catch (err) {
        showToast('error', err instanceof ApiError ? err.message : 'Gagal memperbarui progress.');
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    []
  );

  return { items, loading, error, submitting, reload: load, submitCreate, submitUpdate };
}