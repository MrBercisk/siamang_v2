import React from 'react';
import type { ScheduleEvent } from '../../../types/jadwalBimbingan';
import { MONTH_NAMES } from '../../../utils/calendar';
import { JadwalEventCard } from './JadwalEventCard';

interface JadwalDayAgendaProps {
  selectedDate: string; // YYYY-MM-DD
  /** Agenda pada tanggal terpilih saja. */
  events: ScheduleEvent[];
  /** true hanya saat data pertama kali dimuat (belum ada jadwal sama sekali). */
  initialLoading: boolean;
  onAdd: () => void;
  onDelete: (event: ScheduleEvent) => void;
  /** Kelas tambahan untuk kontainer luar, mis. `lg:col-span-7` dari grid induk. */
  className?: string;
}

export const JadwalDayAgenda: React.FC<JadwalDayAgendaProps> = ({
  selectedDate,
  events,
  initialLoading,
  onAdd,
  onDelete,
  className = '',
}) => {
  const [selYear, selMonth, selDay] = selectedDate.split('-').map(Number);

  return (
    <div
      className={`bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 space-y-4 ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#1f877c]">event_available</span>
          <span>
            Agenda Bimbingan ({selDay} {MONTH_NAMES[selMonth - 1]} {selYear})
          </span>
        </h3>

        <button
          type="button"
          onClick={onAdd}
          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1 cursor-pointer shrink-0"
        >
          <span>+ Tambah di Tanggal Ini</span>
        </button>
      </div>

      {initialLoading ? (
        <div className="space-y-3">
          {[0, 1].map((key) => (
            <div key={key} className="h-28 rounded-2xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
          <span className="material-symbols-outlined text-3xl text-slate-300">event_busy</span>
          <p className="text-xs font-bold text-slate-600">
            Belum Ada Agenda Bimbingan untuk Tanggal Ini
          </p>
          <p className="text-[11px] text-slate-400">
            Klik &quot;Tambah Jadwal +&quot; untuk membuat bimbingan baru.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <JadwalEventCard key={event.id} event={event} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
};