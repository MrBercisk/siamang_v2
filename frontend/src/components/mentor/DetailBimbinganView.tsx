import React, { useState } from 'react';
import { useBimbinganMentorDetail } from './hooks/useBimbinganMentorDetail';
import { BimbinganProfileCard } from './bimbingan/BimbinganProfileCard';
import { BimbinganDetailTabs, type DetailTabKey } from './bimbingan/BimbinganDetailTabs';
import { BimbinganProgressTab } from './bimbingan/BimbinganProgressTab';
import { BimbinganLaporanTab } from './bimbingan/BimbinganLaporanTab';
import { BimbinganNilaiTab } from './bimbingan/BimbinganNilaiTab';

interface DetailBimbinganViewProps {
  bimbinganId: string;
  onBack: () => void;
}

export const DetailBimbinganView: React.FC<DetailBimbinganViewProps> = ({
  bimbinganId,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<DetailTabKey>('progress');
  const {
    detail,
    loading,
    error,
    refetch,
    savingNilai,
    updatingLaporanId,
    saveNilai,
    updateLaporanStatus,
  } = useBimbinganMentorDetail(bimbinganId);

  return (
    <div className="space-y-6 animate-fade-in font-sans text-slate-800">
      {/* HEADER & BREADCRUMB */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">Detail Bimbingan Mahasiswa</h2>
        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
          <button
            type="button"
            onClick={onBack}
            className="hover:underline cursor-pointer text-slate-600 font-medium"
          >
            Bimbingan Mahasiswa
          </button>
          <span className="text-slate-400">&gt;</span>
          <span className="text-[#1f877c] font-semibold">Detail Bimbingan Mahasiswa</span>
        </div>
      </div>

      {loading && !detail ? (
        <div className="flex items-center justify-center py-24 text-sm font-medium text-slate-500">
          Memuat detail bimbingan...
        </div>
      ) : error && !detail ? (
        <div className="flex flex-col items-center justify-center gap-3 py-24 text-sm font-medium text-red-500">
          <span>Gagal memuat data: {error}</span>
          <button
            type="button"
            onClick={refetch}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold cursor-pointer"
          >
            Coba lagi
          </button>
        </div>
      ) : (
        detail && (
          <>
            <BimbinganProfileCard detail={detail} />

            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
              <BimbinganDetailTabs active={activeTab} onChange={setActiveTab} />

              {activeTab === 'progress' && <BimbinganProgressTab items={detail.progressList} />}

              {activeTab === 'laporan' && (
                <BimbinganLaporanTab
                  items={detail.laporanList}
                  updatingId={updatingLaporanId}
                  onUpdateStatus={updateLaporanStatus}
                />
              )}

              {/* Tetap ter-mount (hanya disembunyikan) supaya nilai yang belum
                  disimpan tidak hilang saat mentor pindah tab. */}
              <div className={activeTab === 'nilai' ? '' : 'hidden'}>
                <BimbinganNilaiTab nilai={detail.nilai} saving={savingNilai} onSave={saveNilai} />
              </div>
            </div>
          </>
        )
      )}
    </div>
  );
};