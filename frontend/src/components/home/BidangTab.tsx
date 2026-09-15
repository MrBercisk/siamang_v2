import { InternshipCategory } from '../../types/internship';

interface BidangTabProps {
  categories: InternshipCategory[];
  onApplyCategory?: (category: InternshipCategory) => void;
  onContactWhatsApp: () => void;
}

export function BidangTab({ categories, onApplyCategory, onContactWhatsApp }: BidangTabProps) {
  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex items-start gap-3">
        <div className="text-[#1f877c] mt-0.5">
          <span className="material-symbols-outlined text-2xl font-bold">category</span>
        </div>
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-[#1e293b]">
            Bidang & Kategori yang Tersedia
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Pilih bidang sesuai minat dan kompetensi anda
          </p>
        </div>
      </div>

      {/* Grid Cards — satu kartu per Lowongan/Proyek */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.length === 0 && (
          <div className="md:col-span-3 text-center py-10 text-sm text-slate-400">
            Belum ada lowongan magang yang tersedia saat ini.
          </div>
        )}

        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-2xl border border-slate-200/90 p-6 flex flex-col justify-between shadow-2xs hover:shadow-md transition-shadow"
          >
            <div>
              <div className="flex items-start gap-3.5 mb-3">
                <div className="w-11 h-11 rounded-2xl bg-[#D1FAE5] text-[#1f877c] flex items-center justify-center shrink-0 shadow-2xs">
                  <span className="material-symbols-outlined text-xl font-bold">
                    {cat.icon || 'work'}
                  </span>
                </div>
                <div className="flex-1">
                  {cat.bidangName && (
                    <span className="text-[11px] font-medium text-slate-400 block mb-0.5">
                      {cat.bidangName}
                    </span>
                  )}
                  <h4 className="text-sm sm:text-base font-bold text-[#1e293b] leading-tight">
                    {cat.title}
                  </h4>
                  {cat.kategoriName && (
                    <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-[#1f877c] bg-[#D1FAE5] border border-emerald-200">
                      {cat.kategoriName}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mt-4">{cat.description}</p>

              {cat.detailKebutuhan && (
                <p className="text-[11px] text-slate-500 leading-relaxed mt-2 italic">
                  {cat.detailKebutuhan}
                </p>
              )}
            </div>

            <div className="border-t border-slate-100 mt-6 pt-4 flex items-center justify-between">
              <span className="text-xs text-slate-500">Slot Tersedia</span>
              <span className="text-xs font-bold text-[#1f877c]">
                {typeof cat.kuota === 'number'
                  ? `${Math.max(cat.kuota - (cat.filled ?? 0), 0)} dari ${cat.kuota}`
                  : 'Belum ditentukan'}
              </span>
            </div>

            {onApplyCategory && (
              <button
                type="button"
                onClick={() => onApplyCategory(cat)}
                className="mt-4 w-full bg-[#1f877c] hover:bg-[#196e65] text-white font-bold text-xs py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                Daftar Lowongan Ini
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Banner */}
      <div className="bg-[#E6F7F3] rounded-2xl p-6 sm:p-8 border border-emerald-100 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xs">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-[#D1FAE5] text-[#1f877c] flex items-center justify-center shrink-0 shadow-2xs">
            <span className="material-symbols-outlined text-3xl">search</span>
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-bold text-[#1e293b]">
              Tidak menemukan bidang yang sesuai?
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Bidang dapat berubah sesuai dengan kebutuhan instansi. Pantau informasi terbaru secara berkala.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onContactWhatsApp}
          className="bg-[#1f877c] hover:bg-[#196e65] text-white px-6 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shrink-0 shadow-xs cursor-pointer transition-colors"
        >
          <span>Hubungi Kami</span>
          <span className="material-symbols-outlined text-lg">chat</span>
        </button>
      </div>
    </div>
  );
}