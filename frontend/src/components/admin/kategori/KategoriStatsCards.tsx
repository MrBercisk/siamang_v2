import React from 'react';
import { KategoriItem } from '../../../types/kategori';

interface KategoriStatsCardsProps {
  kategoriList: KategoriItem[];
}

export const KategoriStatsCards: React.FC<KategoriStatsCardsProps> = ({ kategoriList }) => {
  const totalKategori = kategoriList.length;
  const totalAktif = kategoriList.filter((k) => k.bidangStatus === 'Aktif').length;
  const totalPendaftar = kategoriList.reduce((acc, curr) => acc + curr.totalApplied, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
        <div>
          <span className="text-slate-400 font-bold block">Total Kategori Magang</span>
          <span className="text-2xl font-black text-slate-900 mt-0.5 block">{totalKategori} Kategori</span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#1f877c] flex items-center justify-center">
          <span className="material-symbols-outlined text-2xl">category</span>
        </div>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
        <div>
          <span className="text-slate-400 font-bold block">Kategori Aktif</span>
          <span className="text-2xl font-black text-emerald-600 mt-0.5 block">{totalAktif} Aktif</span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <span className="material-symbols-outlined text-2xl">check_circle</span>
        </div>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
        <div>
          <span className="text-slate-400 font-bold block">Total Pendaftar Masuk</span>
          <span className="text-2xl font-black text-blue-600 mt-0.5 block">{totalPendaftar} Berkas</span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <span className="material-symbols-outlined text-2xl">assignment_turned_in</span>
        </div>
      </div>
    </div>
  );
};