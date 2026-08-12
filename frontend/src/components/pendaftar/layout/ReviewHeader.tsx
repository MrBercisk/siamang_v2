import { useState } from 'react';
import { User } from '../../../types/auth';

interface ReviewHeaderProps {
  user: User;
  onGoToProfile: () => void;
  onNavigateHome: () => void;
  onLogout: () => void;
  onSwitchToAccepted?: () => void;
}

export function ReviewHeader({
  user,
  onGoToProfile,
  onNavigateHome,
  onLogout,
  onSwitchToAccepted,
}: ReviewHeaderProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const displayName = user.name || 'Leona Strive';
  const displayEmail = user.email || 'leona@gmail.com';
  const initials = displayName.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <header className="bg-white border-b border-slate-200/90 sticky top-0 z-30 px-4 sm:px-6 py-3 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center p-1.5 shrink-0 shadow-2xs">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/d/d4/Logo_Kota_Yogyakarta.png"
            alt="Logo Kota Yogyakarta"
            className="w-full h-full object-contain"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://illustrations.popsy.co/emerald/shield.svg';
            }}
          />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900 text-sm sm:text-base tracking-tight leading-none">
              SI AMANG
            </span>
          </div>
          <span className="text-[10px] sm:text-xs text-slate-500 font-medium block mt-0.5">
            Sistem Informasi Aplikasi Magang DISKOMINFOSAN Kota Yogyakarta
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        {/* Status Switcher Tool */}
        {onSwitchToAccepted && (
          <button
            type="button"
            onClick={onSwitchToAccepted}
            className="hidden sm:flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#1f877c] text-xs font-extrabold px-3 py-1.5 rounded-xl border border-emerald-200 transition-all cursor-pointer"
            title="Klik untuk simulasi tampilan peserta yang sudah DITERIMA"
          >
            <span className="material-symbols-outlined text-base">swap_horiz</span>
            <span>Lihat Status: Diterima Magang</span>
          </button>
        )}

        {/* Notification Icon */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            title="Notifikasi"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
                <h4 className="text-xs font-bold text-slate-800">Notifikasi</h4>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">2 Baru</span>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="p-2.5 bg-emerald-50/70 border border-emerald-100 rounded-xl">
                  <p className="font-bold text-emerald-900 text-[11px]">Pendaftaran Berhasil Dikirim</p>
                  <p className="text-slate-600 text-[10px] mt-0.5">Berkas pendaftaran Anda telah diterima dan sedang dalam tahap peninjauan.</p>
                  <span className="text-[9px] text-slate-400 mt-1 block">28 Mei 2026, 14:30 WIB</span>
                </div>
              </div>
            </div>
          )}
        </div>

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