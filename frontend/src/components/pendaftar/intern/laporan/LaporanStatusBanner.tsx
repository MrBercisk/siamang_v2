import React from 'react';
import type { LaporanAccessStatus } from '../../../../types/laporanPeserta';

const BANNER_CONFIG: Record<Exclude<LaporanAccessStatus, 'locked'>, { bg: string; text: string }> = {
  belum_upload: { bg: 'bg-[#e53935]', text: 'Keterangan: Anda Belum Upload Laporan' },
  pending: { bg: 'bg-[#00a0e9]', text: 'Keterangan: Anda Sudah Upload Laporan. Pengeditan dapat dilakukan dalam 3 hari.' },
  ditolak: { bg: 'bg-[#e53935]', text: 'Keterangan: Laporan Anda ditolak! Harap upload laporan terbaru.' },
  diterima: { bg: 'bg-[#10b981]', text: 'Keterangan: Laporan Anda telah diterima! Silahkan download nilai magang Anda atau tunggu jika belum tersedia.' },
};

interface LaporanStatusBannerProps {
  status: Exclude<LaporanAccessStatus, 'locked'>;
  catatanReject?: string;
}

export const LaporanStatusBanner: React.FC<LaporanStatusBannerProps> = ({ status, catatanReject }) => {
  const config = BANNER_CONFIG[status];
  return (
    <div className={`p-4 px-6 rounded-2xl ${config.bg} text-white flex items-center gap-3 shadow-sm font-semibold text-xs sm:text-sm`}>
      <span className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center font-bold text-xs shrink-0">
        i
      </span>
      <span>
        {config.text}
        {status === 'ditolak' && catatanReject ? ` Alasan: ${catatanReject}` : ''}
      </span>
    </div>
  );
};