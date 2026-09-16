import React from 'react';
import { BidangOption, KategoriItem } from '../../../types/kategori';

interface KategoriTableProps {
  kategoriList: KategoriItem[];
  bidangOptions: BidangOption[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  bidangFilter: number | 'Semua';
  onBidangFilterChange: (value: number | 'Semua') => void;
  onEdit: (item: KategoriItem) => void;
  onDelete: (item: KategoriItem) => void;
}

export const KategoriTable: React.FC<KategoriTableProps> = ({
  kategoriList,
  bidangOptions,
  searchTerm,
  onSearchChange,
  bidangFilter,
  onBidangFilterChange,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 space-y-5">

      {/* SEARCH BAR & FILTER DROPDOWN */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-lg">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari kategori magang..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1f877c]"
            />
          </div>

          <select
            value={bidangFilter}
            onChange={(e) => onBidangFilterChange(e.target.value === 'Semua' ? 'Semua' : Number(e.target.value))}
            className="w-full sm:w-64 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white"
          >
            <option value="Semua">Semua Bidang Naungan</option>
            {bidangOptions.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        <span className="text-xs text-slate-400 font-bold self-end sm:self-center">
          Menampilkan {kategoriList.length} Kategori
        </span>
      </div>

      {/* DATA TABLE */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-700 font-bold text-[11px] uppercase tracking-wider">
              <th className="py-3.5 px-4">Nama Kategori Magang</th>
              <th className="py-3.5 px-4">Bidang Naungan</th>
              <th className="py-3.5 px-4 text-center">Pendaftar Masuk</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4 text-center w-32">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {kategoriList.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400 font-medium">
                  Tidak ada kategori magang yang sesuai.
                </td>
              </tr>
            ) : (
              kategoriList.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-4">
                    <p className="font-bold text-slate-900 text-xs">{item.name}</p>
                    {item.description && (
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5 line-clamp-1">
                        {item.description}
                      </p>
                    )}
                  </td>
                  <td className="py-4 px-4 font-semibold text-slate-700">{item.bidangName}</td>
                  <td className="py-4 px-4 text-center font-bold text-[#1f877c] text-sm">
                    {item.totalApplied} <span className="text-[10px] text-slate-400 font-medium">Pendaftar</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                        item.bidangStatus === 'Aktif'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-slate-100 text-slate-600 border-slate-300'
                      }`}
                      title="Mengikuti status bidang induk — ubah lewat menu Kelola Bidang"
                    >
                      {item.bidangStatus}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">

                      {/* EDIT BUTTON */}
                      <button
                        type="button"
                        onClick={() => onEdit(item)}
                        className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-300 text-blue-600 transition-colors cursor-pointer"
                        title="Edit Kategori"
                      >
                        <span className="material-symbols-outlined text-base">edit</span>
                      </button>

                      {/* PINDAHKAN KE SAMPAH (SOFT DELETE) */}
                      <button
                        type="button"
                        onClick={() => onDelete(item)}
                        className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-300 text-rose-600 transition-colors cursor-pointer"
                        title="Pindahkan ke Sampah"
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