import React from 'react';

interface BimbinganPaginationProps {
  total: number;
  page: number;
  perPage: number;
  onPageChange: (page: number) => void;
}

/** Maksimal `size` nomor halaman yang tampil, berpusat di halaman aktif. */
function getVisiblePages(current: number, totalPages: number, size = 5): number[] {
  const half = Math.floor(size / 2);
  let start = Math.max(1, current - half);
  const end = Math.min(totalPages, start + size - 1);
  start = Math.max(1, end - size + 1);
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

const NAV_BUTTON =
  'w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 cursor-pointer disabled:text-slate-300 disabled:hover:bg-transparent disabled:cursor-not-allowed';

export const BimbinganPagination: React.FC<BimbinganPaginationProps> = ({
  total,
  page,
  perPage,
  onPageChange,
}) => {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const from = total === 0 ? 0 : (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);

  return (
    <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
      <div>
        {total === 0 ? 'Tidak ada entri.' : `Menampilkan ${from} - ${to} dari ${total} entri.`}
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Halaman sebelumnya"
          className={NAV_BUTTON}
        >
          <span className="material-symbols-outlined text-sm">chevron_left</span>
        </button>

        {getVisiblePages(page, totalPages).map((number) => (
          <button
            key={number}
            type="button"
            onClick={() => onPageChange(number)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer ${
              number === page
                ? 'bg-[#1f877c] text-white font-bold'
                : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {number}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Halaman berikutnya"
          className={NAV_BUTTON}
        >
          <span className="material-symbols-outlined text-sm">chevron_right</span>
        </button>
      </div>
    </div>
  );
};