import React from 'react';
import type { ProgressItem } from '../../../types/bimbinganMentor';
import { DownloadButton } from './DownloadButton';

interface BimbinganProgressTabProps {
  items: ProgressItem[];
}

export const BimbinganProgressTab: React.FC<BimbinganProgressTabProps> = ({ items }) => (
  <div className="p-6">
    <div className="rounded-xl border border-slate-200 overflow-hidden">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b border-slate-200 text-slate-900 font-bold bg-slate-50/60">
            <th className="py-3.5 px-4 text-center w-12">No</th>
            <th className="py-3.5 px-4">Tanggal Bimbingan</th>
            <th className="py-3.5 px-4">Pencapaian</th>
            <th className="py-3.5 px-4">Catatan</th>
            <th className="py-3.5 px-4 text-center">File Presentasi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-10 text-center text-slate-400 font-medium">
                Belum ada catatan progress dari mahasiswa.
              </td>
            </tr>
          ) : (
            items.map((item, index) => (
              <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-4 px-4 text-center font-bold text-slate-500">{index + 1}</td>
                <td className="py-4 px-4 text-slate-700 font-medium whitespace-nowrap">
                  {item.tanggal}
                </td>
                <td className="py-4 px-4 font-bold text-slate-900">{item.pencapaian}</td>
                <td className="py-4 px-4 text-slate-600 font-medium">{item.catatan}</td>
                <td className="py-4 px-4 text-center">
                  <DownloadButton url={item.filePresentasiUrl} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);