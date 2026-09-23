import React from 'react';

export const LaporanLockedView: React.FC = () => (
  <div className="min-h-[380px] bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-8 flex flex-col items-center justify-center text-center space-y-3">
    <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
      Halaman ini belum bisa diakses!
    </h2>
    <p className="text-sm text-slate-600 font-medium max-w-md">
      Selesaikan progress magang agar bisa upload laporan magang Anda.
    </p>
  </div>
);