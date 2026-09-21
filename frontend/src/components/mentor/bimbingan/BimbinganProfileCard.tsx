import React, { useState } from 'react';
import type { BimbinganDetail } from '../../../types/bimbinganMentor';

interface BimbinganProfileCardProps {
  detail: BimbinganDetail;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

export const BimbinganProfileCard: React.FC<BimbinganProfileCardProps> = ({ detail }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(detail.fotoUrl) && !imageFailed;

  // Ketua ditaruh paling depan; anggota lain dinomori mulai dari 2.
  const leader = detail.members.find((member) => member.isLeader);
  const others = detail.members.filter((member) => !member.isLeader);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* KIRI: FOTO, NAMA, INFO DASAR */}
        <div className="md:col-span-7 flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {showImage ? (
            <img
              src={detail.fotoUrl}
              alt={detail.nama}
              onError={() => setImageFailed(true)}
              className="w-20 h-20 rounded-full object-cover border-2 border-slate-200 shadow-xs shrink-0"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-[#E6F7F3] border-2 border-[#C6EFE7] text-[#1f877c] flex items-center justify-center text-xl font-black shrink-0">
              {getInitials(detail.nama)}
            </div>
          )}

          <div className="space-y-3 text-center sm:text-left">
            <h3 className="text-lg font-bold text-slate-900">{detail.nama}</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-400 font-medium block text-[11px]">
                  Tipe Pendaftaran
                </span>
                <span className="font-bold text-slate-800">{detail.tipePendaftaran}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block text-[11px]">Kategori</span>
                <span
                  className="font-bold text-slate-800 truncate block max-w-[140px]"
                  title={detail.kategori}
                >
                  {detail.kategori}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block text-[11px]">Judul Project</span>
                <span
                  className="font-bold text-slate-800 truncate block max-w-[140px]"
                  title={detail.judulProject}
                >
                  {detail.judulProject}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* KANAN: PROGRESS SAAT INI */}
        <div className="md:col-span-5 bg-slate-50/60 p-4 rounded-xl border border-slate-100 space-y-2">
          <span className="text-xs font-bold text-slate-800 block">Progress Saat ini</span>
          <div className="text-3xl font-black text-slate-900">{detail.progress}%</div>
          <div className="w-full bg-slate-200/80 rounded-full h-3 overflow-hidden">
            <div
              className="bg-[#1f877c] h-3 rounded-full transition-all duration-500"
              style={{ width: `${detail.progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* ANGGOTA KELOMPOK (hanya untuk pendaftaran kelompok) */}
      {detail.members.length > 0 && (
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <h4 className="text-xs font-bold text-slate-800">
            Anggota Kelompok ({detail.members.length})
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {leader && (
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#E6F7F3] text-[#1f877c] border border-[#C6EFE7]">
                  Ketua Kelompok
                </span>
                <span className="font-bold text-slate-800">{leader.name}</span>
              </div>
            )}

            {others.map((member, index) => (
              <div key={`${member.name}-${index}`} className="flex items-center gap-3">
                <span className="font-bold text-slate-600 w-24">Anggota {index + 2}</span>
                <span className="font-semibold text-slate-800">{member.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};