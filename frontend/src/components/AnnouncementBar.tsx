interface AnnouncementBarProps {
  message?: string;
}

export function AnnouncementBar({ 
  message = "Program magang periode kedua akan dibuka pada tanggal 5 Mei 2026" 
}: AnnouncementBarProps) {
  return (
    <div className="bg-[#0f766e] text-white py-2 px-4 text-center font-medium text-xs sm:text-sm w-full relative z-30 flex items-center justify-center gap-2 shadow-xs">
      <span className="material-symbols-outlined text-sm sm:text-base text-amber-300 animate-pulse">
        campaign
      </span>
      <span>{message}</span>
    </div>
  );
}

