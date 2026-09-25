import React from 'react';
import { showToast } from '../../../../utils/swal';
import type { NilaiSummary } from '../../../../types/nilaiPeserta';

interface NilaiCertificateCardProps {
  nilai: NilaiSummary;
}

export const NilaiCertificateCard: React.FC<NilaiCertificateCardProps> = ({ nilai }) => (
  <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-xl bg-[#E6F7F3] border border-[#C6EFE7] flex items-center justify-center text-[#1f877c] shrink-0">
        <span className="material-symbols-outlined text-2xl">workspace_premium</span>
      </div>
      <div>
        <h4 className="font-bold text-slate-900 text-sm">Surat Keterangan &amp; Sertifikat Kelulusan Magang</h4>
        <p className="text-xs text-slate-500 font-medium">
          Berkas resmi bertanda tangan digital Dinas Komunikasi Informatika dan Persandian Kota Yogyakarta.
        </p>
      </div>
    </div>

    {nilai.suratKeteranganUrl ? (
      <a
        href={nilai.suratKeteranganUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="px-5 py-2.5 rounded-xl bg-[#1f877c] hover:bg-[#196e65] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer shrink-0"
      >
        <span className="material-symbols-outlined text-lg">download</span>
        <span>Download Surat Keterangan (PDF)</span>
      </a>
    ) : (
      <button
        type="button"
        onClick={() => showToast('info', 'Surat keterangan belum tersedia.')}
        className="px-5 py-2.5 rounded-xl bg-slate-200 text-slate-500 font-bold text-xs flex items-center justify-center gap-1.5 shrink-0 cursor-not-allowed"
        disabled
      >
        <span className="material-symbols-outlined text-lg">download</span>
        <span>Belum Tersedia</span>
      </button>
    )}
  </div>
);