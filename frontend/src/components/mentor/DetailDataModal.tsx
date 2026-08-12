import React from 'react';
import {
  showSuccessAlert,
  showConfirmAlert,
  showDeleteConfirmAlert,
  showToast,
} from '../../utils/swal';

export interface PendaftarData {
  id: number;
  fotoUrl: string;
  nama: string;
  email: string;
  phone: string;
  instansi: string;
  nim: string;
  kategori: string;
  tanggalDaftar: string;
  status: 'Diterima' | 'Ditolak' | 'Verifikasi';
  tipeDaftar?: 'Kelompok' | 'Individu';
  alamat?: string;
  jurusan?: string;
  semester?: string;
  ipk?: string;
  keahlian?: string;
  alasanPenolakan?: string;
  berkas: {
    pasFoto: boolean;
    suratPermohonan: boolean;
    proposal: boolean;
    nda: boolean;
  };
}

interface DetailDataModalProps {
  pendaftar: PendaftarData | null;
  onClose: () => void;
  onUpdateStatus: (id: number, newStatus: 'Diterima' | 'Ditolak' | 'Verifikasi') => void;
}

export const DetailDataModal: React.FC<DetailDataModalProps> = ({
  pendaftar,
  onClose,
  onUpdateStatus,
}) => {
  if (!pendaftar) return null;

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
      onClose();
    }
  };

  const handleTolak = async () => {
    const confirmed = await showDeleteConfirmAlert({
      title: 'Tolak Pendaftaran?',
      text: `Apakah Anda yakin ingin MENOLAK pendaftaran dari ${pendaftar.nama}?`,
      confirmButtonText: 'Ya, Tolak Pendaftar',
    });

    if (confirmed) {
      onUpdateStatus(pendaftar.id, 'Ditolak');
      showToast('info', `Pendaftaran ${pendaftar.nama} telah DITOLAK.`);
      onClose();
    }
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
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden font-sans text-slate-800">
        
        {/* MODAL HEADER */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#E6F7F3] text-[#1f877c] flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-xl">account_circle</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Detail Data Pendaftar Magang</h2>
              <p className="text-xs text-slate-500">
                Informasi biodata & dokumen calon peserta magang DISKOMINFOSAN
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* MODAL BODY - SCROLLABLE */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* PROFILE SUMMARY HEADER CARD */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <img
              src={pendaftar.fotoUrl}
              alt={pendaftar.nama}
              className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-xs shrink-0"
            />
            <div className="flex-1 text-center sm:text-left space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h3 className="text-lg font-bold text-slate-900">{pendaftar.nama}</h3>
                {pendaftar.status === 'Diterima' ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Diterima
                  </span>
                ) : pendaftar.status === 'Ditolak' ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                    Ditolak
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                    Verifikasi
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 font-medium">{pendaftar.instansi}</p>
              <p className="text-xs text-[#1f877c] font-bold">{pendaftar.kategori}</p>
            </div>
          </div>

          {/* DETAIL INFORMATION GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200/60 space-y-1">
              <span className="text-slate-400 font-medium block text-[11px]">NIM / NIK</span>
              <span className="font-bold text-slate-800">{pendaftar.nim}</span>
            </div>
            <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200/60 space-y-1">
              <span className="text-slate-400 font-medium block text-[11px]">Email</span>
              <span className="font-bold text-slate-800">{pendaftar.email}</span>
            </div>
            <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200/60 space-y-1">
              <span className="text-slate-400 font-medium block text-[11px]">Nomor WhatsApp</span>
              <span className="font-bold text-slate-800">{pendaftar.phone}</span>
            </div>
            <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200/60 space-y-1">
              <span className="text-slate-400 font-medium block text-[11px]">Tanggal Pendaftaran</span>
              <span className="font-bold text-slate-800">{pendaftar.tanggalDaftar}</span>
            </div>
          </div>

          {/* DOCUMENTS CHECKLIST */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Berkas Pendaftaran
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                  <span className="font-medium text-slate-700">Pas Foto Terbaru</span>
                </div>
                <button
                  type="button"
                  onClick={() => showToast('info', 'Membuka dokumen Pas Foto...')}
                  className="text-[11px] font-bold text-[#1f877c] hover:underline cursor-pointer"
                >
                  Lihat
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                  <span className="font-medium text-slate-700">Surat Permohonan Instansi</span>
                </div>
                <button
                  type="button"
                  onClick={() => showToast('info', 'Membuka Surat Permohonan...')}
                  className="text-[11px] font-bold text-[#1f877c] hover:underline cursor-pointer"
                >
                  Lihat
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                  <span className="font-medium text-slate-700">Proposal Magang</span>
                </div>
                <button
                  type="button"
                  onClick={() => showToast('info', 'Membuka Proposal...')}
                  className="text-[11px] font-bold text-[#1f877c] hover:underline cursor-pointer"
                >
                  Lihat
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                  <span className="font-medium text-slate-700">Surat Pernyataan NDA</span>
                </div>
                <button
                  type="button"
                  onClick={() => showToast('info', 'Membuka Surat NDA...')}
                  className="text-[11px] font-bold text-[#1f877c] hover:underline cursor-pointer"
                >
                  Lihat
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* MODAL FOOTER - ACTION BUTTONS */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Tutup
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePending}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer"
            >
              Set Verifikasi
            </button>
            <button
              type="button"
              onClick={handleTolak}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer"
            >
              Tolak Pendaftaran
            </button>
            <button
              type="button"
              onClick={handleTerima}
              className="px-4 py-2.5 rounded-xl bg-[#1f877c] hover:bg-[#196e65] text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer"
            >
              Terima Pendaftaran
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
