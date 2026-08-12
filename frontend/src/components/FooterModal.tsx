import React, { useState, FormEvent } from 'react';

export type FooterModalType =
  | 'pedoman'
  | 'panduan-magang'
  | 'faq'
  | 'panduan-pendaftaran'
  | 'cek-status'
  | 'hubungi-admin'
  | 'kebijakan-privasi'
  | 'syarat-ketentuan'
  | null;

interface FooterModalProps {
  type: FooterModalType;
  onClose: () => void;
  onNavigate?: (page: 'home' | 'info' | 'register' | 'login' | 'dashboard') => void;
}

export function FooterModal({ type, onClose, onNavigate }: FooterModalProps) {
  const [searchCode, setSearchCode] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  if (!type) return null;

  const handleSearchStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCode.trim()) return;
    
    // Demo search simulation
    if (searchCode.toUpperCase().includes('MG') || searchCode.length > 3) {
      setSearchResult({
        id: searchCode.toUpperCase(),
        name: 'Siswa / Mahasiswa Pendaftar',
        institution: 'Universitas Gadjah Mada',
        division: 'Bidang Aplikasi Informatika (APTIKA)',
        status: 'Dalam Proses Seleksi Berkas',
        date: '10 Februari 2026',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-300'
      });
    } else {
      setSearchResult({
        notFound: true,
        message: 'Nomor Pendaftaran tidak ditemukan. Pastikan Anda memasukkan kode pendaftaran atau email yang terdaftar.'
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#1f877c] text-white px-6 py-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl text-white">
                {type === 'pedoman' && 'menu_book'}
                {type === 'panduan-magang' && 'map'}
                {type === 'faq' && 'help'}
                {type === 'panduan-pendaftaran' && 'assignment'}
                {type === 'cek-status' && 'published_with_changes'}
                {type === 'hubungi-admin' && 'support_agent'}
                {type === 'kebijakan-privasi' && 'security'}
                {type === 'syarat-ketentuan' && 'gavel'}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">
                {type === 'pedoman' && 'Pedoman Pelaksanaan Magang'}
                {type === 'panduan-magang' && 'Panduan Magang DISKOMINFOSAN'}
                {type === 'faq' && 'Pertanyaan Sering Diajukan (FAQ)'}
                {type === 'panduan-pendaftaran' && 'Panduan Pendaftaran Magang'}
                {type === 'cek-status' && 'Cek Status Pendaftaran'}
                {type === 'hubungi-admin' && 'Hubungi Admin DISKOMINFOSAN'}
                {type === 'kebijakan-privasi' && 'Kebijakan Privasi'}
                {type === 'syarat-ketentuan' && 'Syarat & Ketentuan'}
              </h3>
              <p className="text-xs text-teal-100 font-medium">SI AMANG - Kota Yogyakarta</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Tutup modal"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700 text-sm leading-relaxed">
          {/* 1. PEDOMAN */}
          {type === 'pedoman' && (
            <div className="space-y-4">
              <div className="p-4 bg-teal-50/80 rounded-xl border border-teal-100 text-[#005c55]">
                <h4 className="font-bold mb-1 flex items-center gap-2">
                  <span className="material-symbols-outlined">info</span> Pedoman Umum Peserta Magang
                </h4>
                <p className="text-xs text-slate-600">
                  Pedoman ini wajib dipatuhi oleh seluruh mahasiswa/siswa yang melaksanakan kegiatan magang di lingkungan Dinas Komunikasi Informatika dan Persandian Kota Yogyakarta.
                </p>
              </div>

              <div className="space-y-3">
                <h5 className="font-bold text-slate-800 text-base">1. Jam Kerja dan Kehadiran</h5>
                <ul className="list-disc pl-5 space-y-1 text-slate-600 text-xs sm:text-sm">
                  <li>Jam operasional magang: Senin s.d. Jumat pukul 08.00 - 16.00 WIB.</li>
                  <li>Peserta wajib melakukan presisi kehadiran melalui sistem SI AMANG setiap hari kerja.</li>
                  <li>Toleransi keterlambatan maksimal 15 menit dengan pemberitahuan kepada pembimbing lapangan.</li>
                </ul>

                <h5 className="font-bold text-slate-800 text-base pt-2">2. Tata Tertib & Pakaian</h5>
                <ul className="list-disc pl-5 space-y-1 text-slate-600 text-xs sm:text-sm">
                  <li>Mengenakan pakaian rapi, sopan, dan berkerah (Kemeja/Batik) serta sepatu tertutup.</li>
                  <li>Mengenakan ID Card / Kartu Tanda Peserta Magang selama berada di lingkungan kantor.</li>
                  <li>Menjaga kerahasiaan data dan dokumen internal Pemerintah Kota Yogyakarta.</li>
                </ul>

                <h5 className="font-bold text-slate-800 text-base pt-2">3. Laporan & Evaluasi Magang</h5>
                <ul className="list-disc pl-5 space-y-1 text-slate-600 text-xs sm:text-sm">
                  <li>Mengisi Logbook Harian pada dashboard SI AMANG.</li>
                  <li>Menyusun Laporan Akhir Magang di bawah bimbingan Pembimbing Lapangan.</li>
                  <li>Sertifikat Magang diterbitkan setelah seluruh laporan disetujui.</li>
                </ul>
              </div>
            </div>
          )}

          {/* 2. PANDUAN MAGANG */}
          {type === 'panduan-magang' && (
            <div className="space-y-4">
              <p className="text-slate-600">
                Alur dan siklus lengkap pelaksanaan program magang di DISKOMINFOSAN Kota Yogyakarta dari pendaftaran hingga penyelesaian:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="w-7 h-7 rounded-lg bg-[#005c55] text-white flex items-center justify-center font-bold text-xs mb-2">1</div>
                  <h5 className="font-bold text-slate-800 mb-1">Pengajuan & Seleksi</h5>
                  <p className="text-xs text-slate-500">Mendaftar online, melengkapi surat pengantar universitas, proposal, dan CV via SI AMANG.</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="w-7 h-7 rounded-lg bg-[#005c55] text-white flex items-center justify-center font-bold text-xs mb-2">2</div>
                  <h5 className="font-bold text-slate-800 mb-1">Verifikasi & Konfirmasi</h5>
                  <p className="text-xs text-slate-500">Tim DISKOMINFOSAN meninjau kuota dan kualifikasi. Hasil dikirim via email & dashboard.</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="w-7 h-7 rounded-lg bg-[#005c55] text-white flex items-center justify-center font-bold text-xs mb-2">3</div>
                  <h5 className="font-bold text-slate-800 mb-1">Onboarding & Orientasi</h5>
                  <p className="text-xs text-slate-500">Penerimaan resmi, pembagian Pembimbing Lapangan, dan penentuan project assignment.</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="w-7 h-7 rounded-lg bg-[#005c55] text-white flex items-center justify-center font-bold text-xs mb-2">4</div>
                  <h5 className="font-bold text-slate-800 mb-1">Sertifikasi & Penilaian</h5>
                  <p className="text-xs text-slate-500">Pengisian logbook harian, presentasi hasil karya, serta penerbitan Sertifikat Magang Resmi.</p>
                </div>
              </div>
            </div>
          )}

          {/* 3. FAQ */}
          {type === 'faq' && (
            <div className="space-y-3">
              {[
                {
                  q: 'Siapa saja yang dapat mendaftar magang di DISKOMINFOSAN?',
                  a: 'Mahasiswa D3/D4/S1 atau Siswa SMK jurusan terkait (TI, Informatika, Sistem Informasi, Komunikasi, DKV, Keamanan Siber, Persandian, Statistik, dan Hukum/Admin Publik).'
                },
                {
                  q: 'Berapa lama durasi magang yang diperbolehkan?',
                  a: 'Durasi magang standar berkisar antara 1 bulan hingga 6 bulan (termasuk program Kampus Merdeka / MBKM).'
                },
                {
                  q: 'Apakah pendaftaran magang dikenakan biaya?',
                  a: 'Tidak. Seluruh proses pendaftaran dan pelaksanaan magang di DISKOMINFOSAN Kota Yogyakarta GRATIS tanpa pemungutan biaya apapun.'
                },
                {
                  q: 'Berapa lama proses verifikasi berkas pendaftaran?',
                  a: 'Proses verifikasi berkas membutuhkan waktu sekitar 3 - 5 hari kerja setelah pendaftaran disubmit.'
                },
                {
                  q: 'Apakah bisa mendaftar secara berkelompok?',
                  a: 'Bisa. Setiap anggota kelompok membuat akun masing-masing dan mencantumkan nama institusi/kelompok yang sama.'
                }
              ].map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <h5 className="font-bold text-slate-800 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#005c55] text-base">help_outline</span>
                    {item.q}
                  </h5>
                  <p className="text-xs text-slate-600 pl-6 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          )}

          {/* 4. PANDUAN PENDAFTARAN */}
          {type === 'panduan-pendaftaran' && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs">
                <p className="font-bold flex items-center gap-1.5 mb-1">
                  <span className="material-symbols-outlined text-sm">warning</span> Dokumen Persyaratan Pendaftaran
                </p>
                <p>Siapkan berkas dalam format PDF / JPG (Maksimal 2MB per file):</p>
                <ul className="list-disc pl-5 mt-1 space-y-0.5">
                  <li>Surat Pengantar Resmi dari Kampus/Sekolah (Ditujukan kepada Kepala DISKOMINFOSAN Kota Yogyakarta)</li>
                  <li>Proposal Magang / Rencana Kegiatan</li>
                  <li>Curriculum Vitae (CV) & Transkrip Nilai Terakhir</li>
                  <li>Pas Foto Formal (Background Merah/Biru)</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h5 className="font-bold text-slate-800">Langkah Pendaftaran:</h5>
                <ol className="list-decimal pl-5 space-y-2 text-xs sm:text-sm text-slate-600">
                  <li>Klik tombol <strong className="text-[#005c55]">Daftar Sekarang</strong> di bagian atas menu.</li>
                  <li>Isi formulir registrasi akun dengan nama lengkap, email aktif, institusi, dan password.</li>
                  <li>Pilih bidang magang yang sesuai (APTIKA, IKP, Persandian, Statistik, dll).</li>
                  <li>Unggah dokumen persyaratan yang diperlukan.</li>
                  <li>Pantau status pendaftaran melalui menu <strong className="text-[#005c55]">Dashboard Saya</strong> atau fitur Cek Status.</li>
                </ol>
              </div>

              {onNavigate && (
                <div className="pt-2 text-center">
                  <button
                    onClick={() => {
                      onClose();
                      onNavigate('register');
                    }}
                    className="bg-[#005c55] text-white px-5 py-2.5 rounded-full font-bold text-xs hover:bg-[#0f766e] transition-colors"
                  >
                    Mulai Pendaftaran Akun Sekarang
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 5. CEK STATUS PENDAFTARAN */}
          {type === 'cek-status' && (
            <div className="space-y-4">
              <p className="text-slate-600 text-xs sm:text-sm">
                Masukkan Kode Pendaftaran atau Email terdaftar untuk melacak status pengajuan magang Anda secara langsung:
              </p>

              <form onSubmit={handleSearchStatus} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Contoh: MG-2026-0012 atau email@kampus.ac.id"
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#005c55] text-xs sm:text-sm"
                  required
                />
                <button
                  type="submit"
                  className="bg-[#005c55] text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm hover:bg-[#0f766e] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">search</span>
                  Cek
                </button>
              </form>

              {searchResult && !searchResult.notFound && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div>
                      <span className="text-xs font-bold text-slate-500 block">Kode Pendaftaran</span>
                      <span className="text-sm font-extrabold text-[#005c55]">{searchResult.id}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${searchResult.badgeColor}`}>
                      {searchResult.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 block">Institusi:</span>
                      <span className="font-semibold text-slate-700">{searchResult.institution}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Pilihan Bidang:</span>
                      <span className="font-semibold text-slate-700">{searchResult.division}</span>
                    </div>
                  </div>
                </div>
              )}

              {searchResult && searchResult.notFound && (
                <div className="p-4 bg-rose-50 text-rose-800 rounded-xl border border-rose-200 text-xs">
                  {searchResult.message}
                </div>
              )}
            </div>
          )}

          {/* 6. HUBUNGI ADMIN */}
          {type === 'hubungi-admin' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-3 hover:bg-emerald-100 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined">chat</span>
                  </div>
                  <div>
                    <span className="font-bold text-emerald-900 block text-xs sm:text-sm">WhatsApp Admin</span>
                    <span className="text-[11px] text-emerald-700">+62 812-3456-7890</span>
                  </div>
                </a>

                <div className="p-4 bg-sky-50 rounded-xl border border-sky-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined">call</span>
                  </div>
                  <div>
                    <span className="font-bold text-sky-900 block text-xs sm:text-sm">Telepon Kantor</span>
                    <span className="text-[11px] text-sky-700">(0274) 515865</span>
                  </div>
                </div>
              </div>

              {contactSubmitted ? (
                <div className="p-4 bg-teal-50 text-[#005c55] rounded-xl border border-teal-200 text-center font-bold text-xs sm:text-sm">
                  Pesan Anda telah berhasil terkirim. Tim Layanan Magang DISKOMINFOSAN akan merespons melalui email Anda.
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setContactSubmitted(true);
                  }}
                  className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200"
                >
                  <h5 className="font-bold text-slate-800 text-xs sm:text-sm">Kirim Pesan Langsung</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Nama Lengkap"
                      required
                      className="px-3 py-2 bg-white rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-[#005c55]"
                    />
                    <input
                      type="email"
                      placeholder="Alamat Email"
                      required
                      className="px-3 py-2 bg-white rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-[#005c55]"
                    />
                  </div>
                  <textarea
                    placeholder="Tuliskan pertanyaan atau kendala Anda secara rinci..."
                    rows={3}
                    required
                    className="w-full px-3 py-2 bg-white rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-[#005c55]"
                  ></textarea>
                  <button
                    type="submit"
                    className="bg-[#005c55] text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-[#0f766e] transition-colors cursor-pointer"
                  >
                    Kirim Pertanyaan
                  </button>
                </form>
              )}
            </div>
          )}

          {/* 7. KEBIJAKAN PRIVASI */}
          {type === 'kebijakan-privasi' && (
            <div className="space-y-3 text-xs sm:text-sm text-slate-600">
              <p>
                Dinas Komunikasi Informatika dan Persandian (DISKOMINFOSAN) Kota Yogyakarta berkomitmen penuh untuk melindungi privasi dan keamanan data pribadi calon peserta magang.
              </p>

              <h5 className="font-bold text-slate-800 text-sm pt-2">1. Pengumpulan Data</h5>
              <p>
                Kami mengumpulkan data pribadi berupa Nama, NIK, NIM/NISN, Email, Nomor Telepon, Institusi Pendidikan, serta Dokumen Pendukung (Surat Pengantar, Transkrip, CV) semata-mata untuk keperluan seleksi dan administrasi kegiatan magang.
              </p>

              <h5 className="font-bold text-slate-800 text-sm pt-2">2. Penggunaan & Keamanan Data</h5>
              <p>
                Data Anda tidak akan diperjualbelikan atau disebarluaskan kepada pihak ketiga di luar instansi Pemerintah Kota Yogyakarta tanpa izin. Seluruh data disimpan dalam peladen terlindungi milik DISKOMINFOSAN Kota Yogyakarta.
              </p>
            </div>
          )}

          {/* 8. SYARAT & KETENTUAN */}
          {type === 'syarat-ketentuan' && (
            <div className="space-y-3 text-xs sm:text-sm text-slate-600">
              <p>
                Dengan mendaftar melalui aplikasi SI AMANG, Anda menyetujui seluruh Syarat & Ketentuan pelaksanaan magang di DISKOMINFOSAN Kota Yogyakarta:
              </p>

              <ul className="list-disc pl-5 space-y-1.5">
                <li>Seluruh informasi dan dokumen yang diunggah adalah benar, sah, dan dapat dipertanggungjawabkan.</li>
                <li>Peserta magang bersedia mematuhi semua tata tertib dan kerahasiaan informasi di lingkungan Pemerintah Kota Yogyakarta.</li>
                <li>DISKOMINFOSAN berhak membatalkan status magang apabila ditemukan pelanggaran berat atau pemalsuan dokumen.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
