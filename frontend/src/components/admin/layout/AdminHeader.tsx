import { useState } from 'react';
import logoPemkot from '../../../assets/logo-pemkot.webp';

interface PendingApplicant {
  id: number;
  registrationNumber?: string;
  nama: string;
  kategoriName?: string;
  submittedAt: string;
}

interface AdminHeaderProps {
  onNavigateHome: () => void;
  onLogout: () => void;
  totalPending?: number;
  pendingApplications?: PendingApplicant[];
  onViewApplication?: (id: number) => void;
  onViewAllApplications?: () => void;
}

function timeAgo(dateString: string): string {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Baru saja';
  if (diffMin < 60) return `${diffMin} menit lalu`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} jam lalu`;
  return `${Math.floor(diffHour / 24)} hari lalu`;
}

export function AdminHeader({
  onNavigateHome,
  onLogout,
  totalPending = 0,
  pendingApplications = [],
  onViewApplication,
  onViewAllApplications,
}: AdminHeaderProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const hasNotifications = totalPending > 0;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-6 py-3 flex items-center justify-between shadow-xs">
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
        {/* Notification Icon */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            title="Notifikasi Admin"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            {hasNotifications && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-white"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
                <h4 className="text-xs font-bold text-slate-800">Notifikasi System Admin</h4>
                {hasNotifications && (
                  <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold">
                    {totalPending} Baru
                  </span>
                )}
              </div>

              <div className="space-y-2.5 text-xs max-h-72 overflow-y-auto">
                {!hasNotifications ? (
                  <p className="text-center text-slate-400 text-[11px] py-4">
                    Tidak ada pendaftaran baru saat ini.
                  </p>
                ) : (
                  pendingApplications.map((applicant) => (
                    <button
                      key={applicant.id}
                      type="button"
                      onClick={() => {
                        onViewApplication?.(applicant.id);
                        setShowNotifications(false);
                      }}
                      className="w-full text-left p-2.5 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-xl transition-colors cursor-pointer"
                    >
                      <p className="font-bold text-blue-900 text-[11px]">
                        Pendaftaran Baru: {applicant.nama}
                      </p>
                      <p className="text-slate-600 text-[10px] mt-0.5">
                        {applicant.registrationNumber}
                        {applicant.kategoriName ? ` · ${applicant.kategoriName}` : ''}
                      </p>
                      <p className="text-slate-400 text-[10px] mt-0.5">
                        {timeAgo(applicant.submittedAt)}
                      </p>
                    </button>
                  ))
                )}
              </div>

              {hasNotifications && onViewAllApplications && (
                <button
                  type="button"
                  onClick={() => {
                    onViewAllApplications();
                    setShowNotifications(false);
                  }}
                  className="w-full text-center text-[11px] font-bold text-[#1f877c] hover:underline pt-3 mt-1 border-t border-slate-100 cursor-pointer"
                >
                  Lihat Semua Pendaftaran →
                </button>
              )}
            </div>
          )}
        </div>

        {/* Admin User Profile — tidak berubah */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#10B981] text-white flex items-center justify-center font-bold text-xs sm:text-sm border border-emerald-300 shadow-2xs">
              A
            </div>
            <div className="text-left hidden sm:block">
              <span className="block text-xs font-bold text-slate-900 leading-tight">Admin</span>
              <span className="block text-[11px] text-slate-400 font-medium">adminsiamang@gmail.com</span>
            </div>
            <span className="material-symbols-outlined text-slate-400 text-lg">expand_more</span>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-800">Super Administrator</p>
                <p className="text-[10px] text-slate-400 truncate">adminsiamang@gmail.com</p>
              </div>
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