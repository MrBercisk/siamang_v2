import React from 'react';

interface TablePaginationProps {
  shownCount: number;
  totalCount: number;
}

/** Pagination statis (1 halaman) — dipakai tabel Periode & tabel Lowongan. */
export const TablePagination: React.FC<TablePaginationProps> = ({ shownCount, totalCount }) => (
  <div className="flex items-center justify-between text-xs text-slate-400 font-medium pt-1">
    <span>
      Menampilkan {shownCount} dari {totalCount} entri.
    </span>
    <div className="flex items-center gap-1">
      <button
        disabled
        className="w-7 h-7 rounded-lg border border-slate-200 text-slate-300 flex items-center justify-center cursor-not-allowed"
      >
        &lt;
      </button>
      <button className="w-7 h-7 rounded-lg bg-[#1f877c] text-white font-bold flex items-center justify-center">
        1
      </button>
      <button
        disabled
        className="w-7 h-7 rounded-lg border border-slate-200 text-slate-300 flex items-center justify-center cursor-not-allowed"
      >
        &gt;
      </button>
    </div>
  </div>
);