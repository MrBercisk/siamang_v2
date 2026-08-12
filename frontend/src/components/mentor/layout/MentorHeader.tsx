import { User } from '../../../types/auth';
import { showToast } from '../../../utils/swal';

interface MentorHeaderProps {
  user: User;
}

export function MentorHeader({ user }: MentorHeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-6 py-3 flex items-center justify-between shadow-2xs">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center p-1 shrink-0">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/d/d4/Logo_Kota_Yogyakarta.png"
            alt="Logo Kota Yogyakarta"
            className="w-full h-full object-contain"
          />
        </div>
        <div>
          <h1 className="font-extrabold text-slate-900 text-base sm:text-lg leading-tight tracking-tight">
            SI AMANG
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
            Sistem Informasi Aplikasi Magang <span className="hidden sm:inline">DISKOMINFOSAN Kota Yogyakarta</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => showToast('info', 'Tidak ada notifikasi baru')}
          className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-colors relative"
          title="Notifikasi"
        >
          <span className="material-symbols-outlined text-xl">notifications</span>
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
        </button>

        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <div className="w-9 h-9 rounded-full bg-[#1f877c] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
            <span className="material-symbols-outlined text-lg">account_circle</span>
          </div>
          <div className="hidden sm:block text-left">
            <span className="block text-xs font-bold text-slate-900 leading-tight">
              {user.name || 'Mentor Aplikasi'}
            </span>
            <span className="block text-[11px] text-slate-400 font-medium leading-tight">
              {user.email || 'mentoraplikasi@gmail.com'}
            </span>
          </div>
          <span className="material-symbols-outlined text-slate-400 text-sm hidden sm:inline">
            expand_more
          </span>
        </div>
      </div>
    </header>
  );
}