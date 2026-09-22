import React, { useState } from 'react';
import type { PendaftarData } from '../../types/pendaftar';
import { showSuccessAlert, showConfirmAlert, showToast } from '../../utils/swal';
import { PendaftarProfileCard } from './pendaftar/PendaftarProfileCard';
import { PendaftarDetailTabs, type PendaftarDetailTabKey } from './pendaftar/PendaftarDetailTabs';
import { PendaftarPersonalTab } from './pendaftar/tabs/PendaftarPersonalTab';
import { PendaftarAkademikTab } from './pendaftar/tabs/PendaftarAkademikTab';
import { PendaftarProjectTab } from './pendaftar/tabs/PendaftarProjectTab';
import { PendaftarKelompokTab } from './pendaftar/tabs/PendaftarKelompokTab';
import { PendaftarVideoCard } from './pendaftar/PendaftarVideoCard';
import { PendaftarRejectReasonModal } from './pendaftar/PendaftarRejectReasonModal';


interface DetailPendaftarViewProps {
  pendaftar: PendaftarData;
  onBack: () => void;
  /** Admin saja. Tanpa ini, tombol Tolak dan aksi Terima default disembunyikan. */
  onUpdateStatus?: (id: number, newStatus: 'Diterima' | 'Ditolak' | 'Verifikasi', reason?: string) => void;
  /** Admin saja. Override alur Terima (mis. membuka modal pilih mentor). */
  onAccept?: (pendaftar: PendaftarData) => Promise<boolean>;
}

export const DetailPendaftarView: React.FC<DetailPendaftarViewProps> = ({
  pendaftar,
  onBack,
  onUpdateStatus,
  onAccept,
}) => {
  const [activeTab, setActiveTab] = useState<PendaftarDetailTabKey>('personal');
  const [showRejectModal, setShowRejectModal] = useState(false);

  const canAccept = Boolean(onAccept || onUpdateStatus);
  const canReject = Boolean(onUpdateStatus);

  const handleTerima = async () => {
    const confirmed = await showConfirmAlert({
      title: 'Terima Pendaftaran?',
      text: `Apakah Anda yakin ingin MENERIMA pendaftaran dari ${pendaftar.nama}?`,
      confirmButtonText: 'Ya, Terima Pendaftar',
      icon: 'question',
    });
    if (!confirmed) return;

    if (onAccept) {
      await onAccept(pendaftar);
    } else if (onUpdateStatus) {
      onUpdateStatus(pendaftar.id, 'Diterima');
      showSuccessAlert(
        'Pendaftaran Diterima!',
        `Status pendaftaran ${pendaftar.nama} berhasil diubah menjadi DITERIMA.`
      );
    }
  };

  const handleConfirmTolak = (reason: string) => {
    onUpdateStatus?.(pendaftar.id, 'Ditolak', reason);
    setShowRejectModal(false);
    showToast('info', `Pendaftaran ${pendaftar.nama} telah DITOLAK dengan alasan: "${reason}"`);
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

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Kembali
          </button>
          {canAccept && pendaftar.status !== 'Diterima' && (
            <button
              type="button"
              onClick={handleTerima}
              className="px-4 py-2 rounded-xl bg-[#1f877c] hover:bg-[#196e65] text-white font-bold text-xs shadow-2xs transition-all cursor-pointer"
            >
              Terima
            </button>
          )}
          {canReject && pendaftar.status !== 'Ditolak' && (
            <button
              type="button"
              onClick={() => setShowRejectModal(true)}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-2xs transition-all cursor-pointer"
            >
              Tolak
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <PendaftarProfileCard pendaftar={pendaftar} />

        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <PendaftarDetailTabs active={activeTab} onChange={setActiveTab} />

            <div className="p-6">
              <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white">
                {activeTab === 'personal' && <PendaftarPersonalTab pendaftar={pendaftar} />}
                {activeTab === 'akademik' && <PendaftarAkademikTab pendaftar={pendaftar} />}
                {activeTab === 'project' && <PendaftarProjectTab pendaftar={pendaftar} />}
                {activeTab === 'kelompok' && <PendaftarKelompokTab pendaftar={pendaftar} />}
              </div>
            </div>
          </div>

          <PendaftarVideoCard pendaftar={pendaftar} />
        </div>
      </div>

      {showRejectModal && (
        <PendaftarRejectReasonModal
          applicantName={pendaftar.nama}
          onClose={() => setShowRejectModal(false)}
          onConfirm={handleConfirmTolak}
        />
      )}
    </div>
  );
};