import React from 'react';
import { PeriodeInfo } from '../../../types/periode';
import { TablePagination } from './TablePagination';
import { formatDate } from '../../../utils/formatters'

interface PeriodeInfoTableProps {
  periodeList: PeriodeInfo[];
  selectedPeriodeId: number | null;
  onSelect: (id: number) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (value: number) => void;
  onEdit: (periode: PeriodeInfo) => void;
}

export const PeriodeInfoTable: React.FC<PeriodeInfoTableProps> = ({
  periodeList,
  selectedPeriodeId,
  onSelect,
  searchTerm,
  onSearchChange,
  itemsPerPage,
  onItemsPerPageChange,
  onEdit,
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-base font-bold text-slate-800">Informasi Periode Magang</h2>

      {/* CONTROLS BAR: TAMPILKAN ENTRI & CARI */}
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

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari ..."
            className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#1f877c]"
          />
        </div>
      </div>

      {/* TABLE PERIODE */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-white text-slate-800 font-bold">
              <th className="py-3.5 px-4 text-center w-12">No</th>
              <th className="py-3.5 px-4">Nama Periode</th>
              <th className="py-3.5 px-4">Tanggal Pembukaan Pendaftaran</th>
              <th className="py-3.5 px-4">Tanggal Penutupan Pendaftaran</th>
              <th className="py-3.5 px-4">Tanggal Pengumuman</th>
              <th className="py-3.5 px-4">Tanggal Mulai Magang</th>
              <th className="py-3.5 px-4">Tanggal Selesai Magang</th>
              <th className="py-3.5 px-4 text-center w-24">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {periodeList.length === 0 ? <tr><td colSpan={6} className="py-8 text-center text-slate-400">Belum ada data periode.</td></tr> : periodeList.map((periode, index) => <tr key={periode.id} className={`hover:bg-slate-50/60 transition-colors ${selectedPeriodeId === periode.id ? 'bg-teal-50/50' : ''}`} onClick={() => onSelect(periode.id)}>
              <td className="py-4 px-4 text-center font-bold text-slate-600">{index + 1}</td>
              <td className="py-4 px-4 font-medium text-slate-800">{periode.name}{periode.isActive && <span className="ml-2 rounded-full bg-emerald-100 px-2 py-1 text-[10px] text-emerald-700">Aktif</span>}</td>
              <td className="py-4 px-4 font-medium text-slate-800">{formatDate(periode.startDate)}</td>
              <td className="py-4 px-4 font-medium text-slate-800">{formatDate(periode.endDate)}</td>
              <td className="py-4 px-4 font-medium text-slate-800">{formatDate(periode.announcementDate)}</td>
              <td className="py-4 px-4 font-medium text-slate-800">{formatDate(periode.internshipStart)}</td>
              <td className="py-4 px-4 font-medium text-slate-800">{formatDate(periode.internshipEnd)}</td>
              <td className="py-4 px-4 text-center">
                <button
                  type="button"
                  onClick={(event) => { event.stopPropagation(); onEdit(periode); }}
                  className="p-2 rounded-xl border border-cyan-300 bg-cyan-50/50 hover:bg-cyan-100 text-cyan-600 transition-colors cursor-pointer inline-flex items-center justify-center"
                  title="Edit Periode"
                >
                  <span className="material-symbols-outlined text-lg">edit_note</span>
                </button>
              </td>
            </tr>)}
          </tbody>
        </table>
      </div>

      <TablePagination shownCount={periodeList.length} totalCount={periodeList.length} />
    </div>
  );
};