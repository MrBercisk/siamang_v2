import React from 'react';
import { KategoriOption, MentorItem } from '../../../types/mentor';

interface MentorTableProps {
  mentorList: MentorItem[];
  kategoriOptions: KategoriOption[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  kategoriFilter: number | 'Semua';
  onKategoriFilterChange: (value: number | 'Semua') => void;
  onEdit: (item: MentorItem) => void;
  onDelete: (item: MentorItem) => void;
}

export const MentorTable: React.FC<MentorTableProps> = ({
  mentorList,
  kategoriOptions,
  searchTerm,
  onSearchChange,
  kategoriFilter,
  onKategoriFilterChange,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 space-y-5">

      {/* SEARCH BAR & CATEGORY FILTER */}
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
              placeholder="Cari nama mentor, NIP, atau email..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1f877c]"
            />
          </div>

          <select
            value={kategoriFilter}
            onChange={(e) => onKategoriFilterChange(e.target.value === 'Semua' ? 'Semua' : Number(e.target.value))}
            className="w-full sm:w-64 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white"
          >
            <option value="Semua">Filter Kategori Magang yang Dikelola</option>
            {kategoriOptions.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <span className="text-xs text-slate-400 font-bold self-end sm:self-center">
          Menampilkan {mentorList.length} Mentor
        </span>
      </div>

      {/* DATA TABLE */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-700 font-bold text-[11px] uppercase tracking-wider">
              <th className="py-3.5 px-4">Nama Mentor &amp; NIP</th>
              <th className="py-3.5 px-4">Kontak / Email</th>
              <th className="py-3.5 px-4">Kategori Magang yang Dikelola</th>
              <th className="py-3.5 px-4 text-center">Mhs Bimbingan</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4 text-center w-28">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mentorList.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">
                  Tidak ada data mentor yang sesuai dengan kriteria pencarian.
                </td>
              </tr>
            ) : (
              mentorList.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">

                  {/* NAMA & NIP */}
                  <td className="py-4 px-4">
                    <p className="font-bold text-slate-900 text-xs">{item.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">NIP: {item.nip || '-'}</p>
                    {item.position && (
                      <p className="text-[10px] text-[#1f877c] font-semibold mt-0.5">{item.position}</p>
                    )}
                  </td>

                  {/* KONTAK & EMAIL */}
                  <td className="py-4 px-4">
                    <p className="font-semibold text-slate-700 text-xs">{item.email}</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">{item.phone || '-'}</p>
                  </td>

                  {/* KATEGORI MAGANG YANG DIKELOLA */}
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1.5 max-w-xs">
                      {item.categories.length > 0 ? (
                        item.categories.map((cat) => (
                          <span
                            key={cat.id}
                            className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#E6F7F3] text-[#135952] border border-[#a1dfd7]"
                            title={`Bidang: ${cat.bidangName}`}
                          >
                            {cat.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">Belum diatur</span>
                      )}
                    </div>
                  </td>

                  {/* MHS BIMBINGAN */}
                  <td className="py-4 px-4 text-center font-bold text-[#1f877c] text-sm">
                    {item.totalMentees} <span className="text-[10px] text-slate-400 font-medium">Orang</span>
                  </td>

                  {/* STATUS (read-only badge; ubah lewat form edit) */}
                  <td className="py-4 px-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                        item.status === 'Aktif'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-slate-100 text-slate-600 border-slate-300'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  {/* AKSI */}
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">

                      {/* EDIT BUTTON */}
                      <button
                        type="button"
                        onClick={() => onEdit(item)}
                        className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-300 text-blue-600 transition-colors cursor-pointer"
                        title="Edit Mentor & Alokasi Kategori"
                      >
                        <span className="material-symbols-outlined text-base">edit</span>
                      </button>

                      {/* DELETE BUTTON */}
                      <button
                        type="button"
                        onClick={() => onDelete(item)}
                        className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-300 text-rose-600 transition-colors cursor-pointer"
                        title="Hapus Mentor"
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