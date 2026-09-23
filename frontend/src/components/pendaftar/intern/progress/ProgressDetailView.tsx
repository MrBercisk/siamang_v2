import React from 'react';
import type { ProgressItem } from '../../../../types/progressPeserta';

interface ProgressDetailViewProps {
  item: ProgressItem;
  onBack: () => void;
}

export const ProgressDetailView: React.FC<ProgressDetailViewProps> = ({ item, onBack }) => (
  <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 sm:p-8 space-y-6">
    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
      <h2 className="text-xl font-bold text-slate-900">Detail Progress Magang</h2>
      <button
        type="button"
        onClick={onBack}
        className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50"
      >
        Kembali
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
      <div className="p-4 bg-slate-50 rounded-xl space-y-1">
        <span className="text-slate-400 font-medium">Judul Project</span>
        <p className="font-bold text-slate-900 text-sm">{item.judulProject}</p>
      </div>

      <div className="p-4 bg-slate-50 rounded-xl space-y-1">
        <span className="text-slate-400 font-medium">Tanggal Bimbingan</span>
        <p className="font-bold text-slate-900 text-sm">{item.tanggalBimbingan}</p>
      </div>

      <div className="p-4 bg-slate-50 rounded-xl space-y-1 md:col-span-2">
        <span className="text-slate-400 font-medium">Pencapaian</span>
        <p className="font-bold text-slate-900 leading-relaxed">{item.pencapaian}</p>
      </div>

      <div className="p-4 bg-slate-50 rounded-xl space-y-1 md:col-span-2">
        <span className="text-slate-400 font-medium">Catatan Mentor</span>
        <p className="font-semibold text-slate-800 leading-relaxed">{item.catatan}</p>
      </div>

      <div className="p-4 bg-slate-50 rounded-xl space-y-1">
        <span className="text-slate-400 font-medium">File Presentasi</span>
        <div>
          {item.filePresentasiUrl ? (
            <a
              href={item.filePresentasiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 px-4 py-2 rounded-xl bg-[#1f877c] text-white font-bold text-xs shadow-2xs inline-flex items-center gap-1.5"
            >
              Download File ({item.fileName ?? 'file.pdf'})
            </a>
          ) : (
            <p className="mt-1 text-slate-400 font-medium">Tidak ada file.</p>
          )}
        </div>
      </div>

      <div className="p-4 bg-slate-50 rounded-xl space-y-1">
        <span className="text-slate-400 font-medium">Tanggal &amp; Waktu Upload</span>
        <p className="font-bold text-slate-900">{item.tanggalUpload}</p>
      </div>
    </div>
  </div>
);