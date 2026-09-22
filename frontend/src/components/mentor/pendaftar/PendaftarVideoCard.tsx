import React from 'react';
import type { PendaftarData } from '../../../types/pendaftar';
import { resolveStorageUrl } from '../../../lib/api';

interface PendaftarVideoCardProps {
  pendaftar: PendaftarData;
}

export const PendaftarVideoCard: React.FC<PendaftarVideoCardProps> = ({ pendaftar }) => {
  const videoUrl = resolveStorageUrl(
    (pendaftar.documents ?? []).find((item) => item.documentType === 'video_perkenalan')?.fileUrl
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
      <h3 className="text-sm font-bold text-slate-900">Video Perkenalan</h3>

      <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-md aspect-video">
        <video controls poster={pendaftar.fotoUrl || undefined} className="w-full h-full object-cover">
          {videoUrl && <source src={videoUrl} type="video/mp4" />}
          Browser Anda tidak mendukung tag video.
        </video>
      </div>
    </div>
  );
};