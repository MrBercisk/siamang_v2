import React from 'react';

interface JadwalActionBarProps {
  loading: boolean;
  syncing: boolean;
  onRefresh: () => void;
  onSyncFromGoogle: () => void;
}

export const JadwalActionBar: React.FC<JadwalActionBarProps> = ({
  loading,
  syncing,
  onRefresh,
  onSyncFromGoogle,
}) => {
  const busy = loading || syncing;

  return (
    <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col lg:flex-row lg:items-center justify-between gap-3 shadow-md">
      <div className="flex items-center gap-3 text-xs">
        <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400 font-bold shrink-0">
          <span className="material-symbols-outlined text-lg">sync_alt</span>
        </div>
        <div>
          <span className="font-bold block text-sm">Jadwal tersimpan di database</span>
          <p className="text-slate-300 text-[11px]">
            Agenda yang dibuat langsung di Google Calendar bisa ditarik ke sini. Tambahkan email
            mahasiswa dan mentor sebagai tamu event agar terbaca otomatis.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onSyncFromGoogle}
          disabled={busy}
          className="px-3.5 py-2 rounded-xl bg-[#1f877c] hover:bg-[#196e65] text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer disabled:opacity-50"
        >
          <span className={`material-symbols-outlined text-base ${syncing ? 'animate-spin' : ''}`}>
            {syncing ? 'sync' : 'cloud_download'}
          </span>
          <span>{syncing ? 'Menarik...' : 'Tarik dari Google Calendar'}</span>
        </button>

        <button
          type="button"
          onClick={onRefresh}
          disabled={busy}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 border border-slate-700 shadow-2xs transition-all cursor-pointer disabled:opacity-50"
        >
          <span className={`material-symbols-outlined text-base ${loading ? 'animate-spin' : ''}`}>
            refresh
          </span>
          <span>Muat ulang</span>
        </button>
      </div>
    </div>
  );
};