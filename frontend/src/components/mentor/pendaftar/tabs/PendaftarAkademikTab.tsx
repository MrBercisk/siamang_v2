import React from 'react';
import type { PendaftarData } from '../../../../types/pendaftar';

interface PendaftarAkademikTabProps {
  pendaftar: PendaftarData;
}

export const PendaftarAkademikTab: React.FC<PendaftarAkademikTabProps> = ({ pendaftar }) => (
  <table className="w-full text-xs text-left divide-y divide-slate-100">
    <tbody className="divide-y divide-slate-100">
      <tr>
        <td className="py-3.5 px-4 font-bold text-slate-400 w-12 text-center">1</td>
        <td className="py-3.5 px-4 text-slate-600 font-medium w-48">Nama Kampus / Universitas</td>
        <td className="py-3.5 px-4 font-bold text-slate-900">{pendaftar.instansi}</td>
      </tr>
      <tr>
        <td className="py-3.5 px-4 font-bold text-slate-400 text-center">2</td>
        <td className="py-3.5 px-4 text-slate-600 font-medium">Program Studi / Jurusan</td>
        <td className="py-3.5 px-4 font-bold text-slate-900">{pendaftar.jurusan || '-'}</td>
      </tr>
      <tr>
        <td className="py-3.5 px-4 font-bold text-slate-400 text-center">3</td>
        <td className="py-3.5 px-4 text-slate-600 font-medium">NIM / NIK</td>
        <td className="py-3.5 px-4 font-bold text-slate-900">{pendaftar.nim}</td>
      </tr>
      <tr>
        <td className="py-3.5 px-4 font-bold text-slate-400 text-center">4</td>
        <td className="py-3.5 px-4 text-slate-600 font-medium">Semester Saat Ini</td>
        <td className="py-3.5 px-4 font-bold text-slate-900">{pendaftar.semester || '-'}</td>
      </tr>
    </tbody>
  </table>
);