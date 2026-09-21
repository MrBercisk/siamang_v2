import React from 'react';
import type { ScheduleEvent } from '../../../types/jadwalBimbingan';
import {
  MONTH_NAMES,
  WEEKDAY_NAMES,
  toDateStr,
  type CalendarCell,
} from '../../../utils/calendar';

interface JadwalCalendarProps {
  year: number;
  monthIndex: number;
  cells: CalendarCell[];
  eventsByDate: Record<string, ScheduleEvent[]>;
  selectedDate: string;
  todayStr: string;
  onSelectDate: (date: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onAdd: () => void;
}

export const JadwalCalendar: React.FC<JadwalCalendarProps> = ({
  year,
  monthIndex,
  cells,
  eventsByDate,
  selectedDate,
  todayStr,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
  onAdd,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 sm:p-8 space-y-6">
      {/* HEADER: TAMBAH + BULAN + NAVIGASI */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onAdd}
          className="bg-[#1f877c] hover:bg-[#196e65] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-2xs transition-all cursor-pointer"
        >
          <span>Tambah Jadwal</span>
          <span className="text-base font-extrabold">+</span>
        </button>

        <h2 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">
          {MONTH_NAMES[monthIndex]} {year}
        </h2>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrevMonth}
            aria-label="Bulan sebelumnya"
            className="w-9 h-9 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">chevron_left</span>
          </button>
          <button
            type="button"
            onClick={onNextMonth}
            aria-label="Bulan berikutnya"
            className="w-9 h-9 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">chevron_right</span>
          </button>
        </div>
      </div>

      {/* GRID TANGGAL */}
      <div className="space-y-3">
        <div className="grid grid-cols-7 gap-2 sm:gap-3 text-center text-xs font-bold text-slate-700 pb-1">
          {WEEKDAY_NAMES.map((name) => (
            <div key={name}>{name}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2 sm:gap-3">
          {cells.map((cell, index) => {
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

            const dateStr = toDateStr(year, monthIndex, cell.day);
            const dayEvents = eventsByDate[dateStr] ?? [];
            const hasEvents = dayEvents.length > 0;
            const isSelected = selectedDate === dateStr;
            const isToday = todayStr === dateStr;

            return (
              <button
                type="button"
                key={dateStr}
                onClick={() => onSelectDate(dateStr)}
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
  );
};