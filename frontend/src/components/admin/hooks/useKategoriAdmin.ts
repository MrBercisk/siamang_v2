import { useCallback, useEffect, useState } from 'react';
import { apiRequest, ApiError } from '../../../lib/api';
import { showSuccessAlert, showToast, showConfirmAlert } from '../../../utils/swal';
import { BidangOption, KategoriFormValues, KategoriItem } from '../../../types/kategori';

/**
 * Kontrak API ini dikonfirmasi dari App\Http\Controllers\Api\KategoriController
 * dan App\Models\Kategori (sudah pakai SoftDeletes):
 * - GET    /kategoris               -> index(), default hanya kategori yang
 *                                       bidang induknya 'Aktif'; admin perlu
 *                                       ?all=1 untuk lihat semua.
 * - GET    /kategoris-trashed       -> trashed(), daftar kategori di Sampah.
 * - POST   /kategoris               -> store().
 * - PUT    /kategoris/{id}          -> update(), 'sometimes' jadi aman partial.
 * - DELETE /kategoris/{id}          -> destroy(), SOFT delete. Ditolak 422
 *                                       kalau masih dipakai lowongan/pendaftaran.
 * - PATCH  /kategoris/{id}/restore  -> restore().
 * - DELETE /kategoris/{id}/force    -> forceDelete(), ditolak 422 dengan
 *                                       alasan yang sama seperti destroy().
 *
 * Bidang options diambil dari /bidangs?all=1 (dipakai untuk dropdown form &
 * untuk menampilkan status bidang induk di tabel kategori).
 *
 * Catatan: view Periode Magang (PeriodeAdminView) memakai `kategoriList` dari
 * hook ini juga sebagai sumber dropdown kategori pada form Lowongan — lihat
 * `toKategoriOptions` di types/periode.ts — supaya tidak ada fetch/hook
 * kedua untuk data yang sama.
 */

interface ApiCollection<T> {
  data: T[];
}

interface ApiItem<T> {
  data: T;
}

interface BackendBidangRef {
  id: number;
  name: string;
  status: 'Aktif' | 'Nonaktif';
}

interface BackendKategori {
  id: number;
  bidang_id: number;
  name: string;
  quota?: number | null;
  description?: string | null;
  bidang?: BackendBidangRef | null;
  applications_count?: number;
  deleted_at?: string | null;
}

function mapKategori(k: BackendKategori): KategoriItem {
  return {
    id: k.id,
    name: k.name,
    bidangId: k.bidang_id,
    bidangName: k.bidang?.name ?? 'Bidang tidak ditemukan',
    bidangStatus: k.bidang?.status ?? 'Nonaktif',
    quota: k.quota ?? null,
    description: k.description ?? undefined,
    totalApplied: k.applications_count ?? 0,
    deletedAt: k.deleted_at ?? null,
  };
}

function toApiPayload(values: KategoriFormValues) {
  return {
    bidang_id: values.bidangId,
    name: values.name.trim(),
    description: values.description.trim() || undefined,
    // `quota` sengaja tidak dikirim dari form ini — sesuai keterangan asli UI,
    // kuota lowongan diatur lewat menu Periode Magang, bukan di sini. Kolom
    // `quota` tetap ada di backend kalau nanti mau diaktifkan lagi.
  };
}

export function useKategoriAdmin() {
  const [kategoriList, setKategoriList] = useState<KategoriItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [bidangOptions, setBidangOptions] = useState<BidangOption[]>([]);

  const [trashed, setTrashed] = useState<KategoriItem[]>([]);
  const [trashedLoading, setTrashedLoading] = useState(false);
  const [trashedError, setTrashedError] = useState<string | null>(null);

  const fetchKategoris = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [kategoriRes, bidangRes] = await Promise.all([
        apiRequest<ApiCollection<BackendKategori>>('/kategoris?all=1'),
        apiRequest<ApiCollection<BackendBidangRef>>('/bidangs?all=1'),
      ]);
      setKategoriList(kategoriRes.data.map(mapKategori));
      setBidangOptions(bidangRes.data.map((b) => ({ id: b.id, name: b.name, status: b.status })));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Gagal memuat data kategori.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTrashed = useCallback(async () => {
    setTrashedLoading(true);
    setTrashedError(null);
    try {
      const res = await apiRequest<ApiCollection<BackendKategori>>('/kategoris-trashed');
      setTrashed(res.data.map(mapKategori));
    } catch (err) {
      setTrashedError(err instanceof ApiError ? err.message : 'Gagal memuat data sampah.');
    } finally {
      setTrashedLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKategoris();
  }, [fetchKategoris]);

  const createKategori = async (values: KategoriFormValues): Promise<boolean> => {
    if (!values.name.trim()) {
      showToast('error', 'Nama kategori magang tidak boleh kosong.');
      return false;
    }
    if (!values.bidangId) {
      showToast('error', 'Bidang naungan wajib dipilih.');
      return false;
    }
    try {
      const response = await apiRequest<ApiItem<BackendKategori>>('/kategoris', {
        method: 'POST',
        data: toApiPayload(values),
      });
      setKategoriList((prev) => [mapKategori(response.data), ...prev]);
      showSuccessAlert(
        'Kategori Berhasil Ditambahkan!',
        `Kategori magang "${response.data.name}" telah tersimpan.`
      );
      return true;
    } catch (err) {
      showToast('error', err instanceof ApiError ? err.message : 'Gagal menambahkan kategori.');
      return false;
    }
  };

  const updateKategori = async (id: number, values: KategoriFormValues): Promise<boolean> => {
    if (!values.name.trim()) {
      showToast('error', 'Nama kategori magang tidak boleh kosong.');
      return false;
    }
    if (!values.bidangId) {
      showToast('error', 'Bidang naungan wajib dipilih.');
      return false;
    }
    try {
      const response = await apiRequest<ApiItem<BackendKategori>>(`/kategoris/${id}`, {
        method: 'PUT',
        data: toApiPayload(values),
      });
      setKategoriList((prev) =>
        prev.map((k) => (k.id === id ? { ...mapKategori(response.data), totalApplied: k.totalApplied } : k))
      );
      showSuccessAlert('Pembaruan Berhasil!', `Data kategori "${response.data.name}" telah diperbarui.`);
      return true;
    } catch (err) {
      showToast('error', err instanceof ApiError ? err.message : 'Gagal memperbarui kategori.');
      return false;
    }
  };

  /** Soft delete — ditolak backend (422) kalau masih dipakai lowongan/pendaftaran. */
  const deleteKategori = async (item: KategoriItem): Promise<void> => {
    const confirmed = await showConfirmAlert({
      title: 'Pindahkan ke Sampah?',
      text: `Kategori "${item.name}" akan dipindahkan ke Sampah. Kalau masih dipakai lowongan atau pendaftaran, tindakan ini akan ditolak.`,
      confirmButtonText: 'Ya, Pindahkan ke Sampah',
    });
    if (!confirmed) return;

    try {
      await apiRequest(`/kategoris/${item.id}`, { method: 'DELETE' });
      setKategoriList((prev) => prev.filter((k) => k.id !== item.id));
      showSuccessAlert('Kategori Dipindahkan ke Sampah', `Data kategori "${item.name}" telah diarsipkan.`);
    } catch (err) {
      // Kalau masih dipakai lowongan/pendaftaran, pesan 422 dari backend
      // sudah deskriptif — cukup diteruskan lewat toast.
      showToast('error', err instanceof ApiError ? err.message : 'Gagal memindahkan kategori ke Sampah.');
    }
  };

  /** Pulihkan kategori dari Sampah. */
  const restoreKategori = async (item: KategoriItem): Promise<void> => {
    try {
      await apiRequest(`/kategoris/${item.id}/restore`, { method: 'PATCH' });
      setTrashed((prev) => prev.filter((k) => k.id !== item.id));
      await fetchKategoris();
      showSuccessAlert('Kategori Dipulihkan', `Kategori "${item.name}" berhasil dipulihkan.`);
    } catch (err) {
      showToast('error', err instanceof ApiError ? err.message : 'Gagal memulihkan kategori.');
    }
  };

  /** Hapus permanen dari Sampah — tidak bisa dibatalkan. */
  const forceDeleteKategori = async (item: KategoriItem): Promise<void> => {
    const confirmed = await showConfirmAlert({
      title: 'Hapus Permanen?',
      text: `Tindakan ini tidak bisa dibatalkan. Kategori "${item.name}" akan dihapus permanen dari database.`,
      confirmButtonText: 'Ya, Hapus Permanen',
    });
    if (!confirmed) return;

    try {
      await apiRequest(`/kategoris/${item.id}/force`, { method: 'DELETE' });
      setTrashed((prev) => prev.filter((k) => k.id !== item.id));
      showSuccessAlert('Kategori Dihapus Permanen', `Data kategori "${item.name}" telah dihapus permanen.`);
    } catch (err) {
      showToast('error', err instanceof ApiError ? err.message : 'Gagal menghapus kategori secara permanen.');
    }
  };

  return {
    kategoriList,
    loading,
    error,
    bidangOptions,
    refetch: fetchKategoris,
    createKategori,
    updateKategori,
    deleteKategori,

    trashed,
    trashedLoading,
    trashedError,
    fetchTrashed,
    restoreKategori,
    forceDeleteKategori,
  };
}