import React from 'react';
import type { PendaftarData } from '../../../../types/pendaftar';

interface PendaftarProjectTabProps {
  pendaftar: PendaftarData;
}

export const PendaftarProjectTab: React.FC<PendaftarProjectTabProps> = ({ pendaftar }) => (
  <table className="w-full text-xs text-left divide-y divide-slate-100">
    <tbody className="divide-y divide-slate-100">
      <tr>
        <td className="py-3.5 px-4 font-bold text-slate-400 w-12 text-center">1</td>
        <td className="py-3.5 px-4 text-slate-600 font-medium w-48">Kategori / Divisi Magang</td>
        <td className="py-3.5 px-4 font-bold text-slate-900">{pendaftar.kategori}</td>
      </tr>
      <tr>
        <td className="py-3.5 px-4 font-bold text-slate-400 text-center">2</td>
        <td className="py-3.5 px-4 text-slate-600 font-medium">Judul Project</td>
        <td className="py-3.5 px-4 font-bold text-slate-900">{pendaftar.projectTitle || '-'}</td>
      </tr>
      <tr>
        <td className="py-3.5 px-4 font-bold text-slate-400 text-center">3</td>
        <td className="py-3.5 px-4 text-slate-600 font-medium">Lowongan</td>
        <td className="py-3.5 px-4 font-bold text-slate-900">{pendaftar.lowongan || '-'}</td>
      </tr>
      <tr>
        <td className="py-3.5 px-4 font-bold text-slate-400 text-center">4</td>
        <td className="py-3.5 px-4 text-slate-600 font-medium">Keahlian Utama</td>
        <td className="py-3.5 px-4 font-bold text-slate-900">{pendaftar.keahlian || '-'}</td>
      </tr>
      <tr>
        <td className="py-3.5 px-4 font-bold text-slate-400 text-center">5</td>
        <td className="py-3.5 px-4 text-slate-600 font-medium">Tools yang Dikuasai</td>
        <td className="py-3.5 px-4 font-bold text-slate-900">{pendaftar.tools || '-'}</td>
      </tr>
      <tr>
        <td className="py-3.5 px-4 font-bold text-slate-400 text-center">6</td>
        <td className="py-3.5 px-4 text-slate-600 font-medium">Periode Magang</td>
        <td className="py-3.5 px-4 font-bold text-slate-900">
          {pendaftar.tanggalMulai || '-'} - {pendaftar.tanggalSelesai || '-'}
        </td>
      </tr>
    </tbody>
  </table>
);