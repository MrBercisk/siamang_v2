import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { BidangOption, EMPTY_KATEGORI_FORM, KategoriFormValues } from '../../../types/kategori';

interface KategoriFormModalProps {
  mode: 'add' | 'edit';
  open: boolean;
  initialValues?: KategoriFormValues;
  bidangOptions: BidangOption[];
  onClose: () => void;
  onSubmit: (values: KategoriFormValues) => Promise<boolean> | boolean;
}

export const KategoriFormModal: React.FC<KategoriFormModalProps> = ({
  mode,
  open,
  initialValues,
  bidangOptions,
  onClose,
  onSubmit,
}) => {
  const [values, setValues] = useState<KategoriFormValues>(initialValues || EMPTY_KATEGORI_FORM);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setValues(
        initialValues || {
          ...EMPTY_KATEGORI_FORM,
          bidangId: bidangOptions[0]?.id ?? '',
        }
      );
    }
  }, [open, initialValues, bidangOptions]);

  if (!open) return null;

  const isEdit = mode === 'edit';

  const handleChange = <K extends keyof KategoriFormValues>(key: K, value: KategoriFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const success = await onSubmit(values);
    setSubmitting(false);
    if (success) {
      onClose();
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-scale-up">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${
                isEdit ? 'bg-blue-50 text-blue-600' : 'bg-[#E6F7F3] text-[#1f877c]'
              }`}
            >
              <span className="material-symbols-outlined text-lg">
                {isEdit ? 'edit_note' : 'playlist_add'}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {isEdit ? 'Edit Kategori Magang' : 'Tambah Kategori Magang'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">

          <div>
            <label className="block font-bold text-slate-700 mb-1">Nama Kategori Magang *</label>
            <input
              type="text"
              required
              value={values.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Contoh: Pengembangan Perangkat Lunak & UI/UX"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-[#1f877c]"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Bidang Naungan *</label>
            <select
              required
              value={values.bidangId}
              onChange={(e) => handleChange('bidangId', Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium"
            >
              <option value="" disabled>
                Pilih bidang...
              </option>
              {bidangOptions.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                  {b.status === 'Nonaktif' ? ' (Nonaktif)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Deskripsi Ruang Lingkup Kategori</label>
            <textarea
              rows={3}
              value={values.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Penjelasan umum mengenai kategori ini..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white font-medium resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`px-5 py-2.5 rounded-xl text-white font-bold cursor-pointer shadow-xs disabled:opacity-60 ${
                isEdit ? 'bg-blue-600 hover:bg-blue-700' : 'bg-[#1f877c] hover:bg-[#196e65]'
              }`}
            >
              {submitting ? 'Menyimpan...' : isEdit ? 'Simpan Pembaruan' : 'Simpan Kategori'}
            </button>
          </div>

        </form>
      </div>
    </div>,
    document.body
  );
};