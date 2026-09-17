import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { EMPTY_MENTOR_FORM, KategoriOption, MentorFormValues } from '../../../types/mentor';

interface MentorFormModalProps {
  mode: 'add' | 'edit';
  open: boolean;
  initialValues?: MentorFormValues;
  kategoriOptions: KategoriOption[];
  onClose: () => void;
  onSubmit: (values: MentorFormValues) => Promise<boolean> | boolean;
}

export const MentorFormModal: React.FC<MentorFormModalProps> = ({
  mode,
  open,
  initialValues,
  kategoriOptions,
  onClose,
  onSubmit,
}) => {
  const [values, setValues] = useState<MentorFormValues>(initialValues || EMPTY_MENTOR_FORM);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setValues(initialValues || EMPTY_MENTOR_FORM);
    }
  }, [open, initialValues]);

  if (!open) return null;

  const isEdit = mode === 'edit';

  const handleChange = <K extends keyof MentorFormValues>(key: K, value: MentorFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleToggleKategori = (id: number) => {
    setValues((prev) => ({
      ...prev,
      kategoriIds: prev.kategoriIds.includes(id)
        ? prev.kategoriIds.filter((k) => k !== id)
        : [...prev.kategoriIds, id],
    }));
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
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-scale-up max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${
                isEdit ? 'bg-blue-50 text-blue-600' : 'bg-[#E6F7F3] text-[#1f877c]'
              }`}
            >
              <span className="material-symbols-outlined text-lg">
                {isEdit ? 'edit_note' : 'person_add'}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {isEdit ? 'Edit Data & Pengelolaan Mentor' : 'Tambah Mentor Pembimbing Baru'}
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
            <label className="block font-bold text-slate-700 mb-1">Nama Lengkap &amp; Gelar *</label>
            <input
              type="text"
              required
              value={values.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Contoh: Dra. Endang Sulastri, M.Kom."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-[#1f877c]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">NIP (Nomor Induk Pegawai)</label>
              <input
                type="text"
                value={values.nip}
                onChange={(e) => handleChange('nip', e.target.value)}
                placeholder="Contoh: 19820412 200801 1 005"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Status Pembimbing</label>
              <select
                value={values.status}
                onChange={(e) => handleChange('status', e.target.value as MentorFormValues['status'])}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium"
              >
                <option value="Aktif">Aktif</option>
                <option value="Nonaktif">Nonaktif</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Email Resmi / Instansi *</label>
              <input
                type="email"
                required
                value={values.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="nama@jogjakota.go.id"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">No. HP / WhatsApp</label>
              <input
                type="text"
                value={values.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="0812xxxxxxxx"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Jabatan / Pangkat Fungsional</label>
            <input
              type="text"
              value={values.position}
              onChange={(e) => handleChange('position', e.target.value)}
              placeholder="Contoh: Pranata Komputer Ahli Muda"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium"
            />
          </div>

          {/* CHECKBOX SELECTION: KATEGORI MAGANG YANG DIKELOLA */}
          <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <label className="block font-bold text-slate-900">
              Pilih Kategori Magang yang Dikelola Mentor *
            </label>
            <p className="text-[11px] text-slate-500 mb-2">
              Mahasiswa pendaftar di kategori berikut akan otomatis disarankan ke mentor ini saat admin memproses pendaftaran.
            </p>

            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {kategoriOptions.length === 0 && (
                <p className="text-[11px] text-slate-400 italic">Belum ada kategori magang yang tersedia.</p>
              )}
              {kategoriOptions.map((cat) => {
                const isChecked = values.kategoriIds.includes(cat.id);
                return (
                  <label
                    key={cat.id}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isChecked
                        ? 'bg-[#E6F7F3] border-[#1f877c] text-slate-900 font-bold'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleKategori(cat.id)}
                      className="mt-0.5 rounded text-[#1f877c] focus:ring-[#1f877c]"
                    />
                    <span className="text-xs">
                      {cat.name}
                      <span className="block text-[10px] font-normal text-slate-400">{cat.bidangName}</span>
                    </span>
                  </label>
                );
              })}
            </div>
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
              {submitting ? 'Menyimpan...' : isEdit ? 'Simpan Pembaruan' : 'Simpan Mentor Baru'}
            </button>
          </div>

        </form>
      </div>
    </div>,
    document.body
  );
};