import { useCallback, useEffect, useState } from 'react';
import { apiRequest, ApiError } from '../../../lib/api';
import { showSuccessAlert, showToast, showConfirmAlert, showTemporaryPasswordAlert } from '../../../utils/swal';
import { KategoriOption, MentorFormValues, MentorItem } from '../../../types/mentor';

/**
 * Kontrak API ini mengikuti App\Http\Controllers\Api\MentorController (baru):
 * - GET    /mentors        -> index(), User role='mentor' + kategori terkait
 *                              (pivot kategori_mentor) + jumlah bimbingan.
 * - POST   /mentors        -> store(), wajib kirim kategori_ids (min 1).
 * - PUT    /mentors/{id}   -> update(), 'sometimes' jadi aman partial.
 * - DELETE /mentors/{id}   -> destroy(), ditolak 422 kalau mentor masih
 *                              punya bimbingan aktif.
 *
 * Kategori options diambil dari /kategoris?all=1 untuk checklist form &
 * filter tabel — dikelompokkan tampilannya per bidang di UI.
 */

interface ApiCollection<T> {
  data: T[];
}

interface ApiItem<T> {
  data: T;
}

interface BackendKategoriRef {
  id: number;
  name: string;
  bidang?: { id: number; name: string } | null;
}

interface BackendMentor {
  id: number;
  name: string;
  nip?: string | null;
  email: string;
  phone?: string | null;
  position?: string | null;
  status: 'Aktif' | 'Nonaktif';
  // Laravel snake_case-kan nama relasi/withCount otomatis saat serialize:
  // kategoriDiampu -> kategori_diampu, withCount('bimbinganSebagaiMentor')
  // -> bimbingan_sebagai_mentor_count.
  kategori_diampu?: BackendKategoriRef[];
  bimbingan_sebagai_mentor_count?: number;
}

function mapMentor(m: BackendMentor): MentorItem {
  return {
    id: m.id,
    name: m.name,
    nip: m.nip ?? undefined,
    email: m.email,
    phone: m.phone ?? undefined,
    position: m.position ?? undefined,
    status: m.status,
    categories: (m.kategori_diampu ?? []).map((k) => ({
      id: k.id,
      name: k.name,
      bidangName: k.bidang?.name ?? '-',
    })),
    totalMentees: m.bimbingan_sebagai_mentor_count ?? 0,
  };
}

function toApiPayload(values: MentorFormValues) {
  return {
    name: values.name.trim(),
    nip: values.nip.trim() || undefined,
    email: values.email.trim(),
    phone: values.phone.trim() || undefined,
    position: values.position.trim() || undefined,
    status: values.status,
    kategori_ids: values.kategoriIds,
  };
}

export function useMentorAdmin() {
  const [mentorList, setMentorList] = useState<MentorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [kategoriOptions, setKategoriOptions] = useState<KategoriOption[]>([]);

  const fetchMentors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [mentorRes, kategoriRes] = await Promise.all([
        apiRequest<ApiCollection<BackendMentor>>('/mentors'),
        apiRequest<ApiCollection<BackendKategoriRef>>('/kategoris?all=1'),
      ]);
      setMentorList(mentorRes.data.map(mapMentor));
      setKategoriOptions(
        kategoriRes.data.map((k) => ({
          id: k.id,
          name: k.name,
          bidangName: k.bidang?.name ?? '-',
        }))
      );
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Gagal memuat data mentor.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMentors();
  }, [fetchMentors]);

  const createMentor = async (values: MentorFormValues): Promise<boolean> => {
    if (!values.name.trim() || !values.email.trim()) {
        showToast('error', 'Nama mentor dan email wajib diisi.');
        return false;
    }
    if (values.kategoriIds.length === 0) {
        showToast('warning', 'Pilih minimal 1 kategori magang yang dikelola mentor.');
        return false;
    }
    try {
        const response = await apiRequest<ApiItem<BackendMentor> & { temporary_password?: string }>(
        '/mentors',
        {
            method: 'POST',
            data: toApiPayload(values),
        }
        );
        const mentor = mapMentor(response.data);
        setMentorList((prev) => [mentor, ...prev]);

        if (response.temporary_password) {
    
        await showTemporaryPasswordAlert(mentor.name, response.temporary_password);
        } else {
        showSuccessAlert(
            'Mentor Berhasil Ditambahkan!',
            `${mentor.name} telah terdaftar sebagai mentor untuk ${mentor.categories.length} kategori.`
        );
        }
        return true;
    } catch (err) {
        showToast('error', err instanceof ApiError ? err.message : 'Gagal menambahkan mentor.');
        return false;
    }
    };

  const updateMentor = async (id: number, values: MentorFormValues): Promise<boolean> => {
    if (!values.name.trim() || !values.email.trim()) {
      showToast('error', 'Nama mentor dan email wajib diisi.');
      return false;
    }
    if (values.kategoriIds.length === 0) {
      showToast('warning', 'Pilih minimal 1 kategori magang yang dikelola mentor.');
      return false;
    }
    try {
      const response = await apiRequest<ApiItem<BackendMentor>>(`/mentors/${id}`, {
        method: 'PUT',
        data: toApiPayload(values),
      });
      setMentorList((prev) =>
        prev.map((m) => (m.id === id ? { ...mapMentor(response.data), totalMentees: m.totalMentees } : m))
      );
      showSuccessAlert('Pembaruan Berhasil!', `Data mentor "${response.data.name}" telah diperbarui.`);
      return true;
    } catch (err) {
      showToast('error', err instanceof ApiError ? err.message : 'Gagal memperbarui mentor.');
      return false;
    }
  };

  /** Ditolak backend (422) kalau mentor masih punya bimbingan aktif. */
  const deleteMentor = async (item: MentorItem): Promise<void> => {
    const confirmed = await showConfirmAlert({
      title: 'Hapus Mentor Ini?',
      text: `Apakah Anda yakin ingin menghapus mentor "${item.name}"? Mahasiswa bimbingan mentor ini perlu dialokasikan ulang ke mentor lain.`,
      confirmButtonText: 'Ya, Hapus',
    });
    if (!confirmed) return;

    try {
      await apiRequest(`/mentors/${item.id}`, { method: 'DELETE' });
      setMentorList((prev) => prev.filter((m) => m.id !== item.id));
      showSuccessAlert('Mentor Dihapus', `Data mentor "${item.name}" telah dihapus.`);
    } catch (err) {
      // Kalau masih ada bimbingan aktif, pesan 422 dari backend sudah
      // deskriptif — cukup diteruskan lewat toast.
      showToast('error', err instanceof ApiError ? err.message : 'Gagal menghapus mentor.');
    }
  };

  return {
    mentorList,
    loading,
    error,
    kategoriOptions,
    refetch: fetchMentors,
    createMentor,
    updateMentor,
    deleteMentor,
  };
}