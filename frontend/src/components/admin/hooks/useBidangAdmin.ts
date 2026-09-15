import { useCallback, useEffect, useState } from 'react';
import { apiRequest, ApiError } from '../../../lib/api';
import { showSuccessAlert, showToast, showConfirmAlert } from '../../../utils/swal';
import { BidangFormValues, BidangItem, BidangStatus } from '../../../types/bidang';

/**
 * Kontrak API ini dikonfirmasi langsung dari App\Http\Controllers\Api\BidangController
 * dan App\Models\Bidang:
 * - GET  /bidangs        -> index() hanya mengembalikan status 'Aktif' secara default;
 *                           admin perlu ?all=1 untuk melihat semua (termasuk Nonaktif).
 * - POST /bidangs        -> store(), fillable: name, status. Response TIDAK menyertakan
 *                           kategori_count (model baru dibuat tanpa withCount).
 * - PUT/PATCH /bidangs/{id} -> update(), field 'sometimes' jadi aman untuk partial update.
 *                           Response juga TIDAK menyertakan kategori_count.
 * - DELETE /bidangs/{id} -> ditolak (422) kalau bidang masih punya kategori terkait;
 *                           pesan errornya sudah deskriptif dari backend, cukup diteruskan.
 *
 * Karena response create/update tidak membawa kategori_count, categoryCount di state lokal
 * dipertahankan dari nilai sebelumnya (bukan ditimpa 0) supaya angka di tabel tidak salah.
 */

interface ApiCollection<T> {
  data: T[];
}

interface ApiItem<T> {
  data: T;
}

interface BackendBidang {
  id: number;
  name: string;
  status: BidangStatus;
  kategori_count?: number;
}

function mapBidang(bidang: BackendBidang): BidangItem {
  return {
    id: bidang.id,
    name: bidang.name,
    status: bidang.status,
    categoryCount: bidang.kategori_count ?? 0,
  };
}

function toApiPayload(values: BidangFormValues) {
  return {
    name: values.name.trim(),
    status: values.status,
  };
}

export function useBidangAdmin() {
  const [bidangList, setBidangList] = useState<BidangItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBidangs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // ?all=1 supaya admin juga melihat bidang berstatus Nonaktif.
      const res = await apiRequest<ApiCollection<BackendBidang>>('/bidangs?all=1');
      setBidangList(res.data.map(mapBidang));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Gagal memuat data bidang.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBidangs();
  }, [fetchBidangs]);

  const createBidang = async (values: BidangFormValues): Promise<boolean> => {
    if (!values.name.trim()) {
      showToast('error', 'Nama bidang tidak boleh kosong.');
      return false;
    }
    try {
      const response = await apiRequest<ApiItem<BackendBidang>>('/bidangs', {
        method: 'POST',
        data: toApiPayload(values),
      });
      setBidangList((prev) => [mapBidang(response.data), ...prev]);
      showSuccessAlert(
        'Bidang Berhasil Ditambahkan!',
        `Unit kerja "${response.data.name}" telah ditambahkan ke database Master Data.`
      );
      return true;
    } catch (err) {
      showToast('error', err instanceof ApiError ? err.message : 'Gagal menambahkan bidang.');
      return false;
    }
  };

  const updateBidang = async (id: number, values: BidangFormValues): Promise<boolean> => {
    if (!values.name.trim()) {
      showToast('error', 'Nama bidang tidak boleh kosong.');
      return false;
    }
    try {
      const response = await apiRequest<ApiItem<BackendBidang>>(`/bidangs/${id}`, {
        method: 'PUT',
        data: toApiPayload(values),
      });
      setBidangList((prev) =>
        prev.map((b) => (b.id === id ? { ...mapBidang(response.data), categoryCount: b.categoryCount } : b))
      );
      showSuccessAlert('Pembaruan Berhasil!', `Data bidang "${response.data.name}" telah diperbarui.`);
      return true;
    } catch (err) {
      showToast('error', err instanceof ApiError ? err.message : 'Gagal memperbarui bidang.');
      return false;
    }
  };

  const deleteBidang = async (item: BidangItem): Promise<void> => {
    const confirmed = await showConfirmAlert({
      title: 'Hapus Bidang Ini?',
      text: `Apakah Anda yakin ingin menghapus bidang "${item.name}"? Kategori magang yang bernaung di bawah bidang ini mungkin perlu disesuaikan.`,
      confirmButtonText: 'Ya, Hapus',
    });
    if (!confirmed) return;

    try {
      await apiRequest(`/bidangs/${item.id}`, { method: 'DELETE' });
      setBidangList((prev) => prev.filter((b) => b.id !== item.id));
      showSuccessAlert('Bidang Dihapus', `Data bidang "${item.name}" telah dihapus dari sistem.`);
    } catch (err) {
      // Kalau bidang masih punya kategori terkait, backend mengembalikan 422
      // dengan pesan yang sudah deskriptif -> langsung diteruskan ke user.
      showToast('error', err instanceof ApiError ? err.message : 'Gagal menghapus bidang.');
    }
  };

  const toggleStatus = async (item: BidangItem): Promise<void> => {
    const nextStatus: BidangStatus = item.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
    try {
      const response = await apiRequest<ApiItem<BackendBidang>>(`/bidangs/${item.id}`, {
        method: 'PATCH',
        data: { status: nextStatus },
      });
      setBidangList((prev) =>
        prev.map((b) => (b.id === item.id ? { ...mapBidang(response.data), categoryCount: b.categoryCount } : b))
      );
      showToast('info', `Status bidang "${item.name}" diubah menjadi ${nextStatus}.`);
    } catch (err) {
      showToast('error', err instanceof ApiError ? err.message : 'Gagal mengubah status bidang.');
    }
  };

  return {
    bidangList,
    loading,
    error,
    refetch: fetchBidangs,
    createBidang,
    updateBidang,
    deleteBidang,
    toggleStatus,
  };
}