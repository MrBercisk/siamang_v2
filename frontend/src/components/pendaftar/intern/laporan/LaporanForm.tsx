import React, { useState } from 'react';
import { showToast } from '../../../../utils/swal';
import type { LaporanFormValues, LaporanItem } from '../../../../types/laporanPeserta';

interface LaporanFormProps {
  existing: LaporanItem | null;
  submitting: boolean;
  onCancel?: () => void;
  onSubmit: (
    values: LaporanFormValues,
    fileLaporan: File | null,
    formNilai: File | null
  ) => Promise<boolean>;
}

function validatePdf(file: File): boolean {
  if (file.type !== 'application/pdf') {
    showToast('error', 'File harus berformat PDF!');
    return false;
  }
  if (file.size > 2 * 1024 * 1024) {
    showToast('error', 'Ukuran file tidak boleh lebih dari 2 MB!');
    return false;
  }
  return true;
}

export const LaporanForm: React.FC<LaporanFormProps> = ({ existing, submitting, onCancel, onSubmit }) => {
  const [formData, setFormData] = useState<LaporanFormValues>({
    judulLaporan: existing?.judulLaporan ?? '',
    linkGoogleDrive: existing?.linkGoogleDrive ?? '',
  });
  const [fileLaporan, setFileLaporan] = useState<File | null>(null);
  const [formNilai, setFormNilai] = useState<File | null>(null);

  const handleFile = (setter: (f: File) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!validatePdf(file)) return;
    setter(file);
    showToast('success', `File ${file.name} dipilih.`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.judulLaporan || !formData.linkGoogleDrive) {
      showToast('error', 'Harap isi semua kolom wajib!');
      return;
    }
    if (!existing && !fileLaporan) {
      showToast('error', 'File laporan wajib diunggah!');
      return;
    }
    await onSubmit(formData, fileLaporan, formNilai);
  };

  const fileLaporanLabel = fileLaporan?.name || existing?.fileLaporanName || 'Pilih File';
  const formNilaiLabel = formNilai?.name || existing?.formNilaiName || 'Pilih File';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <h3 className="text-lg font-bold text-slate-900">
          {existing ? 'Upload / Re-Upload Laporan Magang' : 'Input Laporan Magang'}
        </h3>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 disabled:opacity-50"
          >
            Batal
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 text-xs">
        <div className="space-y-2">
          <label className="block font-bold text-slate-800">Judul Laporan</label>
          <input
            type="text"
            placeholder="Masukkan Judul Laporan Anda"
            value={formData.judulLaporan}
            onChange={(e) => setFormData((prev) => ({ ...prev, judulLaporan: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-hidden focus:border-[#1f877c] font-medium"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block font-bold text-slate-800">File Laporan (PDF)</label>
          <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white hover:border-[#1f877c] cursor-pointer transition-all">
            <span className="text-slate-500 font-medium truncate">{fileLaporanLabel}</span>
            <span className="material-symbols-outlined text-slate-400 text-lg">file_upload</span>
            <input type="file" accept=".pdf" onChange={handleFile(setFileLaporan)} className="hidden" />
          </label>
          <p className="text-[11px] text-slate-400 font-medium">
            File harus berformat PDF dan tidak lebih dari 2 MB.
          </p>
        </div>

        <div className="space-y-2">
          <label className="block font-bold text-slate-800">Link Google Drive</label>
          <input
            type="text"
            placeholder="Masukkan Link Google Drive Project Anda"
            value={formData.linkGoogleDrive}
            onChange={(e) => setFormData((prev) => ({ ...prev, linkGoogleDrive: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-hidden focus:border-[#1f877c] font-medium"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block font-bold text-slate-800">Form Nilai (PDF)</label>
          <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white hover:border-[#1f877c] cursor-pointer transition-all">
            <span className="text-slate-500 font-medium truncate">{formNilaiLabel}</span>
            <span className="material-symbols-outlined text-slate-400 text-lg">file_upload</span>
            <input type="file" accept=".pdf" onChange={handleFile(setFormNilai)} className="hidden" />
          </label>
          <p className="text-[11px] text-slate-400 font-medium">
            File harus berformat PDF dan tidak lebih dari 2 MB.
          </p>
        </div>

        <div className="flex items-center justify-end pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-2.5 rounded-xl bg-[#1f877c] hover:bg-[#196e65] text-white font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {submitting ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </form>
    </div>
  );
};