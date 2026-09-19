import React, { useMemo, useState } from 'react';
import { useJadwalBimbinganAdmin } from './hooks/useJadwalBimbinganAdmin';
import { EMPTY_JADWAL_FORM } from '../../types/jadwalBimbingan';
import type { JadwalFormValues, ScheduleEvent } from '../../types/jadwalBimbingan';

// Tipe dipindah ke types/jadwalBimbingan; re-export supaya import lama tetap jalan.
export type { ScheduleEvent };

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const pad = (value: number) => String(value).padStart(2, '0');
const toDateStr = (year: number, monthIndex: number, day: number) =>
  `${year}-${pad(monthIndex + 1)}-${pad(day)}`;

export const JadwalBimbinganAdminView: React.FC = () => {
  const { events, students, mentors, loading, error, refetch, createJadwal, deleteJadwal } =
    useJadwalBimbinganAdmin({ withOptions: true });

  // Kalender: mulai dari bulan & tanggal hari ini
  const today = useMemo(() => new Date(), []);
  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  // Modal & form
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [form, setForm] = useState<JadwalFormValues>(EMPTY_JADWAL_FORM);

  const updateForm = <K extends keyof JadwalFormValues>(key: K, value: JadwalFormValues[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // --- Turunan data ---------------------------------------------------------
  const eventsByDate = useMemo(() => {
    const grouped: Record<string, ScheduleEvent[]> = {};
    events.forEach((event) => {
      if (!grouped[event.date]) grouped[event.date] = [];
      grouped[event.date].push(event);
    });
    return grouped;
  }, [events]);

  const monthPrefix = `${currentYear}-${pad(currentMonthIndex + 1)}-`;
  const monthEvents = useMemo(
    () => events.filter((event) => event.date.startsWith(monthPrefix)),
    [events, monthPrefix]
  );

  const syncedCount = useMemo(
    () => events.filter((event) => event.googleCalendarSynced).length,
    [events]
  );

  const calendarCells = useMemo(() => {
    const firstWeekday = new Date(currentYear, currentMonthIndex, 1).getDay(); // 0 = Sunday
    const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
    const prevMonthDays = new Date(currentYear, currentMonthIndex, 0).getDate();
    const totalCells = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;

    return Array.from({ length: totalCells }, (_, index) => {
      const dayOffset = index - firstWeekday + 1;
      if (dayOffset < 1) return { day: prevMonthDays + dayOffset, inMonth: false };
      if (dayOffset > daysInMonth) return { day: dayOffset - daysInMonth, inMonth: false };
      return { day: dayOffset, inMonth: true };
    });
  }, [currentYear, currentMonthIndex]);

  const [selYear, selMonth, selDay] = selectedDate.split('-').map(Number);
  const selectedDayEvents = eventsByDate[selectedDate] ?? [];

  // --- Navigasi bulan -------------------------------------------------------
  const goToMonth = (year: number, monthIndex: number) => {
    setCurrentYear(year);
    setCurrentMonthIndex(monthIndex);
    setSelectedDate(toDateStr(year, monthIndex, 1));
  };

  const handlePrevMonth = () => {
    if (currentMonthIndex === 0) goToMonth(currentYear - 1, 11);
    else goToMonth(currentYear, currentMonthIndex - 1);
  };

  const handleNextMonth = () => {
    if (currentMonthIndex === 11) goToMonth(currentYear + 1, 0);
    else goToMonth(currentYear, currentMonthIndex + 1);
  };

  // --- Form -----------------------------------------------------------------
  const openAddModal = () => {
    setForm({ ...EMPTY_JADWAL_FORM, date: selectedDate });
    setShowAddModal(true);
  };

  const handleStudentChange = (userId: string) => {
    const student = students.find((item) => item.userId === userId);
    setForm((prev) => ({
      ...prev,
      studentUserId: userId,
      // Otomatis pilih mentor yang sudah ditugaskan ke mahasiswa ini
      mentorUserId: student?.mentorId ?? prev.mentorUserId,
    }));
  };

  const handleAddScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi, toast, dan alert ditangani hook (pola sama dengan useKategoriAdmin).
    setSubmitting(true);
    const success = await createJadwal(form);
    setSubmitting(false);
    if (!success) return;

    // Pindahkan kalender ke bulan & tanggal jadwal yang baru dibuat
    const [year, month] = form.date.split('-').map(Number);
    setCurrentYear(year);
    setCurrentMonthIndex(month - 1);
    setSelectedDate(form.date);
    setShowAddModal(false);
  };

  // --- Tampilan -------------------------------------------------------------
  return (
    <div className="space-y-6 animate-fade-in font-sans text-slate-800">
      {/* PAGE TITLE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Jadwal Bimbingan Mahasiswa
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Kelola agenda bimbingan magang dan pertemuan mentor.
          </p>
        </div>

        {/* GOOGLE CALENDAR STATUS CARD */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <span className="material-symbols-outlined text-2xl">calendar_month</span>
          </div>
          <div className="text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">Google Calendar</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                  syncedCount > 0
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                {syncedCount > 0 ? `${syncedCount} tersinkron` : 'Belum tersinkron'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
              {loading ? 'Memuat jadwal...' : `${events.length} jadwal tersimpan di SIAMANG`}
            </p>
          </div>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span className="font-bold">{error}</span>
          <button
            type="button"
            onClick={refetch}
            className="self-start px-3 py-1.5 font-bold bg-white border border-rose-200 rounded-lg hover:bg-rose-100 cursor-pointer"
          >
            Coba lagi
          </button>
        </div>
      )}

      {/* ACTION BAR */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3 text-xs">
          <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400 font-bold shrink-0">
            <span className="material-symbols-outlined text-lg">sync_alt</span>
          </div>
          <div>
            <span className="font-bold block text-sm">Jadwal tersimpan di database</span>
            <p className="text-slate-300 text-[11px]">
              Jadwal yang dibuat di sini langsung tersimpan. Penyinkronan ke Google Calendar
              menunggu integrasi di backend.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={refetch}
          disabled={loading}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 border border-slate-700 shadow-2xs transition-all cursor-pointer disabled:opacity-50 shrink-0"
        >
          <span className={`material-symbols-outlined text-base ${loading ? 'animate-spin' : ''}`}>
            refresh
          </span>
          <span>Muat ulang</span>
        </button>
      </div>

      {/* KALENDER */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={openAddModal}
            className="bg-[#1f877c] hover:bg-[#196e65] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-2xs transition-all cursor-pointer"
          >
            <span>Tambah Jadwal</span>
            <span className="text-base font-extrabold">+</span>
          </button>

          <h2 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">
            {MONTH_NAMES[currentMonthIndex]} {currentYear}
          </h2>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrevMonth}
              aria-label="Bulan sebelumnya"
              className="w-9 h-9 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">chevron_left</span>
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              aria-label="Bulan berikutnya"
              className="w-9 h-9 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">chevron_right</span>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-7 gap-2 sm:gap-3 text-center text-xs font-bold text-slate-700 pb-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((name) => (
              <div key={name}>{name}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2 sm:gap-3">
            {calendarCells.map((cell, index) => {
              if (!cell.inMonth) {
                return (
                  <div
                    key={`filler-${index}`}
                    className="h-20 sm:h-24 p-2.5 rounded-2xl border border-slate-200 bg-white flex flex-col justify-between text-slate-400 opacity-60"
                  >
                    <span className="text-xs sm:text-sm font-bold">{cell.day}</span>
                  </div>
                );
              }

              const dateStr = toDateStr(currentYear, currentMonthIndex, cell.day);
              const dayEvents = eventsByDate[dateStr] ?? [];
              const hasEvents = dayEvents.length > 0;
              const isSelected = selectedDate === dateStr;
              const isToday = todayStr === dateStr;

              return (
                <button
                  type="button"
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`h-20 sm:h-24 p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between text-left ${
                    isSelected
                      ? 'bg-[#1e293b] text-white border-slate-800 shadow-md scale-[1.02]'
                      : hasEvents
                        ? 'bg-[#FFF5C2] border-amber-200 hover:border-amber-400 text-slate-900'
                        : 'bg-[#E9F7F5] border-transparent hover:border-[#1f877c] text-slate-800'
                  } ${isToday && !isSelected ? 'ring-2 ring-[#1f877c]/50' : ''}`}
                >
                  <span
                    className={`text-xs sm:text-sm font-bold ${
                      isSelected ? 'text-[#38bdf8]' : hasEvents ? 'text-amber-900' : ''
                    }`}
                  >
                    {cell.day}
                  </span>
                  {hasEvents && (
                    <span
                      className={`text-[10px] sm:text-xs font-medium leading-tight ${
                        isSelected ? 'text-amber-300' : 'text-amber-800'
                      }`}
                    >
                      {dayEvents.length} agenda
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* AGENDA HARI TERPILIH & DAFTAR BULAN INI */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#1f877c]">event_available</span>
              <span>
                Agenda Bimbingan ({selDay} {MONTH_NAMES[selMonth - 1]} {selYear})
              </span>
            </h3>

            <button
              type="button"
              onClick={openAddModal}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1 cursor-pointer shrink-0"
            >
              <span>+ Tambah di Tanggal Ini</span>
            </button>
          </div>

          {loading && events.length === 0 ? (
            <div className="space-y-3">
              {[0, 1].map((key) => (
                <div key={key} className="h-28 rounded-2xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : selectedDayEvents.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
              <span className="material-symbols-outlined text-3xl text-slate-300">event_busy</span>
              <p className="text-xs font-bold text-slate-600">
                Belum Ada Agenda Bimbingan untuk Tanggal Ini
              </p>
              <p className="text-[11px] text-slate-400">
                Klik "Tambah Jadwal +" untuk membuat bimbingan baru.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedDayEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#1f877c]/10 text-[#1f877c]">
                        {evt.time} WIB
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm mt-1.5">{evt.title}</h4>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {evt.googleCalendarSynced && (
                        <span
                          className="px-2 py-1 rounded-lg text-[10px] font-extrabold bg-blue-100 text-blue-700 flex items-center gap-1"
                          title="Tersinkronisasi dengan Google Calendar"
                        >
                          <span className="material-symbols-outlined text-xs">sync</span>
                          <span>GCal</span>
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => deleteJadwal(evt)}
                        aria-label={`Hapus agenda ${evt.title}`}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 pt-1 border-t border-slate-200/60">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Mahasiswa</span>
                      <p className="font-bold text-slate-800">{evt.studentName}</p>
                      {evt.studentInstitution && (
                        <p className="text-[10px] text-slate-500">{evt.studentInstitution}</p>
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">
                        Mentor Lapangan
                      </span>
                      <p className="font-bold text-slate-800">{evt.mentorName}</p>
                    </div>
                  </div>

                  {evt.location && (
                    <div className="text-xs flex items-center gap-1.5 text-slate-600">
                      <span className="material-symbols-outlined text-sm text-[#1f877c]">
                        location_on
                      </span>
                      <span>{evt.location}</span>
                    </div>
                  )}

                  {evt.notes && <p className="text-xs text-slate-500">{evt.notes}</p>}

                  {evt.meetLink && (
                    <div className="pt-1">
                      <a
                        href={evt.meetLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">video_camera_front</span>
                        <span>Buka Google Meet Link</span>
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center justify-between">
            <span>Daftar Seluruh Agenda Bulan Ini</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
              {monthEvents.length} Agenda
            </span>
          </h3>

          {monthEvents.length === 0 ? (
            <p className="text-xs text-slate-500">
              Belum ada agenda pada {MONTH_NAMES[currentMonthIndex]} {currentYear}.
            </p>
          ) : (
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {monthEvents.map((e) => (
                <button
                  type="button"
                  key={e.id}
                  onClick={() => setSelectedDate(e.date)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                    selectedDate === e.date
                      ? 'border-[#1f877c] bg-[#E6F7F3]'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#1f877c]">
                      {e.dayNumber} {MONTH_NAMES[currentMonthIndex]} {currentYear}
                    </span>
                    <span className="text-[10px] font-medium text-slate-500">{e.time} WIB</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{e.title}</h4>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {e.studentName}
                    {e.studentInstitution ? ` (${e.studentInstitution})` : ''}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MODAL TAMBAH JADWAL BIMBINGAN */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#E6F7F3] text-[#1f877c] flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-lg">calendar_add_on</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">Tambah Jadwal Bimbingan</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                aria-label="Tutup"
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleAddScheduleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Judul Agenda Bimbingan *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => updateForm('title', e.target.value)}
                  placeholder="Contoh: Bimbingan Laporan Akhir & Reviu Prototipe UI/UX"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-[#1f877c]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mahasiswa Bimbingan *</label>
                  <select
                    required
                    value={form.studentUserId}
                    onChange={(e) => handleStudentChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium"
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
                  <label className="block font-bold text-slate-700 mb-1">Mentor Lapangan *</label>
                  <select
                    required
                    value={form.mentorUserId}
                    onChange={(e) => updateForm('mentorUserId', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium"
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tanggal *</label>
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) => updateForm('date', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jam mulai *</label>
                  <input
                    type="time"
                    required
                    value={form.startTime}
                    onChange={(e) => updateForm('startTime', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jam selesai *</label>
                  <input
                    type="time"
                    required
                    value={form.endTime}
                    onChange={(e) => updateForm('endTime', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Lokasi</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => updateForm('location', e.target.value)}
                    placeholder="Ruang Rapat DISKOMINFOSAN Lt.2"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tautan Google Meet</label>
                  <input
                    type="url"
                    value={form.meetLink}
                    onChange={(e) => updateForm('meetLink', e.target.value)}
                    placeholder="https://meet.google.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Catatan Tambahan (Opsional)</label>
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) => updateForm('notes', e.target.value)}
                  placeholder="Catatan persiapan atau topik yang akan dibahas..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white font-medium resize-none"
                />
              </div>

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

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
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
        </div>
      )}
    </div>
  );
};