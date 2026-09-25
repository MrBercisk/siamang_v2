import React from 'react';
import type { NilaiSummary } from '../../../../types/nilaiPeserta';

interface NilaiSummaryCardProps {
  nilai: NilaiSummary;
}

export const NilaiSummaryCard: React.FC<NilaiSummaryCardProps> = ({ nilai }) => (
  <div className="lg:col-span-7 bg-[#E6F7F3] rounded-2xl border border-[#C6EFE7] p-6 flex flex-col justify-between space-y-6">
    <div className="flex items-start justify-between gap-4">
      <div>
        <span className="text-xs font-bold text-[#1f877c] uppercase tracking-wider block">
          Hasil Akhir Evaluasi Magang
        </span>
        <h3 className="text-2xl font-black text-slate-900 mt-1">{nilai.predikat}</h3>
        <p className="text-xs text-slate-600 mt-1 font-medium">
          Status: <strong className="text-emerald-700">Dinyatakan LULUS Magang</strong>
        </p>
      </div>

      <div className="text-right bg-white p-4 rounded-2xl border border-emerald-200 shadow-2xs">
        <span className="text-[11px] font-bold text-slate-400 uppercase block">Rata-Rata Skor</span>
        <span className="text-3xl font-black text-[#1f877c] block leading-none mt-1">
          {(nilai.rataRata ?? 0).toFixed(1)}
        </span>
        <span className="text-[11px] font-bold text-slate-500">/ 10.0</span>
      </div>
    </div>
  </div>
);