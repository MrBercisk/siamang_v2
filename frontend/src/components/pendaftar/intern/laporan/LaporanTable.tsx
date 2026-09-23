import React from 'react';
import type { LaporanItem, NilaiMagangSummary } from '../../../../types/laporanPeserta';

interface LaporanTableProps {
  laporan: LaporanItem;
  nilai: NilaiMagangSummary | null;
  onEdit?: () => void;
  onUploadUlang?: () => void;
}

const STATUS_BADGE: Record<LaporanItem['status'], string> = {
  pending: '',
  ditolak: 'px-5 py-2 rounded-full text-xs font-bold bg-rose-100 text-rose-700 border border-rose-300 inline-block',
  diterima: 'px-5 py-2 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 inline-block',
};

export const LaporanTable: React.FC<LaporanTableProps> = ({ laporan, nilai, onEdit, onUploadUlang }) => {
  const nilaiLabel = nilai?.isPublished && nilai.predikat ? nilai.predikat : 'Belum Ada Nilai Magang';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-lg font-bold text-slate-900">Data Laporan Magang</h3>
        {laporan.status === 'ditolak' && onUploadUlang && (
          <button
            type="button"
            onClick={onUploadUlang}
            className="px-4 py-2.5 rounded-xl bg-[#1f877c] hover:bg-[#196e65] text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
          >
            <span>Upload Laporan</span>
            <span className="material-symbols-outlined text-lg leading-none">add</span>
          </button>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-900 font-bold bg-white">
                <th className="py-4 px-6 text-center w-16">No</th>
                <th className="py-4 px-6">Judul Laporan</th>
                <th className="py-4 px-6 text-center">File Laporan</th>
                <th className="py-4 px-6">Link Google Drive</th>
                <th className="py-4 px-6 text-center">Nilai Magang</th>
                <th className="py-4 px-6 text-center whitespace-nowrap">Tanggal Upload</th>
                <th className="py-4 px-6 text-center">{laporan.status === 'pending' ? 'Aksi' : 'Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="py-5 px-6 text-center font-bold text-slate-400">1</td>
                <td className="py-5 px-6 font-semibold text-slate-800">{laporan.judulLaporan}</td>
                <td className="py-5 px-6 text-center">
                  {laporan.fileLaporanUrl ? (
                    <a
                      href={laporan.fileLaporanUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2 rounded-xl bg-[#1f877c] hover:bg-[#196e65] text-white font-bold text-xs shadow-2xs transition-all cursor-pointer inline-flex items-center gap-1.5"
                    >
                      Download File
                    </a>
                  ) : (
                    <span className="text-slate-300 font-medium">-</span>
                  )}
                </td>
                <td className="py-5 px-6 font-medium text-slate-700 break-all">{laporan.linkGoogleDrive}</td>
                <td className="py-5 px-6 text-center">
                  <span className="px-4 py-2 rounded-full text-xs font-bold bg-[#fef3c7] text-[#b45309] border border-[#fde68a] inline-block whitespace-nowrap">
                    {nilaiLabel}
                  </span>
                </td>
                <td className="py-5 px-6 text-center text-slate-500 font-medium whitespace-nowrap">
                  {laporan.tanggalUpload}
                </td>
                <td className="py-5 px-6 text-center">
                  {laporan.status === 'pending' && laporan.canEdit && onEdit ? (
                    <button
                      type="button"
                      onClick={onEdit}
                      className="w-8 h-8 rounded-lg border border-sky-400 text-sky-500 hover:bg-sky-50 flex items-center justify-center cursor-pointer transition-all mx-auto"
                      title="Edit Laporan"
                    >
                      <span className="material-symbols-outlined text-base">edit</span>
                    </button>
                  ) : laporan.status === 'ditolak' ? (
                    <span className={STATUS_BADGE.ditolak}>Ditolak</span>
                  ) : laporan.status === 'diterima' ? (
                    <span className={STATUS_BADGE.diterima}>Diterima</span>
                  ) : (
                    <span className="text-slate-300 font-medium">-</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};