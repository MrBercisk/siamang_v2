import { memo, useState } from 'react';
import { InternshipCategory, TimelineSchedule, ApplicationRequirement, ApplicationStatus } from '../types/internship';
import { TimelineCard } from './TimelineCard';
import { NoticeBar } from './NoticeBar';

interface InternshipInfoSectionProps {
  categories: InternshipCategory[];
  schedules: TimelineSchedule[];
  requirements: ApplicationRequirement[];
  applications: ApplicationStatus[];
  onApplyCategory?: (category: InternshipCategory) => void;
  onNavigateRegister?: () => void;
}

// Static data defined outside component to avoid re-creation on every render
const CUSTOM_BIDANG_LIST = [
  {
    id: 'dev1',
    categoryName: 'Bidang Sistem Informasi dan Statistik',
    title: 'Pengembangan Perangkat Lunak',
    badge: 'SIM CUTI',
    description: 'Pengembangan dan pemeliharaan aplikasi internal DISKOMINFOSAN Kota Yogyakarta',
    slotText: '2 Mahasiswa',
    icon: 'code'
  },
  {
    id: 'dev2',
    categoryName: 'Bidang Sistem Informasi dan Statistik',
    title: 'Pengembangan Perangkat Lunak',
    badge: 'SIM CUTI',
    description: 'Pengembangan dan pemeliharaan aplikasi internal DISKOMINFOSAN Kota Yogyakarta',
    slotText: '2 Mahasiswa',
    icon: 'code'
  },
  {
    id: 'dev3',
    categoryName: 'Bidang Sistem Informasi dan Statistik',
    title: 'Pengembangan Perangkat Lunak',
    badge: 'SIM CUTI',
    description: 'Pengembangan dan pemeliharaan aplikasi internal DISKOMINFOSAN Kota Yogyakarta',
    slotText: '2 Mahasiswa',
    icon: 'code'
  }
];

const CUSTOM_REQUIREMENTS_LIST = [
  {
    id: 'req1',
    icon: 'school',
    title: 'Pendidikan',
    description: 'Minimal mahasiswa semester 5 (D3) / semester 7 (S1).'
  },
  {
    id: 'req2',
    icon: 'article',
    title: 'Surat Permohonan Magang & NDA',
    description: 'Mahasiswa wajib memiliki surat permohonan magang dari kampus dan NDA perjanjian magang DISKOMINFOSAN yang dapat di download',
    hasDownloadLink: true
  },
  {
    id: 'req3',
    icon: 'account_circle',
    title: 'Pas Foto',
    description: 'Mahasiswa wajib memiliki pas foto ukuran 3 × 4.'
  },
  {
    id: 'req4',
    icon: 'play_circle',
    title: 'Video Perkenalan',
    description: 'Mahasiswa wajib membuat video perkenalan dengan durasi maksimal 2 menit dan ukuran 20MB.'
  }
];

export const InternshipInfoSection = memo(function InternshipInfoSection({
  schedules,
  onApplyCategory,
  onNavigateRegister,
}: InternshipInfoSectionProps) {
  const [activeTab, setActiveTab] = useState<'timeline' | 'bidang' | 'persyaratan' | 'status'>('bidang');

  // Search state for Status Pendaftaran
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDemoStatus, setSelectedDemoStatus] = useState<'pending' | 'accepted' | 'rejected'>('pending');

  // Use module-level constants instead of re-creating on each render
  const customBidangList = CUSTOM_BIDANG_LIST;
  const customRequirementsList = CUSTOM_REQUIREMENTS_LIST;

  return (
    <section className="bg-slate-50/70 py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Tabs Bar */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-2 md:p-3 mb-8">
          <div className="flex border-b border-slate-100 overflow-x-auto hide-scrollbar space-x-2 md:space-x-8 px-2">
            
            {/* Timeline Tab */}
            <button
              onClick={() => setActiveTab('timeline')}
              className={`flex items-center space-x-2 px-4 py-3.5 text-xs sm:text-sm font-bold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                activeTab === 'timeline'
                  ? 'border-[#1f877c] text-[#1f877c]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="material-symbols-outlined text-lg">calendar_month</span>
              <span>Timeline</span>
            </button>

            {/* Bidang Tersedia Tab */}
            <button
              onClick={() => setActiveTab('bidang')}
              className={`flex items-center space-x-2 px-4 py-3.5 text-xs sm:text-sm font-bold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                activeTab === 'bidang'
                  ? 'border-[#1f877c] text-[#1f877c]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="material-symbols-outlined text-lg">category</span>
              <span>Bidang Tersedia</span>
            </button>

            {/* Persyaratan Tab */}
            <button
              onClick={() => setActiveTab('persyaratan')}
              className={`flex items-center space-x-2 px-4 py-3.5 text-xs sm:text-sm font-bold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                activeTab === 'persyaratan'
                  ? 'border-[#1f877c] text-[#1f877c]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="material-symbols-outlined text-lg">assignment</span>
              <span>Persyaratan</span>
            </button>

            {/* Status Pendaftaran Tab */}
            <button
              onClick={() => setActiveTab('status')}
              className={`flex items-center space-x-2 px-4 py-3.5 text-xs sm:text-sm font-bold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                activeTab === 'status'
                  ? 'border-[#1f877c] text-[#1f877c]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="material-symbols-outlined text-lg">account_box</span>
              <span>Status Pendaftaran</span>
            </button>
          </div>
        </div>

        {/* Tab Panel Content */}
        <div className="space-y-8">

          {/* TAB 1: TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2.5 mb-2">
                <span className="material-symbols-outlined text-[#1f877c] text-2xl">
                  event_note
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  Jadwal Program Magang
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 -mt-4">
                Periode pelaksanaan program magang DISKOMINFOSAN Kota Yogyakarta.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {schedules.map((sched) => (
                  <TimelineCard key={sched.id} schedule={sched} />
                ))}
              </div>

              <NoticeBar />
            </div>
          )}

          {/* TAB 2: BIDANG TERSEDIA (Image 1) */}
          {activeTab === 'bidang' && (
            <div className="space-y-8">
              {/* Section Header */}
              <div className="flex items-start gap-3">
                <div className="text-[#1f877c] mt-0.5">
                  <span className="material-symbols-outlined text-2xl font-bold">category</span>
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#1e293b]">
                    Bidang & Kategori yang Tersedia
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Pilih bidang sesuai minat dan kompetensi anda
                  </p>
                </div>
              </div>

              {/* Grid Cards (3 Column Layout) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {customBidangList.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-slate-200/90 p-6 flex flex-col justify-between shadow-2xs hover:shadow-md transition-shadow"
                  >
                    <div>
                      {/* Top Row: Icon Badge & Category Text */}
                      <div className="flex items-start gap-3.5 mb-3">
                        <div className="w-11 h-11 rounded-2xl bg-[#D1FAE5] text-[#1f877c] flex items-center justify-center shrink-0 shadow-2xs">
                          <span className="material-symbols-outlined text-xl font-bold">
                            {item.icon}
                          </span>
                        </div>
                        <div className="flex-1">
                          <span className="text-[11px] font-medium text-slate-400 block mb-0.5">
                            {item.categoryName}
                          </span>
                          <h4 className="text-sm sm:text-base font-bold text-[#1e293b] leading-tight">
                            {item.title}
                          </h4>
                          <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-[#1f877c] bg-[#D1FAE5] border border-emerald-200">
                            {item.badge}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-600 leading-relaxed mt-4">
                        {item.description}
                      </p>
                    </div>

                    {/* Footer Row */}
                    <div className="border-t border-slate-100 mt-6 pt-4 flex items-center justify-between">
                      <span className="text-xs text-slate-500">Slot Tersedia</span>
                      <span className="text-xs font-bold text-[#1f877c]">{item.slotText}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Banner */}
              <div className="bg-[#E6F7F3] rounded-2xl p-6 sm:p-8 border border-emerald-100 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xs">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-[#D1FAE5] text-[#1f877c] flex items-center justify-center shrink-0 shadow-2xs">
                    <span className="material-symbols-outlined text-3xl">search</span>
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-[#1e293b]">
                      Tidak menemukan bidang yang sesuai?
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                      Bidang dapat berubah sesuai dengan kebutuhan instansi. Pantau informasi terbaru secara berkala.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    window.open('https://wa.me/628123456789', '_blank');
                  }}
                  className="bg-[#1f877c] hover:bg-[#196e65] text-white px-6 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shrink-0 shadow-xs cursor-pointer transition-colors"
                >
                  <span>Hubungi Kami</span>
                  <span className="material-symbols-outlined text-lg">chat</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: PERSYARATAN (Image 2) */}
          {activeTab === 'persyaratan' && (
            <div className="space-y-8">
              {/* Section Header */}
              <div className="flex items-start gap-3">
                <div className="text-[#1f877c] mt-0.5">
                  <span className="material-symbols-outlined text-2xl font-bold">assignment</span>
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#1e293b]">
                    Persyaratan Umum
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Pastikan diri Anda sesuai dengan persyaratan yang telah ditetapkan.
                  </p>
                </div>
              </div>

              {/* Grid Cards (4 Column Layout) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {customRequirementsList.map((req) => (
                  <div
                    key={req.id}
                    className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-start"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-[#D1FAE5] text-[#1f877c] flex items-center justify-center mb-5 shadow-2xs">
                      <span className="material-symbols-outlined text-2xl font-bold">
                        {req.icon}
                      </span>
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-[#1e293b] mb-2 leading-tight">
                      {req.title}
                    </h4>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {req.description}
                      {req.hasDownloadLink && (
                        <span>{' '}
                          <a
                            href="#download"
                            onClick={(e) => {
                              e.preventDefault();
                              alert('Munduh berkas NDA & Surat Permohonan Magang...');
                            }}
                            className="text-[#1f877c] font-bold underline hover:text-[#196e65]"
                          >
                            DISINI
                          </a>
                        </span>
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: STATUS PENDAFTARAN (Image 3, 4, 5, 6) */}
          {activeTab === 'status' && (
            <div className="space-y-8">
              {/* Section Header */}
              <div className="flex items-start gap-3">
                <div className="text-[#1f877c] mt-0.5">
                  <span className="material-symbols-outlined text-2xl font-bold">account_box</span>
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#1e293b]">
                    Cek Status Pendaftaran
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Masukkan nomor pendaftaran atau email terdaftar untuk melihat progress seleksi Anda.
                  </p>
                </div>
              </div>

              {/* Search Card & Illustration (Image 3) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs">
                {/* Left Search Form (7 cols) */}
                <div className="lg:col-span-7 space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-[#1e293b] mb-2">
                      Nomor Pendaftaran atau email
                    </label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Contoh: 5001234556 atau leona@gmail.com"
                        className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:border-[#1f877c] focus:ring-2 focus:ring-[#1f877c]/20 text-xs sm:text-sm transition-colors text-slate-900 placeholder:text-slate-400"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (searchQuery.toLowerCase().includes('diterima') || searchQuery.toLowerCase().includes('lolos')) {
                            setSelectedDemoStatus('accepted');
                          } else if (searchQuery.toLowerCase().includes('tolak') || searchQuery.toLowerCase().includes('gagal')) {
                            setSelectedDemoStatus('rejected');
                          } else {
                            setSelectedDemoStatus('pending');
                          }
                        }}
                        className="bg-[#1f877c] hover:bg-[#196e65] text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-colors"
                      >
                        <span>Cek Status</span>
                        <span className="material-symbols-outlined text-lg">search</span>
                      </button>
                    </div>
                  </div>

                  {/* Info Notice */}
                  <div className="p-3.5 bg-[#ECFDF5] border border-emerald-100 rounded-xl flex items-center gap-2.5 text-xs text-slate-700">
                    <span className="material-symbols-outlined text-lg text-[#1f877c] shrink-0">
                      info
                    </span>
                    <span>Belum mendapatkan nomor pendaftaran? Cek email konfirmasi Anda.</span>
                  </div>

                  {/* Demo Status Switcher Bar */}
                  <div className="pt-2 flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Simulasi Status:</span>
                    <button
                      type="button"
                      onClick={() => setSelectedDemoStatus('pending')}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        selectedDemoStatus === 'pending'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Pending Administrasi
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedDemoStatus('accepted')}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        selectedDemoStatus === 'accepted'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Diterima
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedDemoStatus('rejected')}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        selectedDemoStatus === 'rejected'
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Tidak Diterima
                    </button>
                  </div>
                </div>

                {/* Right Vector Illustration (5 cols) */}
                <div className="lg:col-span-5 flex justify-center">
                  <div className="w-full max-w-xs flex items-center justify-center p-4 bg-slate-50/60 rounded-2xl border border-slate-100">
                    <img
                      src="https://illustrations.popsy.co/emerald/checking-boxes.svg"
                      alt="Check Status Illustration"
                      className="w-full h-auto max-h-48 object-contain"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://illustrations.popsy.co/teal/work-from-home.svg';
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* DYNAMIC RESULT CARDS ACCORDING TO SELECTED STATUS */}

              {/* STATE 1: PENDING ADMINISTRASI (Image 4) */}
              {selectedDemoStatus === 'pending' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Applicant Info */}
                    <div className="lg:col-span-5 space-y-5">
                      <div className="flex items-center gap-4">
                        <img
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                          alt="LEONA STRIVE"
                          className="w-20 h-20 rounded-full object-cover border-2 border-slate-200 shadow-2xs"
                          loading="lazy"
                          decoding="async"
                        />
                        <div>
                          <h4 className="text-lg font-extrabold text-[#1e293b]">LEONA STRIVE</h4>
                          <p className="text-xs text-slate-400">Nomor Pendaftaran</p>
                          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200">
                            <span className="material-symbols-outlined text-sm">info</span>
                            <span>Pending Administrasi</span>
                          </div>
                        </div>
                      </div>

                      {/* Detail Pendaftaran */}
                      <div className="pt-2">
                        <h5 className="text-xs sm:text-sm font-bold text-[#1e293b] mb-3">
                          Detail Pendaftaran
                        </h5>
                        <div className="space-y-3 text-xs sm:text-sm">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2 text-slate-500">
                              <span className="material-symbols-outlined text-base">calendar_today</span>
                              <span>Tanggal Daftar</span>
                            </span>
                            <span className="font-bold text-[#1e293b]">Nomor Pendaftaran</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2 text-slate-500">
                              <span className="material-symbols-outlined text-base">category</span>
                              <span>Program/Bidang</span>
                            </span>
                            <span className="font-bold text-[#1e293b]">Nomor Pendaftaran</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2 text-slate-500">
                              <span className="material-symbols-outlined text-base">mail</span>
                              <span>Email</span>
                            </span>
                            <span className="font-bold text-[#1e293b]">Nomor Pendaftaran</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Progres Seleksi */}
                    <div className="lg:col-span-7 space-y-6">
                      <h5 className="text-base font-bold text-[#1e293b]">Progres Seleksi</h5>

                      {/* Stepper Timeline */}
                      <div className="grid grid-cols-4 gap-2 text-center relative">
                        {/* Line Background */}
                        <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 -z-10" />
                        <div className="absolute top-4 left-6 w-1/3 h-0.5 bg-emerald-500 -z-10" />

                        {/* Step 1 */}
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                            1
                          </div>
                          <span className="text-xs font-bold text-[#1e293b] mt-2 block">Pendaftaran Diterima</span>
                          <span className="text-[11px] font-bold text-emerald-600 mt-1">05 Mei 2026<br />10:00 WIB</span>
                        </div>

                        {/* Step 2 */}
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                            2
                          </div>
                          <span className="text-xs font-bold text-[#1e293b] mt-2 block">Verifikasi Dokumen</span>
                          <span className="text-[11px] font-bold text-amber-600 mt-1">Sedang Diverifikasi</span>
                        </div>

                        {/* Step 3 */}
                        <div className="flex flex-col items-center opacity-60">
                          <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 font-bold text-xs flex items-center justify-center">
                            3
                          </div>
                          <span className="text-xs font-bold text-slate-600 mt-2 block">Seleksi Mentor</span>
                          <span className="text-[11px] text-slate-400 mt-1">Menunggu</span>
                        </div>

                        {/* Step 4 */}
                        <div className="flex flex-col items-center opacity-60">
                          <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 font-bold text-xs flex items-center justify-center">
                            4
                          </div>
                          <span className="text-xs font-bold text-slate-600 mt-2 block">Pengumuman Final</span>
                          <span className="text-[11px] text-slate-400 mt-1">Menunggu</span>
                        </div>
                      </div>

                      {/* Alert Message Box */}
                      <div className="p-4 bg-amber-50/90 border border-amber-200 rounded-2xl flex items-center gap-3 text-xs text-amber-900 mt-6">
                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-lg">info</span>
                        </div>
                        <p className="leading-relaxed">
                          Dokumen Anda sedang dalam proses verifikasi oleh tim kami. Mohon tunggu informasi selanjutnya melalui email dan aplikasi SI AMANG.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Assistance & Info Cards */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-5 bg-[#E6F7F3] rounded-2xl p-6 border border-emerald-100 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-[#D1FAE5] text-[#1f877c] flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-2xl">support_agent</span>
                        </div>
                        <div>
                          <h5 className="text-sm font-bold text-[#1e293b]">Butuh Bantuan?</h5>
                          <p className="text-xs text-slate-500 mt-0.5">Jika ada kendala atau pertanyaan terkait pendaftaran, silahkan hubungi tim kami.</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => window.open('https://wa.me/628123456789', '_blank')}
                        className="bg-[#1f877c] hover:bg-[#196e65] text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shrink-0 cursor-pointer shadow-2xs"
                      >
                        <span>Hubungi Kami</span>
                        <span className="material-symbols-outlined text-sm">chat</span>
                      </button>
                    </div>

                    <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/90 flex items-start gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-[#D1FAE5] text-[#1f877c] flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-xl">info</span>
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-[#1e293b] mb-1.5">Informasi Penting</h5>
                        <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4">
                          <li>Pastikan dokumen yang Anda unggah sesuai dengan persyaratan yang ditentukan.</li>
                          <li>Pengumuman hasil seleksi akan dikirimkan melalui email terdaftar.</li>
                          <li>Seluruh proses seleksi tidak dipungut biaya apapun.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STATE 2: DITERIMA (Image 5) */}
              {selectedDemoStatus === 'accepted' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Applicant Info */}
                    <div className="lg:col-span-5 space-y-5">
                      <div className="flex items-center gap-4">
                        <img
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                          alt="LEONA STRIVE"
                          className="w-20 h-20 rounded-full object-cover border-2 border-slate-200 shadow-2xs"
                        />
                        <div>
                          <h4 className="text-lg font-extrabold text-[#1e293b]">LEONA STRIVE</h4>
                          <p className="text-xs text-slate-400">Nomor Pendaftaran</p>
                          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-300">
                            <span className="material-symbols-outlined text-sm">check_circle</span>
                            <span>Diterima</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs font-bold text-[#1f877c] leading-snug">
                        Selamat! Anda dinyatakan lolos seleksi magang DISKOMINFOSAN Kota Yogyakarta
                      </p>

                      {/* Detail Pendaftaran */}
                      <div className="pt-1">
                        <h5 className="text-xs sm:text-sm font-bold text-[#1e293b] mb-3">
                          Detail Pendaftaran
                        </h5>
                        <div className="space-y-3 text-xs sm:text-sm">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2 text-slate-500">
                              <span className="material-symbols-outlined text-base">calendar_today</span>
                              <span>Tanggal Daftar</span>
                            </span>
                            <span className="font-bold text-[#1e293b]">Nomor Pendaftaran</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2 text-slate-500">
                              <span className="material-symbols-outlined text-base">category</span>
                              <span>Program/Bidang</span>
                            </span>
                            <span className="font-bold text-[#1e293b]">Nomor Pendaftaran</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2 text-slate-500">
                              <span className="material-symbols-outlined text-base">mail</span>
                              <span>Email</span>
                            </span>
                            <span className="font-bold text-[#1e293b]">Nomor Pendaftaran</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Progres Seleksi (All Green) */}
                    <div className="lg:col-span-7 space-y-6">
                      <h5 className="text-base font-bold text-[#1e293b]">Progres Seleksi</h5>

                      {/* Stepper Timeline */}
                      <div className="grid grid-cols-4 gap-2 text-center relative">
                        <div className="absolute top-4 left-6 right-6 h-0.5 bg-emerald-500 -z-10" />

                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                            1
                          </div>
                          <span className="text-xs font-bold text-[#1e293b] mt-2 block">Pendaftaran Diterima</span>
                          <span className="text-[11px] font-bold text-emerald-600 mt-1">05 Mei 2026<br />10:00 WIB</span>
                        </div>

                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                            2
                          </div>
                          <span className="text-xs font-bold text-[#1e293b] mt-2 block">Verifikasi Dokumen</span>
                          <span className="text-[11px] font-bold text-emerald-600 mt-1">08 Mei 2026<br />14:00 WIB</span>
                        </div>

                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                            3
                          </div>
                          <span className="text-xs font-bold text-[#1e293b] mt-2 block">Seleksi Mentor</span>
                          <span className="text-[11px] font-bold text-emerald-600 mt-1">11 Mei 2026<br />11:00 WIB</span>
                        </div>

                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                            4
                          </div>
                          <span className="text-xs font-bold text-[#1e293b] mt-2 block">Pengumuman Final</span>
                          <span className="text-[11px] font-bold text-emerald-600 mt-1">12 Mei 2026<br />09:00 WIB</span>
                        </div>
                      </div>

                      {/* Alert Message Box with Button */}
                      <div className="p-4 bg-[#ECFDF5] border border-emerald-300 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#005c55] mt-6">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-xl text-[#1f877c] shrink-0">info</span>
                          <p className="leading-relaxed">
                            Anda telah diterima sebagai peserta magang. Silakan cek jadwal dan informasi selanjutnya pada aplikasi SI AMANG.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => alert('Membuka jadwal magang...')}
                          className="bg-[#1f877c] hover:bg-[#196e65] text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shrink-0 shadow-2xs cursor-pointer transition-colors"
                        >
                          <span>Lihat Jadwal</span>
                          <span className="material-symbols-outlined text-base">login</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Dokumen & Informasi Selanjutnya Section */}
                  <div>
                    <h5 className="text-sm font-bold text-[#1e293b] mb-4">
                      Dokumen & Informasi Selanjutnya
                    </h5>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Card 1 */}
                      <div className="bg-[#E6F7F3] rounded-2xl p-5 border border-emerald-100 flex flex-col justify-between">
                        <div>
                          <span className="material-symbols-outlined text-2xl text-[#1f877c] mb-2 block">
                            assignment
                          </span>
                          <h6 className="text-sm font-bold text-[#1e293b] mb-1">Surat Penerimaan</h6>
                          <p className="text-xs text-slate-600 mb-4">
                            Unduh surat penerimaan untuk keperluan administrasi
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => alert('Mengunduh Surat Penerimaan (PDF)...')}
                          className="w-fit bg-[#1f877c] hover:bg-[#196e65] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          <span>Unduh PDF</span>
                          <span className="material-symbols-outlined text-base">download</span>
                        </button>
                      </div>

                      {/* Card 2 */}
                      <div className="bg-[#E6F7F3] rounded-2xl p-5 border border-emerald-100 flex flex-col justify-between">
                        <div>
                          <span className="material-symbols-outlined text-2xl text-[#1f877c] mb-2 block">
                            folder
                          </span>
                          <h6 className="text-sm font-bold text-[#1e293b] mb-1">Panduan Peserta</h6>
                          <p className="text-xs text-slate-600 mb-4">
                            Panduan lengkap kegiatan magang bagi peserta
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => window.open('https://wa.me/628123456789', '_blank')}
                          className="w-fit bg-[#1f877c] hover:bg-[#196e65] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          <span>Lihat Panduan</span>
                          <span className="material-symbols-outlined text-base">chat</span>
                        </button>
                      </div>

                      {/* Card 3 */}
                      <div className="bg-[#E6F7F3] rounded-2xl p-5 border border-emerald-100 flex flex-col justify-between">
                        <div>
                          <span className="material-symbols-outlined text-2xl text-[#1f877c] mb-2 block">
                            call
                          </span>
                          <h6 className="text-sm font-bold text-[#1e293b] mb-1">Hubungi Mentor</h6>
                          <p className="text-xs text-slate-600 mb-4">
                            Informasi mentor dan kontak dapat dilihat di SI AMANG.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => window.open('https://wa.me/628123456789', '_blank')}
                          className="w-fit bg-[#1f877c] hover:bg-[#196e65] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          <span>Buka SI AMANG</span>
                          <span className="material-symbols-outlined text-base">chat</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STATE 3: TIDAK DITERIMA / DITOLAK (Image 6) */}
              {selectedDemoStatus === 'rejected' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Applicant Info */}
                    <div className="lg:col-span-5 space-y-5">
                      <div className="flex items-center gap-4">
                        <img
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                          alt="LEONA STRIVE"
                          className="w-20 h-20 rounded-full object-cover border-2 border-slate-200 shadow-2xs"
                        />
                        <div>
                          <h4 className="text-lg font-extrabold text-[#1e293b]">LEONA STRIVE</h4>
                          <p className="text-xs text-slate-400">Nomor Pendaftaran</p>
                          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-rose-700 bg-rose-50 border border-rose-300">
                            <span className="material-symbols-outlined text-sm">cancel</span>
                            <span>Tidak Diterima</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs font-bold text-rose-600 leading-snug">
                        Mohon maaf, Anda belum lolos seleksi magang DISKOMINFOSAN Kota Yogyakarta
                      </p>

                      {/* Detail Pendaftaran */}
                      <div className="pt-1">
                        <h5 className="text-xs sm:text-sm font-bold text-[#1e293b] mb-3">
                          Detail Pendaftaran
                        </h5>
                        <div className="space-y-3 text-xs sm:text-sm">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2 text-slate-500">
                              <span className="material-symbols-outlined text-base">calendar_today</span>
                              <span>Tanggal Daftar</span>
                            </span>
                            <span className="font-bold text-[#1e293b]">Nomor Pendaftaran</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2 text-slate-500">
                              <span className="material-symbols-outlined text-base">category</span>
                              <span>Program/Bidang</span>
                            </span>
                            <span className="font-bold text-[#1e293b]">Nomor Pendaftaran</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2 text-slate-500">
                              <span className="material-symbols-outlined text-base">mail</span>
                              <span>Email</span>
                            </span>
                            <span className="font-bold text-[#1e293b]">Nomor Pendaftaran</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Progres Seleksi (Failed) */}
                    <div className="lg:col-span-7 space-y-6">
                      <h5 className="text-base font-bold text-[#1e293b]">Progres Seleksi</h5>

                      {/* Stepper Timeline */}
                      <div className="grid grid-cols-4 gap-2 text-center relative">
                        <div className="absolute top-4 left-6 w-1/3 h-0.5 bg-emerald-500 -z-10" />
                        <div className="absolute top-4 left-1/3 right-6 h-0.5 bg-rose-500 -z-10" />

                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                            1
                          </div>
                          <span className="text-xs font-bold text-[#1e293b] mt-2 block">Pendaftaran Diterima</span>
                          <span className="text-[11px] font-bold text-emerald-600 mt-1">05 Mei 2026<br />10:00 WIB</span>
                        </div>

                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-rose-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                            2
                          </div>
                          <span className="text-xs font-bold text-[#1e293b] mt-2 block">Verifikasi Dokumen</span>
                          <span className="text-[11px] font-bold text-emerald-600 mt-1">08 Mei 2026<br />14:00 WIB</span>
                        </div>

                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-rose-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                            3
                          </div>
                          <span className="text-xs font-bold text-rose-600 mt-2 block">Seleksi Mentor</span>
                          <span className="text-[11px] font-bold text-rose-600 mt-1">11 Mei 2026<br />11:00 WIB</span>
                        </div>

                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-rose-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                            4
                          </div>
                          <span className="text-xs font-bold text-rose-600 mt-2 block">Pengumuman Final</span>
                          <span className="text-[11px] font-bold text-rose-600 mt-1">11 Mei 2026<br />11:00 WIB</span>
                        </div>
                      </div>

                      {/* Alert Message Box (Rose) */}
                      <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-xs text-rose-800 mt-6">
                        <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-lg">info</span>
                        </div>
                        <p className="leading-relaxed">
                          Dokumen anda belum sesuai dengan ketentuan yang dibutuhkan. Silakan perbaiki dan daftar kembali pada periode selanjutnya.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Encouragement Card */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
                    <div>
                      <h5 className="text-base font-bold text-[#1e293b]">Tetap Semangat!</h5>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Terus tingkatkan kemampuan Anda dan jangan ragu untuk mendaftar kembali di periode berikutnya.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab('bidang')}
                      className="bg-[#1f877c] hover:bg-[#196e65] text-white px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm shrink-0 shadow-2xs cursor-pointer transition-colors"
                    >
                      Lihat Lowongan
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </section>
  );
});
