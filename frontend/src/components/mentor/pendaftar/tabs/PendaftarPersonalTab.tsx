import React from 'react';
import type { PendaftarData } from '../../../../types/pendaftar';

interface PendaftarPersonalTabProps {
  pendaftar: PendaftarData;
}

export const PendaftarPersonalTab: React.FC<PendaftarPersonalTabProps> = ({ pendaftar }) => (
  <table className="w-full text-xs text-left divide-y divide-slate-100">
    <tbody className="divide-y divide-slate-100">
      <tr>
        <td className="py-3.5 px-4 font-bold text-slate-400 w-12 text-center">1</td>
        <td className="py-3.5 px-4 text-slate-600 font-medium w-48">Nama Lengkap</td>
        <td className="py-3.5 px-4 font-bold text-slate-900">{pendaftar.nama}</td>
      </tr>
      <tr>
        <td className="py-3.5 px-4 font-bold text-slate-400 text-center">2</td>
        <td className="py-3.5 px-4 text-slate-600 font-medium">Email</td>
        <td className="py-3.5 px-4 font-bold text-slate-900">{pendaftar.email}</td>
      </tr>
      <tr>
        <td className="py-3.5 px-4 font-bold text-slate-400 text-center">3</td>
        <td className="py-3.5 px-4 text-slate-600 font-medium">No. Handphone</td>
        <td className="py-3.5 px-4 font-bold text-slate-900">{pendaftar.phone}</td>
      </tr>
    </tbody>
  </table>
);