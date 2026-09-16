import React from 'react';
import { PendaftarData } from '../../../types/pendaftar';

interface PendaftarStatsCardsProps {
  applicantList: PendaftarData[];
}

export const PendaftarStatsCards: React.FC<PendaftarStatsCardsProps> = ({ applicantList }) => {
  const total = applicantList.length;
  const menungguVerifikasi = applicantList.filter((a) => a.status === 'Verifikasi').length;
  const diterima = applicantList.filter((a) => a.status === 'Diterima').length;
  const ditolak = applicantList.filter((a) => a.status === 'Ditolak').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
        <div>
          <span className="text-slate-400 font-bold block">Total Pendaftar</span>
          <span className="text-2xl font-black text-slate-900 mt-0.5 block">{total} Orang</span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
          <span className="material-symbols-outlined text-2xl">group</span>
        </div>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
        <div>
          <span className="text-slate-400 font-bold block">Menunggu Verifikasi</span>
          <span className="text-2xl font-black text-amber-600 mt-0.5 block">{menungguVerifikasi} Berkas</span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
          <span className="material-symbols-outlined text-2xl">pending_actions</span>
        </div>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
        <div>
          <span className="text-slate-400 font-bold block">Diterima Magang</span>
          <span className="text-2xl font-black text-emerald-600 mt-0.5 block">{diterima} Peserta</span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <span className="material-symbols-outlined text-2xl">verified</span>
        </div>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
        <div>
          <span className="text-slate-400 font-bold block">Berkas Ditolak</span>
          <span className="text-2xl font-black text-rose-600 mt-0.5 block">{ditolak} Berkas</span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
          <span className="material-symbols-outlined text-2xl">cancel</span>
        </div>
      </div>
    </div>
  );
};