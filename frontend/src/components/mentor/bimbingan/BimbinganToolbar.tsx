import React from 'react';

interface BimbinganToolbarProps {
  perPage: number;
  onPerPageChange: (value: number) => void;
  search: string;
  onSearchChange: (value: string) => void;
}

export const BimbinganToolbar: React.FC<BimbinganToolbarProps> = ({
  perPage,
  onPerPageChange,
  search,
  onSearchChange,
}) => (
  <div className="p-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
    <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
      <span>Tampilkan</span>
      <select
        value={perPage}
        onChange={(e) => onPerPageChange(Number(e.target.value))}
        className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-bold text-slate-800 focus:outline-hidden focus:border-[#1f877c]"
      >
        <option value={10}>10</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
      </select>
      <span>data per halaman</span>
    </div>

    <div className="relative min-w-[240px]">
      <input
        type="text"
        placeholder="Cari ..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pl-3 pr-8 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-[#1f877c]"
      />
    </div>
  </div>
);