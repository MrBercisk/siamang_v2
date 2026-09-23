import { useState } from 'react';
import { User } from '../../../types/auth';
import logoPemkot from '../../../assets/logo-pemkot.webp';

interface AcceptedHeaderProps {
  user: User;
  onGoToProfile: () => void;
  onNavigateHome: () => void;
  onLogout: () => void;
}

export function AcceptedHeader({
  user,
  onGoToProfile,
  onNavigateHome,
  onLogout,
}: AcceptedHeaderProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const displayName = user.name || 'Leona Strive';
  const displayEmail = user.email || 'leona@gmail.com';
  const initials = displayName.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <header className="bg-white border-b border-slate-200/90 sticky top-0 z-30 px-4 sm:px-6 py-3 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center p-1.5 shrink-0 shadow-2xs">
        <img
            src={logoPemkot}
            alt="Logo Kota Yogyakarta"
            className="w-full h-full object-contain"
          />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900 text-sm sm:text-base tracking-tight leading-none">
              SIAMANG
            </span>
          </div>
          <span className="text-[10px] sm:text-xs text-slate-500 font-medium block mt-0.5">
            Sistem Informasi Aplikasi Magang DISKOMINFOSAN Kota Yogyakarta
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
      

        {/* User Profile */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1f877c] text-white flex items-center justify-center font-bold text-xs sm:text-sm border border-emerald-200 shadow-2xs">
              {initials}
            </div>
            <div className="text-left hidden sm:block">
              <span className="block text-xs font-bold text-slate-900 leading-tight">
                {displayName}
              </span>
              <span className="block text-[11px] text-slate-400 font-medium">
                {displayEmail}
              </span>
            </div>
            <span className="material-symbols-outlined text-slate-400 text-lg">expand_more</span>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-800">{displayName}</p>
                <p className="text-[10px] text-slate-400 truncate">{displayEmail}</p>
              </div>
              <button
                type="button"
                onClick={() => { onGoToProfile(); setShowProfileMenu(false); }}
                className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-base">account_circle</span>
                <span>Profil Saya</span>
              </button>
              <button
                type="button"
                onClick={() => { onNavigateHome(); setShowProfileMenu(false); }}
                className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-base">home</span>
                <span>Ke Beranda</span>
              </button>
              <div className="border-t border-slate-100 my-1" />
              <button
                type="button"
                onClick={onLogout}
                className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-base">logout</span>
                <span>Keluar</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}