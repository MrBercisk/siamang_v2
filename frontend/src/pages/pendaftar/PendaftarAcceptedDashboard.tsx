import { useState, FormEvent } from 'react';
import { User } from '../../types/auth';
import { RiwayatMagangView } from '../../components/pendaftar/RiwayatMagangView';
import { ProfileView } from '../../components/pendaftar/ProfileView';
import { ProgressMagangPesertaView } from '../../components/pendaftar/ProgressMagangPesertaView';
import { LaporanMagangPesertaView } from '../../components/pendaftar/LaporanMagangPesertaView';
import { NilaiMagangPesertaView } from '../../components/pendaftar/NilaiMagangPesertaView';

interface PendaftarAcceptedDashboardProps {
  user: User;
  onNavigate: (page: 'home' | 'info' | 'register' | 'login' | 'dashboard') => void;
  onLogout?: () => void;
  onSwitchToReview?: () => void;
}

export function PendaftarAcceptedDashboard({
  user,
  onNavigate,
  onLogout,
  onSwitchToReview,
}: PendaftarAcceptedDashboardProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'progress' | 'forum' | 'laporan' | 'nilai' | 'riwayat' | 'profile'>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedAgendaDate, setSelectedAgendaDate] = useState<string | null>(null);

  // Forum discussion state
  const [forumMessages, setForumMessages] = useState([
    {
      id: 1,
      sender: 'Bpk. Ahmad Fauzi (Mentor DISKOMINFOSAN)',
      time: '08:30 WIB',
      text: 'Selamat pagi rekan-rekan magang. Harap persiapkan draf laporan mingguan untuk sesi bimbingan besok.',
      isMentor: true,
    },
    {
      id: 2,
      sender: user.name || 'Leona Strive',
      time: '08:45 WIB',
      text: 'Baik Pak Ahmad, draf laporan dan progress modul SI AMANG sudah siap untuk direview.',
      isMentor: false,
    }
  ]);
  const [newMessage, setNewMessage] = useState('');

  // Report submission state
  const [reportLogs, setReportLogs] = useState([
    { id: 1, month: 'Mei 2026', filename: 'Laporan_Bulanan_Mei_Leona.pdf', date: '31 Mei 2026', status: 'Disetujui Mentor' },
    { id: 2, month: 'Juni 2026', filename: 'Laporan_Minggu1_Juni_Leona.pdf', date: '07 Juni 2026', status: 'Menunggu Review' },
  ]);
  const [uploadFileName, setUploadFileName] = useState('');

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setForumMessages([
      ...forumMessages,
      {
        id: Date.now(),
        sender: user.name || 'Leona Strive',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' WIB',
        text: newMessage,
        isMentor: false,
      }
    ]);
    setNewMessage('');
  };

  const handleUploadReport = (e: FormEvent) => {
    e.preventDefault();
    if (!uploadFileName) return;
    setReportLogs([
      {
        id: Date.now(),
        month: 'Juni 2026',
        filename: uploadFileName,
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        status: 'Menunggu Review',
      },
      ...reportLogs,
    ]);
    setUploadFileName('');
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
          {/* Switcher back to Review Status */}
          {onSwitchToReview && (
            <button
              type="button"
              onClick={onSwitchToReview}
              className="hidden sm:flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-extrabold px-3 py-1.5 rounded-xl border border-amber-200 transition-all cursor-pointer"
              title="Kembali ke simulasi status Pendaftaran Dalam Review"
            >
              <span className="material-symbols-outlined text-base">swap_horiz</span>
              <span>Lihat Status: Sedang Ditinjau</span>
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
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
                  <h4 className="text-xs font-bold text-slate-800">Notifikasi Agenda</h4>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">1 Baru</span>
                </div>
                <div className="space-y-2.5 text-xs">
                  <div className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-xl">
                    <p className="font-bold text-emerald-900 text-[11px]">Jadwal Bimbingan Mentor</p>
                    <p className="text-slate-600 text-[10px] mt-0.5">Sesi bimbingan tatap muka dilaksanakan besok jam 09:00 WIB.</p>
                    <span className="text-[9px] text-slate-400 mt-1 block">2 Juni 2026, 09:00 WIB</span>
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
                {(user.name || 'Leona Strive').split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()}
              </div>
              <div className="text-left hidden sm:block">
                <span className="block text-xs font-bold text-slate-900 leading-tight">
                  {user.name || 'Leona Strive'}
                </span>
                <span className="block text-[11px] text-slate-400 font-medium">
                  {user.email || 'leona@gmail.com'}
                </span>
              </div>
              <span className="material-symbols-outlined text-slate-400 text-lg">expand_more</span>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-800">{user.name || 'Leona Strive'}</p>
                  <p className="text-[10px] text-slate-400 truncate">{user.email || 'leona@gmail.com'}</p>
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
        
        {/* SIDEBAR (Matching Layout in Image 2) */}
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

          <div className="p-3 sm:p-4 space-y-4">
            {!sidebarCollapsed && (
              <span className="px-3 text-[10px] font-extrabold uppercase text-[#1f877c] tracking-wider block mb-1">
                MENU
              </span>
            )}

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

            <button
              type="button"
              onClick={() => setActiveTab('progress')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'progress' ? 'bg-[#E6F7F3] text-[#1f877c] font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-xl">monitoring</span>
              {!sidebarCollapsed && <span>Progress Magang</span>}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('forum')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'forum' ? 'bg-[#E6F7F3] text-[#1f877c] font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-xl">forum</span>
              {!sidebarCollapsed && <span>Forum Diskusi</span>}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('laporan')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'laporan' ? 'bg-[#E6F7F3] text-[#1f877c] font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-xl">assignment</span>
              {!sidebarCollapsed && <span>Laporan Magang</span>}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('nilai')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'nilai' ? 'bg-[#E6F7F3] text-[#1f877c] font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-xl">emoji_events</span>
              {!sidebarCollapsed && <span>Nilai Magang</span>}
            </button>

            <div className="pt-2 border-t border-slate-100 space-y-1">
              {!sidebarCollapsed && (
                <span className="px-3 text-[10px] font-extrabold uppercase text-[#1f877c] tracking-wider block mb-1">
                  AKUN
                </span>
              )}

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

        {/* MAIN ACCEPTED DASHBOARD CONTENT */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-x-hidden">

          {/* TAB 1: DASHBOARD ACTIVE INTERN (Matching Screenshot 2) */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in">
              
              {/* TOP STATS ROW (3 CARDS EXACTLY LIKE SCREENSHOT) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Card 1: Progress Magang */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
                  <span className="text-xs font-bold text-slate-700 block">Progress Magang</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                      20%
                    </span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 rounded-full h-7 p-1 overflow-hidden relative border border-slate-200/60">
                    <div
                      className="bg-[#1f877c] h-full rounded-full transition-all duration-500 flex items-center justify-center text-[10px] font-bold text-white"
                      style={{ width: '20%' }}
                    >
                      20%
                    </div>
                  </div>
                </div>

                {/* Card 2: Sisa Hari Magang */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-2">
                  <span className="text-xs font-bold text-slate-700 block">Sisa Hari Magang</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                      21
                    </span>
                    <span className="text-xs font-medium text-slate-500">Hari lagi</span>
                  </div>
                  <div className="pt-2">
                    <span className="text-[11px] text-slate-400 block">Periode magang berakhir</span>
                    <span className="text-xs font-bold text-slate-800">1 Januari 2026</span>
                  </div>
                </div>

                {/* Card 3: Total Bimbingan */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-2">
                  <span className="text-xs font-bold text-slate-700 block">Total Bimbingan</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                      8
                    </span>
                    <span className="text-xs font-medium text-slate-500">kali</span>
                  </div>
                  <div className="pt-2">
                    <span className="text-[11px] text-slate-400 block">Bimbingan berikutnya</span>
                    <span className="text-xs font-bold text-slate-800">03 Desember 2025</span>
                  </div>
                </div>
              </div>

              {/* MIDDLE ROW: CALENDAR & AGENDA MENDATANG (EXACT MATCH TO IMAGE) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left (8 Cols): June 2026 Interactive Calendar Card */}
                <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-6">
                  
                  {/* Calendar Header */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900">June 2026</h3>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        className="w-8 h-8 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-lg">chevron_left</span>
                      </button>
                      <button
                        type="button"
                        className="w-8 h-8 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-lg">chevron_right</span>
                      </button>
                    </div>
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-2 sm:gap-3 text-center">
                    
                    {/* Days Header */}
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div key={day} className="text-xs font-bold text-slate-500 py-1">
                        {day}
                      </div>
                    ))}

                    {/* Day 31 (Prev month) */}
                    <div className="h-14 sm:h-16 rounded-xl border border-slate-200/60 p-1.5 text-left text-slate-300 text-xs font-bold">
                      31
                    </div>

                    {/* June 1 */}
                    <div className="h-14 sm:h-16 rounded-xl bg-[#E6F7F3] p-1.5 text-left text-slate-800 text-xs font-bold">
                      1
                    </div>

                    {/* June 2 - Highlight Yellow Agenda */}
                    <div
                      onClick={() => setSelectedAgendaDate('2 Juni 2026: Sesi Bimbingan Mentor DISKOMINFOSAN')}
                      className="h-14 sm:h-16 rounded-xl bg-[#FEF08A] border border-amber-300 p-1.5 text-left text-amber-900 text-xs font-bold cursor-pointer hover:shadow-md transition-all"
                    >
                      <span>2</span>
                      <span className="block text-[9px] font-normal text-amber-800 mt-1 leading-none">
                        detail agenda
                      </span>
                    </div>

                    {/* June 3 - 6 */}
                    {[3, 4, 5, 6].map((num) => (
                      <div key={num} className="h-14 sm:h-16 rounded-xl bg-[#E6F7F3] p-1.5 text-left text-slate-800 text-xs font-bold">
                        {num}
                      </div>
                    ))}

                    {/* June 7 - 13 */}
                    {[7, 8, 9, 10, 11, 12, 13].map((num) => (
                      <div key={num} className="h-14 sm:h-16 rounded-xl bg-[#E6F7F3] p-1.5 text-left text-slate-800 text-xs font-bold">
                        {num}
                      </div>
                    ))}

                    {/* June 14 - 20 */}
                    {[14, 15, 16, 17, 18, 19, 20].map((num) => (
                      <div key={num} className="h-14 sm:h-16 rounded-xl bg-[#E6F7F3] p-1.5 text-left text-slate-800 text-xs font-bold">
                        {num}
                      </div>
                    ))}

                    {/* June 21 - 24 */}
                    {[21, 22, 23, 24].map((num) => (
                      <div key={num} className="h-14 sm:h-16 rounded-xl bg-[#E6F7F3] p-1.5 text-left text-slate-800 text-xs font-bold">
                        {num}
                      </div>
                    ))}

                    {/* June 25 - Selected Dark Navy Date */}
                    <div className="h-14 sm:h-16 rounded-xl bg-[#1E293B] p-1.5 text-left text-white text-xs font-bold shadow-md">
                      25
                    </div>

                    {/* June 26 - 29 */}
                    {[26, 27, 28, 29].map((num) => (
                      <div key={num} className="h-14 sm:h-16 rounded-xl bg-[#E6F7F3] p-1.5 text-left text-slate-800 text-xs font-bold">
                        {num}
                      </div>
                    ))}

                    {/* June 30 - Highlight Yellow Agenda */}
                    <div
                      onClick={() => setSelectedAgendaDate('30 Juni 2026: Batas Pengumpulan Laporan Bulanan')}
                      className="h-14 sm:h-16 rounded-xl bg-[#FEF08A] border border-amber-300 p-1.5 text-left text-amber-900 text-xs font-bold cursor-pointer hover:shadow-md transition-all"
                    >
                      <span>30</span>
                      <span className="block text-[9px] font-normal text-amber-800 mt-1 leading-none">
                        detail agenda
                      </span>
                    </div>

                    {/* Next Month July 1 - 4 */}
                    {[1, 2, 3, 4].map((num) => (
                      <div key={num} className="h-14 sm:h-16 rounded-xl border border-slate-200/60 p-1.5 text-left text-slate-300 text-xs font-bold">
                        {num}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right (4 Cols): Agenda Mendatang Card */}
                <div className="lg:col-span-4 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
                  <h3 className="text-base font-bold text-slate-900">Agenda Mendatang</h3>

                  <div className="space-y-4">
                    {/* Item 1 */}
                    <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors space-y-1">
                      <h4 className="text-xs font-bold text-slate-900">
                        Bimbingan dengan Mentor
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        2 Juni 2026 - 09:00
                      </p>
                    </div>

                    {/* Item 2 */}
                    <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors space-y-1">
                      <h4 className="text-xs font-bold text-slate-900">
                        Bimbingan dengan Mentor
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        2 Juni 2026 - 09:00
                      </p>
                    </div>

                    {/* Item 3 */}
                    <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors space-y-1">
                      <h4 className="text-xs font-bold text-slate-900">
                        Review Modul SI AMANG
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        25 Juni 2026 - 13:00
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROGRESS MAGANG (Matching User Screenshots) */}
          {activeTab === 'progress' && (
            <ProgressMagangPesertaView />
          )}

          {/* TAB 3: FORUM DISKUSI */}
          {activeTab === 'forum' && (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4 animate-in fade-in flex flex-col h-[550px]">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Forum Diskusi Magang</h2>
                <p className="text-xs text-slate-500">Ruang komunikasi antara peserta magang dan mentor DISKOMINFOSAN Kota Yogyakarta.</p>
              </div>

              {/* Chat Container */}
              <div className="flex-1 bg-slate-50 border border-slate-200/80 rounded-2xl p-4 overflow-y-auto space-y-3 text-xs">
                {forumMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.isMentor ? 'items-start' : 'items-end'}`}
                  >
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="font-bold text-[10px] text-slate-600">{msg.sender}</span>
                      <span className="text-[9px] text-slate-400">{msg.time}</span>
                    </div>
                    <div
                      className={`p-3 rounded-2xl max-w-xs sm:max-w-md text-xs leading-relaxed ${
                        msg.isMentor
                          ? 'bg-white border border-slate-200 text-slate-800'
                          : 'bg-[#1f877c] text-white'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Send Box */}
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Ketik pesan atau pertanyaan untuk mentor..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs"
                />
                <button
                  type="submit"
                  className="bg-[#1f877c] hover:bg-[#196e65] text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-base">send</span>
                  <span>Kirim</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: LAPORAN MAGANG (Matching User Screenshots) */}
          {activeTab === 'laporan' && (
            <LaporanMagangPesertaView />
          )}

          {/* TAB 5: NILAI MAGANG */}
          {activeTab === 'nilai' && (
            <NilaiMagangPesertaView user={user} />
          )}

          {/* TAB 6: RIWAYAT MAGANG */}
          {activeTab === 'riwayat' && <RiwayatMagangView />}

          {/* TAB 7: PROFILE SAYA */}
          {activeTab === 'profile' && <ProfileView user={user} />}

        </main>
      </div>

      {/* MODAL AGENDA DETAIL */}
      {selectedAgendaDate && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900">Detail Agenda Kalender</h3>
            <p className="text-xs text-slate-700 bg-amber-50 p-3 rounded-xl border border-amber-200 font-medium">
              {selectedAgendaDate}
            </p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedAgendaDate(null)}
                className="px-4 py-2 bg-[#1f877c] text-white text-xs font-bold rounded-xl"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
