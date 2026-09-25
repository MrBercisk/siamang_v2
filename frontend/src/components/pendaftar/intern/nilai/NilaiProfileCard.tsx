import React from 'react';
import type { NilaiProfile } from '../../../../types/nilaiPeserta';

interface NilaiProfileCardProps {
  profile: NilaiProfile;
}

export const NilaiProfileCard: React.FC<NilaiProfileCardProps> = ({ profile }) => (
  <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-4">
    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
      Informasi Peserta Magang
    </h4>

    <div className="space-y-3 text-xs">
      <div>
        <span className="text-slate-400 font-medium block">Nama Peserta</span>
        <p className="font-bold text-slate-900 text-sm">{profile.nama}</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <span className="text-slate-400 font-medium block">NIM / ID</span>
          <p className="font-semibold text-slate-800">{profile.nim ?? '-'}</p>
        </div>
        <div>
          <span className="text-slate-400 font-medium block">Instansi</span>
          <p className="font-semibold text-slate-800">{profile.instansi ?? '-'}</p>
        </div>
      </div>

      <div>
        <span className="text-slate-400 font-medium block">Kategori Magang</span>
        <p className="font-semibold text-slate-800">{profile.kategori ?? '-'}</p>
      </div>

      <div>
        <span className="text-slate-400 font-medium block">Judul Project</span>
        <p className="font-semibold text-[#1f877c]">{profile.judulProject ?? '-'}</p>
      </div>

     <div>
    <span className="text-slate-400 font-medium block">Mentor Lapangan</span>
        <p className="font-bold text-slate-900">{profile.mentorNama ?? '-'}</p>
        <p className="text-[11px] text-slate-400 font-medium">
            {profile.mentorNip ? `NIP. ${profile.mentorNip}` : ''}
        </p>
     </div>
    </div>
  </div>
);