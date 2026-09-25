import React from 'react';

export const NilaiNotPublishedView: React.FC = () => (
  <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-8 flex flex-col items-center justify-center text-center space-y-4">
    <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500">
      <span className="material-symbols-outlined text-3xl">pending_actions</span>
    </div>
    <div className="space-y-1">
      <h3 className="text-xl font-bold text-slate-900">Nilai Magang Belum Tersedia</h3>
      <p className="text-xs text-slate-600 max-w-md leading-relaxed">
        Mentor lapangan belum menyelesaikan evaluasi atau belum input nilai magang Anda.
        Silakan hubungi mentor Anda atau cek kembali setelah laporan magang disetujui.
      </p>
    </div>
    <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
      Status: Menunggu Evaluasi Mentor
    </span>
  </div>
);