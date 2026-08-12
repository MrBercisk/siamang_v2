import { TimelineSchedule } from '../types/internship';

interface TimelineCardProps {
  schedule: TimelineSchedule;
  key?: string;
}

export function TimelineCard({ schedule }: TimelineCardProps) {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'warning':
        return {
          bar: 'bg-amber-500',
          iconBg: 'bg-amber-50 text-amber-600',
          text: 'text-amber-600',
        };
      case 'success':
        return {
          bar: 'bg-emerald-500',
          iconBg: 'bg-emerald-50 text-emerald-600',
          text: 'text-emerald-600',
        };
      case 'secondary':
        return {
          bar: 'bg-teal-600',
          iconBg: 'bg-teal-50 text-teal-700',
          text: 'text-teal-700',
        };
      case 'primary':
      default:
        return {
          bar: 'bg-[#005c55]',
          iconBg: 'bg-[#005c55]/10 text-[#005c55]',
          text: 'text-[#005c55]',
        };
    }
  };

  const style = getColorClasses(schedule.statusColor);

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200/80 relative overflow-hidden group hover:shadow-md transition-shadow">
      <div className={`absolute top-0 left-0 w-1.5 h-full ${style.bar} rounded-l-xl`} />
      
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-full ${style.iconBg} flex items-center justify-center flex-shrink-0`}>
          <span className="material-symbols-outlined fill-1 text-xl">
            {schedule.icon}
          </span>
        </div>
        <div>
          <h3 className="font-bold text-sm text-slate-800 leading-snug">
            {schedule.title}
          </h3>
          <span className="text-[11px] text-slate-500">
            {schedule.subtext}
          </span>
        </div>
      </div>

      <p className={`text-lg font-extrabold ${style.text} mb-2`}>
        {schedule.date}
      </p>

      <p className="text-xs text-slate-600 leading-relaxed">
        {schedule.description}
      </p>
    </div>
  );
}
