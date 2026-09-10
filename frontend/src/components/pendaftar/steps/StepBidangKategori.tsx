import type { BidangOption, KategoriOption } from '../../../hooks/useInternshipData';
import { showWarningAlert } from '../../../utils/swal';

interface StepBidangKategoriProps {
  selectedBidang: string;
  setSelectedBidang: (value: string) => void;
  selectedKategori: string;
  setSelectedKategori: (value: string) => void;
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
  bidangOptions,
  kategoriByBidang,
  onBack,
  onNext,
}: StepBidangKategoriProps) {
  const kategoriOptions = kategoriByBidang[selectedBidang] || [];

  const handleBidangChange = (value: string) => {
    setSelectedBidang(value);
    setSelectedKategori(''); // reset kategori setiap kali bidang berganti
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
            onChange={(e) => setSelectedKategori(e.target.value)}
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