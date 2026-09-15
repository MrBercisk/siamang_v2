import React from 'react';
import { BidangItem } from '../../../types/bidang';

interface BidangTableProps {
  bidangList: BidangItem[];
  totalCount: number;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onEdit: (item: BidangItem) => void;
  onDelete: (item: BidangItem) => void;
  onToggleStatus: (item: BidangItem) => void;
}

export const BidangTable: React.FC<BidangTableProps> = ({
  bidangList,
  totalCount,
  searchTerm,
  onSearchChange,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 space-y-5">

      {/* SEARCH BAR & FILTER */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="relative w-full sm:w-80">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-lg">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari nama bidang..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1f877c]"
          />
        </div>

        <span className="text-xs text-slate-400 font-bold self-end sm:self-center">
          Menampilkan {bidangList.length} dari {totalCount} Bidang
        </span>
      </div>

      {/* DATA TABLE */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-700 font-bold text-[11px] uppercase tracking-wider">
              <th className="py-3.5 px-4">Nama Bidang</th>
              <th className="py-3.5 px-4 text-center">Kategori</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4 text-center w-32">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {bidangList.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-400 font-medium">
                  Tidak ada data bidang yang sesuai dengan pencarian &ldquo;{searchTerm}&rdquo;.
                </td>
              </tr>
            ) : (
              bidangList.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-4">
                    <p className="font-bold text-slate-900 text-xs">{item.name}</p>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      {item.categoryCount} Kategori
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => onToggleStatus(item)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                        item.status === 'Aktif'
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-300'
                      }`}
                      title="Klik untuk mengubah status"
                    >
                      {item.status}
                    </button>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">

                      {/* EDIT BUTTON */}
                      <button
                        type="button"
                        onClick={() => onEdit(item)}
                        className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-300 text-blue-600 transition-colors cursor-pointer"
                        title="Edit Data Bidang"
                      >
                        <span className="material-symbols-outlined text-base">edit</span>
                      </button>

                      {/* DELETE BUTTON */}
                      <button
                        type="button"
                        onClick={() => onDelete(item)}
                        className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-300 text-rose-600 transition-colors cursor-pointer"
                        title="Hapus Bidang"
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

    </div>
  );
};