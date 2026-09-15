import React from 'react';
import { BidangItem } from '../../../types/bidang';

interface BidangStatsCardsProps {
  bidangList: BidangItem[];
}

export const BidangStatsCards: React.FC<BidangStatsCardsProps> = ({ bidangList }) => {
  const totalBidang = bidangList.length;
  const totalAktif = bidangList.filter((b) => b.status === 'Aktif').length;
  const totalKategori = bidangList.reduce((acc, curr) => acc + curr.categoryCount, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
        <div>
          <span className="text-slate-400 font-bold block">Total Bidang</span>
          <span className="text-2xl font-black text-slate-900 mt-0.5 block">{totalBidang}</span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#1f877c] flex items-center justify-center">
          <span className="material-symbols-outlined text-2xl">database</span>
        </div>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
        <div>
          <span className="text-slate-400 font-bold block">Status Aktif</span>
          <span className="text-2xl font-black text-emerald-600 mt-0.5 block">{totalAktif}</span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <span className="material-symbols-outlined text-2xl">check_circle</span>
        </div>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
        <div>
          <span className="text-slate-400 font-bold block">Total Kategori Dinaungi</span>
          <span className="text-2xl font-black text-blue-600 mt-0.5 block">{totalKategori}</span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <span className="material-symbols-outlined text-2xl">account_tree</span>
        </div>
      </div>
    </div>
  );
};