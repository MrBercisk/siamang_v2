import React from 'react';
import { PendaftarData } from '../../../types/pendaftar';

interface PendaftarTableProps {
  applicantList: PendaftarData[];
  totalCount: number;
  searchTerm: string;
  statusFilter: string;
  categoryFilter: string;
  categoryOptions: string[];
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onCategoryFilterChange: (value: string) => void;
  onDetail: (item: PendaftarData) => void;
  onTerima: (item: PendaftarData) => void;
  onTolak: (item: PendaftarData) => void;
}

export const PendaftarTable: React.FC<PendaftarTableProps> = ({
  applicantList,
  totalCount,
  searchTerm,
  statusFilter,
  categoryFilter,
  categoryOptions,
  onSearchChange,
  onStatusFilterChange,
  onCategoryFilterChange,
  onDetail,
  onTerima,
  onTolak,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 space-y-5">

      {/* SEARCH & FILTERS */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">

          <div className="relative w-full sm:w-64">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-lg">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari nama, kampus, NIM..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1f877c]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="w-full sm:w-44 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white"
          >
            <option value="Semua">Semua Status</option>
            <option value="Verifikasi">Menunggu Verifikasi</option>
            <option value="Diterima">Diterima</option>
            <option value="Ditolak">Ditolak</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => onCategoryFilterChange(e.target.value)}
            className="w-full sm:w-56 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white"
          >
            <option value="Semua">Semua Kategori Magang</option>
            {categoryOptions.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

        </div>

        <span className="text-xs text-slate-400 font-bold self-end lg:self-center">
          Menampilkan {applicantList.length} dari {totalCount} Pendaftar
        </span>
      </div>

      {/* DATA TABLE */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-700 font-bold text-[11px] uppercase tracking-wider">
              <th className="py-3.5 px-4 w-12 text-center">No</th>
              <th className="py-3.5 px-4">Nama Pendaftar</th>
              <th className="py-3.5 px-4">Instansi / Jurusan</th>
              <th className="py-3.5 px-4">Kategori Pilihan</th>
              <th className="py-3.5 px-4 text-center">Tipe</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4 text-center w-36">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {applicantList.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400 font-medium">
                  Tidak ada pendaftar yang sesuai dengan filter pencarian.
                </td>
              </tr>
            ) : (
              applicantList.map((app, index) => (
                <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">

                  <td className="py-4 px-4 text-center font-bold text-slate-400 text-xs">
                    {index + 1}
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      {app.fotoUrl ? (
                        <img
                          src={app.fotoUrl}
                          alt={app.nama || 'Pendaftar'}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                      ) : (
                        <div
                          className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center text-slate-500 font-bold text-[11px]"
                          aria-hidden="true"
                        >
                          {(app.nama || '?').trim().charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <button
                          type="button"
                          onClick={() => onDetail(app)}
                          className="font-bold text-slate-900 text-xs hover:text-[#1f877c] text-left cursor-pointer transition-colors"
                        >
                          {app.nama || '(Nama tidak tersedia)'}
                        </button>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                          {app.email || '-'} • {app.phone || '-'}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <p className="font-semibold text-slate-800 text-xs">{app.instansi}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{app.jurusan || app.nim}</p>
                  </td>

                  <td className="py-4 px-4 font-medium text-slate-700 max-w-[180px] leading-tight">
                    {app.kategori}
                  </td>

                  <td className="py-4 px-4 text-center">
                    <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {app.tipeDaftar || 'Kelompok'}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold ${
                        app.status === 'Diterima'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : app.status === 'Ditolak'
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                    >
                      {app.status === 'Verifikasi' ? 'Verifikasi' : app.status}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">

                      <button
                        type="button"
                        onClick={() => onDetail(app)}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                        title="Lihat Detail Pendaftar"
                      >
                        <span className="material-symbols-outlined text-sm">visibility</span>
                        <span>Detail</span>
                      </button>

                      {app.status !== 'Diterima' && (
                        <button
                          type="button"
                          onClick={() => onTerima(app)}
                          className="p-1.5 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors cursor-pointer"
                          title="Terima Pendaftaran"
                        >
                          <span className="material-symbols-outlined text-base">check</span>
                        </button>
                      )}

                      {app.status !== 'Ditolak' && (
                        <button
                          type="button"
                          onClick={() => onTolak(app)}
                          className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer"
                          title="Tolak Pendaftaran"
                        >
                          <span className="material-symbols-outlined text-base">close</span>
                        </button>
                      )}

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