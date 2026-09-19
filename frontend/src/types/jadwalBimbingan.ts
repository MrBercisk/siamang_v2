/** Lokasi file: src/types/jadwalBimbingan.ts */

export interface ScheduleEvent {
  id: string;
  title: string;
  studentUserId: string;
  studentName: string;
  studentInstitution: string;
  mentorUserId: string;
  mentorName: string;
  date: string; // YYYY-MM-DD
  dayNumber: number;
  time: string; // "09:00 - 10:30"
  location: string;
  meetLink?: string;
  googleCalendarSynced: boolean;
  googleCalendarEventId?: string;
  notes?: string;
}

/** Mahasiswa dengan pendaftaran berstatus 'accepted' (dari /options). */
export interface StudentOption {
  userId: string;
  name: string;
  institution: string;
  /** Mentor yang sudah ditugaskan di application, dipakai untuk auto-pilih di form. */
  mentorId?: string;
}

export interface MentorOption {
  id: string;
  name: string;
}

/** Status dihitung di frontend dari tanggal & jam; tabel jadwal_bimbingans tidak punya kolom status. */
export type ScheduleStatus = 'dijadwalkan' | 'berlangsung' | 'selesai';

export interface JadwalFormValues {
  title: string;
  studentUserId: string;
  mentorUserId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  location: string;
  meetLink: string;
  notes: string;
  syncGoogleCalendar: boolean;
}

export const EMPTY_JADWAL_FORM: JadwalFormValues = {
  title: '',
  studentUserId: '',
  mentorUserId: '',
  date: '',
  startTime: '09:00',
  endTime: '10:30',
  location: '',
  meetLink: '',
  notes: '',
  syncGoogleCalendar: true,
};