import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AdminMentorOption } from '../../../types/internship';

interface PilihMentorModalProps {
  open: boolean;
  applicantName?: string;
  bidang?: string;
  kategori?: string;
  mentors: AdminMentorOption[];
  loading: boolean;
  onClose: () => void;
  onSubmit: (mentorId: number) => Promise<boolean> | boolean;
}

export const PilihMentorModal: React.FC<PilihMentorModalProps> = ({
  open,
  applicantName,
  bidang,
  kategori,
  mentors,
  loading,
  onClose,
  onSubmit,
}) => {
  const [selectedMentorId, setSelectedMentorId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) setSelectedMentorId('');
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedMentorId) return;

    setSubmitting(true);
    const success = await onSubmit(Number(selectedMentorId));
    setSubmitting(false);
    if (success) onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-scale-up">
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Pilih Mentor Pembimbing</h3>
            <p className="text-xs text-slate-500 mt-1">
              {applicantName}
            </p>
            {(bidang || kategori) && (
              <p className="text-[11px] text-[#1f877c] font-semibold mt-1">
                {[bidang, kategori].filter(Boolean).join(' - ')}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"
            aria-label="Tutup"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-700">Mentor sesuai kategori pendaftar *</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Pilih satu mentor yang akan membimbing pendaftar ini.
              </p>
            </div>
            {!loading && mentors.length > 0 && (
              <span className="px-2.5 py-1 rounded-full bg-[#E6F7F3] text-[#1f877c] font-bold">
                {mentors.length} tersedia
              </span>
            )}
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {loading && (
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 text-center text-slate-500">
                Memuat mentor sesuai kategori...
              </div>
            )}

            {!loading && mentors.map((mentor) => {
              const isSelected = selectedMentorId === String(mentor.id);
              return (
                <label
                  key={mentor.id}
                  className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-colors ${
                    isSelected
                      ? 'border-[#1f877c] bg-[#E6F7F3]'
                      : 'border-slate-200 bg-white hover:border-[#8accc3] hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="admin-mentor"
                    value={mentor.id}
                    checked={isSelected}
                    onChange={(event) => setSelectedMentorId(event.target.value)}
                    className="h-4 w-4 accent-[#1f877c]"
                  />
                  <span className="w-10 h-10 rounded-full bg-[#D1FAE5] text-[#1f877c] flex items-center justify-center font-bold shrink-0">
                    {mentor.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold text-slate-900 truncate">{mentor.name}</span>
                    <span className="block text-[11px] text-slate-500 truncate">{mentor.email}</span>
                  </span>
                  {isSelected && (
                    <span className="material-symbols-outlined text-[#1f877c]">check_circle</span>
                  )}
                </label>
              );
            })}
          </div>

          {!loading && mentors.length === 0 && (
            <p className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-medium">
              Belum ada mentor aktif yang mengampu kategori ini. Atur kategori dan status mentor di menu Mentor terlebih dahulu.
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 font-bold text-slate-700"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading || !selectedMentorId || submitting}
              className="px-5 py-2.5 rounded-xl bg-[#1f877c] hover:bg-[#196e65] text-white font-bold disabled:opacity-50"
            >
              {submitting ? 'Menyimpan...' : 'Terima & Tetapkan Mentor'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
