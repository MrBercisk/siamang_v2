import React, { useState } from 'react';
import { showSuccessAlert, showToast, showConfirmAlert } from '../../utils/swal';

export interface ScheduleEvent {
  id: string;
  title: string;
  studentName: string;
  studentInstitution: string;
  mentorName: string;
  date: string; // YYYY-MM-DD
  dayNumber: number;
  time: string; // e.g. "09:00 - 10:30 WIB"
  location: string;
  meetLink?: string;
  googleCalendarSynced: boolean;
  googleCalendarEventId?: string;
  notes?: string;
}

export const JadwalBimbinganAdminView: React.FC = () => {
  // Calendar Month State (Default June 2026 as per screenshot)
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(5); // 0-indexed, 5 = June
  const [selectedDay, setSelectedDay] = useState<number>(25); // Default day 25 highlighted dark as in screenshot

  // Google Calendar Connection Status State
  const [isGCalConnected, setIsGCalConnected] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Baru saja');

  // Modal State
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [selectedEventForDetail, setSelectedEventForDetail] = useState<ScheduleEvent | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState<string>('');
  const [formStudent, setFormStudent] = useState<string>('Leona Strive (UAD)');
  const [formMentor, setFormMentor] = useState<string>('Dra. Endang Sulastri, M.Kom.');
  const [formDate, setFormDate] = useState<string>('2026-06-25');
  const [formTime, setFormTime] = useState<string>('09:00 - 10:30');
  const [formLocation, setFormLocation] = useState<string>('Ruang Rapat DISKOMINFOSAN Lt.2');
  const [formSyncGCal, setFormSyncGCal] = useState<boolean>(true);
  const [formNotes, setFormNotes] = useState<string>('');

  // Sample Schedule Events
  const [events, setEvents] = useState<ScheduleEvent[]>([
    {
      id: 'EVT-001',
      title: 'Bimbingan Laporan Akhir & Reviu UI/UX',
      studentName: 'Leona Strive',
      studentInstitution: 'Universitas Ahmad Dahlan',
      mentorName: 'Dra. Endang Sulastri, M.Kom.',
      date: '2026-06-02',
      dayNumber: 2,
      time: '09:00 - 10:30 WIB',
      location: 'Ruang Bimbingan Diskominfosan Lt. 2',
      meetLink: 'https://meet.google.com/amg-mgn-yk1',
      googleCalendarSynced: true,
      googleCalendarEventId: 'gcal_8912389123',
      notes: 'Membahas progress prototipe SIAMANG dan laporan mingguan bab 4.',
    },
    {
      id: 'EVT-002',
      title: 'Bimbingan Evaluasi Tengah Periode',
      studentName: 'Rizky Pratama',
      studentInstitution: 'Universitas Negeri Yogyakarta',
      mentorName: 'Bpk. Ahmad Fauzi, S.Kom.',
      date: '2026-06-25',
      dayNumber: 25,
      time: '11:00 - 12:00 WIB',
      location: 'Google Meet Online',
      meetLink: 'https://meet.google.com/rzk-eval-2026',
      googleCalendarSynced: true,
      googleCalendarEventId: 'gcal_9912838192',
      notes: 'Persiapan presentasi mid-term magang bidang jaringan e-Gov.',
    },
    {
      id: 'EVT-003',
      title: 'Bimbingan Akhir & Penilaian Mentor',
      studentName: 'Leona Strive',
      studentInstitution: 'Universitas Ahmad Dahlan',
      mentorName: 'Dra. Endang Sulastri, M.Kom.',
      date: '2026-06-30',
      dayNumber: 30,
      time: '13:30 - 15:00 WIB',
      location: 'Ruang Bimbingan Diskominfosan Lt. 2',
      meetLink: 'https://meet.google.com/amg-final-2026',
      googleCalendarSynced: true,
      googleCalendarEventId: 'gcal_7718239102',
      notes: 'Pemeriksaan draft akhir laporan magang dan penginputan nilai mentor.',
    },
  ]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Helper: Month Navigation
  const handlePrevMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonthIndex(currentMonthIndex - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonthIndex(currentMonthIndex + 1);
    }
  };

  // Helper: Check if a day has agenda
  const getEventsForDay = (dayNum: number) => {
    const formattedDate = `${currentYear}-${String(currentMonthIndex + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    return events.filter((e) => e.date === formattedDate || e.dayNumber === dayNum);
  };

  // Add Event Form Submit
  const handleAddScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formTitle.trim()) {
      showToast('error', 'Harap isi judul agenda bimbingan.');
      return;
    }

    const dayNum = parseInt(formDate.split('-')[2], 10) || selectedDay;

    const newEvent: ScheduleEvent = {
      id: `EVT-${Date.now().toString().slice(-4)}`,
      title: formTitle,
      studentName: formStudent.split('(')[0].trim(),
      studentInstitution: formStudent.includes('(') ? formStudent.split('(')[1].replace(')', '') : 'Perguruan Tinggi',
      mentorName: formMentor,
      date: formDate,
      dayNumber: dayNum,
      time: `${formTime} WIB`,
      location: formLocation,
      meetLink: formLocation.toLowerCase().includes('meet') ? 'https://meet.google.com/amg-new-event' : undefined,
      googleCalendarSynced: formSyncGCal,
      googleCalendarEventId: formSyncGCal ? `gcal_${Date.now()}` : undefined,
      notes: formNotes,
    };

    setEvents((prev) => [...prev, newEvent]);
    setSelectedDay(dayNum);
    setShowAddModal(false);

    // Reset Form
    setFormTitle('');
    setFormNotes('');

    if (formSyncGCal) {
      showSuccessAlert(
        'Jadwal Berhasil Ditambahkan & Tersinkron!',
        `Agenda "${newEvent.title}" telah tersimpan ke sistem SI AMANG dan otomatis disinkronkan ke Google Calendar DISKOMINFOSAN.`
      );
    } else {
      showSuccessAlert('Jadwal Berhasil Ditambahkan', `Agenda "${newEvent.title}" telah disimpan.`);
    }
  };

  // Simulate Incoming Event Added directly from Google Calendar
  const handleSimulateAddFromGoogleCalendar = () => {
    setIsSyncing(true);
    showToast('info', 'Menghubungkan ke Google Calendar API...');

    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));

      const simulatedGCalEvent: ScheduleEvent = {
        id: `GCAL-${Math.floor(1000 + Math.random() * 9000)}`,
        title: 'Bimbingan Teknis Tambahan via Google Calendar',
        studentName: 'Budi Santoso',
        studentInstitution: 'UPN Veteran Yogyakarta',
        mentorName: 'Bpk. Hendra Wijaya, S.T.',
        date: '2026-06-15',
        dayNumber: 15,
        time: '10:00 - 11:30 WIB',
        location: 'Google Meet (Otomatis dari GCal)',
        meetLink: 'https://meet.google.com/gcal-auto-sync',
        googleCalendarSynced: true,
        googleCalendarEventId: `gcal_external_${Date.now()}`,
        notes: 'Dibuat langsung dari aplikasi Google Calendar Admin/Mentor.',
      };

      setEvents((prev) => [...prev, simulatedGCalEvent]);
      setSelectedDay(15);

      showSuccessAlert(
        'Data Google Calendar Terbarui!',
        '1 Agenda baru terdeteksi dari Google Calendar ("Bimbingan Teknis Tambahan via Google Calendar") dan otomatis masuk ke Jadwal Bimbingan.'
      );
    }, 1200);
  };

  // Sync Google Calendar Manual Refresh
  const handleManualSyncGCal = () => {
    setIsSyncing(true);
    showToast('info', 'Mengambil pembaruan jadwal dari Google Calendar...');

    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
      showToast('success', 'Kalender berhasil disinkronkan dengan Google Calendar!');
    }, 1000);
  };

  // Delete Schedule
  const handleDeleteSchedule = async (eventId: string, eventTitle: string) => {
    const confirm = await showConfirmAlert(
      'Hapus Jadwal Bimbingan?',
      `Apakah Anda yakin ingin menghapus agenda "${eventTitle}"? Jika tersambung, agenda juga akan dihapus dari Google Calendar.`
    );

    if (confirm.isConfirmed) {
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
      setShowDetailModal(false);
      showToast('success', 'Jadwal berhasil dihapus dari sistem & Google Calendar.');
    }
  };

  // Days for June 2026 (Starts on Monday June 1st)
  // Screenshot grid:
  // Row 1: May 31 (grey), Jun 1, Jun 2 (yellow), Jun 3, Jun 4, Jun 5, Jun 6
  // Row 2: 7, 8, 9, 10, 11, 12, 13
  // Row 3: 14, 15, 16, 17, 18, 19, 20
  // Row 4: 21, 22, 23, 24, 25 (dark navy), 26, 27
  // Row 5: 28, 29, 30 (yellow), Jul 1, Jul 2, Jul 3, Jul 4

  const selectedDayEvents = getEventsForDay(selectedDay);

  return (
    <div className="space-y-6 animate-fade-in font-sans text-slate-800">
      
      {/* PAGE TITLE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Jadwal Bimbingan Mahasiswa
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Kelola agenda bimbingan magang, pertemuan mentor, dan sinkronkan dengan Google Calendar.
          </p>
        </div>

        {/* GOOGLE CALENDAR LIVE SYNC CARD */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <span className="material-symbols-outlined text-2xl">calendar_month</span>
          </div>
          <div className="text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">Google Calendar API</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Connected
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
              Real-time 2-Way Sync • Terakhir: {lastSyncTime}
            </p>
          </div>
        </div>
      </div>

      {/* ACTION BAR & GOOGLE CALENDAR CONTROLS */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3 text-xs">
          <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400 font-bold shrink-0">
            <span className="material-symbols-outlined text-lg">sync_alt</span>
          </div>
          <div>
            <span className="font-bold block text-sm">Sinkronisasi Otomatis Google Calendar</span>
            <p className="text-slate-300 text-[11px]">
              Setiap kali Anda menambah di Google Calendar, jadwal bimbingan otomatis ter-update di sini.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleSimulateAddFromGoogleCalendar}
            disabled={isSyncing}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer disabled:opacity-50"
            title="Simulasi jika mentor/admin menambah event di Google Calendar"
          >
            <span className="material-symbols-outlined text-base">cloud_download</span>
            <span>+ Sync dari GCal</span>
          </button>

          <button
            type="button"
            onClick={handleManualSyncGCal}
            disabled={isSyncing}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 border border-slate-700 shadow-2xs transition-all cursor-pointer disabled:opacity-50"
          >
            <span className={`material-symbols-outlined text-base ${isSyncing ? 'animate-spin' : ''}`}>
              refresh
            </span>
            <span>Sinkronkan</span>
          </button>
        </div>
      </div>

      {/* CALENDAR CONTAINER CARD (Matching User Screenshot Exactly) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 sm:p-8 space-y-6">
        
        {/* CALENDAR TOP HEADER BAR */}
        <div className="flex items-center justify-between">
          {/* LEFT: TAMBAH JADWAL BUTTON */}
          <button
            type="button"
            onClick={() => {
              setFormDate(`${currentYear}-${String(currentMonthIndex + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`);
              setShowAddModal(true);
            }}
            className="bg-[#1f877c] hover:bg-[#196e65] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-2xs transition-all cursor-pointer"
          >
            <span>Tambah Jadwal</span>
            <span className="text-base font-extrabold">+</span>
          </button>

          {/* CENTER: MONTH & YEAR DISPLAY */}
          <h2 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">
            {monthNames[currentMonthIndex]} {currentYear}
          </h2>

          {/* RIGHT: NAVIGATION BUTTONS */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="w-9 h-9 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">chevron_left</span>
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="w-9 h-9 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">chevron_right</span>
            </button>
          </div>
        </div>

        {/* CALENDAR GRID */}
        <div className="space-y-3">
          
          {/* DAY NAMES HEADER */}
          <div className="grid grid-cols-7 gap-2 sm:gap-3 text-center text-xs font-bold text-slate-700 pb-1">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* DATES GRID (7 Columns x 5 Rows) */}
          <div className="grid grid-cols-7 gap-2 sm:gap-3">
            
            {/* Row 1: May 31 (Prev month grey) */}
            <div className="h-20 sm:h-24 p-2.5 rounded-2xl border border-slate-200 bg-white flex flex-col justify-between text-slate-400 opacity-60">
              <span className="text-xs sm:text-sm font-bold">31</span>
            </div>

            {/* Row 1: June 1 */}
            <div
              onClick={() => setSelectedDay(1)}
              className={`h-20 sm:h-24 p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                selectedDay === 1
                  ? 'bg-[#1e293b] text-white border-slate-800 shadow-md scale-[1.02]'
                  : 'bg-[#E9F7F5] border-transparent hover:border-[#1f877c] text-slate-800'
              }`}
            >
              <span className={`text-xs sm:text-sm font-bold ${selectedDay === 1 ? 'text-[#38bdf8]' : ''}`}>1</span>
            </div>

            {/* Row 1: June 2 (Yellow highlight with detail agenda as in screenshot) */}
            <div
              onClick={() => setSelectedDay(2)}
              className={`h-20 sm:h-24 p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                selectedDay === 2
                  ? 'bg-[#1e293b] text-white border-slate-800 shadow-md scale-[1.02]'
                  : 'bg-[#FFF5C2] border-amber-200 hover:border-amber-400 text-slate-900'
              }`}
            >
              <span className={`text-xs sm:text-sm font-bold ${selectedDay === 2 ? 'text-[#38bdf8]' : 'text-amber-900'}`}>2</span>
              <span className={`text-[10px] sm:text-xs font-medium leading-tight ${selectedDay === 2 ? 'text-amber-300' : 'text-amber-800'}`}>
                detail agenda
              </span>
            </div>

            {/* June 3 - 6 */}
            {[3, 4, 5, 6].map((day) => (
              <div
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`h-20 sm:h-24 p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedDay === day
                    ? 'bg-[#1e293b] text-white border-slate-800 shadow-md scale-[1.02]'
                    : 'bg-[#E9F7F5] border-transparent hover:border-[#1f877c] text-slate-800'
                }`}
              >
                <span className={`text-xs sm:text-sm font-bold ${selectedDay === day ? 'text-[#38bdf8]' : ''}`}>{day}</span>
              </div>
            ))}

            {/* Row 2: June 7 - 13 */}
            {[7, 8, 9, 10, 11, 12, 13].map((day) => (
              <div
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`h-20 sm:h-24 p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedDay === day
                    ? 'bg-[#1e293b] text-white border-slate-800 shadow-md scale-[1.02]'
                    : 'bg-[#E9F7F5] border-transparent hover:border-[#1f877c] text-slate-800'
                }`}
              >
                <span className={`text-xs sm:text-sm font-bold ${selectedDay === day ? 'text-[#38bdf8]' : ''}`}>{day}</span>
                {getEventsForDay(day).length > 0 && selectedDay !== day && (
                  <span className="text-[10px] sm:text-xs font-medium text-[#1f877c]">detail agenda</span>
                )}
              </div>
            ))}

            {/* Row 3: June 14 - 20 */}
            {[14, 15, 16, 17, 18, 19, 20].map((day) => {
              const dayEvts = getEventsForDay(day);
              const hasEvents = dayEvts.length > 0;
              return (
                <div
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`h-20 sm:h-24 p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    selectedDay === day
                      ? 'bg-[#1e293b] text-white border-slate-800 shadow-md scale-[1.02]'
                      : hasEvents
                      ? 'bg-[#FFF5C2] border-amber-200 text-slate-900'
                      : 'bg-[#E9F7F5] border-transparent hover:border-[#1f877c] text-slate-800'
                  }`}
                >
                  <span className={`text-xs sm:text-sm font-bold ${selectedDay === day ? 'text-[#38bdf8]' : ''}`}>{day}</span>
                  {hasEvents && (
                    <span className={`text-[10px] sm:text-xs font-medium leading-tight ${selectedDay === day ? 'text-amber-300' : 'text-amber-800'}`}>
                      detail agenda
                    </span>
                  )}
                </div>
              );
            })}

            {/* Row 4: June 21 - 24 */}
            {[21, 22, 23, 24].map((day) => (
              <div
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`h-20 sm:h-24 p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedDay === day
                    ? 'bg-[#1e293b] text-white border-slate-800 shadow-md scale-[1.02]'
                    : 'bg-[#E9F7F5] border-transparent hover:border-[#1f877c] text-slate-800'
                }`}
              >
                <span className={`text-xs sm:text-sm font-bold ${selectedDay === day ? 'text-[#38bdf8]' : ''}`}>{day}</span>
              </div>
            ))}

            {/* Row 4: June 25 (Selected Dark Navy as shown in screenshot) */}
            <div
              onClick={() => setSelectedDay(25)}
              className={`h-20 sm:h-24 p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                selectedDay === 25
                  ? 'bg-[#1e293b] text-white border-slate-800 shadow-md scale-[1.02]'
                  : 'bg-[#E9F7F5] border-transparent hover:border-[#1f877c] text-slate-800'
              }`}
            >
              <span className="text-xs sm:text-sm font-bold text-[#10b981]">25</span>
              {getEventsForDay(25).length > 0 && (
                <span className="text-[10px] sm:text-xs font-medium text-emerald-300">
                  {getEventsForDay(25).length} agenda
                </span>
              )}
            </div>

            {/* Row 4: June 26 - 27 */}
            {[26, 27].map((day) => (
              <div
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`h-20 sm:h-24 p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedDay === day
                    ? 'bg-[#1e293b] text-white border-slate-800 shadow-md scale-[1.02]'
                    : 'bg-[#E9F7F5] border-transparent hover:border-[#1f877c] text-slate-800'
                }`}
              >
                <span className={`text-xs sm:text-sm font-bold ${selectedDay === day ? 'text-[#38bdf8]' : ''}`}>{day}</span>
              </div>
            ))}

            {/* Row 5: June 28, 29 */}
            {[28, 29].map((day) => (
              <div
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`h-20 sm:h-24 p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedDay === day
                    ? 'bg-[#1e293b] text-white border-slate-800 shadow-md scale-[1.02]'
                    : 'bg-[#E9F7F5] border-transparent hover:border-[#1f877c] text-slate-800'
                }`}
              >
                <span className={`text-xs sm:text-sm font-bold ${selectedDay === day ? 'text-[#38bdf8]' : ''}`}>{day}</span>
              </div>
            ))}

            {/* Row 5: June 30 (Yellow highlight with detail agenda as in screenshot) */}
            <div
              onClick={() => setSelectedDay(30)}
              className={`h-20 sm:h-24 p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                selectedDay === 30
                  ? 'bg-[#1e293b] text-white border-slate-800 shadow-md scale-[1.02]'
                  : 'bg-[#FFF5C2] border-amber-200 hover:border-amber-400 text-slate-900'
              }`}
            >
              <span className={`text-xs sm:text-sm font-bold ${selectedDay === 30 ? 'text-[#38bdf8]' : 'text-amber-900'}`}>30</span>
              <span className={`text-[10px] sm:text-xs font-medium leading-tight ${selectedDay === 30 ? 'text-amber-300' : 'text-amber-800'}`}>
                detail agenda
              </span>
            </div>

            {/* Row 5: Next month July 1 - 4 (white cards with grey numbers) */}
            {[1, 2, 3, 4].map((nextDay) => (
              <div
                key={`next-${nextDay}`}
                className="h-20 sm:h-24 p-2.5 rounded-2xl border border-slate-200 bg-white flex flex-col justify-between text-slate-400"
              >
                <span className="text-xs sm:text-sm font-bold">{nextDay}</span>
              </div>
            ))}

          </div>

        </div>

      </div>

      {/* SELECTED DAY AGENDA DETAILS & ALL AGENDAS LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT: DETAILS FOR SELECTED DAY (7 COLS) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#1f877c]">event_available</span>
              <span>Agenda Bimbingan ({selectedDay} {monthNames[currentMonthIndex]} {currentYear})</span>
            </h3>

            <button
              type="button"
              onClick={() => {
                setFormDate(`${currentYear}-${String(currentMonthIndex + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`);
                setShowAddModal(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1 cursor-pointer"
            >
              <span>+ Tambah di Tanggal Ini</span>
            </button>
          </div>

          {selectedDayEvents.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
              <span className="material-symbols-outlined text-3xl text-slate-300">event_busy</span>
              <p className="text-xs font-bold text-slate-600">Belum Ada Agenda Bimbingan untuk Tanggal Ini</p>
              <p className="text-[11px] text-slate-400">
                Klik tombol "Tambah Jadwal +" untuk membuat bimbingan baru yang tersinkron dengan Google Calendar.
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
                        {evt.time}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm mt-1.5">{evt.title}</h4>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {evt.googleCalendarSynced && (
                        <span className="px-2 py-1 rounded-lg text-[10px] font-extrabold bg-blue-100 text-blue-700 flex items-center gap-1" title="Tersinkronisasi dengan Google Calendar">
                          <span className="material-symbols-outlined text-xs">sync</span>
                          <span>GCal</span>
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteSchedule(evt.id, evt.title)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 pt-1 border-t border-slate-200/60">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Mahasiswa</span>
                      <p className="font-bold text-slate-800">{evt.studentName}</p>
                      <p className="text-[10px] text-slate-500">{evt.studentInstitution}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Mentor Lapangan</span>
                      <p className="font-bold text-slate-800">{evt.mentorName}</p>
                    </div>
                  </div>

                  {evt.location && (
                    <div className="text-xs flex items-center gap-1.5 text-slate-600">
                      <span className="material-symbols-outlined text-sm text-[#1f877c]">location_on</span>
                      <span>{evt.location}</span>
                    </div>
                  )}

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

        {/* RIGHT: ALL SCHEDULED AGENDAS OVERVIEW (5 COLS) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center justify-between">
            <span>Daftar Seluruh Agenda Bulan Ini</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
              {events.length} Agenda
            </span>
          </h3>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {events.map((e) => (
              <div
                key={e.id}
                onClick={() => setSelectedDay(e.dayNumber)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                  selectedDay === e.dayNumber
                    ? 'border-[#1f877c] bg-[#E6F7F3]'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#1f877c]">{e.dayNumber} {monthNames[currentMonthIndex]} 2026</span>
                  <span className="text-[10px] font-medium text-slate-500">{e.time}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900">{e.title}</h4>
                <p className="text-[11px] text-slate-500 font-medium">
                  {e.studentName} ({e.studentInstitution})
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* MODAL TAMBAH JADWAL BIMBINGAN */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-scale-up">
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
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"
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
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Contoh: Bimbingan Laporan Akhir & Reviu Prototipe UI/UX"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-[#1f877c]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mahasiswa Bimbingan</label>
                  <select
                    value={formStudent}
                    onChange={(e) => setFormStudent(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                  >
                    <option value="Leona Strive (UAD)">Leona Strive (UAD)</option>
                    <option value="Rizky Pratama (UNY)">Rizky Pratama (UNY)</option>
                    <option value="Budi Santoso (UPN)">Budi Santoso (UPN)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mentor Lapangan</label>
                  <select
                    value={formMentor}
                    onChange={(e) => setFormMentor(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                  >
                    <option value="Dra. Endang Sulastri, M.Kom.">Dra. Endang Sulastri, M.Kom.</option>
                    <option value="Bpk. Ahmad Fauzi, S.Kom.">Bpk. Ahmad Fauzi, S.Kom.</option>
                    <option value="Bpk. Hendra Wijaya, S.T.">Bpk. Hendra Wijaya, S.T.</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tanggal Bimbingan</label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Waktu (Jam)</label>
                  <input
                    type="text"
                    required
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    placeholder="09:00 - 10:30"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Lokasi / Tautan Google Meet</label>
                <input
                  type="text"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  placeholder="Ruang Rapat DISKOMINFOSAN Lt.2 atau Link GMeet"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Catatan Tambahan (Opsional)</label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Catatan persiapan atau topik yang akan dibahas..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white font-medium resize-none"
                />
              </div>

              {/* GOOGLE CALENDAR SYNC TOGGLE CHECKBOX */}
              <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="syncGCal"
                  checked={formSyncGCal}
                  onChange={(e) => setFormSyncGCal(e.target.checked)}
                  className="mt-0.5 accent-[#1f877c] w-4 h-4 cursor-pointer"
                />
                <label htmlFor="syncGCal" className="text-[11px] font-medium text-blue-900 cursor-pointer">
                  <strong className="font-bold block text-blue-950">Otomatis Sync ke Google Calendar</strong>
                  Kirimkan undangan event kalender dan notifikasi email ke Google Account Mahasiswa &amp; Mentor Lapangan.
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#1f877c] hover:bg-[#196e65] text-white font-bold cursor-pointer shadow-xs"
                >
                  Simpan &amp; Sinkronkan
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
