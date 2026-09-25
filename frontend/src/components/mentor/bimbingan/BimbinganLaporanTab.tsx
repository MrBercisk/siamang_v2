import React, { useState } from 'react';
import type { LaporanItem, LaporanStatus } from '../../../types/bimbinganMentor';
import { DownloadButton } from './DownloadButton';

interface BimbinganLaporanTabProps {
  items: LaporanItem[];
  /** ID laporan yang sedang diproses (tombol dikunci selama request berjalan). */
  updatingId: string | null;
  onUpdateStatus: (laporanId: string, status: 'diterima' | 'ditolak', catatan?: string) => void;
}

const STATUS_BADGE: Record<LaporanStatus, { label: string; className: string }> = {
  pending: { label: 'Menunggu', className: 'bg-amber-50 text-amber-700 border-amber-300' },
  diterima: { label: 'Disetujui', className: 'bg-emerald-50 text-emerald-700 border-emerald-300' },
  ditolak: { label: 'Ditolak', className: 'bg-rose-50 text-rose-700 border-rose-300' },
};

export const BimbinganLaporanTab: React.FC<BimbinganLaporanTabProps> = ({
  items,
  updatingId,
  onUpdateStatus,
}) => {
  const [rejectTarget, setRejectTarget] = useState<LaporanItem | null>(null);
  const [catatan, setCatatan] = useState('');

  const openRejectModal = (laporan: LaporanItem) => {
    setRejectTarget(laporan);
    setCatatan('');
  };

  const closeRejectModal = () => {
    setRejectTarget(null);
    setCatatan('');
  };

  const confirmReject = () => {
    if (!rejectTarget) return;
    onUpdateStatus(rejectTarget.id, 'ditolak', catatan.trim() || undefined);
    closeRejectModal();
  };

  return (
    <div className="p-6">
      <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-800 font-bold bg-white">
              <th className="py-4 px-6 text-center w-16">No</th>
              <th className="py-4 px-6">Judul Laporan</th>
              <th className="py-4 px-6 text-center">File Laporan</th>
              <th className="py-4 px-6">Link Project</th>
              <th className="py-4 px-6 text-center">Form Nilai</th>
              <th className="py-4 px-6 text-center">Status</th>
              <th className="py-4 px-6 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-slate-400 font-medium">
                  Belum ada laporan yang diunggah mahasiswa.
                </td>
              </tr>
            ) : (
              items.map((laporan, index) => {
                const badge = STATUS_BADGE[laporan.status];
                const busy = updatingId === laporan.id;

                return (
                  <tr key={laporan.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-5 px-6 text-center font-bold text-slate-500">{index + 1}</td>
                    <td className="py-5 px-6 font-semibold text-slate-800 whitespace-nowrap">
                      {laporan.judulLaporan}
                    </td>
                    <td className="py-5 px-6 text-center">
                      <DownloadButton url={laporan.fileLaporanUrl} />
                    </td>
                    <td className="py-5 px-6">
                      {laporan.linkProject ? (
                        <a
                          href={laporan.linkProject}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-700 hover:text-[#1f877c] font-medium transition-colors break-all"
                        >
                          {laporan.linkProject}
                        </a>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-5 px-6 text-center">
                      <DownloadButton url={laporan.formNilaiUrl} />
                    </td>
                    <td className="py-5 px-6 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold border ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                      {laporan.status === 'ditolak' && laporan.catatanReject && (
                        <div
                          className="mt-1.5 text-[10px] text-rose-500 italic max-w-[160px] mx-auto truncate"
                          title={laporan.catatanReject}
                        >
                          "{laporan.catatanReject}"
                        </div>
                      )}
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => onUpdateStatus(laporan.id, 'diterima')}
                          disabled={busy || laporan.status === 'diterima'}
                          className="w-9 h-9 rounded-xl border border-[#1f877c] text-[#1f877c] hover:bg-[#E6F7F3] flex items-center justify-center cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                          title="Setujui Laporan"
                        >
                          <span className="material-symbols-outlined text-lg font-bold">
                            check_circle
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => openRejectModal(laporan)}
                          disabled={busy || laporan.status === 'ditolak'}
                          className="w-9 h-9 rounded-xl border border-rose-400 text-rose-500 hover:bg-rose-50 flex items-center justify-center cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                          title="Tolak / Revisi Laporan"
                        >
                          <span className="material-symbols-outlined text-lg font-bold">cancel</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {rejectTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-sm font-bold text-slate-800">Tolak Laporan</h3>
            <p className="mt-1 text-xs text-slate-500">{rejectTarget.judulLaporan}</p>
            <textarea
              autoFocus
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Catatan / alasan penolakan (opsional)"
              rows={4}
              className="mt-4 w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-200 resize-none"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeRejectModal}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmReject}
                className="px-4 py-2 rounded-xl bg-rose-500 text-white text-xs font-bold hover:bg-rose-600 cursor-pointer"
              >
                Tolak Laporan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};