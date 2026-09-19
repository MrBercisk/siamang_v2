import React from 'react';
import { LowonganItem } from '../../../types/periode';
import { TablePagination } from './TablePagination';

interface LowonganTableProps {
  lowonganList: LowonganItem[];
  totalCount: number;
  itemsPerPage: number;
  onItemsPerPageChange: (value: number) => void;
  onAdd: () => void;
  onEdit: (item: LowonganItem) => void;
  onDelete: (item: LowonganItem) => void;
}

export const LowonganTable: React.FC<LowonganTableProps> = ({
  lowonganList,
  totalCount,
  itemsPerPage,
  onItemsPerPageChange,
  onAdd,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-base font-bold text-slate-800">Informasi Lowongan Magang</h2>

      {/* CONTROLS BAR: TAMPILKAN ENTRI & BUTTON TAMBAH LOWONGAN */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
          <span>Tampilkan</span>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-bold text-slate-800"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span>data per halaman</span>
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="bg-[#1f877c] hover:bg-[#196e65] text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer shrink-0"
        >
          <span>Tambah Lowongan</span>
          <span className="text-lg font-bold">+</span>
        </button>
      </div>

      {/* TABLE LOWONGAN MAGANG */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-white text-slate-800 font-bold">
              <th className="py-3.5 px-4 text-center w-12">No</th>
              <th className="py-3.5 px-4">Kategori</th>
              <th className="py-3.5 px-4">Bidang</th>
              <th className="py-3.5 px-4">Project</th>
              <th className="py-3.5 px-4">Definisi</th>
              <th className="py-3.5 px-4 text-center">Detail Kebutuhan</th>
              <th className="py-3.5 px-4 text-center">Kuota</th>
              <th className="py-3.5 px-4 text-center w-28">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {lowonganList.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400 font-medium">
                  Belum ada lowongan magang.
                </td>
              </tr>
            ) : (
              lowonganList.map((item, idx) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-4 text-center font-bold text-slate-600">{idx + 1}</td>
                  <td className="py-4 px-4 font-semibold text-slate-800 max-w-[160px] leading-tight">
                    {item.kategori}
                  </td>
                  <td className="py-4 px-4 text-slate-600 font-medium max-w-[150px] leading-tight">
                    {item.bidang}
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-900">{item.project}</td>
                  <td className="py-4 px-4 text-slate-600 max-w-[180px] leading-tight">{item.definisi}</td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-block px-3 py-1 rounded-full border border-teal-300 bg-emerald-50 text-[#1f877c] font-bold text-[11px]">
                      {item.detailKebutuhan}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center font-bold text-slate-900 text-sm">{item.kuota}</td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {/* EDIT BUTTON */}
                      <button
                        type="button"
                        onClick={() => onEdit(item)}
                        className="p-1.5 rounded-lg border border-cyan-300 bg-cyan-50/50 hover:bg-cyan-100 text-cyan-600 transition-colors cursor-pointer"
                        title="Edit Lowongan"
                      >
                        <span className="material-symbols-outlined text-base">edit_note</span>
                      </button>

                      {/* DELETE BUTTON */}
                      <button
                        type="button"
                        onClick={() => onDelete(item)}
                        className="p-1.5 rounded-lg border border-rose-300 bg-rose-50/50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                        title="Hapus Lowongan"
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <TablePagination shownCount={lowonganList.length} totalCount={totalCount} />
    </div>
  );
};