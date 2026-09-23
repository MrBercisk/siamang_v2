import React, { useState } from 'react';
import { useLaporanMagang } from '../hooks/useLaporanMagang';
import { LaporanLockedView } from './laporan/LaporanLockedView';
import { LaporanStatusBanner } from './laporan/LaporanStatusBanner';
import { LaporanForm } from './laporan/LaporanForm';
import { LaporanTable } from './laporan/LaporanTable';

export const LaporanMagangPesertaView: React.FC = () => {
  const { state, loading, submitting, submit } = useLaporanMagang();
  const [isEditing, setIsEditing] = useState(false);

  if (loading || !state) {
    return (
      <div className="min-h-[380px] bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-8 flex items-center justify-center text-slate-400 text-sm font-medium">
        Memuat data laporan...
      </div>
    );
  }

  if (state.accessStatus === 'locked') {
    return <LaporanLockedView />;
  }

  const handleSubmit = async (...args: Parameters<typeof submit>) => {
    const success = await submit(...args);
    if (success) setIsEditing(false);
    return success;
  };

  if (state.accessStatus === 'belum_upload') {
    return (
      <div className="space-y-6">
        <LaporanStatusBanner status="belum_upload" />
        <LaporanForm existing={null} submitting={submitting} onSubmit={handleSubmit} />
      </div>
    );
  }

  // pending | ditolak | diterima -- selalu ada state.laporan di titik ini
  const laporan = state.laporan!;

  if (isEditing) {
    return (
      <LaporanForm
        existing={laporan}
        submitting={submitting}
        onCancel={() => setIsEditing(false)}
        onSubmit={handleSubmit}
      />
    );
  }

  return (
    <div className="space-y-6">
      <LaporanStatusBanner status={state.accessStatus} catatanReject={laporan.catatanReject} />
      <LaporanTable
        laporan={laporan}
        nilai={state.nilai}
        onEdit={laporan.status === 'pending' ? () => setIsEditing(true) : undefined}
        onUploadUlang={laporan.status === 'ditolak' ? () => setIsEditing(true) : undefined}
      />
    </div>
  );
};