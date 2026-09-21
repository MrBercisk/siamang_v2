import React from 'react';
import type { ScheduleEvent } from '../../../types/jadwalBimbingan';

interface JadwalGoogleCalendarCardProps {
  events: ScheduleEvent[];
  loading: boolean;
}

export const JadwalGoogleCalendarCard: React.FC<JadwalGoogleCalendarCardProps> = ({
  events,
  loading,
}) => {
  const syncedCount = events.filter((event) => event.googleCalendarSynced).length;

  return (
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
  );
};