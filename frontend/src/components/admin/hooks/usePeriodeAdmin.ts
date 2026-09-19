import { useCallback, useEffect, useState } from 'react';
import { apiRequest, ApiError } from '../../../lib/api';
import { showSuccessAlert, showToast, showConfirmAlert } from '../../../utils/swal';
import { LowonganFormValues, LowonganItem, PeriodeFormValues, PeriodeInfo } from '../../../types/periode';

interface ApiCollection<T> { data: T[]; }
interface ApiItem<T> { data: T; }

interface BackendPeriode {
  id: number;
  name?: string | null;
  start_date: string;
  end_date: string;
  announcement_date: string;
  internship_start?: string | null;
  internship_end?: string | null;
  duration_info?: string | null;
  system_type?: string | null;
  is_active: boolean;
}

interface BackendLowongan {
  id: number;
  periode_id: number;
  kategori_id: number;
  project?: string | null;
  definisi?: string | null;
  detail_kebutuhan?: string | null;
  kuota: number;
  kategori?: { name?: string | null; bidang?: { name?: string | null } | null } | null;
}

function toDateInputValue(value?: string | null): string {
  if (!value) return '';
  return value.slice(0, 10);
}

const mapPeriode = (item: BackendPeriode): PeriodeInfo => ({
  id: item.id,
  name: item.name?.trim() || `Periode #${item.id}`,
  startDate: toDateInputValue(item.start_date),
  endDate: toDateInputValue(item.end_date),
  announcementDate: toDateInputValue(item.announcement_date),
  internshipStart: toDateInputValue(item.internship_start),
  internshipEnd: toDateInputValue(item.internship_end),
  durationInfo: item.duration_info ?? '',
  systemType: item.system_type ?? '',
  isActive: item.is_active,
});

const mapLowongan = (item: BackendLowongan): LowonganItem => ({
  id: item.id,
  periodeId: item.periode_id,
  kategoriId: item.kategori_id,
  kategori: item.kategori?.name ?? 'Kategori tidak ditemukan',
  bidang: item.kategori?.bidang?.name ?? 'Bidang tidak ditemukan',
  project: item.project ?? '',
  definisi: item.definisi ?? '',
  detailKebutuhan: item.detail_kebutuhan ?? '',
  kuota: item.kuota,
});

function validateLowongan(values: LowonganFormValues): number | null {
  if (!values.kategoriId) {
    showToast('error', 'Silakan pilih kategori magang.');
    return null;
  }
  const kuota = parseInt(values.kuota, 10);
  if (!values.kuota || Number.isNaN(kuota) || kuota <= 0) {
    showToast('error', 'Masukkan kuota magang yang valid.');
    return null;
  }
  return kuota;
}

export function usePeriodeAdmin() {
  const [periodeList, setPeriodeList] = useState<PeriodeInfo[]>([]);
  const [selectedPeriodeId, setSelectedPeriodeId] = useState<number | null>(null);
  const [allLowongan, setAllLowongan] = useState<LowonganItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [periodeResponse, lowonganResponse] = await Promise.all([
        apiRequest<ApiCollection<BackendPeriode>>('/periodes'),
        apiRequest<ApiCollection<BackendLowongan>>('/lowongans?all=1'),
      ]);
      const periods = periodeResponse.data.map(mapPeriode);
      setPeriodeList(periods);
      setAllLowongan(lowonganResponse.data.map(mapLowongan));
      setSelectedPeriodeId((current) =>
        current && periods.some((period) => period.id === current)
          ? current
          : periods.find((period) => period.isActive)?.id ?? periods[0]?.id ?? null
      );
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Gagal memuat data periode magang.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const periodeData = periodeList.find((period) => period.id === selectedPeriodeId) ?? null;
  const lowonganList = allLowongan.filter((item) => item.periodeId === selectedPeriodeId);

  const savePeriode = async (values: PeriodeFormValues): Promise<boolean> => {
    if (!values.startDate.trim() || !values.endDate.trim() || !values.announcementDate.trim()) {
      showToast('error', 'Semua tanggal periode wajib diisi.');
      return false;
    }
    if (!periodeData) return false;
    try {
      const response = await apiRequest<ApiItem<BackendPeriode>>(`/periodes/${periodeData.id}`, {
        method: 'PUT',
        data: {
          name: values.name.trim() || null,
          start_date: values.startDate,
          end_date: values.endDate,
          announcement_date: values.announcementDate,
          internship_start: values.internshipStart || null,
          internship_end: values.internshipEnd || null,
          duration_info: values.durationInfo.trim() || null,
          system_type: values.systemType.trim() || null,
          is_active: values.isActive,
        },
      });
      setPeriodeList((prev) => prev.map((item) => item.id === periodeData.id ? mapPeriode(response.data) : item));
      showSuccessAlert('Periode Diperbarui!', 'Jadwal periode magang berhasil diperbarui.');
      return true;
    } catch (err) {
      showToast('error', err instanceof ApiError ? err.message : 'Gagal memperbarui periode.');
      return false;
    }
  };

  const createLowongan = async (values: LowonganFormValues): Promise<boolean> => {
    const kuota = validateLowongan(values);
    if (kuota === null || !selectedPeriodeId) return false;
    try {
      const response = await apiRequest<ApiItem<BackendLowongan>>('/lowongans', {
        method: 'POST',
        data: { periode_id: selectedPeriodeId, kategori_id: Number(values.kategoriId), project: values.project || null, definisi: values.definisi || null, detail_kebutuhan: values.detailKebutuhan || null, kuota },
      });
      setAllLowongan((prev) => [...prev, mapLowongan(response.data)]);
      showSuccessAlert('Lowongan Berhasil Ditambahkan!', `Lowongan project "${values.project}" telah disimpan.`);
      return true;
    } catch (err) {
      showToast('error', err instanceof ApiError ? err.message : 'Gagal menambahkan lowongan.');
      return false;
    }
  };

  const updateLowongan = async (id: number, values: LowonganFormValues): Promise<boolean> => {
    const kuota = validateLowongan(values);
    if (kuota === null) return false;
    try {
      const response = await apiRequest<ApiItem<BackendLowongan>>(`/lowongans/${id}`, {
        method: 'PUT',
        data: { kategori_id: Number(values.kategoriId), project: values.project || null, definisi: values.definisi || null, detail_kebutuhan: values.detailKebutuhan || null, kuota },
      });
      setAllLowongan((prev) => prev.map((item) => item.id === id ? mapLowongan(response.data) : item));
      showSuccessAlert('Pembaruan Berhasil!', `Data lowongan magang "${values.project}" telah diperbarui.`);
      return true;
    } catch (err) {
      showToast('error', err instanceof ApiError ? err.message : 'Gagal memperbarui lowongan.');
      return false;
    }
  };

  const deleteLowongan = async (item: LowonganItem): Promise<void> => {
    const confirmed = await showConfirmAlert({
      title: 'Hapus Lowongan Magang?',
      text: `Apakah Anda yakin ingin menghapus lowongan project "${item.project}" (${item.kategori})?`,
      confirmButtonText: 'Ya, Hapus',
    });
    if (!confirmed) return;

    try {
      await apiRequest(`/lowongans/${item.id}`, { method: 'DELETE' });
      setAllLowongan((prev) => prev.filter((lowongan) => lowongan.id !== item.id));
      showSuccessAlert('Lowongan Dihapus', `Lowongan project "${item.project}" telah dihapus.`);
    } catch (err) {
      showToast('error', err instanceof ApiError ? err.message : 'Gagal menghapus lowongan.');
    }
  };

  return {
    periodeData,
    periodeList,
    selectedPeriodeId,
    selectPeriode: setSelectedPeriodeId,
    lowonganList,
    loading,
    error,
    refetch: fetchData,
    savePeriode,
    createLowongan,
    updateLowongan,
    deleteLowongan,
  };
}