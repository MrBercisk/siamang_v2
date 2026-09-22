import React from 'react';
import type { PendaftarData } from '../../../types/pendaftar';

interface PendaftarStatusBadgeProps {
  status: PendaftarData['status'];
}

const STYLES: Record<PendaftarData['status'], string> = {
  Diterima: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  Ditolak: 'bg-rose-100 text-rose-800 border-rose-300',
  Verifikasi: 'bg-amber-100 text-amber-800 border-amber-300',
};

export const PendaftarStatusBadge: React.FC<PendaftarStatusBadgeProps> = ({ status }) => (
  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${STYLES[status]}`}>
    {status}
  </span>
);