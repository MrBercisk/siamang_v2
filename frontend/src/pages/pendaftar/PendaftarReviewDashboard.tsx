import { useState, FormEvent } from 'react';
import { User } from '../../types/auth';
import { ApplicationStatus } from '../../types/internship';
import { RiwayatMagangView } from '../../components/pendaftar/RiwayatMagangView';
import { ProfileView } from '../../components/pendaftar/ProfileView';
import { PendaftaranFormView } from '../../components/pendaftar/PendaftaranFormView';

interface PendaftarReviewDashboardProps {
  user: User;
  applications: ApplicationStatus[];
  onNavigate: (page: 'home' | 'info' | 'register' | 'login' | 'dashboard') => void;
  onLogout?: () => void;
  onSwitchToAccepted?: () => void;
}

export function PendaftarReviewDashboard({
  user,
  onNavigate,
  onLogout,
  onSwitchToAccepted,
}: PendaftarReviewDashboardProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'pendaftaran' | 'riwayat' | 'profile'>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Modals for Quick Action buttons
  const [showBuktiModal, setShowBuktiModal] = useState(false);
  const [showBerkasModal, setShowBerkasModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showHelpChat, setShowHelpChat] = useState(false);

  // Logbook state
  const [logbookDate, setLogbookDate] = useState(new Date().toISOString().split('T')[0]);
  const [activity, setActivity] = useState('');
  const [submittedLogs, setSubmittedLogs] = useState([
    {
      id: 1,
      date: '2026-05-10',
      activity: 'Pengenalan lingkungan kerja DISKOMINFOSAN Kota Yogyakarta dan koordinasi dengan pembimbing lapangan.',
      status: 'Disetujui',
    },
    {
      id: 2,
      date: '2026-05-11',
      activity: 'Orientasi sistem infrastruktur jaringan dan pengerjaan modul SI AMANG.',
      status: 'Disetujui',
    }
  ]);

  // Profile state
  const [profileData, setProfileData] = useState({
    name: user.name || 'Leona Strive',
    email: user.email || 'leona@gmail.com',
    institution: user.institution || 'Universitas Gadjah Mada',
    nim: '21/478912/TK/52110',
    major: 'Teknologi Informasi',
    phone: '081234567890',
  });
  const [profileSavedSuccess, setProfileSavedSuccess] = useState(false);

  const handleAddLogbook = (e: FormEvent) => {
    e.preventDefault();
    if (!activity) return;
    setSubmittedLogs([
      {
        id: Date.now(),
        date: logbookDate,
        activity,
        status: 'Menunggu Review',
      },
      ...submittedLogs
    ]);
    setActivity('');
  };

  const handleSaveProfile = (e: FormEvent) => {
    e.preventDefault();
    setProfileSavedSuccess(true);
    setTimeout(() => setProfileSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-800">
      
      {/* TOP HEADER BAR */}
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
                {profileData.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()}
              </div>
              <div className="text-left hidden sm:block">
                <span className="block text-xs font-bold text-slate-900 leading-tight">
                  {profileData.name}
                </span>
                <span className="block text-[11px] text-slate-400 font-medium">
                  {profileData.email}
                </span>
              </div>
              <span className="material-symbols-outlined text-slate-400 text-lg">expand_more</span>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-800">{profileData.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{profileData.email}</p>
                </div>
                <button
                  type="button"
                  onClick={() => { setActiveTab('profile'); setShowProfileMenu(false); }}
                  className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">account_circle</span>
                  <span>Profil Saya</span>
                </button>
                <button
                  type="button"
                  onClick={() => { onNavigate('home'); setShowProfileMenu(false); }}
                  className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">home</span>
                  <span>Ke Beranda</span>
                </button>
                <div className="border-t border-slate-100 my-1" />
                <button
                  type="button"
                  onClick={() => { if (onLogout) onLogout(); else onNavigate('home'); }}
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

      {/* BODY WITH SIDEBAR & MAIN CONTENT */}
      <div className="flex-1 flex relative">
        {/* SIDEBAR */}
        <aside className={`bg-white border-r border-slate-200/90 transition-all duration-300 flex flex-col justify-between relative z-20 ${sidebarCollapsed ? 'w-16 sm:w-20' : 'w-60 sm:w-64'}`}>
          <button
            type="button"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute -right-3.5 top-6 w-7 h-7 rounded-full bg-[#1f877c] text-white flex items-center justify-center shadow-md hover:bg-[#196e65] transition-all cursor-pointer z-30"
          >
            <span className="material-symbols-outlined text-base">
              {sidebarCollapsed ? 'chevron_right' : 'chevron_left'}
            </span>
          </button>

          <div className="p-3 sm:p-4 space-y-6">
            <div>
              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'dashboard' ? 'bg-[#E6F7F3] text-[#1f877c] shadow-2xs' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined text-xl">grid_view</span>
                {!sidebarCollapsed && <span>Dashboard</span>}
              </button>
            </div>

            <div className="space-y-1.5">
              {!sidebarCollapsed && (
                <span className="px-3.5 text-[10px] font-extrabold uppercase text-[#1f877c] tracking-wider block mb-1">
                  Pendaftaran
                </span>
              )}

              <button
                type="button"
                onClick={() => setActiveTab('pendaftaran')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'pendaftaran' ? 'bg-[#E6F7F3] text-[#1f877c] font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined text-xl">assignment</span>
                {!sidebarCollapsed && <span>Pendaftaran Magang</span>}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('riwayat')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'riwayat' ? 'bg-[#E6F7F3] text-[#1f877c] font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined text-xl">history</span>
                {!sidebarCollapsed && <span>Riwayat Magang</span>}
              </button>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              {!sidebarCollapsed && (
                <span className="px-3.5 text-[10px] font-extrabold uppercase text-[#1f877c] tracking-wider block mb-1">
                  Akun
                </span>
              )}

              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'profile' ? 'bg-[#E6F7F3] text-[#1f877c] font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined text-xl">account_circle</span>
                {!sidebarCollapsed && <span>Profile Saya</span>}
              </button>

              <button
                type="button"
                onClick={() => { if (onLogout) onLogout(); else onNavigate('home'); }}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">logout</span>
                {!sidebarCollapsed && <span>Keluar</span>}
              </button>
            </div>
          </div>

          {!sidebarCollapsed && (
            <div className="p-4 border-t border-slate-100 text-center">
              <span className="text-[10px] font-medium text-slate-400 block">
                SI AMANG © 2026 DISKOMINFOSAN
              </span>
            </div>
          )}
        </aside>

        {/* MAIN DASHBOARD CONTENT */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-x-hidden">
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Halo {profileData.name}!
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Selamat datang kembali di sistem pendaftaran magang Diskominfosan Kota Yogyakarta
                  </p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 sm:p-4 shadow-2xs flex items-center gap-3.5 shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-[#E6F7F3] text-[#1f877c] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-xl font-bold">calendar_month</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 block leading-tight">
                      Periode Magang Aktif
                    </span>
                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 mt-0.5">
                      Juli - Desember 2026
                    </h4>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Pendaftaran dibuka sampai 31 Mei 2026
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Banner & Detail */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 bg-[#FFFBEB] border border-amber-200/90 rounded-2xl p-6 shadow-2xs flex flex-col justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] text-amber-600 flex items-center justify-center shrink-0 shadow-2xs">
                      <span className="material-symbols-outlined text-2xl font-bold">hourglass_empty</span>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900">
                        Pendaftaran Anda Sedang Ditinjau
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        Terima kasih telah mendaftar program magang di Diskominfosan Kota Yogyakarta. Saat ini pendaftaran Anda sedang melalui proses seleksi administrasi.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-2 flex flex-wrap items-center justify-between gap-3">
                    <span className="inline-block px-3.5 py-1.5 rounded-full text-xs font-bold text-amber-800 bg-[#FEF3C7] border border-amber-300/80">
                      Estimasi Pengumuman: 3-5 hari kerja
                    </span>

                    {onSwitchToAccepted && (
                      <button
                        type="button"
                        onClick={onSwitchToAccepted}
                        className="text-xs text-[#1f877c] font-extrabold hover:underline flex items-center gap-1"
                      >
                        <span>Simulasi jika DITERIMA</span>
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                    Detail Pendaftaran
                  </h3>
                  <div className="space-y-3 text-xs sm:text-sm">
                    <div className="flex justify-between items-center"><span className="text-slate-400 font-medium">No. Pendaftaran</span><span className="font-extrabold text-[#1f877c] font-mono text-sm">12345656</span></div>
                    <div className="flex justify-between items-center"><span className="text-slate-400 font-medium">Tanggal Daftar</span><span className="font-bold text-slate-800">28 Mei 2024, 14:30 WIB</span></div>
                    <div className="flex justify-between items-center"><span className="text-slate-400 font-medium">Tipe Pendaftaran</span><span className="font-bold text-slate-800">Individu</span></div>
                    <div className="flex justify-between items-center"><span className="text-slate-400 font-medium">Bidang</span><span className="font-bold text-slate-800">Pengembangan Sistem Informasi</span></div>
                    <div className="flex justify-between items-center"><span className="text-slate-400 font-medium">Kategori</span><span className="font-bold text-slate-800">Pengembangan Web</span></div>
                  </div>
                </div>
              </div>

              {/* Tahapan Seleksi */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
                <h3 className="text-base font-bold text-slate-900">Tahapan Seleksi</h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 relative">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-9 h-9 rounded-full bg-[#10B981] text-white font-bold text-xs flex items-center justify-center">1</div>
                    <span className="text-xs font-bold text-slate-900 mt-2 block">Pendaftaran Dikirim</span>
                    <span className="text-[11px] text-slate-400 mt-0.5">28 Mei 2026</span>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-9 h-9 rounded-full bg-[#10B981] text-white font-bold text-xs flex items-center justify-center">2</div>
                    <span className="text-xs font-bold text-slate-900 mt-2 block">Verifikasi Berkas</span>
                    <span className="text-[11px] text-slate-400 mt-0.5">30 Mei 2026</span>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-9 h-9 rounded-full bg-[#10B981] text-white font-bold text-xs flex items-center justify-center">3</div>
                    <span className="text-xs font-bold text-slate-900 mt-2 block">Review Administrasi</span>
                    <span className="text-[11px] font-bold text-[#1f877c] mt-0.5">Sedang Berlangsung</span>
                  </div>
                  <div className="flex flex-col items-center text-center opacity-60">
                    <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-600 font-bold text-xs flex items-center justify-center">4</div>
                    <span className="text-xs font-bold text-slate-600 mt-2 block">Pengumuman Hasil</span>
                    <span className="text-[11px] text-slate-400 mt-0.5">Akan Diumumkan</span>
                  </div>
                  <div className="flex flex-col items-center text-center opacity-60">
                    <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-600 font-bold text-xs flex items-center justify-center">5</div>
                    <span className="text-xs font-bold text-slate-600 mt-2 block">Mulai Magang</span>
                    <span className="text-[11px] text-slate-400 mt-0.5">Menunggu Informasi</span>
                  </div>
                </div>
              </div>

              {/* Riwayat & Quick Action */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-900">Riwayat Pendaftaran</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                          <th className="py-3 px-2">Periode Magang</th>
                          <th className="py-3 px-2">Tanggal Daftar</th>
                          <th className="py-3 px-2">Bidang</th>
                          <th className="py-3 px-2">Status</th>
                          <th className="py-3 px-2 text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        <tr>
                          <td className="py-3.5 px-2 font-medium">Juli - Desember 2026</td>
                          <td className="py-3.5 px-2">28 Mei 2026</td>
                          <td className="py-3.5 px-2 font-medium">Pengembangan Sistem Informasi</td>
                          <td className="py-3.5 px-2">
                            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#FEF3C7] text-amber-800 border border-amber-300/70 inline-block">
                              Review
                            </span>
                          </td>
                          <td className="py-3.5 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => setShowDetailModal(true)}
                              className="p-1.5 rounded-lg border border-slate-200 hover:border-[#1f877c] text-[#1f877c] hover:bg-[#E6F7F3] transition-colors cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-lg">visibility</span>
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="lg:col-span-4 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-900">Quick Action</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setShowBuktiModal(true)}
                      className="p-4 rounded-xl bg-[#E6F7F3]/60 hover:bg-[#E6F7F3] border border-emerald-100 text-slate-800 flex flex-col items-center justify-center text-center gap-2 transition-all cursor-pointer group shadow-2xs"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white text-[#1f877c] flex items-center justify-center shadow-xs">
                        <span className="material-symbols-outlined text-xl">download</span>
                      </div>
                      <span className="text-xs font-bold leading-tight">Cetak Bukti Pendaftaran</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowBerkasModal(true)}
                      className="p-4 rounded-xl bg-[#E6F7F3]/60 hover:bg-[#E6F7F3] border border-emerald-100 text-slate-800 flex flex-col items-center justify-center text-center gap-2 transition-all cursor-pointer group shadow-2xs"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white text-[#1f877c] flex items-center justify-center shadow-xs">
                        <span className="material-symbols-outlined text-xl">folder</span>
                      </div>
                      <span className="text-xs font-bold leading-tight">Lihat Berkas Saya</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pendaftaran' && (
            <PendaftaranFormView user={user} />
          )}

          {activeTab === 'riwayat' && <RiwayatMagangView />}

          {activeTab === 'profile' && <ProfileView user={user} />}
        </main>
      </div>

      {/* Help Chat Widget */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => setShowHelpChat(!showHelpChat)}
          className="w-12 h-12 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold shadow-xl flex items-center justify-center transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-2xl">chat_bubble</span>
        </button>

        {showHelpChat && (
          <div className="absolute bottom-16 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 z-50">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <h4 className="text-xs font-bold text-slate-800">Bantuan SI AMANG</h4>
              <button type="button" onClick={() => setShowHelpChat(false)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <p className="text-xs text-slate-600 mb-4">
              Ada pertanyaan terkait pendaftaran magang? Silakan hubungi admin DISKOMINFOSAN Kota Yogyakarta.
            </p>
            <button
              type="button"
              onClick={() => window.open('https://wa.me/628123456789', '_blank')}
              className="w-full bg-[#1f877c] text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#196e65]"
            >
              <span className="material-symbols-outlined text-base">chat</span>
              <span>Hubungi Admin WA</span>
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      {showBuktiModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">Bukti Pendaftaran Magang</h3>
            <p className="text-xs text-slate-600">Nomor Registrasi: 12345656 - DISKOMINFOSAN Kota Yogyakarta</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowBuktiModal(false)} className="px-4 py-2 text-xs font-bold text-slate-600">Tutup</button>
              <button onClick={() => { window.print(); setShowBuktiModal(false); }} className="px-4 py-2 bg-[#1f877c] text-white rounded-xl text-xs font-bold">Cetak</button>
            </div>
          </div>
        </div>
      )}

      {showBerkasModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">Berkas Lampiran Pendaftaran</h3>
            <ul className="text-xs space-y-2">
              <li className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">Surat Permohonan Magang.pdf</li>
              <li className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">Perjanjian NDA Magang.pdf</li>
              <li className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">Pas Foto 3x4.jpg</li>
            </ul>
            <button onClick={() => setShowBerkasModal(false)} className="px-4 py-2 bg-[#1f877c] text-white rounded-xl text-xs font-bold">Tutup</button>
          </div>
        </div>
      )}

      {showDetailModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">Detail Pendaftaran</h3>
            <p className="text-xs text-slate-600">Status: Sedang Ditinjau oleh Tim Seleksi Administrasi DISKOMINFOSAN Kota Yogyakarta.</p>
            <button onClick={() => setShowDetailModal(false)} className="px-4 py-2 bg-[#1f877c] text-white rounded-xl text-xs font-bold">Tutup</button>
          </div>
        </div>
      )}

    </div>
  );
}
