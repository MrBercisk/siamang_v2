import type {
  BidangOption,
  KategoriOption,
  LowonganOption,
} from '../../../../hooks/useInternshipData';

import { showWarningAlert } from '../../../../utils/swal';

interface StepBidangKategoriProps {
  selectedBidang: string;
  setSelectedBidang: (value: string) => void;
  selectedKategori: string;
  setSelectedKategori: (value: string) => void;
  selectedLowongan: string;
  setSelectedLowongan: (value: string) => void;
  lowonganByKategori: Record<string, LowonganOption[]>;
  bidangOptions: BidangOption[];
  kategoriByBidang: Record<string, KategoriOption[]>;
  onBack: () => void;
  onNext: () => void;
}

export function StepBidangKategori({
  selectedBidang,
  setSelectedBidang,
  selectedKategori,
  setSelectedKategori,
  selectedLowongan,
  setSelectedLowongan,
  lowonganByKategori,
  bidangOptions,
  kategoriByBidang,
  onBack,
  onNext,
}: StepBidangKategoriProps) {
  const kategoriOptions = kategoriByBidang[selectedBidang] || [];
  const lowonganOptions = lowonganByKategori[selectedKategori] || [];

  const handleBidangChange = (value: string) => {
    setSelectedBidang(value);
    setSelectedKategori('');
    setSelectedLowongan('');
  };
  const handleKategoriChange = (value: string) => {
    setSelectedKategori(value);
    setSelectedLowongan('');
  };

  const handleNext = () => {
    if (!selectedBidang) {
      showWarningAlert('Bidang Belum Dipilih', 'Silakan pilih bidang terlebih dahulu sebelum melanjutkan.');
      return;
    }
    if (!selectedKategori) {
      showWarningAlert('Kategori Belum Dipilih', 'Silakan pilih kategori terlebih dahulu sebelum melanjutkan.');
      return;
    }
    if (!selectedLowongan) {
      showWarningAlert(
        'Lowongan Belum Dipilih',
        'Silakan pilih lowongan magang terlebih dahulu sebelum melanjutkan.'
      );
      return;
    }
    onNext();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-8 shadow-2xs space-y-6">
      <div>
        <h2 className="text-base sm:text-lg font-bold text-slate-900">Pilih Bidang & Kategori</h2>
        <p className="text-xs text-slate-500 mt-0.5">Pilih bidang & kategori sesuai dengan minat dan keahlian Anda.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
        <div>
          <label className="block font-bold text-slate-700 mb-1">
            Pilih Bidang <span className="text-rose-500">*</span>
          </label>
          <select
            value={selectedBidang}
            onChange={(e) => handleBidangChange(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#1f877c] outline-none bg-white font-semibold text-slate-800"
          >
            <option value="" disabled>
              Pilih bidang
            </option>
            {bidangOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">
            Pilih Kategori <span className="text-rose-500">*</span>
          </label>
          <select
              value={selectedKategori}
              onChange={(e) => handleKategoriChange(e.target.value)}
              disabled={!selectedBidang}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#1f877c] outline-none bg-white font-semibold text-slate-800 disabled:bg-slate-50 disabled:text-slate-400"
            >
            <option value="" disabled>
              {selectedBidang ? 'Pilih kategori' : 'Pilih bidang terlebih dahulu'}
            </option>
            {kategoriOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.name}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
            <label className="block font-bold text-slate-700 mb-1">
              Pilih Lowongan <span className="text-rose-500">*</span>
            </label>

            <select
              value={selectedLowongan}
              onChange={(e) => setSelectedLowongan(e.target.value)}
              disabled={!selectedKategori}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#1f877c] outline-none bg-white font-semibold text-slate-800 disabled:bg-slate-50 disabled:text-slate-400"
            >
              <option value="" disabled>
                {!selectedBidang
                  ? 'Pilih bidang terlebih dahulu'
                  : !selectedKategori
                    ? 'Pilih kategori terlebih dahulu'
                    : lowonganOptions.length === 0
                      ? 'Tidak ada lowongan tersedia'
                      : 'Pilih lowongan'}
              </option>

              {lowonganOptions.map((lowongan) => {
                const remaining =
                  lowongan.kuota !== undefined && lowongan.filled !== undefined
                    ? Math.max(lowongan.kuota - lowongan.filled, 0)
                    : null;

                return (
                  <option key={lowongan.id} value={lowongan.id}>
                    {lowongan.project}
                    {remaining !== null
                      ? ` — ${remaining} kuota tersedia`
                      : ''}
                  </option>
                );
              })}
            </select>
          </div>
      </div>

      {/* Info Box */}
      <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-start gap-3 text-xs text-slate-700">
        <span className="material-symbols-outlined text-emerald-700 text-lg mt-0.5">info</span>
        <div>
          <span className="font-bold text-emerald-900 block">Informasi Penting</span>
          <span>Pastikan tipe pendaftaran dipilih dengan benar karena akan mempengaruhi data yang harus diisi pada langkah selanjutnya.</span>
        </div>
      </div>

      {/* Bottom Bar Footer */}
      <div className="p-4 bg-[#E6F7F3] border border-emerald-200 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white font-bold text-xs text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
        >
          Kembali
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="px-6 py-2.5 bg-[#1f877c] hover:bg-[#196e65] text-white font-bold text-xs rounded-xl shadow-2xs transition-all cursor-pointer ml-auto"
        >
          Simpan & Lanjutkan
        </button>
      </div>
    </div>
  );
}