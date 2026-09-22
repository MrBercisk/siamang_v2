import React from 'react';
import type { ScheduleEvent } from '../../../types/jadwalBimbingan';
import { MONTH_NAMES } from '../../../utils/calendar';

interface JadwalMonthListProps {
  /** Agenda pada bulan yang sedang tampil saja. */
  events: ScheduleEvent[];
  year: number;
  monthIndex: number;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  /** Kelas tambahan untuk kontainer luar, mis. `lg:col-span-5` dari grid induk. */
  className?: string;
}

export const JadwalMonthList: React.FC<JadwalMonthListProps> = ({
  events,
  year,
  monthIndex,
  selectedDate,
  onSelectDate,
  className = '',
}) => {
  const monthLabel = `${MONTH_NAMES[monthIndex]} ${year}`;

  return (
    <div
      className={`bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 space-y-4 ${className}`}
    >
      <h3 className="text-base font-bold text-slate-900 flex items-center justify-between">
        <span>Daftar Seluruh Agenda Bulan Ini</span>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
          {events.length} Agenda
        </span>
      </h3>

      {events.length === 0 ? (
        <p className="text-xs text-slate-500">Belum ada agenda pada {monthLabel}.</p>
      ) : (
        <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
          {events.map((event) => (
            <button
              type="button"
              key={event.id}
              onClick={() => onSelectDate(event.date)}
              className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                selectedDate === event.date
                  ? 'border-[#1f877c] bg-[#E6F7F3]'
                  : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#1f877c]">
                  {event.dayNumber} {monthLabel}
                </span>
                <span className="text-[10px] font-medium text-slate-500">{event.time} WIB</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900">{event.title}</h4>
              <p className="text-[11px] text-slate-500 font-medium">
                {event.studentName}
                {event.studentInstitution ? ` (${event.studentInstitution})` : ''}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};