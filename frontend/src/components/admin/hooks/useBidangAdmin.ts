import { useCallback, useEffect, useState } from 'react';
import { apiRequest, ApiError } from '../../../lib/api';
import { showSuccessAlert, showToast, showConfirmAlert } from '../../../utils/swal';
import { BidangFormValues, BidangItem, BidangStatus } from '../../../types/bidang';

/**
 * Kontrak API ini dikonfirmasi dari App\Http\Controllers\Api\BidangController
 * dan App\Models\Bidang (sudah pakai SoftDeletes, cascade ke kategori):
 * - GET    /bidangs              -> index(), default hanya status 'Aktif';
 *                                   admin perlu ?all=1 untuk lihat semua.
 * - GET    /bidangs-trashed      -> trashed(), daftar bidang di Sampah.
 * - POST   /bidangs              -> store().
 * - PUT    /bidangs/{id}         -> update(), 'sometimes' jadi aman partial.
 * - DELETE /bidangs/{id}         -> destroy(), SOFT delete (pindah ke Sampah),
 *                                   kategori terkait ikut diarsipkan otomatis.
 * - PATCH  /bidangs/{id}/restore -> restore(), pulihkan bidang + kategorinya.
 * - DELETE /bidangs/{id}/force   -> forceDelete(), hapus permanen (ditolak
 *                                   422 kalau masih ada kategori terkait).
 *
 * Response create/update TIDAK menyertakan kategori_count, jadi nilai lama di
 * state dipertahankan (bukan ditimpa 0) supaya angka di tabel tidak salah.
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
  deleted_at?: string | null;
}

function mapBidang(bidang: BackendBidang): BidangItem {
  return {
    id: bidang.id,
    name: bidang.name,
    status: bidang.status,
    categoryCount: bidang.kategori_count ?? 0,
    deletedAt: bidang.deleted_at ?? null,
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

  const [trashed, setTrashed] = useState<BidangItem[]>([]);
  const [trashedLoading, setTrashedLoading] = useState(false);
  const [trashedError, setTrashedError] = useState<string | null>(null);

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

  const fetchTrashed = useCallback(async () => {
    setTrashedLoading(true);
    setTrashedError(null);
    try {
      const res = await apiRequest<ApiCollection<BackendBidang>>('/bidangs-trashed');
      setTrashed(res.data.map(mapBidang));
    } catch (err) {
      setTrashedError(err instanceof ApiError ? err.message : 'Gagal memuat data sampah.');
    } finally {
      setTrashedLoading(false);
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

  /** Soft delete — bidang & kategori terkait pindah ke Sampah, bisa dipulihkan. */
  const deleteBidang = async (item: BidangItem): Promise<void> => {
    const confirmed = await showConfirmAlert({
      title: 'Pindahkan ke Sampah?',
      text: `Bidang "${item.name}" beserta kategori di bawahnya akan dipindahkan ke Sampah, dan bisa dipulihkan kapan saja.`,
      confirmButtonText: 'Ya, Pindahkan ke Sampah',
    });
    if (!confirmed) return;

    try {
      await apiRequest(`/bidangs/${item.id}`, { method: 'DELETE' });
      setBidangList((prev) => prev.filter((b) => b.id !== item.id));
      showSuccessAlert(
        'Bidang Dipindahkan ke Sampah',
        `Data bidang "${item.name}" beserta kategorinya telah diarsipkan. Buka tab Sampah untuk memulihkannya.`
      );
    } catch (err) {
      showToast('error', err instanceof ApiError ? err.message : 'Gagal memindahkan bidang ke Sampah.');
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

  /** Pulihkan bidang dari Sampah — kategori terkait ikut pulih otomatis di backend. */
  const restoreBidang = async (item: BidangItem): Promise<void> => {
    try {
      await apiRequest(`/bidangs/${item.id}/restore`, { method: 'PATCH' });
      setTrashed((prev) => prev.filter((b) => b.id !== item.id));
      await fetchBidangs(); // supaya bidang + kategori yang dipulihkan muncul lagi di list Aktif
      showSuccessAlert('Bidang Dipulihkan', `Bidang "${item.name}" berhasil dipulihkan beserta kategorinya.`);
    } catch (err) {
      showToast('error', err instanceof ApiError ? err.message : 'Gagal memulihkan bidang.');
    }
  };

  /** Hapus permanen dari Sampah — tidak bisa dibatalkan. */
  const forceDeleteBidang = async (item: BidangItem): Promise<void> => {
    const confirmed = await showConfirmAlert({
      title: 'Hapus Permanen?',
      text: `Tindakan ini tidak bisa dibatalkan. Bidang "${item.name}" akan dihapus permanen dari database.`,
      confirmButtonText: 'Ya, Hapus Permanen',
    });
    if (!confirmed) return;

    try {
      await apiRequest(`/bidangs/${item.id}/force`, { method: 'DELETE' });
      setTrashed((prev) => prev.filter((b) => b.id !== item.id));
      showSuccessAlert('Bidang Dihapus Permanen', `Data bidang "${item.name}" telah dihapus permanen dari sistem.`);
    } catch (err) {
      // Ditolak backend (422) kalau masih ada kategori terkait — pesannya
      // sudah deskriptif, cukup diteruskan.
      showToast('error', err instanceof ApiError ? err.message : 'Gagal menghapus bidang secara permanen.');
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

    trashed,
    trashedLoading,
    trashedError,
    fetchTrashed,
    restoreBidang,
    forceDeleteBidang,
  };
}