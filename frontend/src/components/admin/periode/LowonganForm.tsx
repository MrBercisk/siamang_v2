import React, { useEffect, useState } from 'react';
import { EMPTY_LOWONGAN_FORM, KategoriOption, LowonganFormValues } from '../../../types/periode';

interface LowonganFormProps {
  mode: 'add' | 'edit';
  initialValues?: LowonganFormValues;
  /** Opsi kategori dari database (lihat useKategoriOptions). */
  kategoriOptions: KategoriOption[];
  kategoriLoading?: boolean;
  kategoriError?: string | null;
  onCancel: () => void;
  onSubmit: (values: LowonganFormValues) => Promise<boolean> | boolean;
}

export const LowonganForm: React.FC<LowonganFormProps> = ({
  mode,
  initialValues,
  kategoriOptions,
  kategoriLoading = false,
  kategoriError = null,
  onCancel,
  onSubmit,
}) => {
  const [values, setValues] = useState<LowonganFormValues>(initialValues || EMPTY_LOWONGAN_FORM);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setValues(initialValues || EMPTY_LOWONGAN_FORM);
  }, [initialValues]);

  const isEdit = mode === 'edit';
  const title = isEdit ? 'Edit Lowongan Magang' : 'Tambah Lowongan Magang';

  const handleChange = <K extends keyof LowonganFormValues>(key: K, value: LowonganFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  /** Kategori menentukan bidang — keduanya berasal dari relasi di database. */
  const handleCategorySelect = (selectedId: string) => {
    const found = kategoriOptions.find((c) => c.id.toString() === selectedId);
    setValues((prev) => ({
      ...prev,
      kategoriId: selectedId,
      kategori: found ? found.name : '',
      bidang: found ? found.bidangName : '',
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const success = await onSubmit(values);
    setSubmitting(false);
    if (success) onCancel();
  };

  return (
    <div className="space-y-6">
      {/* HEADER & BREADCRUMB */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
        <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 font-medium">
          <span className="hover:text-slate-600 cursor-pointer" onClick={onCancel}>
            Informasi Lowongan Magang
          </span>
          <span>&gt;</span>
          <span className="text-[#1f877c] font-bold">{title}</span>
        </div>
      </div>

      {/* FORM CONTAINER CARD */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-8">
        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* KATEGORI */}
            <div>
              <label className="block font-bold text-slate-700 mb-2">
                Kategori <span className="text-rose-500">*</span>
              </label>
              <select
                value={values.kategoriId}
                onChange={(e) => handleCategorySelect(e.target.value)}
                required
                disabled={kategoriLoading || !!kategoriError}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:ring-2 focus:ring-[#1f877c] focus:outline-hidden disabled:bg-slate-50 disabled:text-slate-400"
              >
                <option value="">
                  {kategoriLoading ? 'Memuat kategori...' : 'Pilih Kategori'}
                </option>
                {kategoriOptions.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {kategoriError && (
                <p className="mt-1.5 text-[11px] font-medium text-rose-500">{kategoriError}</p>
              )}
              {!kategoriLoading && !kategoriError && kategoriOptions.length === 0 && (
                <p className="mt-1.5 text-[11px] font-medium text-amber-600">
                  Belum ada kategori aktif. Tambahkan lebih dulu di Master Data Kategori.
                </p>
              )}
            </div>

            {/* BIDANG — read-only, mengikuti relasi kategori di database */}
            <div>
              <label className="block font-bold text-slate-700 mb-2">Bidang</label>
              <input
                type="text"
                readOnly
                value={values.bidang}
                placeholder="Terisi otomatis dari kategori"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-500 cursor-not-allowed focus:outline-hidden"
              />
              <p className="mt-1.5 text-[11px] text-slate-400 font-medium">
                Mengikuti bidang induk kategori yang dipilih.
              </p>
            </div>

            {/* PROJECT */}
            <div>
              <label className="block font-bold text-slate-700 mb-2">
                Project <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={values.project}
                onChange={(e) => handleChange('project', e.target.value)}
                placeholder="Contoh: SIM CUTI"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:ring-2 focus:ring-[#1f877c] focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* DESKRIPSI */}
            <div>
              <label className="block font-bold text-slate-700 mb-2">Deskripsi</label>
              <textarea
                rows={4}
                value={values.definisi}
                onChange={(e) => handleChange('definisi', e.target.value)}
                placeholder="Masukkan deskripsi magang"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:ring-2 focus:ring-[#1f877c] focus:outline-hidden resize-none"
              />
            </div>

            {/* DETAIL KEBUTUHAN */}
            <div>
              <label className="block font-bold text-slate-700 mb-2">Detail Kebutuhan</label>
              <textarea
                rows={4}
                value={values.detailKebutuhan}
                onChange={(e) => handleChange('detailKebutuhan', e.target.value)}
                placeholder="Masukkan detail kebutuhan (skill), contoh: PHP, React"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:ring-2 focus:ring-[#1f877c] focus:outline-hidden resize-none"
              />
            </div>

            {/* KUOTA */}
            <div>
              <label className="block font-bold text-slate-700 mb-2">
                Kuota <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min={1}
                required
                value={values.kuota}
                onChange={(e) => handleChange('kuota', e.target.value)}
                placeholder="Masukkan jumlah kuota yang dibutuhkan"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:ring-2 focus:ring-[#1f877c] focus:outline-hidden"
              />
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 font-bold text-slate-600 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-2.5 rounded-xl bg-[#1f877c] hover:bg-[#196e65] text-white font-bold transition-all shadow-xs cursor-pointer disabled:opacity-60"
            >
              {submitting ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};