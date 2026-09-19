import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { PeriodeFormValues } from '../../../types/periode';

interface PeriodeFormModalProps {
  open: boolean;
  initialValues: PeriodeFormValues;
  onClose: () => void;
  onSubmit: (values: PeriodeFormValues) => Promise<boolean> | boolean;
}

const EMPTY_PERIODE_FORM: PeriodeFormValues = {
  name: '',
  startDate: '',
  endDate: '',
  announcementDate: '',
  internshipStart: '',
  internshipEnd: '',
  durationInfo: '',
  systemType: '',
  isActive: false,
};

export const PeriodeFormModal: React.FC<PeriodeFormModalProps> = ({
  open,
  initialValues,
  onClose,
  onSubmit,
}) => {
  const [values, setValues] = useState<PeriodeFormValues>(initialValues || EMPTY_PERIODE_FORM);
  const [submitting, setSubmitting] = useState(false);

  // Reset isian setiap modal dibuka ulang.
  useEffect(() => {
    if (open) setValues(initialValues || EMPTY_PERIODE_FORM);
  }, [open, initialValues]);

  if (!open) return null;

  const handleChange = <K extends keyof PeriodeFormValues>(key: K, value: PeriodeFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const success = await onSubmit(values);
    setSubmitting(false);
    if (success) onClose();
  };

  const fields: Array<{ key: Exclude<keyof PeriodeFormValues, 'isActive'>; label: string; type: 'text' | 'date'; placeholder: string }> = [
    { key: 'name', label: 'Nama Periode', type: 'text', placeholder: 'Contoh: Periode 2 - 2026' },
    { key: 'startDate', label: 'Tanggal Pembukaan Pendaftaran', type: 'date', placeholder: '' },
    { key: 'endDate', label: 'Tanggal Penutupan Pendaftaran', type: 'date', placeholder: '' },
    { key: 'announcementDate', label: 'Tanggal Pengumuman', type: 'date', placeholder: '' },
    { key: 'internshipStart', label: 'Tanggal Mulai Magang', type: 'date', placeholder: '' },
    { key: 'internshipEnd', label: 'Tanggal Selesai Magang', type: 'date', placeholder: '' },
    { key: 'durationInfo', label: 'Informasi Durasi', type: 'text', placeholder: 'Contoh: 4 - 6 Bulan' },
    { key: 'systemType', label: 'Sistem Magang', type: 'text', placeholder: 'Contoh: Hybrid' },
  ];

  return createPortal(
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-scale-up">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600">
              <span className="material-symbols-outlined text-lg">edit_calendar</span>
            </div>
            <h3 className="text-base font-bold text-slate-900">Edit Periode Magang</h3>
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
          {fields.map((field) => (
            <div key={field.key}>
              <label className="block font-bold text-slate-700 mb-1">{field.label}</label>
              <input
                type={field.type}
                required
                value={values[field.key]}
                onChange={(e) => handleChange(field.key, e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-[#1f877c]"
              />
            </div>
          ))}

          <label className="flex items-center gap-2 font-bold text-slate-700">
            <input
              type="checkbox"
              checked={values.isActive}
              onChange={(e) => handleChange('isActive', e.target.checked)}
              className="h-4 w-4 accent-[#1f877c]"
            />
            Jadikan periode aktif
          </label>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-[#1f877c] hover:bg-[#196e65] text-white font-bold cursor-pointer shadow-xs disabled:opacity-60"
            >
              {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};