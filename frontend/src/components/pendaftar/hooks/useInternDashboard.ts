import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '../../../lib/api';
import { fetchInternDashboardSummary, fetchInternJadwalBimbingan } from './dashboardApplicantApi';
import type { InternDashboardSummary, JadwalBimbinganItem } from '../../../types/dashboard';

export function useInternDashboard(monthIndex: number, year: number) {
  const [summary, setSummary] = useState<InternDashboardSummary | null>(null);
  const [jadwal, setJadwal] = useState<JadwalBimbinganItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [summaryData, jadwalData] = await Promise.all([
        fetchInternDashboardSummary(),
        fetchInternJadwalBimbingan(monthIndex + 1, year), 
      ]);
      setSummary(summaryData);
      setJadwal(jadwalData);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Gagal memuat data dashboard.');
    } finally {
      setLoading(false);
    }
  }, [monthIndex, year]);

  useEffect(() => {
    void load();
  }, [load]);

  return { summary, jadwal, loading, error, reload: load };
}