interface NoticeBarProps {
  text?: string;
}

export function NoticeBar({ 
  text = "Jadwal dapat berubah sewaktu-waktu. Informasi terbaru akan diumumkan melalui aplikasi SI AMANG atau email yang terdaftar." 
}: NoticeBarProps) {
  return (
    <div className="bg-[#ECFDF5] border border-[#D1FAE5] rounded-xl p-4 flex items-start gap-3">
      <span className="material-symbols-outlined text-[#047857] mt-0.5 text-xl flex-shrink-0 fill-1">
        info
      </span>
      <div>
        <p className="text-xs font-bold text-[#047857] mb-0.5">Catatan Penting</p>
        <p className="text-xs text-slate-600 leading-relaxed">
          {text}
        </p>
      </div>
    </div>
  );
}
