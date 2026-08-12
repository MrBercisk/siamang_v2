import { useState } from 'react';
import { User } from '../../../types/auth';

interface ReviewDashboardTabProps {
  user: User;
  onSwitchToAccepted?: () => void;
}

export function ReviewDashboardTab({ user, onSwitchToAccepted }: ReviewDashboardTabProps) {
  const [showBuktiModal, setShowBuktiModal] = useState(false);
  const [showBerkasModal, setShowBerkasModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const displayName = user.name || 'Leona Strive';

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Halo {displayName}!
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