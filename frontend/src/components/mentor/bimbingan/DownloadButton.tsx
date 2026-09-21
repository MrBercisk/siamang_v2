import React from 'react';

interface DownloadButtonProps {
  /** URL file dari backend. Kosong = file belum diunggah mahasiswa. */
  url?: string;
  label?: string;
}

const BASE = 'px-4 py-2 rounded-xl font-bold text-xs inline-flex items-center gap-1.5 transition-all';

export const DownloadButton: React.FC<DownloadButtonProps> = ({ url, label = 'Download File' }) => {
  if (!url) {
    return (
      <span
        className={`${BASE} bg-slate-100 text-slate-400 cursor-not-allowed`}
        title="File belum tersedia"
      >
        Belum ada file
      </span>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className={`${BASE} bg-[#1f877c] hover:bg-[#196e65] text-white shadow-2xs cursor-pointer`}
    >
      {label}
    </a>
  );
};