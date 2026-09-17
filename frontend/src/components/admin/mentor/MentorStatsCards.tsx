import React from 'react';
import { MentorItem } from '../../../types/mentor';

interface MentorStatsCardsProps {
  mentorList: MentorItem[];
}

export const MentorStatsCards: React.FC<MentorStatsCardsProps> = ({ mentorList }) => {
  const totalMentor = mentorList.length;
  const totalAktif = mentorList.filter((m) => m.status === 'Aktif').length;
  const totalMentees = mentorList.reduce((acc, curr) => acc + curr.totalMentees, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
        <div>
          <span className="text-slate-400 font-bold block">Total Mentor Pembimbing</span>
          <span className="text-2xl font-black text-slate-900 mt-0.5 block">{totalMentor} Mentor</span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#1f877c] flex items-center justify-center">
          <span className="material-symbols-outlined text-2xl">supervisor_account</span>
        </div>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
        <div>
          <span className="text-slate-400 font-bold block">Mentor Aktif</span>
          <span className="text-2xl font-black text-emerald-600 mt-0.5 block">{totalAktif} Orang</span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <span className="material-symbols-outlined text-2xl">verified_user</span>
        </div>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
        <div>
          <span className="text-slate-400 font-bold block">Total Mahasiswa Dibimbing</span>
          <span className="text-2xl font-black text-blue-600 mt-0.5 block">{totalMentees} Mahasiswa</span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <span className="material-symbols-outlined text-2xl">school</span>
        </div>
      </div>
    </div>
  );
};