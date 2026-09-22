import React from 'react';
import type { PendaftarData } from '../../../../types/pendaftar';

interface PendaftarKelompokTabProps {
  pendaftar: PendaftarData;
}

export const PendaftarKelompokTab: React.FC<PendaftarKelompokTabProps> = ({ pendaftar }) => (
  <table className="w-full text-xs text-left divide-y divide-slate-100">
    <thead>
      <tr className="bg-slate-50 text-slate-700 font-bold">
        <th className="py-3 px-4 text-center w-12">No</th>
        <th className="py-3 px-4">Nama Anggota</th>
        <th className="py-3 px-4">Peran</th>
        <th className="py-3 px-4">NIM</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-slate-100">
      <tr>
        <td className="py-3.5 px-4 font-bold text-slate-400 text-center">1</td>
        <td className="py-3.5 px-4 font-bold text-slate-900">{pendaftar.nama}</td>
        <td className="py-3.5 px-4">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
            Ketua Tim
          </span>
        </td>
        <td className="py-3.5 px-4 text-slate-700 font-medium">{pendaftar.nim}</td>
      </tr>
      {(pendaftar.teamMembers ?? []).map((member, index) => (
        <tr key={member.id}>
          <td className="py-3.5 px-4 font-bold text-slate-400 text-center">{index + 2}</td>
          <td className="py-3.5 px-4 font-bold text-slate-900">{member.fullName}</td>
          <td className="py-3.5 px-4">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
              Anggota {index + 1}
            </span>
          </td>
          <td className="py-3.5 px-4 text-slate-700 font-medium">{member.nim || '-'}</td>
        </tr>
      ))}
    </tbody>
  </table>
);