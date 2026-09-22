import React, { useState } from 'react';

const QUICK_REASONS = [
  'Berkas persyaratan tidak lengkap',
  'Kuota divisi magang sudah penuh',
  'Kualifikasi jurusan belum sesuai',
  'Surat pengantar kampus belum terlampir',
];

interface PendaftarRejectReasonModalProps {
  applicantName: string;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export const PendaftarRejectReasonModal: React.FC<PendaftarRejectReasonModalProps> = ({
  applicantName,
  onClose,
  onConfirm,
}) => {
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;
    onConfirm(reason.trim());
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-up">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
            <span className="material-symbols-outlined">cancel</span>
            <span>Alasan Penolakan Pendaftaran</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <p className="text-xs text-slate-600">
          Mohon masukkan alasan penolakan berkas pendaftaran calon peserta{' '}
          <strong className="text-slate-900">{applicantName}</strong>:
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <textarea
            rows={4}
            required
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Contoh: Berkas persyaratan tidak lengkap, kuota divisi telah terpenuhi, atau kualifikasi jurusan belum sesuai."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 font-medium text-slate-800 resize-none"
          />

          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-400 block">Pilih Alasan Cepat:</span>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_REASONS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setReason(chip)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 border border-slate-200 text-[10px] font-medium text-slate-600 transition-all cursor-pointer"
                >
                  + {chip}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer shadow-xs"
            >
              Konfirmasi Tolak
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};