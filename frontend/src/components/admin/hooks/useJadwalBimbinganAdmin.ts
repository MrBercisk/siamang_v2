import { useCallback, useEffect, useState } from 'react';
import { apiRequest, ApiError } from '../../../lib/api';
import { showSuccessAlert, showToast, showConfirmAlert } from '../../../utils/swal';
import {
  JadwalFormValues,
  MentorOption,
  ScheduleEvent,
  ScheduleStatus,
  StudentOption,
} from '../../../types/jadwalBimbingan';

/**
 * Lokasi file: src/components/admin/hooks/useJadwalBimbinganAdmin.ts
 *
 * Kontrak API dari App\Http\Controllers\Api\Admin\JadwalBimbinganAdminController
 * (prefix `/admin` mengikuti ApplicationAdminController — sesuaikan bila route berbeda):
 * - GET    /admin/jadwal-bimbingans          -> index(), semua jadwal urut tanggal & jam.
 *                                               Filter opsional: month, year,
 *                                               student_user_id, mentor_user_id.
 * - GET    /admin/jadwal-bimbingans/options  -> options(), { students, mentors } untuk
 *                                               dropdown form. students = user dengan
 *                                               application 'accepted'; mentors = mentor Aktif.
 * - POST   /admin/jadwal-bimbingans/sync     -> sync(), tarik agenda dari Google Calendar lalu
 *                                               upsert ke DB. { created, updated, deleted, skipped[] }.
 * - POST   /admin/jadwal-bimbingans          -> store(), 422 bila validasi gagal.
 * - PUT    /admin/jadwal-bimbingans/{id}     -> update(), field sama dengan store().
 * - DELETE /admin/jadwal-bimbingans/{id}     -> destroy(), HAPUS PERMANEN (model
 *                                               JadwalBimbingan tidak memakai SoftDeletes).
 *
 * Status jadwal (Dijadwalkan/Berlangsung/Selesai) dihitung di sini lewat
 * `getScheduleStatus`, bukan dari backend.
 *
 * Google Calendar: `googleCalendarSynced` bernilai true bila jadwal sudah terhubung ke
 * event Google (dikirim dari SIAMANG atau ditarik lewat `syncFromGoogle`).
 *
 * Hook ini dipakai oleh JadwalBimbinganAdminView (withOptions: true, untuk form)
 * dan BimbinganSettingsTab (read-only, tanpa options).
 */

const JADWAL_ENDPOINT = '/admin/jadwal-bimbingans';

interface ApiCollection<T> {
  data: T[];
}

interface ApiItem<T> {
  data: T;
}

interface BackendJadwal {
  id: number | string;
  title: string;
  studentUserId: number | string;
  studentName?: string | null;
  studentInstitution?: string | null;
  mentorUserId: number | string;
  mentorName?: string | null;
  date: string; // YYYY-MM-DD
  time: string; // "09:00 - 10:30"
  location?: string | null;
  meetLink?: string | null;
  googleCalendarSynced?: boolean | null;
  googleCalendarEventId?: string | null;
  notes?: string | null;
}

interface BackendOptions {
  students: {
    userId: number | string;
    name: string;
    institution?: string | null;
    mentorId?: number | string | null;
  }[];
  mentors: { id: number | string; name: string }[];
}

interface BackendSyncResult {
  created: number;
  updated: number;
  deleted: number;
  skipped: { title: string; reason: string }[];
}

function mapJadwal(item: BackendJadwal): ScheduleEvent {
  const date = item.date ? item.date.slice(0, 10) : '';

  return {
    id: String(item.id),
    title: item.title,
    studentUserId: String(item.studentUserId),
    studentName: item.studentName || 'Peserta belum ditentukan',
    studentInstitution: item.studentInstitution || '',
    mentorUserId: String(item.mentorUserId),
    mentorName: item.mentorName || 'Mentor belum ditentukan',
    date,
    dayNumber: date ? parseInt(date.split('-')[2], 10) || 0 : 0,
    time: item.time || '-',
    location: item.location || '',
    meetLink: item.meetLink || undefined,
    googleCalendarSynced: Boolean(item.googleCalendarSynced),
    googleCalendarEventId: item.googleCalendarEventId || undefined,
    notes: item.notes || undefined,
  };
}

function toApiPayload(values: JadwalFormValues) {
  return {
    title: values.title.trim(),
    studentUserId: Number(values.studentUserId),
    mentorUserId: Number(values.mentorUserId),
    date: values.date,
    time: `${values.startTime} - ${values.endTime}`,
    location: values.location.trim() || undefined,
    meetLink: values.meetLink.trim() || undefined,
    notes: values.notes.trim() || undefined,
    syncGoogleCalendar: values.syncGoogleCalendar,
  };
}

function sortEvents(events: ScheduleEvent[]): ScheduleEvent[] {
  return [...events].sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
}

/** Mengembalikan pesan error validasi, atau null bila form valid. */
function validateForm(values: JadwalFormValues): string | null {
  if (!values.title.trim()) return 'Harap isi judul agenda bimbingan.';
  if (!values.studentUserId || !values.mentorUserId) return 'Pilih mahasiswa dan mentor lapangan.';
  if (!values.date) return 'Tanggal bimbingan wajib diisi.';
  if (!values.startTime || !values.endTime) return 'Jam mulai dan jam selesai wajib diisi.';
  if (values.endTime <= values.startTime) return 'Jam selesai harus setelah jam mulai.';
  return null;
}

/** Ringkasan hasil tarik dari Google Calendar untuk ditampilkan ke admin. */
function buildSyncMessage({ created, updated, deleted, skipped }: BackendSyncResult): string {
  const parts: string[] = [];
  if (created) parts.push(`${created} jadwal baru`);
  if (updated) parts.push(`${updated} diperbarui`);
  if (deleted) parts.push(`${deleted} dihapus`);

  let message =
    parts.length > 0 ? `${parts.join(', ')}.` : 'Tidak ada perubahan dari Google Calendar.';

  if (skipped.length > 0) {
    const titles = skipped
      .slice(0, 3)
      .map((item) => `"${item.title}"`)
      .join(', ');
    const more = skipped.length > 3 ? `, dan ${skipped.length - 3} lainnya` : '';
    message += ` ${skipped.length} event dilewati karena mahasiswa/mentor tidak dikenali (${titles}${more}). Pastikan email mereka ditambahkan sebagai tamu event.`;
  }

  return message;
}

/** Status dihitung dari tanggal & jam karena tabel jadwal_bimbingans tidak punya kolom status. */
export function getScheduleStatus(event: ScheduleEvent, now = new Date()): ScheduleStatus {
  if (!event.date) return 'dijadwalkan';

  const match = event.time.match(/(\d{1,2})[:.](\d{2})\s*-\s*(\d{1,2})[:.](\d{2})/);
  const startClock = match ? `${match[1].padStart(2, '0')}:${match[2]}` : '00:00';
  const endClock = match ? `${match[3].padStart(2, '0')}:${match[4]}` : '23:59';

  const start = new Date(`${event.date}T${startClock}:00`);
  const end = new Date(`${event.date}T${endClock}:00`);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 'dijadwalkan';
  if (now < start) return 'dijadwalkan';
  if (now <= end) return 'berlangsung';
  return 'selesai';
}

interface UseJadwalBimbinganAdminOptions {
  /** Ambil daftar mahasiswa & mentor untuk dropdown form tambah/ubah jadwal. */
  withOptions?: boolean;
}

export function useJadwalBimbinganAdmin({
  withOptions = false,
}: UseJadwalBimbinganAdminOptions = {}) {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [mentors, setMentors] = useState<MentorOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJadwals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [jadwalRes, optionsRes] = await Promise.all([
        apiRequest<ApiCollection<BackendJadwal>>(JADWAL_ENDPOINT),
        withOptions
          ? apiRequest<ApiItem<BackendOptions>>(`${JADWAL_ENDPOINT}/options`)
          : Promise.resolve(null),
      ]);

      setEvents(sortEvents(jadwalRes.data.map(mapJadwal)));

      if (optionsRes) {
        setStudents(
          optionsRes.data.students.map((s) => ({
            userId: String(s.userId),
            name: s.name,
            institution: s.institution || '',
            mentorId: s.mentorId ? String(s.mentorId) : undefined,
          }))
        );
        setMentors(optionsRes.data.mentors.map((m) => ({ id: String(m.id), name: m.name })));
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Gagal memuat jadwal bimbingan.');
    } finally {
      setLoading(false);
    }
  }, [withOptions]);

  useEffect(() => {
    fetchJadwals();
  }, [fetchJadwals]);

  /** Tarik agenda dari Google Calendar ke database, lalu muat ulang daftar jadwal. */
  const syncFromGoogle = async (): Promise<void> => {
    setSyncing(true);
    try {
      const response = await apiRequest<ApiItem<BackendSyncResult>>(`${JADWAL_ENDPOINT}/sync`, {
        method: 'POST',
      });
      await fetchJadwals();
      showSuccessAlert('Sinkronisasi Selesai', buildSyncMessage(response.data));
    } catch (err) {
      showToast(
        'error',
        err instanceof ApiError ? err.message : 'Gagal menarik jadwal dari Google Calendar.'
      );
    } finally {
      setSyncing(false);
    }
  };

  const createJadwal = async (values: JadwalFormValues): Promise<boolean> => {
    const validationError = validateForm(values);
    if (validationError) {
      showToast('error', validationError);
      return false;
    }
    try {
      const response = await apiRequest<ApiItem<BackendJadwal>>(JADWAL_ENDPOINT, {
        method: 'POST',
        data: toApiPayload(values),
      });
      const created = mapJadwal(response.data);
      setEvents((prev) => sortEvents([...prev.filter((e) => e.id !== created.id), created]));

      // Jujur soal status sinkronisasi: jangan mengaku tersinkron kalau backend belum melakukannya.
      showSuccessAlert(
        'Jadwal Berhasil Ditambahkan!',
        values.syncGoogleCalendar && !created.googleCalendarSynced
          ? `Agenda "${created.title}" telah tersimpan. Sinkronisasi Google Calendar belum berhasil, jadwal ini belum masuk ke kalender.`
          : `Agenda "${created.title}" telah tersimpan.`
      );
      return true;
    } catch (err) {
      showToast('error', err instanceof ApiError ? err.message : 'Gagal menambahkan jadwal bimbingan.');
      return false;
    }
  };

  const updateJadwal = async (id: string, values: JadwalFormValues): Promise<boolean> => {
    const validationError = validateForm(values);
    if (validationError) {
      showToast('error', validationError);
      return false;
    }
    try {
      const response = await apiRequest<ApiItem<BackendJadwal>>(`${JADWAL_ENDPOINT}/${id}`, {
        method: 'PUT',
        data: toApiPayload(values),
      });
      const updated = mapJadwal(response.data);
      setEvents((prev) => sortEvents(prev.map((e) => (e.id === id ? updated : e))));
      showSuccessAlert('Pembaruan Berhasil!', `Agenda "${updated.title}" telah diperbarui.`);
      return true;
    } catch (err) {
      showToast('error', err instanceof ApiError ? err.message : 'Gagal memperbarui jadwal bimbingan.');
      return false;
    }
  };

  /** Hapus permanen — model JadwalBimbingan tidak memakai SoftDeletes. */
  const deleteJadwal = async (item: ScheduleEvent): Promise<void> => {
    const confirmed = await showConfirmAlert({
      title: 'Hapus Jadwal Bimbingan?',
      text: `Agenda "${item.title}" akan dihapus permanen dan tidak bisa dipulihkan.`,
      confirmButtonText: 'Ya, Hapus',
    });
    if (!confirmed) return;

    try {
      await apiRequest(`${JADWAL_ENDPOINT}/${item.id}`, { method: 'DELETE' });
      setEvents((prev) => prev.filter((e) => e.id !== item.id));
      showSuccessAlert('Jadwal Dihapus', `Agenda "${item.title}" telah dihapus.`);
    } catch (err) {
      showToast('error', err instanceof ApiError ? err.message : 'Gagal menghapus jadwal bimbingan.');
    }
  };

  return {
    events,
    students,
    mentors,
    loading,
    syncing,
    error,
    refetch: fetchJadwals,
    syncFromGoogle,
    createJadwal,
    updateJadwal,
    deleteJadwal,
  };
}