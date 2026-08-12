import { useState, FormEvent } from 'react';
import { User } from '../../types/auth';
import { JadwalBimbinganAdminView } from '../../components/admin/JadwalBimbinganAdminView';
import { BidangAdminView } from '../../components/admin/BidangAdminView';
import { KategoriAdminView } from '../../components/admin/KategoriAdminView';
import { MentorAdminView } from '../../components/admin/MentorAdminView';
import { PendaftarAdminView } from '../../components/admin/PendaftarAdminView';
import { PeriodeAdminView } from '../../components/admin/PeriodeAdminView';

interface AdminDashboardPageProps {
  user: User;
  onNavigate: (page: 'home' | 'info' | 'register' | 'login' | 'dashboard') => void;
  onLogout?: () => void;
}

export function AdminDashboardPage({
  user,
  onNavigate,
  onLogout,
}: AdminDashboardPageProps) {
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'bidang' | 'kategori' | 'mentor' | 'pendaftar' | 'jadwal' | 'bimbingan' | 'periode'
  >('dashboard');

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Master Data States
  const [bidangList, setBidangList] = useState([
    { id: 1, name: 'Infrastruktur dan Sistem Informasi', count: 8, status: 'Aktif' },
    { id: 2, name: 'Komunikasi dan Informasi Publik', count: 5, status: 'Aktif' },
    { id: 3, name: 'Sertifikasi dan Layanan E-Gov', count: 4, status: 'Aktif' },
    { id: 4, name: 'Keamanan Informasi dan Persandian', count: 4, status: 'Aktif' },
  ]);
  const [newBidangName, setNewBidangName] = useState('');

  const [kategoriList, setKategoriList] = useState([
    { id: 1, bidang: 'Infrastruktur dan Sistem Informasi', name: 'Pengembangan Web', quota: 10, totalApplied: 12 },
    { id: 2, bidang: 'Infrastruktur dan Sistem Informasi', name: 'Pengembangan Aplikasi Mobile', quota: 5, totalApplied: 6 },
    { id: 3, bidang: 'Komunikasi dan Informasi Publik', name: 'Desain Grafis & Multimedia', quota: 8, totalApplied: 9 },
    { id: 4, bidang: 'Sertifikasi dan Layanan E-Gov', name: 'System Administrator', quota: 4, totalApplied: 3 },
  ]);

  const [mentorList, setMentorList] = useState([
    { id: 1, name: 'Bpk. Ahmad Fauzi, S.Kom.', nip: '198504122010011005', email: 'ahmad.fauzi@jogjakota.go.id', totalMhs: 3 },
    { id: 2, name: 'Ibu Retno Wulandari, M.T.', nip: '198802152012022001', email: 'retno.w@jogjakota.go.id', totalMhs: 4 },
    { id: 3, name: 'Bpk. Hendra Wijaya, S.T.', nip: '198209202008011002', email: 'hendra.w@jogjakota.go.id', totalMhs: 2 },
  ]);

  const [applicantList, setApplicantList] = useState([
    {
      id: '12345656',
      name: 'Leona Strive',
      institution: 'Universitas Gadjah Mada',
      field: 'Infrastruktur dan Sistem Informasi',
      category: 'Pengembangan Web',
      date: '28 Mei 2026',
      status: 'Review',
    },
    {
      id: '12345657',
      name: 'Rizky Pratama',
      institution: 'Universitas Negeri Yogyakarta',
      field: 'Komunikasi dan Informasi Publik',
      category: 'Desain Grafis & Multimedia',
      date: '27 Mei 2026',
      status: 'Diterima',
    },
    {
      id: '12345658',
      name: 'Budi Santoso',
      institution: 'UPN Veteran Yogyakarta',
      field: 'Sertifikasi dan Layanan E-Gov',
      category: 'System Administrator',
      date: '26 Mei 2026',
      status: 'Diterima',
    },
    {
      id: '12345659',
      name: 'Siti Rahmawati',
      institution: 'Universitas Islam Indonesia',
      field: 'Infrastruktur dan Sistem Informasi',
      category: 'Pengembangan Web',
      date: '25 Mei 2026',
      status: 'Ditolak',
    },
  ]);

  // Chart Monthly Data
  const monthlyData = [
    { month: 'Jan', accepted: 5, rejected: 6 },
    { month: 'Feb', accepted: 2, rejected: 3 },
    { month: 'Mar', accepted: 4, rejected: 5 },
    { month: 'Apr', accepted: 1, rejected: 6 },
    { month: 'Mei', accepted: 2, rejected: 3 },
    { month: 'Jun', accepted: 2, rejected: 7 },
    { month: 'Jul', accepted: 4, rejected: 3 },
    { month: 'Agu', accepted: 7, rejected: 2 },
    { month: 'Sep', accepted: 7, rejected: 5 },
    { month: 'Okt', accepted: 2, rejected: 8 },
    { month: 'Nov', accepted: 5, rejected: 5 },
    { month: 'Des', accepted: 3, rejected: 4 },
  ];

  const handleAddBidang = (e: FormEvent) => {
    e.preventDefault();
    if (!newBidangName.trim()) return;
    setBidangList([
      ...bidangList,
      {
        id: Date.now(),
        name: newBidangName,
        count: 0,
        status: 'Aktif',
      },
    ]);
    setNewBidangName('');
  };

  const handleChangeStatus = (id: string, newStatus: string) => {
    setApplicantList(
      applicantList.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-800">
      
      {/* TOP HEADER BAR (EXACT MATCH TO ADMIN SCREENSHOT) */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-6 py-3 flex items-center justify-between shadow-xs">
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
          {/* Notification Icon */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              title="Notifikasi Admin"
            >
              <span className="material-symbols-outlined text-xl">notifications</span>
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-white"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
                  <h4 className="text-xs font-bold text-slate-800">Notifikasi System Admin</h4>
                  <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold">3 Baru</span>
                </div>
                <div className="space-y-2.5 text-xs">
                  <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-xl">
                    <p className="font-bold text-blue-900 text-[11px]">4 Pendaftaran Baru Masuk</p>
                    <p className="text-slate-600 text-[10px] mt-0.5">Harap melakukan peninjauan administrasi pendaftar magang.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Admin User Profile */}
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
                <span className="block text-xs font-bold text-slate-900 leading-tight">
                  Admin
                </span>
                <span className="block text-[11px] text-slate-400 font-medium">
                  adminsiamang@gmail.com
                </span>
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
        
        {/* SIDEBAR NAVIGATION (MATCHING ADMIN SCREENSHOT PRECISELY) */}
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

          <div className="p-3 sm:p-4 space-y-5">
            {/* Dashboard Link */}
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

            {/* MASTER DATA Group */}
            <div className="space-y-1">
              {!sidebarCollapsed && (
                <span className="px-3.5 text-[10px] font-extrabold uppercase text-[#1f877c] tracking-wider block mb-1">
                  MASTER DATA
                </span>
              )}

              <button
                type="button"
                onClick={() => setActiveTab('bidang')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'bidang' ? 'bg-[#E6F7F3] text-[#1f877c] font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined text-xl">database</span>
                {!sidebarCollapsed && <span>Bidang</span>}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('kategori')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'kategori' ? 'bg-[#E6F7F3] text-[#1f877c] font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined text-xl">account_tree</span>
                {!sidebarCollapsed && <span>Kategori</span>}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('mentor')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'mentor' ? 'bg-[#E6F7F3] text-[#1f877c] font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined text-xl">groups</span>
                {!sidebarCollapsed && <span>Mentor</span>}
              </button>
            </div>

            {/* MAGANG Group */}
            <div className="space-y-1 pt-2 border-t border-slate-100">
              {!sidebarCollapsed && (
                <span className="px-3.5 text-[10px] font-extrabold uppercase text-[#1f877c] tracking-wider block mb-1">
                  MAGANG
                </span>
              )}

              <button
                type="button"
                onClick={() => setActiveTab('pendaftar')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'pendaftar' ? 'bg-[#E6F7F3] text-[#1f877c] font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined text-xl">badge</span>
                {!sidebarCollapsed && <span>Pendaftar</span>}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('jadwal')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'jadwal' ? 'bg-[#E6F7F3] text-[#1f877c] font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined text-xl">calendar_today</span>
                {!sidebarCollapsed && <span>Jadwal</span>}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('bimbingan')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'bimbingan' ? 'bg-[#E6F7F3] text-[#1f877c] font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined text-xl">diversity_3</span>
                {!sidebarCollapsed && <span>Bimbingan</span>}
              </button>
            </div>

            {/* PENGATURAN Group */}
            <div className="space-y-1 pt-2 border-t border-slate-100">
              {!sidebarCollapsed && (
                <span className="px-3.5 text-[10px] font-extrabold uppercase text-[#1f877c] tracking-wider block mb-1">
                  PENGATURAN
                </span>
              )}

              <button
                type="button"
                onClick={() => setActiveTab('periode')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'periode' ? 'bg-[#E6F7F3] text-[#1f877c] font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined text-xl">calendar_month</span>
                {!sidebarCollapsed && <span>Periode Magang</span>}
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

        {/* MAIN ADMIN CONTENT AREA */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-x-hidden">

          {/* TAB 1: ADMIN DASHBOARD OVERVIEW (EXACT MATCH TO ADMIN SCREENSHOT) */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in">
              
              {/* TOP 4 STAT CARDS (EXACT MATCH TO ADMIN SCREENSHOT) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                
                {/* Card 1: Total Pendaftar (Light Blue Tint) */}
                <div className="bg-[#E0F2FE] border border-sky-200 rounded-2xl p-5 shadow-2xs flex items-center justify-between">
                  <div>
                    <span className="text-3xl font-extrabold text-[#0284C7] block">
                      21
                    </span>
                    <span className="text-xs font-bold text-[#0369A1] mt-2 block">
                      Total Pendaftar
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-white/80 text-[#0284C7] flex items-center justify-center shrink-0 shadow-2xs">
                    <span className="material-symbols-outlined text-2xl font-bold">groups</span>
                  </div>
                </div>

                {/* Card 2: Pendaftar Diterima (Light Green Tint) */}
                <div className="bg-[#DCFCE7] border border-emerald-200 rounded-2xl p-5 shadow-2xs flex items-center justify-between">
                  <div>
                    <span className="text-3xl font-extrabold text-[#16A34A] block">
                      21
                    </span>
                    <span className="text-xs font-bold text-[#15803D] mt-2 block">
                      Pendaftar Diterima
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-white/80 text-[#16A34A] flex items-center justify-center shrink-0 shadow-2xs">
                    <span className="material-symbols-outlined text-2xl font-bold">how_to_reg</span>
                  </div>
                </div>

                {/* Card 3: Total Bidang (Light Yellow/Amber Tint) */}
                <div className="bg-[#FEF3C7] border border-amber-200 rounded-2xl p-5 shadow-2xs flex items-center justify-between">
                  <div>
                    <span className="text-3xl font-extrabold text-[#D97706] block">
                      21
                    </span>
                    <span className="text-xs font-bold text-[#B45309] mt-2 block">
                      Total Bidang
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-white/80 text-[#D97706] flex items-center justify-center shrink-0 shadow-2xs">
                    <span className="material-symbols-outlined text-2xl font-bold">dashboard_customize</span>
                  </div>
                </div>

                {/* Card 4: Kategori Tersedia (Light Slate Tint) */}
                <div className="bg-[#E2E8F0] border border-slate-300 rounded-2xl p-5 shadow-2xs flex items-center justify-between">
                  <div>
                    <span className="text-3xl font-extrabold text-[#334155] block">
                      21
                    </span>
                    <span className="text-xs font-bold text-[#1E293B] mt-2 block">
                      Kategori Tersedia
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-white/80 text-[#334155] flex items-center justify-center shrink-0 shadow-2xs">
                    <span className="material-symbols-outlined text-2xl font-bold">category</span>
                  </div>
                </div>
              </div>

              {/* MIDDLE ROW: GRAFIK PENDAFTAR & RIGHT CARDS (EXACT MATCH TO ADMIN SCREENSHOT) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left (8 Cols): Grafik Pendaftar (Monthly Bar Chart) */}
                <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <h3 className="text-base font-bold text-slate-900">Grafik Pendaftar</h3>
                    
                    {/* Legend Indicator */}
                    <div className="flex items-center gap-4 text-xs font-semibold">
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-xs bg-[#8B5CF6]"></span>
                        <span className="text-slate-600">Diterima</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-xs bg-[#F87171]"></span>
                        <span className="text-slate-600">Tidak Diterima</span>
                      </div>
                    </div>
                  </div>

                  {/* Custom CSS/SVG Bar Chart for Jan - Des */}
                  <div className="h-64 flex items-end justify-between gap-1.5 pt-6 pb-2 px-2 border-b border-slate-200 relative">
                    
                    {/* Y-Axis Grid Lines */}
                    <div className="absolute inset-x-0 top-0 border-b border-slate-100 text-[10px] text-slate-400 pl-1">8</div>
                    <div className="absolute inset-x-0 top-1/4 border-b border-slate-100 text-[10px] text-slate-400 pl-1">6</div>
                    <div className="absolute inset-x-0 top-2/4 border-b border-slate-100 text-[10px] text-slate-400 pl-1">4</div>
                    <div className="absolute inset-x-0 top-3/4 border-b border-slate-100 text-[10px] text-slate-400 pl-1">2</div>
                    <div className="absolute inset-x-0 bottom-0 text-[10px] text-slate-400 pl-1">0</div>

                    {/* Bars Mapping */}
                    {monthlyData.map((item) => (
                      <div key={item.month} className="flex-1 flex flex-col items-center gap-1 z-10 h-full justify-end group">
                        <div className="flex items-end gap-1 w-full justify-center h-full">
                          {/* Accepted Bar (Purple) */}
                          <div
                            className="bg-[#8B5CF6] rounded-t-xs w-2.5 sm:w-3.5 transition-all group-hover:brightness-110"
                            style={{ height: `${(item.accepted / 8) * 100}%` }}
                            title={`${item.month} Diterima: ${item.accepted}`}
                          />
                          {/* Rejected Bar (Pink/Coral) */}
                          <div
                            className="bg-[#F87171] rounded-t-xs w-2.5 sm:w-3.5 transition-all group-hover:brightness-110"
                            style={{ height: `${(item.rejected / 8) * 100}%` }}
                            title={`${item.month} Tidak Diterima: ${item.rejected}`}
                          />
                        </div>
                        <span className="text-[10px] sm:text-xs font-bold text-slate-500 mt-2">
                          {item.month}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Bottom Legend */}
                  <div className="flex justify-center items-center gap-6 text-xs font-bold text-slate-600 pt-1">
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-xs bg-[#8B5CF6]"></span>
                      <span>Diterima</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-xs bg-[#F87171]"></span>
                      <span>Tidak Diterima</span>
                    </div>
                  </div>
                </div>

                {/* Right Side Cards (4 Cols): Agenda Mendatang & Mahasiswa Bimbingan */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* Card 1: Agenda Mendatang */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
                    <h3 className="text-base font-bold text-slate-900">Agenda Mendatang</h3>

                    <div className="space-y-3">
                      <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 space-y-1">
                        <h4 className="text-xs font-bold text-slate-900">
                          Bimbingan dengan Mentor
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          2 Juni 2026 - 09:00
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 space-y-1">
                        <h4 className="text-xs font-bold text-slate-900">
                          Bimbingan dengan Mentor
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          2 Juni 2026 - 09:00
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Mahasiswa Bimbingan */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
                    <h3 className="text-base font-bold text-slate-900">Mahasiswa Bimbingan</h3>

                    <div className="space-y-3">
                      {/* Item 1 */}
                      <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0 border border-slate-300">
                          <img
                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                            alt="Leona Strive"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xs font-bold text-slate-900">Leona Strive</h4>
                          <div className="w-full bg-slate-100 rounded-full h-3.5 p-0.5 mt-1 border border-slate-200">
                            <div className="bg-[#1f877c] h-full rounded-full text-[9px] text-white font-bold flex items-center justify-center" style={{ width: '20%' }}>
                              20%
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Item 2 */}
                      <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0 border border-slate-300">
                          <img
                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                            alt="Leona Strive"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xs font-bold text-slate-900">Leona Strive</h4>
                          <div className="w-full bg-slate-100 rounded-full h-3.5 p-0.5 mt-1 border border-slate-200">
                            <div className="bg-[#1f877c] h-full rounded-full text-[9px] text-white font-bold flex items-center justify-center" style={{ width: '20%' }}>
                              20%
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Item 3 */}
                      <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0 border border-slate-300">
                          <img
                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                            alt="Leona Strive"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xs font-bold text-slate-900">Leona Strive</h4>
                          <div className="w-full bg-slate-100 rounded-full h-3.5 p-0.5 mt-1 border border-slate-200">
                            <div className="bg-[#1f877c] h-full rounded-full text-[9px] text-white font-bold flex items-center justify-center" style={{ width: '20%' }}>
                              20%
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* TAB 2: MASTER DATA - BIDANG */}
          {activeTab === 'bidang' && (
            <BidangAdminView />
          )}

          {/* TAB 3: MASTER DATA - KATEGORI */}
          {activeTab === 'kategori' && (
            <KategoriAdminView />
          )}

          {/* TAB 4: MASTER DATA - MENTOR */}
          {activeTab === 'mentor' && (
            <MentorAdminView />
          )}

          {/* TAB 5: DATA PENDAFTAR & APPROVAL */}
          {activeTab === 'pendaftar' && (
            <PendaftarAdminView />
          )}

          {/* TAB 6: JADWAL BIMBINGAN (Google Calendar Sync) */}
          {activeTab === 'jadwal' && (
            <JadwalBimbinganAdminView />
          )}

          {/* TAB 7: BIMBINGAN */}
          {activeTab === 'bimbingan' && (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4 animate-in fade-in">
              <h2 className="text-lg font-bold text-slate-900 capitalize">Pengaturan Bimbingan Magang</h2>
              <p className="text-xs text-slate-500">Monitoring aktivitas bimbingan peserta magang dengan pembimbing lapangan DISKOMINFOSAN Kota Yogyakarta.</p>
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold">
                Status Sistem Bimbingan: Aktif (28 Sesi Bimbingan Berjalan)
              </div>
            </div>
          )}

          {/* TAB 8: PERIODE MAGANG */}
          {activeTab === 'periode' && (
            <PeriodeAdminView />
          )}

        </main>
      </div>

    </div>
  );
}
