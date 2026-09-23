import React, { useState } from 'react';
import type { ProgressItem } from '../../../../types/progressPeserta';

interface ProgressTableProps {
  items: ProgressItem[];
  loading: boolean;
  onAdd: () => void;
  onView: (item: ProgressItem) => void;
  onEdit: (item: ProgressItem) => void;
}

export const ProgressTable: React.FC<ProgressTableProps> = ({ items, loading, onAdd, onView, onEdit }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredList = items.filter(
    (item) =>
      item.judulProject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.pencapaian.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.catatan.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-6">

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-slate-900">Data Progress Magang</h2>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
              search
            </span>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-[#1f877c] bg-white"
            />
          </div>

          <button
            type="button"
            onClick={onAdd}
            className="px-4 py-2.5 rounded-xl bg-[#1f877c] hover:bg-[#196e65] text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>Tambah Progress</span>
            <span className="material-symbols-outlined text-lg leading-none">add</span>
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-900 font-bold bg-white">
                <th className="py-4 px-4 text-center w-12">No</th>
                <th className="py-4 px-4">Judul Project</th>
                <th className="py-4 px-4 text-center whitespace-nowrap">Tanggal Bimbingan</th>
                <th className="py-4 px-4">Pencapaian</th>
                <th className="py-4 px-4">Catatan</th>
                <th className="py-4 px-4 text-center">File Presentasi</th>
                <th className="py-4 px-4 text-center whitespace-nowrap">Tanggal Upload</th>
                <th className="py-4 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 font-medium">
                    Memuat data...
                  </td>
                </tr>
              ) : filteredList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 font-medium">
                    Belum ada data progress magang.
                  </td>
                </tr>
              ) : (
                filteredList.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-4 text-center font-bold text-slate-400">{index + 1}</td>
                    <td className="py-4 px-4 font-semibold text-slate-800 max-w-[180px] leading-relaxed">
                      {item.judulProject}
                    </td>
                    <td className="py-4 px-4 text-center text-slate-600 font-medium whitespace-nowrap">
                      {item.tanggalBimbingan}
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-900 max-w-[180px] leading-relaxed">
                      {item.pencapaian}
                    </td>
                    <td className="py-4 px-4 text-slate-600 max-w-[180px] leading-relaxed">
                      {item.catatan}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {item.filePresentasiUrl ? (
                        <a
                          href={item.filePresentasiUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-xl bg-[#1f877c] hover:bg-[#196e65] text-white font-bold text-xs shadow-2xs transition-all cursor-pointer inline-flex items-center gap-1.5"
                        >
                          Download File
                        </a>
                      ) : (
                        <span className="text-slate-300 font-medium">-</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center text-slate-500 font-medium whitespace-nowrap">
                      {item.tanggalUpload}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => onView(item)}
                          className="w-8 h-8 rounded-lg border border-[#1f877c] text-[#1f877c] hover:bg-[#E6F7F3] flex items-center justify-center cursor-pointer transition-all"
                          title="Lihat Detail Progress"
                        >
                          <span className="material-symbols-outlined text-base">visibility</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onEdit(item)}
                          className="w-8 h-8 rounded-lg border border-sky-400 text-sky-500 hover:bg-sky-50 flex items-center justify-center cursor-pointer transition-all"
                          title="Edit Progress"
                        >
                          <span className="material-symbols-outlined text-base">edit</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-3 text-xs text-slate-500">
          <span>
            Menampilkan {filteredList.length === 0 ? 0 : 1} - {filteredList.length} dari {filteredList.length} riwayat.
          </span>
          <div className="flex items-center gap-1">
            <button type="button" className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 cursor-not-allowed" disabled>
              <span className="material-symbols-outlined text-xs">chevron_left</span>
            </button>
            <button type="button" className="w-7 h-7 rounded-lg bg-[#1f877c] text-white font-bold text-xs flex items-center justify-center">
              1
            </button>
            <button type="button" className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 cursor-not-allowed" disabled>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};