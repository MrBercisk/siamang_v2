import { useState, FormEvent } from 'react';
import { InternshipCategory } from '../types/internship';
import { User } from '../types/auth';

interface ApplicationModalProps {
  category: InternshipCategory | null;
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    fieldId: string;
    fieldName: string;
    applicantName: string;
    institution: string;
    major: string;
    notes?: string;
  }) => Promise<void>;
}

export function ApplicationModal({
  category,
  user,
  isOpen,
  onClose,
  onSubmit,
}: ApplicationModalProps) {
  const [applicantName, setApplicantName] = useState(user?.name || '');
  const [institution, setInstitution] = useState(user?.institution || '');
  const [major, setMajor] = useState(user?.major || '');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !category) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({
        fieldId: category.id,
        fieldName: category.title,
        applicantName: applicantName || 'Mahasiswa Pendaftar',
        institution: institution || 'Perguruan Tinggi',
        major: major || 'Program Studi',
        notes: notes || 'Pendaftaran magang via portal SI AMANG',
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1800);
    } catch {
      // Handled in hook
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="bg-[#005c55] text-white p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">
              Formulir Pendaftaran
            </span>
            <h3 className="text-base font-bold text-white truncate max-w-[320px]">
              {category.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-2xl">check</span>
            </div>
            <h4 className="text-lg font-bold text-slate-900">Pendaftaran Berhasil Dikirim!</h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Berkas Anda telah tersimpan di portal SI AMANG. Silakan pantau tab Status Pendaftaran secara berkala.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                required
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                placeholder="Masukkan nama lengkap Anda"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#005c55]/30 focus:border-[#005c55]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Instansi / Perguruan Tinggi
                </label>
                <input
                  type="text"
                  required
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="Contoh: Universitas Gadjah Mada"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#005c55]/30 focus:border-[#005c55]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jurusan / Program Studi
                </label>
                <input
                  type="text"
                  required
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  placeholder="Contoh: Informatika / Ilmu Komunikasi"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#005c55]/30 focus:border-[#005c55]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Catatan Tambahan / Link Portofolio (Opsional)
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Tautan CV, Portofolio, atau motivasi singkat..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#005c55]/30 focus:border-[#005c55]"
              />
            </div>

            <div className="pt-2 flex gap-3 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-lg bg-[#005c55] text-white text-xs font-semibold hover:bg-[#0f766e] transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
              >
                {isSubmitting ? 'Mengirim...' : 'Kirim Pendaftaran'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
