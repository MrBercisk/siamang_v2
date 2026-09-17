import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { BidangFormValues, BidangStatus, EMPTY_BIDANG_FORM } from '../../../types/bidang';

interface BidangFormModalProps {
  mode: 'add' | 'edit';
  open: boolean;
  initialValues?: BidangFormValues;
  onClose: () => void;
  onSubmit: (values: BidangFormValues) => Promise<boolean> | boolean;
}

export const BidangFormModal: React.FC<BidangFormModalProps> = ({
  mode,
  open,
  initialValues,
  onClose,
  onSubmit,
}) => {
  const [values, setValues] = useState<BidangFormValues>(initialValues || EMPTY_BIDANG_FORM);
  const [submitting, setSubmitting] = useState(false);

  // Sync form fields whenever the modal is (re)opened with new initial values
  useEffect(() => {
    if (open) {
      setValues(initialValues || EMPTY_BIDANG_FORM);
    }
  }, [open, initialValues]);

  if (!open) return null;

  const isEdit = mode === 'edit';

  const handleChange = <K extends keyof BidangFormValues>(key: K, value: BidangFormValues[K]) => {
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
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-scale-up">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${
                isEdit ? 'bg-blue-50 text-blue-600' : 'bg-[#E6F7F3] text-[#1f877c]'
              }`}
            >
              <span className="material-symbols-outlined text-lg">
                {isEdit ? 'edit_note' : 'add_box'}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {isEdit ? 'Edit Data Bidang' : 'Tambah Bidang Baru'}
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
            <label className="block font-bold text-slate-700 mb-1">Nama Bidang *</label>
            <input
              type="text"
              required
              value={values.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Contoh: Layanan Statistik & Persandian"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-[#1f877c]"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Status</label>
            <select
              value={values.status}
              onChange={(e) => handleChange('status', e.target.value as BidangStatus)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium"
            >
              <option value="Aktif">Aktif</option>
              <option value="Nonaktif">Nonaktif</option>
            </select>
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
              {submitting ? 'Menyimpan...' : isEdit ? 'Simpan Pembaruan' : 'Simpan Bidang Baru'}
            </button>
          </div>

        </form>
      </div>
    </div>,
    document.body
  );
};