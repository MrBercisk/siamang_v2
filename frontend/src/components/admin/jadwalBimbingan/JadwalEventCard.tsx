import React from 'react';
import type { ScheduleEvent } from '../../../types/jadwalBimbingan';

interface JadwalEventCardProps {
  event: ScheduleEvent;
  onDelete: (event: ScheduleEvent) => void;
}

export const JadwalEventCard: React.FC<JadwalEventCardProps> = ({ event, onDelete }) => {
  return (
    <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-all space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#1f877c]/10 text-[#1f877c]">
            {event.time} WIB
          </span>
          <h4 className="font-bold text-slate-900 text-sm mt-1.5">{event.title}</h4>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {event.googleCalendarSynced && (
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
            onClick={() => onDelete(event)}
            aria-label={`Hapus agenda ${event.title}`}
            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">delete</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 pt-1 border-t border-slate-200/60">
        <div>
          <span className="text-[10px] font-bold text-slate-400 block">Mahasiswa</span>
          <p className="font-bold text-slate-800">{event.studentName}</p>
          {event.studentInstitution && (
            <p className="text-[10px] text-slate-500">{event.studentInstitution}</p>
          )}
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 block">Mentor Lapangan</span>
          <p className="font-bold text-slate-800">{event.mentorName}</p>
        </div>
      </div>

      {event.location && (
        <div className="text-xs flex items-center gap-1.5 text-slate-600">
          <span className="material-symbols-outlined text-sm text-[#1f877c]">location_on</span>
          <span>{event.location}</span>
        </div>
      )}

      {event.notes && <p className="text-xs text-slate-500">{event.notes}</p>}

      {event.meetLink && (
        <div className="pt-1">
          <a
            href={event.meetLink}
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
  );
};