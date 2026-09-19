import { useMemo, useState } from 'react';
import { useMentorDashboard } from '../hooks/useMentorDashboard';
import { getScheduleStatus } from '../../admin/hooks/useJadwalBimbinganAdmin';
import type { ScheduleEvent } from '../../../types/jadwalBimbingan';


const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const pad = (value: number) => String(value).padStart(2, '0');
const toDateStr = (year: number, monthIndex: number, day: number) =>
  `${year}-${pad(monthIndex + 1)}-${pad(day)}`;

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});
const formatAgendaDate = (date: string) => dateFormatter.format(new Date(`${date}T00:00:00`));
const startTime = (time: string) => time.split(' - ')[0] || time;

const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

const STAT_CARDS = [
  {
    key: 'totalPendaftar',
    label: 'Total Pendaftar',
    icon: 'groups',
    card: 'bg-[#EBF5FF] border-sky-100',
    text: 'text-[#0284c7]',
    iconBox: 'border-sky-200/80',
    iconSize: 'text-3xl',
  },
  {
    key: 'diterima',
    label: 'Pendaftar Diterima',
    icon: 'verified',
    card: 'bg-[#ECFDF5] border-emerald-100',
    text: 'text-[#10B981]',
    iconBox: 'border-emerald-200/80',
    iconSize: 'text-3xl',
  },
  {
    key: 'ditolak',
    label: 'Pendaftar Ditolak',
    icon: 'close',
    card: 'bg-[#FEF2F2] border-rose-100',
    text: 'text-[#E11D48]',
    iconBox: 'border-rose-200/80',
    iconSize: 'text-4xl',
  },
] as const;

export function DashboardTab() {
  const { stats, schedules, students, loading, error, refetch } = useMentorDashboard();

  const today = useMemo(() => new Date(), []);
  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonthIndex, setCurrentMonthIndex] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const eventsByDate = useMemo(() => {
    const grouped: Record<string, ScheduleEvent[]> = {};
    schedules.forEach((event) => {
      if (!grouped[event.date]) grouped[event.date] = [];
      grouped[event.date].push(event);
    });
    return grouped;
  }, [schedules]);

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

  const upcoming = useMemo(() => {
    const now = new Date();
    return schedules.filter((event) => getScheduleStatus(event, now) !== 'selesai');
  }, [schedules]);

  // Klik tanggal menampilkan agenda tanggal itu; tanpa pilihan, tampil agenda mendatang.
  const agendaEvents = selectedDate ? eventsByDate[selectedDate] ?? [] : upcoming.slice(0, 5);

  const goToMonth = (year: number, monthIndex: number) => {
    setCurrentYear(year);
    setCurrentMonthIndex(monthIndex);
    setSelectedDate(null);
  };

  const handlePrevMonth = () => {
    if (currentMonthIndex === 0) goToMonth(currentYear - 1, 11);
    else goToMonth(currentYear, currentMonthIndex - 1);
  };

  const handleNextMonth = () => {
    if (currentMonthIndex === 11) goToMonth(currentYear + 1, 0);
    else goToMonth(currentYear, currentMonthIndex + 1);
  };

  return (
    <div className="space-y-6 animate-fade-in">
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

      {/* STATS CARDS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {STAT_CARDS.map((card) => (
          <div
            key={card.key}
            className={`p-6 rounded-2xl border shadow-2xs flex items-center justify-between ${card.card}`}
          >
            <div>
              <span className={`text-4xl sm:text-5xl font-extrabold block ${card.text}`}>
                {loading ? '–' : stats[card.key]}
              </span>
              <span className={`text-xs font-bold block mt-2 ${card.text}`}>{card.label}</span>
            </div>
            <div
              className={`w-14 h-14 rounded-2xl bg-white/80 border flex items-center justify-center p-2.5 shrink-0 shadow-2xs ${card.iconBox}`}
            >
              <span className={`material-symbols-outlined ${card.iconSize} ${card.text}`}>
                {card.icon}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* MIDDLE SECTION: CALENDAR & RIGHT STACK */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CALENDAR - 8 COLS */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              {MONTH_NAMES[currentMonthIndex]} {currentYear}
            </h3>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                aria-label="Bulan sebelumnya"
                className="w-7 h-7 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-600 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                aria-label="Bulan berikutnya"
                className="w-7 h-7 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-600 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <span key={day} className="font-semibold text-slate-500 py-1">
                {day}
              </span>
            ))}

            {calendarCells.map((cell, index) => {
              if (!cell.inMonth) {
                return (
                  <div
                    key={`filler-${index}`}
                    className="p-3 rounded-xl bg-slate-50 text-slate-300 font-medium"
                  >
                    {cell.day}
                  </div>
                );
              }

              const dateStr = toDateStr(currentYear, currentMonthIndex, cell.day);
              const count = eventsByDate[dateStr]?.length ?? 0;
              const isToday = dateStr === todayStr;
              const isSelected = dateStr === selectedDate;

              let style = 'bg-[#E6F7F3]/40 text-slate-800 font-bold';
              if (count > 0) style = 'bg-amber-100 border border-amber-300 text-amber-900 font-bold';
              if (isToday) style = 'bg-slate-900 text-white font-extrabold';

              return (
                <button
                  type="button"
                  key={dateStr}
                  onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                  className={`rounded-xl flex flex-col items-center justify-center min-h-[52px] cursor-pointer transition-colors ${
                    count > 0 ? 'p-2' : 'p-3'
                  } ${style} ${isSelected ? 'ring-2 ring-[#1f877c]' : ''}`}
                >
                  <span>{cell.day}</span>
                  {count > 0 && (
                    <span className="text-[9px] font-medium leading-none mt-1">
                      {count} agenda
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT STACK: AGENDA & MAHASISWA BIMBINGAN - 4 COLS */}
        <div className="lg:col-span-4 space-y-6">
          {/* Agenda Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-slate-900">
                {selectedDate ? `Agenda ${formatAgendaDate(selectedDate)}` : 'Agenda Mendatang'}
              </h3>
              {selectedDate && (
                <button
                  type="button"
                  onClick={() => setSelectedDate(null)}
                  className="text-[11px] font-bold text-[#1f877c] hover:underline cursor-pointer shrink-0"
                >
                  Lihat mendatang
                </button>
              )}
            </div>

            <div className="space-y-3">
              {loading ? (
                [0, 1].map((key) => (
                  <div key={key} className="h-14 rounded-xl bg-slate-100 animate-pulse" />
                ))
              ) : agendaEvents.length === 0 ? (
                <p className="text-xs text-slate-500">
                  {selectedDate ? 'Tidak ada agenda pada tanggal ini.' : 'Belum ada agenda mendatang.'}
                </p>
              ) : (
                agendaEvents.map((event) => (
                  <div key={event.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="block text-xs font-bold text-slate-900">{event.title}</span>
                    <span className="block text-[11px] text-slate-500 mt-1">
                      {formatAgendaDate(event.date)} - {startTime(event.time)}
                    </span>
                    <span className="block text-[11px] text-slate-500">{event.studentName}</span>
                    {event.meetLink && (
                      <a
                        href={event.meetLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block mt-1 text-[11px] font-bold text-blue-600 hover:underline"
                      >
                        Buka Google Meet
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Mahasiswa Bimbingan Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Mahasiswa Bimbingan</h3>

            <div className="space-y-3">
              {loading ? (
                [0, 1, 2].map((key) => (
                  <div key={key} className="h-10 rounded-xl bg-slate-100 animate-pulse" />
                ))
              ) : students.length === 0 ? (
                <p className="text-xs text-slate-500">Belum ada mahasiswa bimbingan.</p>
              ) : (
                students.map((student) => (
                  <div key={student.id} className="flex items-center gap-3">
                    {student.avatarUrl ? (
                      <img
                        src={student.avatarUrl}
                        alt={student.name}
                        className="w-10 h-10 rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#E6F7F3] text-[#1f877c] text-xs font-extrabold flex items-center justify-center shrink-0">
                        {initials(student.name)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0 space-y-1">
                      <span className="block text-xs font-bold text-slate-900 truncate">
                        {student.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-[#E6F7F3] rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full bg-[#1f877c] rounded-full"
                            style={{ width: `${student.progressPercent}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-extrabold text-[#1f877c] w-8 text-right">
                          {student.progressPercent}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}