import React from 'react';
import type { NilaiAspect } from '../../../../types/nilaiPeserta';

function getKategoriSkor(skor: number): string {
  if (skor >= 8.5) return 'Sangat Baik';
  if (skor >= 7.0) return 'Baik';
  if (skor >= 5.5) return 'Cukup';
  return 'Kurang';
}

interface NilaiBreakdownTableProps {
  aspects: NilaiAspect[];
}

export const NilaiBreakdownTable: React.FC<NilaiBreakdownTableProps> = ({ aspects }) => (
  <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-4">
    <h4 className="text-base font-bold text-slate-900">Rincian 6 Aspek Penilaian Mentor</h4>

    <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white">
      <table className="w-full text-xs text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200 text-slate-900 font-bold bg-slate-50/60">
            <th className="py-4 px-6 text-center w-16">No</th>
            <th className="py-4 px-6">Aspek Penilaian</th>
            <th className="py-4 px-6 text-center w-40">Nilai Mentor (0-10)</th>
            <th className="py-4 px-6 text-center w-40">Kategori</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {aspects.map((item, index) => (
            <tr key={item.key} className="hover:bg-slate-50/60 transition-colors">
              <td className="py-4 px-6 text-center font-bold text-slate-400">{index + 1}</td>
              <td className="py-4 px-6 font-semibold text-slate-800">{item.label}</td>
              <td className="py-4 px-6 text-center font-black text-[#1f877c] text-sm">
                {item.skor.toFixed(1)} / 10
              </td>
              <td className="py-4 px-6 text-center">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {getKategoriSkor(item.skor)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);