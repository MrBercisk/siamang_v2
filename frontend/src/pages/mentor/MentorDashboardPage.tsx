import { useState, FormEvent } from 'react';
import { User } from '../../types/auth';
import { DetailDataModal, PendaftarData } from '../../components/mentor/DetailDataModal';
import { DetailPendaftarView } from '../../components/mentor/DetailPendaftarView';
import { DetailBimbinganView, BimbinganData } from '../../components/mentor/DetailBimbinganView';
import { showToast } from '../../utils/swal';

interface MentorDashboardPageProps {
  user: User;
  onNavigate: (page: 'home' | 'info' | 'register' | 'login' | 'dashboard') => void;
  onLogout?: () => void;
}

export function MentorDashboardPage({
  user,
  onNavigate,
  onLogout,
}: MentorDashboardPageProps) {
  // Navigation active tab: 'dashboard' | 'forum' | 'pendaftar' | 'bimbingan'
  const [activeTab, setActiveTab] = useState<'dashboard' | 'forum' | 'pendaftar' | 'bimbingan'>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Selected pendaftar for Detail Modal
  const [selectedPendaftar, setSelectedPendaftar] = useState<PendaftarData | null>(null);

  // Selected Bimbingan Mahasiswa
  const [selectedBimbingan, setSelectedBimbingan] = useState<BimbinganData | null>(null);
  const [bimbinganSearch, setBimbinganSearch] = useState('');
  const [bimbinganItemsPerPage, setBimbinganItemsPerPage] = useState(10);

  // Sample Bimbingan Data matching Screenshot 1, 2, and 3
  const [bimbinganList, setBimbinganList] = useState<BimbinganData[]>([
    {
      id: 1,
      nama: 'Leona Strive',
      fotoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      kategori: 'Perencanaan dan Implementasi Sistem Informasi',
      judulProject: 'Perencanaan dan Implementasi Sistem Informasi',
      tipePendaftaran: 'Kelompok',
      lastUpdate: '20 Juni 2025',
      status: 'On Progress',
      progress: 70,
      ketua: 'Nama Ketua',
      anggota2: 'Nama Anggota',
      anggota3: 'Nama Anggota',
      progressList: [
        {
          id: 1,
          tanggal: '28 Mei 2026',
          pencapaian: 'Membuat wireframe',
          catatan: 'Lanjutkan ke hi-fi design',
          filePresentasi: 'Wireframe_v1.pdf',
        },
      ],
      laporanList: [
        {
          id: 1,
          judulLaporan: 'Sistem Informasi Aplikasi',
          fileLaporan: 'Laporan_Sistem_Informasi_Aplikasi.pdf',
          linkProject: 'https://google.drive.com/...',
          formNilai: 'Form_Nilai_Sistem_Informasi.pdf',
          status: 'disetujui',
        },
      ],
      nilai: {
        kehadiran: 0,
        kemampuanKerja: 0,
        kualitasKerja: 0,
        kerjasama: 0,
        inisiatifKreativitas: 0,
        disiplin: 0,
      },
    },
    {
      id: 2,
      nama: 'Leona Strive',
      fotoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      kategori: 'Perencanaan dan Implementasi Sistem Informasi',
      judulProject: 'Perencanaan dan Implementasi Sistem Informasi',
      tipePendaftaran: 'Kelompok',
      lastUpdate: '20 Juni 2025',
      status: 'On Progress',
      progress: 70,
      ketua: 'Nama Ketua',
      anggota2: 'Nama Anggota',
      anggota3: 'Nama Anggota',
      progressList: [
        {
          id: 1,
          tanggal: '28 Mei 2026',
          pencapaian: 'Membuat wireframe',
          catatan: 'Lanjutkan ke hi-fi design',
          filePresentasi: 'Wireframe_v1.pdf',
        },
      ],
      laporanList: [
        {
          id: 1,
          judulLaporan: 'Sistem Informasi Aplikasi',
          fileLaporan: 'Laporan_Sistem_Informasi_Aplikasi.pdf',
          linkProject: 'https://google.drive.com/...',
          formNilai: 'Form_Nilai_Sistem_Informasi.pdf',
          status: 'disetujui',
        },
      ],
      nilai: {
        kehadiran: 0,
        kemampuanKerja: 0,
        kualitasKerja: 0,
        kerjasama: 0,
        inisiatifKreativitas: 0,
        disiplin: 0,
      },
    },
  ]);

  // Filter state for Pendaftar Magang table
  const [pendaftarFilter, setPendaftarFilter] = useState<'all' | 'verifikasi' | 'diterima' | 'ditolak'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Sample Pendaftar Data matching Image 3
  const [pendaftarList, setPendaftarList] = useState<PendaftarData[]>([
    {
      id: 1,
      fotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      nama: 'Leona Strive',
      email: 'leona@gmail.com',
      phone: '08123456789',
      instansi: 'Universitas Gadjah Mada',
      nim: '21/478912/SV/19231',
      kategori: 'Perencanaan dan Implementasi Sistem Informasi',
      tanggalDaftar: '20 Juni 2025',
      status: 'Diterima',
      berkas: { pasFoto: true, suratPermohonan: true, proposal: true, nda: true },
    },
    {
      id: 2,
      fotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      nama: 'Leona Strive',
      email: 'leona2@gmail.com',
      phone: '08123456780',
      instansi: 'Universitas Gadjah Mada',
      nim: '21/478913/SV/19232',
      kategori: 'Perencanaan dan Implementasi Sistem Informasi',
      tanggalDaftar: '20 Juni 2025',
      status: 'Ditolak',
      berkas: { pasFoto: true, suratPermohonan: true, proposal: true, nda: true },
    },
    {
      id: 3,
      fotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      nama: 'Leona Strive',
      email: 'budi@gmail.com',
      phone: '08123456781',
      instansi: 'Universitas Negeri Yogyakarta',
      nim: '21/478914/SV/19233',
      kategori: 'Perencanaan dan Implementasi Sistem Informasi',
      tanggalDaftar: '20 Juni 2025',
      status: 'Verifikasi',
      berkas: { pasFoto: true, suratPermohonan: true, proposal: true, nda: true },
    },
    {
      id: 4,
      fotoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      nama: 'Leona Strive',
      email: 'siti@gmail.com',
      phone: '08123456782',
      instansi: 'UPN Veteran Yogyakarta',
      nim: '21/478915/SV/19234',
      kategori: 'Perencanaan dan Implementasi Sistem Informasi',
      tanggalDaftar: '20 Juni 2025',
      status: 'Diterima',
      berkas: { pasFoto: true, suratPermohonan: true, proposal: true, nda: true },
    },
    {
      id: 5,
      fotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      nama: 'Leona Strive',
      email: 'rizky@gmail.com',
      phone: '08123456783',
      instansi: 'Universitas Amikom Yogyakarta',
      nim: '21/478916/SV/19235',
      kategori: 'Perencanaan dan Implementasi Sistem Informasi',
      tanggalDaftar: '20 Juni 2025',
      status: 'Ditolak',
      berkas: { pasFoto: true, suratPermohonan: true, proposal: true, nda: true },
    },
  ]);

  // Forum Diskusi chat state
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'LEONA STRIVE',
      role: 'applicant',
      message: 'Halo pak, saya izin bertanya terkait fitur tambahan yang bapak inginkan',
      timestamp: '2023-08-05 02:54:00',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: user.name || 'Mentor Aplikasi',
      role: 'mentor',
      message: inputMessage.trim(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    setChatMessages([...chatMessages, newMessage]);
    setInputMessage('');
    showToast('success', 'Pesan berhasil dikirim!');
  };

  const handleUpdateStatus = (id: number, newStatus: 'Diterima' | 'Ditolak' | 'Verifikasi') => {
    setPendaftarList(
      pendaftarList.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
  };

  // Counts for tabs
  const countVerifikasi = pendaftarList.filter((p) => p.status === 'Verifikasi').length;
  const countDiterima = pendaftarList.filter((p) => p.status === 'Diterima').length;
  const countDitolak = pendaftarList.filter((p) => p.status === 'Ditolak').length;

  // Filtered List
  const filteredPendaftar = pendaftarList.filter((p) => {
    const matchesTab =
      pendaftarFilter === 'all'
        ? true
        : pendaftarFilter === 'verifikasi'
        ? p.status === 'Verifikasi'
        : pendaftarFilter === 'diterima'
        ? p.status === 'Diterima'
        : p.status === 'Ditolak';

    const matchesSearch =
      p.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.kategori.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.instansi.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-800">
      
      {/* TOP HEADER BAR */}
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

      {/* BODY WITH SIDEBAR */}
      <div className="flex-1 flex relative">
        
        {/* SIDEBAR */}
        <aside
          className={`bg-white border-r border-slate-200/90 transition-all duration-300 flex flex-col justify-between relative z-20 ${
            sidebarCollapsed ? 'w-16' : 'w-60'
          }`}
        >
          {/* Toggle Button on Sidebar border */}
          <button
            type="button"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute -right-3.5 top-6 w-7 h-7 rounded-full bg-[#1f877c] text-white flex items-center justify-center shadow-md cursor-pointer hover:bg-[#196e65] transition-all z-30"
            title={sidebarCollapsed ? 'Buka Sidebar' : 'Tutup Sidebar'}
          >
            <span className="material-symbols-outlined text-base">
              {sidebarCollapsed ? 'chevron_right' : 'chevron_left'}
            </span>
          </button>

          <div className="p-3 space-y-5">
            {/* MENU Label */}
            {!sidebarCollapsed && (
              <div className="px-3 pt-2">
                <span className="text-[11px] font-extrabold text-[#1f877c] tracking-wider uppercase">
                  MENU
                </span>
              </div>
            )}

            {/* NAV LINKS */}
            <nav className="space-y-1">
              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-[#E6F7F3] text-[#1f877c]'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="material-symbols-outlined text-xl shrink-0">grid_view</span>
                {!sidebarCollapsed && <span>Dashboard</span>}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('forum')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'forum'
                    ? 'bg-[#E6F7F3] text-[#1f877c]'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="material-symbols-outlined text-xl shrink-0">chat_bubble_outline</span>
                {!sidebarCollapsed && <span>Forum Diskusi</span>}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('pendaftar')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'pendaftar'
                    ? 'bg-[#E6F7F3] text-[#1f877c]'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="material-symbols-outlined text-xl shrink-0">groups</span>
                {!sidebarCollapsed && <span>Pendaftar Magang</span>}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('bimbingan')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'bimbingan'
                    ? 'bg-[#E6F7F3] text-[#1f877c]'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="material-symbols-outlined text-xl shrink-0">group_add</span>
                {!sidebarCollapsed && <span>Bimbingan Mahasiswa</span>}
              </button>

              <div className="pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    if (onLogout) onLogout();
                    else onNavigate('home');
                  }}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xl shrink-0">logout</span>
                  {!sidebarCollapsed && <span>Logout</span>}
                </button>
              </div>
            </nav>
          </div>
        </aside>

        {/* MAIN CONTENT CANVAS */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-x-hidden">
          
          {/* TAB 1: DASHBOARD MENTOR */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* STATS CARDS ROW (Matching Screenshot 1) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                
                {/* Card 1: Total Pendaftar */}
                <div className="p-6 rounded-2xl bg-[#EBF5FF] border border-sky-100 shadow-2xs flex items-center justify-between">
                  <div>
                    <span className="text-4xl sm:text-5xl font-extrabold text-[#0284c7] block">
                      21
                    </span>
                    <span className="text-xs font-bold text-[#0284c7] block mt-2">
                      Total Pendaftar
                    </span>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-white/80 border border-sky-200/80 flex items-center justify-center p-2.5 shrink-0 shadow-2xs">
                    <span className="material-symbols-outlined text-3xl text-[#0284c7]">
                      groups
                    </span>
                  </div>
                </div>

                {/* Card 2: Pendaftar Diterima */}
                <div className="p-6 rounded-2xl bg-[#ECFDF5] border border-emerald-100 shadow-2xs flex items-center justify-between">
                  <div>
                    <span className="text-4xl sm:text-5xl font-extrabold text-[#10B981] block">
                      21
                    </span>
                    <span className="text-xs font-bold text-[#10B981] block mt-2">
                      Pendaftar Diterima
                    </span>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-white/80 border border-emerald-200/80 flex items-center justify-center p-2.5 shrink-0 shadow-2xs">
                    <span className="material-symbols-outlined text-3xl text-[#10B981]">
                      verified
                    </span>
                  </div>
                </div>

                {/* Card 3: Pendaftar Ditolak */}
                <div className="p-6 rounded-2xl bg-[#FEF2F2] border border-rose-100 shadow-2xs flex items-center justify-between">
                  <div>
                    <span className="text-4xl sm:text-5xl font-extrabold text-[#E11D48] block">
                      21
                    </span>
                    <span className="text-xs font-bold text-[#E11D48] block mt-2">
                      Pendaftar Ditolak
                    </span>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-white/80 border border-rose-200/80 flex items-center justify-center p-2.5 shrink-0 shadow-2xs">
                    <span className="material-symbols-outlined text-4xl text-[#E11D48]">
                      close
                    </span>
                  </div>
                </div>

              </div>

              {/* MIDDLE SECTION: CALENDAR & RIGHT STACK */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* CALENDAR (June 2026) - 8 COLS */}
                <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900">June 2026</h3>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        className="w-7 h-7 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-600 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">chevron_left</span>
                      </button>
                      <button
                        type="button"
                        className="w-7 h-7 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-600 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                      </button>
                    </div>
                  </div>

                  {/* CALENDAR GRID */}
                  <div className="grid grid-cols-7 gap-2 text-center text-xs">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <span key={day} className="font-semibold text-slate-500 py-1">
                        {day}
                      </span>
                    ))}

                    {/* Day 31 prev month */}
                    <div className="p-3 rounded-xl bg-slate-50 text-slate-300 font-medium">31</div>

                    {/* Days 1 to 30 */}
                    <div className="p-3 rounded-xl bg-[#E6F7F3]/40 text-slate-800 font-bold">1</div>
                    
                    {/* Day 2 (Yellow highlighted with detail agenda) */}
                    <div className="p-2 rounded-xl bg-amber-100 border border-amber-300 text-amber-900 font-bold flex flex-col items-center justify-center min-h-[52px]">
                      <span>2</span>
                      <span className="text-[9px] font-medium leading-none mt-1">detail agenda</span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#E6F7F3]/40 text-slate-800 font-bold">3</div>
                    <div className="p-3 rounded-xl bg-[#E6F7F3]/40 text-slate-800 font-bold">4</div>
                    <div className="p-3 rounded-xl bg-[#E6F7F3]/40 text-slate-800 font-bold">5</div>
                    <div className="p-3 rounded-xl bg-[#E6F7F3]/40 text-slate-800 font-bold">6</div>
                    <div className="p-3 rounded-xl bg-[#E6F7F3]/40 text-slate-800 font-bold">7</div>
                    <div className="p-3 rounded-xl bg-[#E6F7F3]/40 text-slate-800 font-bold">8</div>
                    <div className="p-3 rounded-xl bg-[#E6F7F3]/40 text-slate-800 font-bold">9</div>
                    <div className="p-3 rounded-xl bg-[#E6F7F3]/40 text-slate-800 font-bold">10</div>
                    <div className="p-3 rounded-xl bg-[#E6F7F3]/40 text-slate-800 font-bold">11</div>
                    <div className="p-3 rounded-xl bg-[#E6F7F3]/40 text-slate-800 font-bold">12</div>
                    <div className="p-3 rounded-xl bg-[#E6F7F3]/40 text-slate-800 font-bold">13</div>
                    <div className="p-3 rounded-xl bg-[#E6F7F3]/40 text-slate-800 font-bold">14</div>
                    <div className="p-3 rounded-xl bg-[#E6F7F3]/40 text-slate-800 font-bold">15</div>
                    <div className="p-3 rounded-xl bg-[#E6F7F3]/40 text-slate-800 font-bold">16</div>
                    <div className="p-3 rounded-xl bg-[#E6F7F3]/40 text-slate-800 font-bold">17</div>
                    <div className="p-3 rounded-xl bg-[#E6F7F3]/40 text-slate-800 font-bold">18</div>
                    <div className="p-3 rounded-xl bg-[#E6F7F3]/40 text-slate-800 font-bold">19</div>
                    <div className="p-3 rounded-xl bg-[#E6F7F3]/40 text-slate-800 font-bold">20</div>
                    <div className="p-3 rounded-xl bg-[#E6F7F3]/40 text-slate-800 font-bold">21</div>
                    <div className="p-3 rounded-xl bg-[#E6F7F3]/40 text-slate-800 font-bold">22</div>
                    <div className="p-3 rounded-xl bg-[#E6F7F3]/40 text-slate-800 font-bold">23</div>
                    <div className="p-3 rounded-xl bg-[#E6F7F3]/40 text-slate-800 font-bold">24</div>
                    
                    {/* Day 25 (Dark navy highlighted) */}
                    <div className="p-3 rounded-xl bg-slate-900 text-white font-extrabold flex items-center justify-center">
                      25
                    </div>

                    <div className="p-3 rounded-xl bg-[#E6F7F3]/40 text-slate-800 font-bold">26</div>
                    <div className="p-3 rounded-xl bg-[#E6F7F3]/40 text-slate-800 font-bold">27</div>
                    <div className="p-3 rounded-xl bg-[#E6F7F3]/40 text-slate-800 font-bold">28</div>
                    <div className="p-3 rounded-xl bg-[#E6F7F3]/40 text-slate-800 font-bold">29</div>

                    {/* Day 30 (Yellow highlighted with detail agenda) */}
                    <div className="p-2 rounded-xl bg-amber-100 border border-amber-300 text-amber-900 font-bold flex flex-col items-center justify-center min-h-[52px]">
                      <span>30</span>
                      <span className="text-[9px] font-medium leading-none mt-1">detail agenda</span>
                    </div>

                    {/* Days next month */}
                    <div className="p-3 rounded-xl bg-slate-50 text-slate-300 font-medium">1</div>
                    <div className="p-3 rounded-xl bg-slate-50 text-slate-300 font-medium">2</div>
                    <div className="p-3 rounded-xl bg-slate-50 text-slate-300 font-medium">3</div>
                    <div className="p-3 rounded-xl bg-slate-50 text-slate-300 font-medium">4</div>
                  </div>
                </div>

                {/* RIGHT STACK: AGENDA & MAHASISWA BAMBINGAN - 4 COLS */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* Agenda Mendatang Card */}
                  <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
                    <h3 className="text-sm font-bold text-slate-900">Agenda Mendatang</h3>
                    
                    <div className="space-y-3">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="block text-xs font-bold text-slate-900">
                          Bimbingan dengan Mentor
                        </span>
                        <span className="block text-[11px] text-slate-500 mt-1">
                          2 Juni 2026 - 09:00
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="block text-xs font-bold text-slate-900">
                          Bimbingan dengan Mentor
                        </span>
                        <span className="block text-[11px] text-slate-500 mt-1">
                          2 Juni 2026 - 09:00
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Mahasiswa Bimbingan Card */}
                  <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
                    <h3 className="text-sm font-bold text-slate-900">Mahasiswa Bimbingan</h3>

                    <div className="space-y-3">
                      {/* Student 1 */}
                      <div className="flex items-center gap-3">
                        <img
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                          alt="Leona Strive"
                          className="w-10 h-10 rounded-full object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0 space-y-1">
                          <span className="block text-xs font-bold text-slate-900 truncate">
                            Leona Strive
                          </span>
                          <div className="w-full bg-[#E6F7F3] rounded-full h-3 overflow-hidden flex items-center px-1">
                            <span className="text-[9px] font-extrabold text-[#1f877c]">20%</span>
                          </div>
                        </div>
                      </div>

                      {/* Student 2 */}
                      <div className="flex items-center gap-3">
                        <img
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                          alt="Leona Strive"
                          className="w-10 h-10 rounded-full object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0 space-y-1">
                          <span className="block text-xs font-bold text-slate-900 truncate">
                            Leona Strive
                          </span>
                          <div className="w-full bg-[#E6F7F3] rounded-full h-3 overflow-hidden flex items-center px-1">
                            <span className="text-[9px] font-extrabold text-[#1f877c]">20%</span>
                          </div>
                        </div>
                      </div>

                      {/* Student 3 */}
                      <div className="flex items-center gap-3">
                        <img
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                          alt="Leona Strive"
                          className="w-10 h-10 rounded-full object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0 space-y-1">
                          <span className="block text-xs font-bold text-slate-900 truncate">
                            Leona Strive
                          </span>
                          <div className="w-full bg-[#E6F7F3] rounded-full h-3 overflow-hidden flex items-center px-1">
                            <span className="text-[9px] font-extrabold text-[#1f877c]">20%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* TAB 2: FORUM DISKUSI (Matching Screenshot 2) */}
          {activeTab === 'forum' && (
            <div className="space-y-4 animate-fade-in">
              
              {/* Petunjuk Penggunaan Box */}
              <div className="p-4 rounded-xl bg-[#E6F7F3] border border-[#C6EFE7] text-slate-700 text-xs sm:text-sm font-medium">
                <span className="font-bold text-[#1f877c]">Petunjuk Penggunaan:</span> Ini adalah menu chat bagi peserta magang. Anda dapat melakukan diskusi dengan mentor terkait magang.
              </div>

              {/* CHAT CONTAINER */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-2xs flex flex-col min-h-[480px]">
                
                {/* Scrollable messages area */}
                <div className="flex-1 bg-[#F1F5F9]/70 rounded-2xl p-4 sm:p-6 overflow-y-auto space-y-4 min-h-[360px]">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        msg.role === 'mentor' ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div
                        className={`p-4 rounded-2xl max-w-lg shadow-2xs space-y-1.5 ${
                          msg.role === 'mentor'
                            ? 'bg-[#1f877c] text-white rounded-br-none'
                            : 'bg-[#E3F2FD] text-slate-800 rounded-bl-none'
                        }`}
                      >
                        <span
                          className={`block text-xs font-extrabold uppercase tracking-wide ${
                            msg.role === 'mentor' ? 'text-teal-100' : 'text-slate-900'
                          }`}
                        >
                          {msg.sender}
                        </span>
                        <p className="text-xs sm:text-sm font-medium leading-relaxed">
                          {msg.message}
                        </p>
                        <span
                          className={`block text-[10px] ${
                            msg.role === 'mentor' ? 'text-teal-200' : 'text-slate-400'
                          }`}
                        >
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* BOTTOM CHAT INPUT */}
                <form
                  onSubmit={handleSendMessage}
                  className="mt-4 flex items-center gap-3 pt-3 border-t border-slate-100"
                >
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Tulis pesan ..."
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-medium focus:outline-hidden focus:border-[#1f877c] focus:ring-1 focus:ring-[#1f877c]"
                  />
                  <button
                    type="submit"
                    className="w-11 h-11 rounded-xl bg-[#1f877c] hover:bg-[#196e65] text-white flex items-center justify-center shrink-0 shadow-2xs transition-all cursor-pointer"
                    title="Kirim Pesan"
                  >
                    <span className="material-symbols-outlined text-xl">send</span>
                  </button>
                </form>

              </div>

            </div>
          )}

          {/* TAB 3: DATA PENDAFTAR MAGANG & DETAIL VIEW */}
          {activeTab === 'pendaftar' && (
            selectedPendaftar ? (
              <DetailPendaftarView
                pendaftar={selectedPendaftar}
                onBack={() => setSelectedPendaftar(null)}
                onUpdateStatus={handleUpdateStatus}
              />
            ) : (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-bold text-slate-900">Data Pendaftar Magang</h2>

              {/* MAIN CONTAINER */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                
                {/* TABS HEADER */}
                <div className="flex border-b border-slate-200 overflow-x-auto">
                  <button
                    type="button"
                    onClick={() => setPendaftarFilter('all')}
                    className={`px-6 py-3.5 text-xs font-bold transition-all whitespace-nowrap cursor-pointer border-b-2 ${
                      pendaftarFilter === 'all'
                        ? 'border-[#1f877c] text-[#1f877c]'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Semua Pendaftar
                  </button>
                  <button
                    type="button"
                    onClick={() => setPendaftarFilter('verifikasi')}
                    className={`px-6 py-3.5 text-xs font-bold transition-all whitespace-nowrap cursor-pointer border-b-2 ${
                      pendaftarFilter === 'verifikasi'
                        ? 'border-[#1f877c] text-[#1f877c]'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Menunggu Verifikasi ({countVerifikasi})
                  </button>
                  <button
                    type="button"
                    onClick={() => setPendaftarFilter('diterima')}
                    className={`px-6 py-3.5 text-xs font-bold transition-all whitespace-nowrap cursor-pointer border-b-2 ${
                      pendaftarFilter === 'diterima'
                        ? 'border-[#1f877c] text-[#1f877c]'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Diterima ({countDiterima})
                  </button>
                  <button
                    type="button"
                    onClick={() => setPendaftarFilter('ditolak')}
                    className={`px-6 py-3.5 text-xs font-bold transition-all whitespace-nowrap cursor-pointer border-b-2 ${
                      pendaftarFilter === 'ditolak'
                        ? 'border-[#1f877c] text-[#1f877c]'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Ditolak ({countDitolak})
                  </button>
                </div>

                {/* CONTROLS BAR: ITEMS PER PAGE & SEARCH */}
                <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 text-xs">
                  <div className="flex items-center gap-2 text-slate-600 font-medium">
                    <span>Tampilkan</span>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => setItemsPerPage(Number(e.target.value))}
                      className="border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white font-bold text-slate-800 focus:outline-hidden focus:border-[#1f877c]"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                    </select>
                    <span>data per halaman</span>
                  </div>

                  <div className="w-full sm:w-64 relative">
                    <input
                      type="text"
                      placeholder="Cari ..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium focus:outline-hidden focus:border-[#1f877c] focus:ring-1 focus:ring-[#1f877c]"
                    />
                  </div>
                </div>

                {/* TABLE */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-900 font-bold bg-slate-50/50">
                        <th className="py-4 px-4 text-center w-12">No</th>
                        <th className="py-4 px-4">Foto Profil</th>
                        <th className="py-4 px-4">Nama</th>
                        <th className="py-4 px-4">Kategori</th>
                        <th className="py-4 px-4">Tanggal Daftar</th>
                        <th className="py-4 px-4 text-center">Status</th>
                        <th className="py-4 px-4 text-center w-20">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredPendaftar.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-slate-400 font-medium">
                            Tidak ada data pendaftar yang cocok.
                          </td>
                        </tr>
                      ) : (
                        filteredPendaftar.map((p, idx) => (
                          <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-4 px-4 text-center font-bold text-slate-500">
                              {idx + 1}
                            </td>
                            <td className="py-4 px-4">
                              <img
                                src={p.fotoUrl}
                                alt={p.nama}
                                className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-2xs"
                              />
                            </td>
                            <td className="py-4 px-4 font-bold text-slate-900">{p.nama}</td>
                            <td className="py-4 px-4 text-slate-700 max-w-xs leading-relaxed font-medium">
                              {p.kategori}
                            </td>
                            <td className="py-4 px-4 text-slate-600 font-medium whitespace-nowrap">
                              {p.tanggalDaftar}
                            </td>
                            <td className="py-4 px-4 text-center">
                              {p.status === 'Diterima' ? (
                                <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                  Diterima
                                </span>
                              ) : p.status === 'Ditolak' ? (
                                <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                                  Ditolak
                                </span>
                              ) : (
                                <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                  Verifikasi
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-4 text-center">
                              <button
                                type="button"
                                onClick={() => setSelectedPendaftar(p)}
                                className="w-8 h-8 rounded-lg border border-[#1f877c]/30 text-[#1f877c] hover:bg-[#E6F7F3] flex items-center justify-center cursor-pointer transition-all mx-auto"
                                title="Lihat Detail Data"
                              >
                                <span className="material-symbols-outlined text-lg">visibility</span>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* FOOTER PAGINATION */}
                <div className="p-4 sm:p-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                  <span>
                    Menampilkan 1 - {filteredPendaftar.length} dari {filteredPendaftar.length} entri.
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-600 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">chevron_left</span>
                    </button>
                    <button
                      type="button"
                      className="w-8 h-8 rounded-lg bg-[#1f877c] text-white font-bold flex items-center justify-center shadow-2xs cursor-pointer"
                    >
                      1
                    </button>
                    <button
                      type="button"
                      className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-600 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">chevron_right</span>
                    </button>
                  </div>
                </div>

              </div>

            </div>
            )
          )}

          {/* TAB 4: BIMBINGAN MAHASISWA (Matching Screenshot 1, 2, 3) */}
          {activeTab === 'bimbingan' && (
            selectedBimbingan ? (
              <DetailBimbinganView
                bimbingan={selectedBimbingan}
                onBack={() => setSelectedBimbingan(null)}
                onUpdateBimbingan={(updated) => {
                  setBimbinganList((prev) =>
                    prev.map((item) => (item.id === updated.id ? updated : item))
                  );
                  setSelectedBimbingan(updated);
                }}
              />
            ) : (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-bold text-slate-900">Data Bimbingan Mahasiswa</h2>

                {/* MAIN TABLE CONTAINER */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                  
                  {/* TOP CONTROLS */}
                  <div className="p-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                      <span>Tampilkan</span>
                      <select
                        value={bimbinganItemsPerPage}
                        onChange={(e) => setBimbinganItemsPerPage(Number(e.target.value))}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-bold text-slate-800 focus:outline-hidden focus:border-[#1f877c]"
                      >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                      </select>
                      <span>data per halaman</span>
                    </div>

                    <div className="relative min-w-[240px]">
                      <input
                        type="text"
                        placeholder="Cari ..."
                        value={bimbinganSearch}
                        onChange={(e) => setBimbinganSearch(e.target.value)}
                        className="w-full pl-3 pr-8 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-[#1f877c]"
                      />
                    </div>
                  </div>

                  {/* TABLE */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="border-y border-slate-200 text-slate-900 font-bold bg-white">
                          <th className="py-4 px-4 text-center w-12">No</th>
                          <th className="py-4 px-4">Nama Mahasiswa</th>
                          <th className="py-4 px-4">Kategori</th>
                          <th className="py-4 px-4">Judul Project</th>
                          <th className="py-4 px-4">Last Update</th>
                          <th className="py-4 px-4 text-center">Status</th>
                          <th className="py-4 px-4 text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {bimbinganList
                          .filter(
                            (b) =>
                              b.nama.toLowerCase().includes(bimbinganSearch.toLowerCase()) ||
                              b.kategori.toLowerCase().includes(bimbinganSearch.toLowerCase()) ||
                              b.judulProject.toLowerCase().includes(bimbinganSearch.toLowerCase())
                          )
                          .map((student, index) => (
                            <tr key={student.id} className="hover:bg-slate-50/60 transition-colors">
                              <td className="py-4 px-4 text-center font-bold text-slate-400">
                                {index + 1}
                              </td>
                              <td className="py-4 px-4 font-bold text-slate-900">
                                {student.nama}
                              </td>
                              <td className="py-4 px-4 text-slate-600 max-w-[200px] leading-relaxed">
                                {student.kategori}
                              </td>
                              <td className="py-4 px-4 text-slate-600 max-w-[200px] leading-relaxed">
                                {student.judulProject}
                              </td>
                              <td className="py-4 px-4 text-slate-600 whitespace-nowrap">
                                {student.lastUpdate}
                              </td>
                              <td className="py-4 px-4 text-center">
                                <span className="inline-block px-4 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-300">
                                  {student.status}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-center">
                                <button
                                  type="button"
                                  onClick={() => setSelectedBimbingan(student)}
                                  className="p-1.5 rounded-lg border border-[#1f877c] text-[#1f877c] hover:bg-[#E6F7F3] cursor-pointer inline-flex items-center justify-center transition-all"
                                  title="Detail Bimbingan Mahasiswa"
                                >
                                  <span className="material-symbols-outlined text-lg">
                                    visibility
                                  </span>
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>

                  {/* PAGINATION FOOTER */}
                  <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                    <div>
                      Menampilkan 1 - {bimbinganList.length} dari {bimbinganList.length} entri.
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-400 cursor-not-allowed"
                        disabled
                      >
                        <span className="material-symbols-outlined text-sm">chevron_left</span>
                      </button>
                      <button
                        type="button"
                        className="w-8 h-8 rounded-lg bg-[#1f877c] text-white font-bold flex items-center justify-center"
                      >
                        1
                      </button>
                      <button
                        type="button"
                        className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-400 cursor-not-allowed"
                        disabled
                      >
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            )
          )}

        </main>

      </div>

    </div>
  );
}
