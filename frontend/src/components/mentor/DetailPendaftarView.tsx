import React, { useState } from 'react';
import { PendaftarData } from './DetailDataModal';
import {
  showSuccessAlert,
  showConfirmAlert,
  showDeleteConfirmAlert,
  showToast,
} from '../../utils/swal';

interface DetailPendaftarViewProps {
  pendaftar: PendaftarData;
  onBack: () => void;
  onUpdateStatus: (id: number, newStatus: 'Diterima' | 'Ditolak' | 'Verifikasi', reason?: string) => void;
}

export const DetailPendaftarView: React.FC<DetailPendaftarViewProps> = ({
  pendaftar,
  onBack,
  onUpdateStatus,
}) => {
  const [activeTab, setActiveTab] = useState<
    'personal' | 'akademik' | 'project' | 'kelompok'
  >('personal');

  // Rejection Modal State
  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);
  const [rejectReason, setRejectReason] = useState<string>('');

  const handleTerima = async () => {
    const confirmed = await showConfirmAlert({
      title: 'Terima Pendaftaran?',
      text: `Apakah Anda yakin ingin MENERIMA pendaftaran dari ${pendaftar.nama}?`,
      confirmButtonText: 'Ya, Terima Pendaftar',
      icon: 'question',
    });

    if (confirmed) {
      onUpdateStatus(pendaftar.id, 'Diterima');
      showSuccessAlert(
        'Pendaftaran Diterima!',
        `Status pendaftaran ${pendaftar.nama} berhasil diubah menjadi DITERIMA.`
      );
    }
  };

  const handleOpenTolakModal = () => {
    setRejectReason('');
    setShowRejectModal(true);
  };

  const handleConfirmTolak = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectReason.trim()) {
      showToast('error', 'Mohon isi alasan penolakan terlebih dahulu.');
      return;
    }

    onUpdateStatus(pendaftar.id, 'Ditolak', rejectReason.trim());
    setShowRejectModal(false);
    showToast('info', `Pendaftaran ${pendaftar.nama} telah DITOLAK dengan alasan: "${rejectReason.trim()}"`);
  };

  const handlePending = async () => {
    const confirmed = await showConfirmAlert({
      title: 'Set Menunggu Verifikasi?',
      text: `Apakah Anda yakin ingin mengubah status pendaftaran ${pendaftar.nama} menjadi Menunggu Verifikasi?`,
      confirmButtonText: 'Ya, Ubah Status',
      icon: 'info',
    });

    if (confirmed) {
      onUpdateStatus(pendaftar.id, 'Verifikasi');
      showToast('success', 'Status pendaftaran diubah ke Menunggu Verifikasi.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans text-slate-800">
      {/* HEADER & BREADCRUMB */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Detail Pendaftar Magang</h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <button
              type="button"
              onClick={onBack}
              className="hover:underline cursor-pointer text-slate-600 font-medium"
            >
              Pendaftar Magang
            </button>
            <span className="text-slate-400">&gt;</span>
            <span className="text-[#1f877c] font-semibold">Detail Pendaftar Magang</span>
          </div>
        </div>

        {/* BACK & ACTION BUTTONS */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Kembali
          </button>
          {pendaftar.status !== 'Diterima' && (
            <button
              type="button"
              onClick={handleTerima}
              className="px-4 py-2 rounded-xl bg-[#1f877c] hover:bg-[#196e65] text-white font-bold text-xs shadow-2xs transition-all cursor-pointer"
            >
              Terima
            </button>
          )}
          {pendaftar.status !== 'Ditolak' && (
            <button
              type="button"
              onClick={handleOpenTolakModal}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-2xs transition-all cursor-pointer"
            >
              Tolak
            </button>
          )}
        </div>
      </div>

      {/* GRID CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT CARD - PROFILE & QUICK ACTIONS (4 COLS) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-6 flex flex-col items-center">
          
          {/* PROFILE PHOTO */}
          <div className="text-center space-y-3">
            <img
              src={pendaftar.fotoUrl}
              alt={pendaftar.nama}
              className="w-28 h-28 rounded-full object-cover border-4 border-[#E6F7F3] shadow-md mx-auto"
            />
            <h3 className="text-lg font-bold text-slate-900">{pendaftar.nama}</h3>
          </div>

          <div className="w-full border-t border-slate-100" />

          {/* KEY VALUE DETAILS */}
          <div className="w-full space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-600 font-medium">Tanggal Pendaftaran</span>
              <span className="font-bold text-slate-900">{pendaftar.tanggalDaftar}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-600 font-medium">Tipe Pendaftaran</span>
              <span className="font-bold text-slate-900">{pendaftar.tipeDaftar || 'Kelompok'}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-600 font-medium">Status Pendaftaran</span>
              {pendaftar.status === 'Diterima' ? (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Diterima
                </span>
              ) : pendaftar.status === 'Ditolak' ? (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                  Ditolak
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                  Verifikasi
                </span>
              )}
            </div>

            {/* SHOW REJECTION REASON IF REJECTED */}
            {pendaftar.status === 'Ditolak' && pendaftar.alasanPenolakan && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 space-y-1">
                <span className="font-bold block text-[11px] text-rose-900">Alasan Penolakan:</span>
                <p className="text-[11px] font-medium leading-relaxed">{pendaftar.alasanPenolakan}</p>
              </div>
            )}
          </div>

          <div className="w-full border-t border-slate-100" />

          {/* OUTLINE ACTION BUTTONS */}
          <div className="w-full space-y-3 pt-1">
            <button
              type="button"
              onClick={() => showToast('info', 'Membuka Berkas Pendaftaran...')}
              className="w-full py-2.5 px-4 rounded-xl border border-[#1f877c] text-[#1f877c] font-bold text-xs hover:bg-[#E6F7F3] transition-all cursor-pointer text-center"
            >
              View Berkas Pendaftaran
            </button>

            <button
              type="button"
              onClick={() => showToast('info', 'Membuka Surat NDA...')}
              className="w-full py-2.5 px-4 rounded-xl border border-[#1f877c] text-[#1f877c] font-bold text-xs hover:bg-[#E6F7F3] transition-all cursor-pointer text-center"
            >
              View Surat NDA
            </button>

            <button
              type="button"
              onClick={() => showToast('info', 'Membuka Surat Permohonan...')}
              className="w-full py-2.5 px-4 rounded-xl border border-[#1f877c] text-[#1f877c] font-bold text-xs hover:bg-[#E6F7F3] transition-all cursor-pointer text-center"
            >
              View Surat Permohonan
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN - TABS & VIDEO (8 COLS) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* TABBED INFORMATION CARD */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            
            {/* TABS HEADER */}
            <div className="flex border-b border-slate-200 overflow-x-auto bg-slate-50/50">
              <button
                type="button"
                onClick={() => setActiveTab('personal')}
                className={`px-5 py-3.5 text-xs font-bold transition-all whitespace-nowrap cursor-pointer border-b-2 ${
                  activeTab === 'personal'
                    ? 'border-[#1f877c] text-[#1f877c] bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Informasi Personal
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('akademik')}
                className={`px-5 py-3.5 text-xs font-bold transition-all whitespace-nowrap cursor-pointer border-b-2 ${
                  activeTab === 'akademik'
                    ? 'border-[#1f877c] text-[#1f877c] bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Informasi Akademik
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('project')}
                className={`px-5 py-3.5 text-xs font-bold transition-all whitespace-nowrap cursor-pointer border-b-2 ${
                  activeTab === 'project'
                    ? 'border-[#1f877c] text-[#1f877c] bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Informasi Project
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('kelompok')}
                className={`px-5 py-3.5 text-xs font-bold transition-all whitespace-nowrap cursor-pointer border-b-2 ${
                  activeTab === 'kelompok'
                    ? 'border-[#1f877c] text-[#1f877c] bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Informasi Kelompok
              </button>
            </div>

            {/* TAB CONTENT TABLE */}
            <div className="p-6">
              <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white">
                
                {/* 1. INFORMASI PERSONAL */}
                {activeTab === 'personal' && (
                  <table className="w-full text-xs text-left divide-y divide-slate-100">
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="py-3.5 px-4 font-bold text-slate-400 w-12 text-center">1</td>
                        <td className="py-3.5 px-4 text-slate-600 font-medium w-48">Nama Lengkap</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">{pendaftar.nama}</td>
                      </tr>
                      <tr>
                        <td className="py-3.5 px-4 font-bold text-slate-400 text-center">2</td>
                        <td className="py-3.5 px-4 text-slate-600 font-medium">Email</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">{pendaftar.email}</td>
                      </tr>
                      <tr>
                        <td className="py-3.5 px-4 font-bold text-slate-400 text-center">3</td>
                        <td className="py-3.5 px-4 text-slate-600 font-medium">No. Handphone</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">{pendaftar.phone}</td>
                      </tr>
                      <tr>
                        <td className="py-3.5 px-4 font-bold text-slate-400 text-center">4</td>
                        <td className="py-3.5 px-4 text-slate-600 font-medium">Alamat</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">Yogyakarta</td>
                      </tr>
                    </tbody>
                  </table>
                )}

                {/* 2. INFORMASI AKADEMIK */}
                {activeTab === 'akademik' && (
                  <table className="w-full text-xs text-left divide-y divide-slate-100">
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="py-3.5 px-4 font-bold text-slate-400 w-12 text-center">1</td>
                        <td className="py-3.5 px-4 text-slate-600 font-medium w-48">Nama Kampus / Universitas</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">{pendaftar.instansi}</td>
                      </tr>
                      <tr>
                        <td className="py-3.5 px-4 font-bold text-slate-400 text-center">2</td>
                        <td className="py-3.5 px-4 text-slate-600 font-medium">Program Studi / Jurusan</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">Teknologi Informasi / Sistem Informasi</td>
                      </tr>
                      <tr>
                        <td className="py-3.5 px-4 font-bold text-slate-400 text-center">3</td>
                        <td className="py-3.5 px-4 text-slate-600 font-medium">NIM / NIK</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">{pendaftar.nim}</td>
                      </tr>
                      <tr>
                        <td className="py-3.5 px-4 font-bold text-slate-400 text-center">4</td>
                        <td className="py-3.5 px-4 text-slate-600 font-medium">Semester Saat Ini</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">Semester 6</td>
                      </tr>
                    </tbody>
                  </table>
                )}

                {/* 3. INFORMASI PROJECT */}
                {activeTab === 'project' && (
                  <table className="w-full text-xs text-left divide-y divide-slate-100">
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="py-3.5 px-4 font-bold text-slate-400 w-12 text-center">1</td>
                        <td className="py-3.5 px-4 text-slate-600 font-medium w-48">Kategori / Divisi Magang</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">{pendaftar.kategori}</td>
                      </tr>
                      <tr>
                        <td className="py-3.5 px-4 font-bold text-slate-400 text-center">2</td>
                        <td className="py-3.5 px-4 text-slate-600 font-medium">Keahlian Utama</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">Fullstack Web Developer & System Analyst</td>
                      </tr>
                      <tr>
                        <td className="py-3.5 px-4 font-bold text-slate-400 text-center">3</td>
                        <td className="py-3.5 px-4 text-slate-600 font-medium">Tools yang Dikuasai</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">React, TypeScript, Tailwind CSS, Laravel, MySQL</td>
                      </tr>
                      <tr>
                        <td className="py-3.5 px-4 font-bold text-slate-400 text-center">4</td>
                        <td className="py-3.5 px-4 text-slate-600 font-medium">Rencana Rencana Periode Magang</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">01 Juni 2026 - 31 Agustus 2026 (3 Bulan)</td>
                      </tr>
                    </tbody>
                  </table>
                )}

                {/* 4. INFORMASI KELOMPOK */}
                {activeTab === 'kelompok' && (
                  <table className="w-full text-xs text-left divide-y divide-slate-100">
                    <thead>
                      <tr className="bg-slate-50 text-slate-700 font-bold">
                        <th className="py-3 px-4 text-center w-12">No</th>
                        <th className="py-3 px-4">Nama Anggota</th>
                        <th className="py-3 px-4">Peran</th>
                        <th className="py-3 px-4">NIM</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="py-3.5 px-4 font-bold text-slate-400 text-center">1</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">{pendaftar.nama}</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Ketua Tim
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 font-medium">{pendaftar.nim}</td>
                      </tr>
                      <tr>
                        <td className="py-3.5 px-4 font-bold text-slate-400 text-center">2</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">Ahmad Rizky Pratama</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                            Anggota 1
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 font-medium">21/478913/SV/19232</td>
                      </tr>
                      <tr>
                        <td className="py-3.5 px-4 font-bold text-slate-400 text-center">3</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">Siti Nurhaliza</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                            Anggota 2
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 font-medium">21/478914/SV/19233</td>
                      </tr>
                    </tbody>
                  </table>
                )}

              </div>
            </div>

          </div>

          {/* VIDEO PERKENALAN CARD */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Video Perkenalan</h3>
            
            {/* HTML5 VIDEO PLAYER WITH STYLING MATCHING IMAGE */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-md aspect-video">
              <video
                controls
                poster="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80"
                className="w-full h-full object-cover"
              >
                <source
                  src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
                  type="video/mp4"
                />
                Browser Anda tidak mendukung tag video.
              </video>
            </div>
          </div>

        </div>

      </div>

      {/* REJECTION REASON MODAL */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                <span className="material-symbols-outlined">cancel</span>
                <span>Alasan Penolakan Pendaftaran</span>
              </div>
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Mohon masukkan alasan penolakan berkas pendaftaran calon peserta <strong className="text-slate-900">{pendaftar.nama}</strong>:
            </p>

            <form onSubmit={handleConfirmTolak} className="space-y-4 text-xs">
              <div>
                <textarea
                  rows={4}
                  required
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Contoh: Berkas persyaratan tidak lengkap, kuota divisi telah terpenuhi, atau kualifikasi jurusan belum sesuai."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 font-medium text-slate-800 resize-none"
                />
              </div>

              {/* TEMPLATE SUGGESTION CHIPS */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-400 block">Pilih Alasan Cepat:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Berkas persyaratan tidak lengkap',
                    'Kuota divisi magang sudah penuh',
                    'Kualifikasi jurusan belum sesuai',
                    'Surat pengantar kampus belum terlampir',
                  ].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setRejectReason(chip)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 border border-slate-200 text-[10px] font-medium text-slate-600 transition-all cursor-pointer"
                    >
                      + {chip}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowRejectModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer shadow-xs"
                >
                  Konfirmasi Tolak
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
