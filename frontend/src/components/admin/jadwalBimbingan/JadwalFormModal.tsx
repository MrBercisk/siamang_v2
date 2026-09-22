import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { EMPTY_JADWAL_FORM } from '../../../types/jadwalBimbingan';
import type {
  JadwalFormValues,
  MentorOption,
  StudentOption,
} from '../../../types/jadwalBimbingan';

interface JadwalFormModalProps {
  open: boolean;
  /** Tanggal awal (YYYY-MM-DD) yang diisikan ke form setiap kali modal dibuka. */
  initialDate: string;
  students: StudentOption[];
  mentors: MentorOption[];
  /** Dipakai untuk menyembunyikan pesan "belum ada mahasiswa" saat data masih dimuat. */
  loading: boolean;
  onClose: () => void;
  /** Kembalikan true bila berhasil — modal akan menutup sendiri. */
  onSubmit: (values: JadwalFormValues) => Promise<boolean> | boolean;
}

const LABEL_CLASS = 'block font-bold text-slate-700 mb-1';
const INPUT_CLASS = 'w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium';

export const JadwalFormModal: React.FC<JadwalFormModalProps> = ({
  open,
  initialDate,
  students,
  mentors,
  loading,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState<JadwalFormValues>({ ...EMPTY_JADWAL_FORM, date: initialDate });
  const [submitting, setSubmitting] = useState(false);

  // Reset form setiap kali modal dibuka
  useEffect(() => {
    if (open) {
      setForm({ ...EMPTY_JADWAL_FORM, date: initialDate });
    }
  }, [open, initialDate]);

  if (!open) return null;

  const updateForm = <K extends keyof JadwalFormValues>(key: K, value: JadwalFormValues[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleStudentChange = (userId: string) => {
    const student = students.find((item) => item.userId === userId);
    setForm((prev) => ({
      ...prev,
      studentUserId: userId,
      // Otomatis pilih mentor yang sudah ditugaskan ke mahasiswa ini
      mentorUserId: student?.mentorId ?? prev.mentorUserId,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validasi, toast, dan alert ditangani hook (useJadwalBimbinganAdmin).
    setSubmitting(true);
    const success = await onSubmit(form);
    setSubmitting(false);
    if (success) onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 space-y-5 animate-scale-up">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#E6F7F3] text-[#1f877c] flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-lg">calendar_add_on</span>
            </div>
            <h3 className="text-base font-bold text-slate-900">Tambah Jadwal Bimbingan</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* JUDUL */}
          <div>
            <label className={LABEL_CLASS}>Judul Agenda Bimbingan *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => updateForm('title', e.target.value)}
              placeholder="Contoh: Bimbingan Laporan Akhir & Reviu Prototipe UI/UX"
              className={`${INPUT_CLASS} focus:ring-2 focus:ring-[#1f877c]`}
            />
          </div>

          {/* MAHASISWA & MENTOR */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={LABEL_CLASS}>Mahasiswa Bimbingan *</label>
              <select
                required
                value={form.studentUserId}
                onChange={(e) => handleStudentChange(e.target.value)}
                className={INPUT_CLASS}
              >
                <option value="">Pilih mahasiswa</option>
                {students.map((student) => (
                  <option key={student.userId} value={student.userId}>
                    {student.name}
                    {student.institution ? ` (${student.institution})` : ''}
                  </option>
                ))}
              </select>
              {students.length === 0 && !loading && (
                <p className="text-[11px] text-slate-500 mt-1">
                  Belum ada mahasiswa dengan pendaftaran berstatus diterima.
                </p>
              )}
            </div>

            <div>
              <label className={LABEL_CLASS}>Mentor Lapangan *</label>
              <select
                required
                value={form.mentorUserId}
                onChange={(e) => updateForm('mentorUserId', e.target.value)}
                className={INPUT_CLASS}
              >
                <option value="">Pilih mentor</option>
                {mentors.map((mentor) => (
                  <option key={mentor.id} value={mentor.id}>
                    {mentor.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* TANGGAL & JAM */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className={LABEL_CLASS}>Tanggal *</label>
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => updateForm('date', e.target.value)}
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label className={LABEL_CLASS}>Jam mulai *</label>
              <input
                type="time"
                required
                value={form.startTime}
                onChange={(e) => updateForm('startTime', e.target.value)}
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label className={LABEL_CLASS}>Jam selesai *</label>
              <input
                type="time"
                required
                value={form.endTime}
                onChange={(e) => updateForm('endTime', e.target.value)}
                className={INPUT_CLASS}
              />
            </div>
          </div>

          {/* LOKASI & MEET */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={LABEL_CLASS}>Lokasi</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => updateForm('location', e.target.value)}
                placeholder="Ruang Rapat DISKOMINFOSAN Lt.2"
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label className={LABEL_CLASS}>Tautan Google Meet</label>
              <input
                type="url"
                value={form.meetLink}
                onChange={(e) => updateForm('meetLink', e.target.value)}
                placeholder="https://meet.google.com/..."
                className={INPUT_CLASS}
              />
            </div>
          </div>

          {/* CATATAN */}
          <div>
            <label className={LABEL_CLASS}>Catatan Tambahan (Opsional)</label>
            <textarea
              rows={2}
              value={form.notes}
              onChange={(e) => updateForm('notes', e.target.value)}
              placeholder="Catatan persiapan atau topik yang akan dibahas..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white font-medium resize-none"
            />
          </div>

          {/* SINKRONISASI GOOGLE CALENDAR */}
          <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 flex items-start gap-3">
            <input
              type="checkbox"
              id="syncGCal"
              checked={form.syncGoogleCalendar}
              onChange={(e) => updateForm('syncGoogleCalendar', e.target.checked)}
              className="mt-0.5 accent-[#1f877c] w-4 h-4 cursor-pointer"
            />
            <label htmlFor="syncGCal" className="text-[11px] font-medium text-blue-900 cursor-pointer">
              <strong className="font-bold block text-blue-950">Sinkronkan ke Google Calendar</strong>
              Jadwal ini akan dikirim ke Google Calendar mahasiswa dan mentor begitu integrasi
              backend aktif.
            </label>
          </div>

          {/* AKSI */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 cursor-pointer disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-[#1f877c] hover:bg-[#196e65] text-white font-bold cursor-pointer shadow-xs disabled:opacity-50"
            >
              {submitting ? 'Menyimpan...' : 'Simpan jadwal'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};