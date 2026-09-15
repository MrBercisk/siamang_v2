import { TimelineSchedule } from '../../types/internship';
import { TimelineCard } from '../TimelineCard';
import { NoticeBar } from '../NoticeBar';

interface TimelineTabProps {
  schedules: TimelineSchedule[];
}

export function TimelineTab({ schedules }: TimelineTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2.5 mb-2">
        <span className="material-symbols-outlined text-[#1f877c] text-2xl">event_note</span>
        <h3 className="text-xl font-bold text-slate-900">Jadwal Program Magang</h3>
      </div>
      <p className="text-xs sm:text-sm text-slate-500 -mt-4">
        Periode pelaksanaan program magang DISKOMINFOSAN Kota Yogyakarta.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {schedules.map((sched) => (
          <TimelineCard key={sched.id} schedule={sched} />
        ))}
      </div>

      <NoticeBar />
    </div>
  );
}