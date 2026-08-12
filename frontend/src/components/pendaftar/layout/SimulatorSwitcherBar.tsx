export type ApplicantStatus = 'review' | 'accepted';

interface SimulatorSwitcherBarProps {
  status: ApplicantStatus;
  onChangeStatus: (status: ApplicantStatus) => void;
}

export function SimulatorSwitcherBar({ status, onChangeStatus }: SimulatorSwitcherBarProps) {
  return (
    <div className="bg-slate-900 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-md border-b border-slate-700 sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-amber-400 text-base">tune</span>
        <span>Simulasi Status Pendaftar:</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChangeStatus('review')}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            status === 'review'
              ? 'bg-amber-400 text-slate-950 shadow-xs'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          1. Dalam Peninjauan (Belum Diterima)
        </button>

        <button
          type="button"
          onClick={() => onChangeStatus('accepted')}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            status === 'accepted'
              ? 'bg-[#10B981] text-white shadow-xs'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          2. Sudah Diterima (Aktif Magang)
        </button>
      </div>
    </div>
  );
}