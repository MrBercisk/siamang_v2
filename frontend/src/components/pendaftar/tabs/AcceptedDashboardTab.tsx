import { useMemo, useState } from 'react';
import { useInternDashboard } from '../hooks/useInternDashboard';
import {
  buildCalendarCells,
  groupByDate,
  toDateStr,
  MONTH_NAMES,
  WEEKDAY_NAMES,
} from '../../../utils/calendar'; 

function formatIndoDate(dateStr: string | null): string {
  if (!dateStr) return '-';

  // Ambil bagian tanggal saja, buang time/timezone kalau backend
  // ternyata masih mengirim format ISO penuh (jaga-jaga / defense in depth)
  const [datePart] = dateStr.split('T');
  const [y, m, d] = datePart.split('-').map(Number);

  if (!y || !m || !d) return '-';

  // Konstruksi manual (y, m-1, d) supaya dianggap tanggal lokal,
  // bukan UTC midnight — menghindari pergeseran tanggal akibat timezone
  const date = new Date(y, m - 1, d);

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function AcceptedDashboardTab() {
  const today = new Date();
  const [viewMonthIndex, setViewMonthIndex] = useState(today.getMonth()); // 0-based
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);

  const { summary, jadwal, loading, error } = useInternDashboard(viewMonthIndex, viewYear);

  const cells = useMemo(
    () => buildCalendarCells(viewYear, viewMonthIndex),
    [viewYear, viewMonthIndex]
  );
  const jadwalByDate = useMemo(() => groupByDate(jadwal), [jadwal]);

  const todayKey = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());
  const upcomingJadwal = useMemo(
    () => jadwal.filter((item) => item.date >= todayKey).slice(0, 5),
    [jadwal, todayKey]
  );

  const goToPrevMonth = () => {
    if (viewMonthIndex === 0) { setViewMonthIndex(11); setViewYear((y) => y - 1); }
    else setViewMonthIndex((m) => m - 1);
  };
  const goToNextMonth = () => {
    if (viewMonthIndex === 11) { setViewMonthIndex(0); setViewYear((y) => y + 1); }
    else setViewMonthIndex((m) => m + 1);
  };

  const selectedItems = selectedDateKey ? jadwalByDate[selectedDateKey] ?? [] : [];

  return (
    <div className="space-y-6 animate-in fade-in">

      {error && (
        <p className="text-xs font-medium text-red-500">Gagal memuat data dashboard: {error}</p>
      )}

      {/* TOP STATS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
          <span className="text-xs font-bold text-slate-700 block">Progress Magang</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {loading ? '...' : `${summary?.progressPercent ?? 0}%`}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-7 p-1 overflow-hidden relative border border-slate-200/60">
            <div
              className="bg-[#1f877c] h-full rounded-full transition-all duration-500 flex items-center justify-center text-[10px] font-bold text-white"
              style={{ width: `${summary?.progressPercent ?? 0}%` }}
            >
              {summary?.progressPercent ?? 0}%
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-2">
          <span className="text-xs font-bold text-slate-700 block">Sisa Hari Magang</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {loading ? '...' : summary?.remainingDays ?? '-'}
            </span>
            <span className="text-xs font-medium text-slate-500">Hari lagi</span>
          </div>
          <div className="pt-2">
            <span className="text-[11px] text-slate-400 block">Periode magang berakhir</span>
            <span className="text-xs font-bold text-slate-800">
              {formatIndoDate(summary?.internshipEndDate ?? null)}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-2">
          <span className="text-xs font-bold text-slate-700 block">Total Bimbingan</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {loading ? '...' : summary?.totalBimbingan ?? 0}
            </span>
            <span className="text-xs font-medium text-slate-500">kali</span>
          </div>
          <div className="pt-2">
            <span className="text-[11px] text-slate-400 block">Bimbingan berikutnya</span>
            <span className="text-xs font-bold text-slate-800">
              {formatIndoDate(summary?.nextBimbinganDate ?? null)}
            </span>
          </div>
        </div>
      </div>

      {/* CALENDAR & AGENDA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              {MONTH_NAMES[viewMonthIndex]} {viewYear}
            </h3>
            <div className="flex items-center gap-1.5">
              <button type="button" onClick={goToPrevMonth} className="w-8 h-8 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center cursor-pointer">
                <span className="material-symbols-outlined text-lg">chevron_left</span>
              </button>
              <button type="button" onClick={goToNextMonth} className="w-8 h-8 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center cursor-pointer">
                <span className="material-symbols-outlined text-lg">chevron_right</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 sm:gap-3 text-center">
            {WEEKDAY_NAMES.map((day) => (
              <div key={day} className="text-xs font-bold text-slate-500 py-1">{day}</div>
            ))}

            {cells.map((cell, index) => {
              if (!cell.inMonth) {
                return (
                  <div key={`out-${index}`} className="h-14 sm:h-16 rounded-xl border border-slate-200/60 p-1.5 text-left text-slate-300 text-xs font-bold">
                    {cell.day}
                  </div>
                );
              }

              const dateKey = toDateStr(viewYear, viewMonthIndex, cell.day);
              const events = jadwalByDate[dateKey] ?? [];
              const hasEvent = events.length > 0;

              if (hasEvent) {
                return (
                  <div
                    key={dateKey}
                    onClick={() => setSelectedDateKey(dateKey)}
                    className="h-14 sm:h-16 rounded-xl bg-[#FEF08A] border border-amber-300 p-1.5 text-left text-amber-900 text-xs font-bold cursor-pointer hover:shadow-md transition-all"
                  >
                    <span>{cell.day}</span>
                    <span className="block text-[9px] font-normal text-amber-800 mt-1 leading-none">
                      detail agenda
                    </span>
                  </div>
                );
              }

              return (
                <div key={dateKey} className="h-14 sm:h-16 rounded-xl bg-[#E6F7F3] p-1.5 text-left text-slate-800 text-xs font-bold">
                  {cell.day}
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-4 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">Agenda Mendatang</h3>
          <div className="space-y-4">
            {loading ? (
              <p className="text-xs text-slate-500 text-center">Memuat agenda...</p>
            ) : upcomingJadwal.length === 0 ? (
              <p className="text-xs text-slate-500 text-center">Belum ada agenda mendatang.</p>
            ) : (
              upcomingJadwal.map((item) => (
                <div key={item.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors space-y-1">
                  <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                  <p className="text-[11px] text-slate-500">
                    {formatIndoDate(item.date)}{item.time ? ` - ${item.time}` : ''}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* MODAL DETAIL */}
      {selectedDateKey && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900">Detail Agenda Kalender</h3>
            <div className="space-y-2">
              {selectedItems.map((item) => (
                <p key={item.id} className="text-xs text-slate-700 bg-amber-50 p-3 rounded-xl border border-amber-200 font-medium">
                  {formatIndoDate(item.date)}
                  {item.time ? `, ${item.time}` : ''}: {item.title}
                </p>
              ))}
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedDateKey(null)}
                className="px-4 py-2 bg-[#1f877c] text-white text-xs font-bold rounded-xl"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}