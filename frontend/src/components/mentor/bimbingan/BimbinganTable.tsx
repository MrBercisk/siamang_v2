import React from 'react';
import type { BimbinganListItem, BimbinganStatus } from '../../../types/bimbinganMentor';

interface BimbinganTableProps {
  items: BimbinganListItem[];
  /** Offset penomoran, supaya nomor lanjut di halaman berikutnya. */
  startIndex: number;
  emptyMessage: string;
  onSelect: (item: BimbinganListItem) => void;
}

const STATUS_STYLES: Record<BimbinganStatus, string> = {
  'On Progress': 'bg-amber-50 text-amber-700 border-amber-300',
  Selesai: 'bg-emerald-50 text-emerald-700 border-emerald-300',
};

export const BimbinganTable: React.FC<BimbinganTableProps> = ({
  items,
  startIndex,
  emptyMessage,
  onSelect,
}) => (
  <div className="overflow-x-auto">
    <table className="w-full text-xs text-left border-collapse">
      <thead>
        <tr className="border-y border-slate-200 text-slate-900 font-bold bg-white">
          <th className="py-4 px-4 text-center w-12">No</th>
          <th className="py-4 px-4">Nama Mahasiswa</th>
          <th className="py-4 px-4">Kategori</th>
          <th className="py-4 px-4">Judul Project</th>
          <th className="py-4 px-4">Last Update</th>
          <th className="py-4 px-4 text-center">Status</th>
          <th className="py-4 px-4 text-center">Aksi</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {items.length === 0 ? (
          <tr>
            <td colSpan={7} className="py-10 text-center text-slate-400 font-medium">
              {emptyMessage}
            </td>
          </tr>
        ) : (
          items.map((student, index) => (
            <tr key={student.id} className="hover:bg-slate-50/60 transition-colors">
              <td className="py-4 px-4 text-center font-bold text-slate-400">
                {startIndex + index + 1}
              </td>
              <td className="py-4 px-4 font-bold text-slate-900">{student.nama}</td>
              <td className="py-4 px-4 text-slate-600 max-w-[200px] leading-relaxed">
                {student.kategori}
              </td>
              <td className="py-4 px-4 text-slate-600 max-w-[200px] leading-relaxed">
                {student.judulProject}
              </td>
              <td className="py-4 px-4 text-slate-600 whitespace-nowrap">{student.lastUpdate}</td>
              <td className="py-4 px-4 text-center">
                <span
                  className={`inline-block px-4 py-1 rounded-full text-xs font-bold border ${STATUS_STYLES[student.status]}`}
                >
                  {student.status}
                </span>
              </td>
              <td className="py-4 px-4 text-center">
                <button
                  type="button"
                  onClick={() => onSelect(student)}
                  className="p-1.5 rounded-lg border border-[#1f877c] text-[#1f877c] hover:bg-[#E6F7F3] cursor-pointer inline-flex items-center justify-center transition-all"
                  title="Detail Bimbingan Mahasiswa"
                >
                  <span className="material-symbols-outlined text-lg">visibility</span>
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);