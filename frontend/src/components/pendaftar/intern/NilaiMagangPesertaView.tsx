import React from 'react';
import { showToast } from '../../../utils/swal';
import { useNilaiMagang } from '../hooks/useNilaiMagang';
import { printTranskrip } from './nilai/nilaiPrintTemplate';
import { NilaiNotPublishedView } from './nilai/NilaiNotPublishedView';
import { NilaiProfileCard } from './nilai/NilaiProfileCard';
import { NilaiSummaryCard } from './nilai/NilaiSummaryCard';
import { NilaiBreakdownTable } from './nilai/NilaiBreakdownTable';
import { NilaiCertificateCard } from './nilai/NilaiCertificateCard';

export const NilaiMagangPesertaView: React.FC = () => {
  const { state, loading, error } = useNilaiMagang();

  if (loading || !state) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-8 flex items-center justify-center text-slate-400 text-sm font-medium">
        Memuat data nilai...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-red-200 shadow-2xs p-8 text-center text-red-500 text-sm font-medium">
        {error}
      </div>
    );
  }

  const { profile, nilai } = state;

  if (!nilai || !nilai.isPublished) {
    return <NilaiNotPublishedView />;
  }

  const handlePrintPDF = () => {
    showToast('info', 'Membuka dokumen sertifikat & transkrip nilai untuk dicetak PDF...');
    const ok = printTranskrip(profile, nilai);
    if (!ok) {
      showToast('error', 'Gagal membuka jendela cetak. Izinkan pop-up di browser Anda.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans text-slate-800">
      <div className="p-4 px-6 rounded-2xl bg-[#1f877c] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-base shrink-0">
            <span className="material-symbols-outlined text-lg">verified</span>
          </span>
          <div>
            <h3 className="font-bold text-sm">Nilai Magang Telah Diterbitkan</h3>
            <p className="text-xs text-emerald-100 font-medium">
              Evaluasi resmi dari Mentor DISKOMINFOSAN Kota Yogyakarta.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handlePrintPDF}
          className="px-5 py-2.5 rounded-xl bg-white text-[#1f877c] hover:bg-emerald-50 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-lg">print</span>
          <span>Cetak PDF Nilai Magang</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <NilaiProfileCard profile={profile} />
        <NilaiSummaryCard nilai={nilai} />
      </div>

      <NilaiBreakdownTable aspects={nilai.aspects} />
      <NilaiCertificateCard nilai={nilai} />
    </div>
  );
};