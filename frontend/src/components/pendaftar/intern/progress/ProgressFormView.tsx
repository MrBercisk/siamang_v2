import React, { useState } from 'react';
import { showToast } from '../../../../utils/swal';
import type { ProgressFormValues, ProgressItem } from '../../../../types/progressPeserta';

interface ProgressFormViewProps {
  editingItem: ProgressItem | null;
  submitting: boolean;
  onCancel: () => void;
  onSubmit: (values: ProgressFormValues, file: File | null) => Promise<boolean>;
}

export const ProgressFormView: React.FC<ProgressFormViewProps> = ({
  editingItem,
  submitting,
  onCancel,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<ProgressFormValues>({
    judulProject: editingItem?.judulProject ?? '',
    tanggalBimbingan: editingItem?.tanggalBimbinganRaw ?? new Date().toISOString().split('T')[0],
    pencapaian: editingItem?.pencapaian ?? '',
    catatan: editingItem && editingItem.catatan !== '-' ? editingItem.catatan : '',
  });
  const [file, setFile] = useState<File | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (selected.type !== 'application/pdf') {
      showToast('error', 'File harus berformat PDF!');
      return;
    }
    if (selected.size > 2 * 1024 * 1024) {
      showToast('error', 'Ukuran file tidak boleh lebih dari 2 MB!');
      return;
    }
    setFile(selected);
    showToast('success', `File ${selected.name} berhasil dipilih.`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.judulProject || !formData.tanggalBimbingan || !formData.pencapaian) {
      showToast('error', 'Harap isi semua kolom wajib!');
      return;
    }
    if (!editingItem && !file) {
      showToast('error', 'File presentasi wajib diunggah!');
      return;
    }

    await onSubmit(formData, file);
  };

  const currentFileLabel = file?.name || editingItem?.fileName || 'Pilih File';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 sm:p-8 space-y-6">
      <h2 className="text-xl font-bold text-slate-900">
        {editingItem ? 'Edit Progress Magang' : 'Input Progress Magang'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800">Judul Project</label>
            <input
              type="text"
              value={formData.judulProject}
              onChange={(e) => setFormData((prev) => ({ ...prev, judulProject: e.target.value }))}
              placeholder="Design Web Aplikasi Magang"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-[#1f877c] bg-white font-medium"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800">Tanggal Bimbingan</label>
            <input
              type="date"
              value={formData.tanggalBimbingan}
              onChange={(e) => setFormData((prev) => ({ ...prev, tanggalBimbingan: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-[#1f877c] bg-white font-medium"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-800">Pencapaian</label>
          <textarea
            rows={3}
            value={formData.pencapaian}
            onChange={(e) => setFormData((prev) => ({ ...prev, pencapaian: e.target.value }))}
            placeholder="Tuliskan pencapaian atau progress Anda"
            className="w-full p-4 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-[#1f877c] bg-white font-medium resize-none"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-800">Catatan</label>
          <textarea
            rows={3}
            value={formData.catatan}
            onChange={(e) => setFormData((prev) => ({ ...prev, catatan: e.target.value }))}
            placeholder="Tuliskan catatan dari mentor saat bimbingan (jika ada)"
            className="w-full p-4 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-[#1f877c] bg-white font-medium resize-none"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-800">File Presentasi (PDF)</label>
          <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white hover:border-[#1f877c] cursor-pointer transition-all shadow-2xs">
            <span className="text-xs text-slate-500 font-medium truncate">{currentFileLabel}</span>
            <span className="material-symbols-outlined text-slate-400 text-lg">file_upload</span>
            <input type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" />
          </label>
          <p className="text-[11px] text-slate-400 font-medium">
            File harus berformat PDF dan tidak lebih dari 2 MB.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl border border-[#1f877c] text-[#1f877c] font-bold text-xs hover:bg-[#E6F7F3] transition-all cursor-pointer disabled:opacity-50"
          >
            Kembali
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl bg-[#1f877c] hover:bg-[#196e65] text-white font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {submitting ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </form>
    </div>
  );
};