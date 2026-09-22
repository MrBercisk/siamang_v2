import React from 'react';
import type { PendaftarData } from '../../../types/pendaftar';
import { resolveStorageUrl } from '../../../lib/api';
import { formatDate } from '../../../utils/formatters';
import { showToast } from '../../../utils/swal';
import { PendaftarStatusBadge } from './PendaftarStatusBadge';

const DOCUMENT_LABELS: Record<string, string> = {
  pas_foto: 'Pas Foto',
  berkas_persyaratan: 'Berkas Persyaratan',
  surat_permohonan: 'Surat Permohonan',
  proposal: 'Proposal',
  nda: 'Surat NDA',
  cv_portofolio: 'CV & Portofolio',
  transkrip_nilai: 'Transkrip Nilai',
  video_perkenalan: 'Video Perkenalan',
};

interface PendaftarProfileCardProps {
  pendaftar: PendaftarData;
}

export const PendaftarProfileCard: React.FC<PendaftarProfileCardProps> = ({ pendaftar }) => {
  const openDocument = (documentType: string) => {
    const document = (pendaftar.documents ?? []).find((item) => item.documentType === documentType);
    const fileUrl = resolveStorageUrl(document?.fileUrl);
    if (fileUrl) window.open(fileUrl, '_blank', 'noopener,noreferrer');
    else showToast('info', 'Dokumen belum tersedia.');
  };

  return (
    <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-6 flex flex-col items-center">
      {/* FOTO PROFIL */}
      <div className="text-center space-y-3">
        <img
          src={pendaftar.fotoUrl || '/assets/default-avatar.png'}
          alt={pendaftar.nama}
          className="w-28 h-28 rounded-full object-cover border-4 border-[#E6F7F3] shadow-md mx-auto"
        />
        <h3 className="text-lg font-bold text-slate-900">{pendaftar.nama}</h3>
      </div>

      <div className="w-full border-t border-slate-100" />

      {/* RINGKASAN KEY-VALUE */}
      <div className="w-full space-y-4 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-slate-600 font-medium">Nomor Pendaftaran</span>
          <span className="font-bold text-slate-900">{pendaftar.registrationNumber}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-600 font-medium">Tanggal Pendaftaran</span>
          <span className="font-bold text-slate-900">{formatDate(pendaftar.tanggalDaftar)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-600 font-medium">Tipe Pendaftaran</span>
          <span className="font-bold text-slate-900">{pendaftar.tipeDaftar || 'Kelompok'}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-600 font-medium">Status Pendaftaran</span>
          <PendaftarStatusBadge status={pendaftar.status} />
        </div>

        {pendaftar.status === 'Ditolak' && pendaftar.alasanPenolakan && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 space-y-1">
            <span className="font-bold block text-[11px] text-rose-900">Alasan Penolakan:</span>
            <p className="text-[11px] font-medium leading-relaxed">{pendaftar.alasanPenolakan}</p>
          </div>
        )}
      </div>

      <div className="w-full border-t border-slate-100" />

      {/* DOKUMEN */}
      <div className="w-full space-y-3 pt-1">
        {(pendaftar.documents ?? []).length === 0 ? (
          <p className="text-xs text-slate-500 text-center">Belum ada dokumen.</p>
        ) : (
          (pendaftar.documents ?? []).map((document) => (
            <button
              key={document.id}
              type="button"
              onClick={() => openDocument(document.documentType)}
              className="w-full py-2.5 px-4 rounded-xl border border-[#1f877c] text-[#1f877c] font-bold text-xs hover:bg-[#E6F7F3] transition-all cursor-pointer text-left flex items-center justify-between gap-3"
            >
              <span>{DOCUMENT_LABELS[document.documentType] ?? document.documentType}</span>
              <span className="material-symbols-outlined text-base">open_in_new</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
};