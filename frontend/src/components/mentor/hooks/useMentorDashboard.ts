import { useCallback, useEffect, useState } from 'react';
import { apiRequest, ApiError } from '../../../lib/api';
import { ScheduleEvent } from '../../../types/jadwalBimbingan';
import {
  EMPTY_MENTOR_STATS,
  MentorDashboardStats,
  MentorStudent,
} from '../../../types/mentorDashboard';

/**
 * Lokasi file: src/components/mentor/hooks/useMentorDashboard.ts
 *
 * Kontrak API dari App\Http\Controllers\Api\Mentor\MentorDashboardController:
 * - GET /mentor/dashboard -> index(), hanya data milik mentor yang login
 *                            (route dibatasi middleware role:mentor).
 *     stats     : jumlah pendaftar pada kategori yang diampu (total/diterima/ditolak)
 *     schedules : semua JadwalBimbingan dengan mentor_user_id = mentor ini
 *     students  : semua Bimbingan dengan mentor_id = mentor ini (nama, progress)
 *
 * Read-only. Jadwal dibuat & diubah oleh admin.
 */

const DASHBOARD_ENDPOINT = '/mentor/dashboard';

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

interface BackendStudent {
  id: number | string;
  name?: string | null;
  avatarUrl?: string | null;
  progressPercent?: number | null;
  status?: string | null;
}

interface BackendDashboard {
  stats: MentorDashboardStats;
  schedules: BackendJadwal[];
  students: BackendStudent[];
}

/** Bentuk sama dengan mapJadwal di useJadwalBimbinganAdmin. */
function mapJadwal(item: BackendJadwal): ScheduleEvent {
  const date = item.date ? item.date.slice(0, 10) : '';

  return {
    id: String(item.id),
    title: item.title,
    studentUserId: String(item.studentUserId),
    studentName: item.studentName || 'Peserta belum ditentukan',
    studentInstitution: item.studentInstitution || '',
    mentorUserId: String(item.mentorUserId),
    mentorName: item.mentorName || '',
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

function mapStudent(s: BackendStudent): MentorStudent {
  return {
    id: String(s.id),
    name: s.name || 'Peserta tidak ditemukan',
    avatarUrl: s.avatarUrl || undefined,
    progressPercent: Math.min(100, Math.max(0, Number(s.progressPercent) || 0)),
    status: s.status?.trim() || '',
  };
}

export function useMentorDashboard() {
  const [stats, setStats] = useState<MentorDashboardStats>(EMPTY_MENTOR_STATS);
  const [schedules, setSchedules] = useState<ScheduleEvent[]>([]);
  const [students, setStudents] = useState<MentorStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest<ApiItem<BackendDashboard>>(DASHBOARD_ENDPOINT);
      setStats(res.data.stats);
      setSchedules(res.data.schedules.map(mapJadwal));
      setStudents(res.data.students.map(mapStudent));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Gagal memuat dashboard mentor.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    stats,
    schedules,
    students,
    loading,
    error,
    refetch: fetchDashboard,
  };
}