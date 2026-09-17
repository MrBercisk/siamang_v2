import React from 'react';
import { BidangItem } from '../../../types/bidang';

interface BidangTrashTableProps {
  bidangList: BidangItem[];
  loading: boolean;
  error: string | null;
  onRestore: (item: BidangItem) => void;
  onForceDelete: (item: BidangItem) => void;
}

function formatDeletedAt(value?: string | null): string {
  if (!value) return '-';
  try {
    return new Date(value).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
  } catch {
    return value;
  }
}

export const BidangTrashTable: React.FC<BidangTrashTableProps> = ({
  bidangList,
  loading,
  error,
  onRestore,
  onForceDelete,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 space-y-5">
      <div className="pb-3 border-b border-slate-100">
        <h3 className="text-sm font-bold text-slate-900">Sampah Bidang</h3>
        <p className="text-[11px] text-slate-500 mt-0.5">
          Bidang yang dihapus tetap tersimpan di sini beserta kategorinya, dan bisa dipulihkan kapan saja.
        </p>
      </div>

      {loading ? (
        <div className="py-10 text-center text-sm font-medium text-slate-500">Memuat data sampah...</div>
      ) : error ? (
        <div className="py-10 text-center text-sm font-medium text-red-500">Gagal memuat data: {error}</div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-700 font-bold text-[11px] uppercase tracking-wider">
                <th className="py-3.5 px-4">Nama Bidang</th>
                <th className="py-3.5 px-4 text-center">Kategori</th>
                <th className="py-3.5 px-4">Dihapus Pada</th>
                <th className="py-3.5 px-4 text-center w-44">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bidangList.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400 font-medium">
                    Sampah kosong.
                  </td>
                </tr>
              ) : (
                bidangList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate-900">{item.name}</td>
                    <td className="py-4 px-4 text-center">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                        {item.categoryCount} Kategori
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-500">{formatDeletedAt(item.deletedAt)}</td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onRestore(item)}
                          className="px-2.5 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                          title="Pulihkan Bidang"
                        >
                          <span className="material-symbols-outlined text-sm">restore</span>
                          Pulihkan
                        </button>
                        <button
                          type="button"
                          onClick={() => onForceDelete(item)}
                          className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-300 text-rose-600 transition-colors cursor-pointer"
                          title="Hapus Permanen"
                        >
                          <span className="material-symbols-outlined text-base">delete_forever</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};