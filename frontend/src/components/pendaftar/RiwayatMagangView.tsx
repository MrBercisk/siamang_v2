import { useState } from 'react';

interface RiwayatItem {
  id: number;
  periode: string;
  tanggalDaftar: string;
  bidang: string;
  status: 'Diterima' | 'Tidak Diterima' | 'Sedang Ditinjau';
}

export function RiwayatMagangView() {
  const [riwayatList] = useState<RiwayatItem[]>([
    {
      id: 1,
      periode: 'Juli - Desember 2026',
      tanggalDaftar: '28 Mei 2026',
      bidang: 'Pengembangan Sistem Informasi',
      status: 'Diterima',
    },
    {
      id: 2,
      periode: 'Januari - Juli 2025',
      tanggalDaftar: 'Desember 2024',
      bidang: 'Desain Komunikasi Visual',
      status: 'Tidak Diterima',
    },
  ]);

  const totalDiterima = riwayatList.filter((r) => r.status === 'Diterima').length;
  const totalTidakDiterima = riwayatList.filter((r) => r.status === 'Tidak Diterima').length;

  return (
    <div className="space-y-6 animate-in fade-in">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
        Riwayat Pendaftaran
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Card: Daftar Riwayat Pendaftaran */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 mb-4">
              Daftar Riwayat Pendaftaran
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-800 font-bold text-xs sm:text-sm">
                    <th className="py-3 px-2 font-bold">Periode Magang</th>
                    <th className="py-3 px-2 font-bold">Tanggal Daftar</th>
                    <th className="py-3 px-2 font-bold">Bidang</th>
                    <th className="py-3 px-2 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm text-slate-700">
                  {riwayatList.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-2 font-medium text-slate-800">{item.periode}</td>
                      <td className="py-4 px-2 text-slate-600">{item.tanggalDaftar}</td>
                      <td className="py-4 px-2 text-slate-700">{item.bidang}</td>
                      <td className="py-4 px-2">
                        {item.status === 'Diterima' ? (
                          <span className="font-bold text-emerald-600 text-xs sm:text-sm">
                            Diterima
                          </span>
                        ) : item.status === 'Tidak Diterima' ? (
                          <span className="font-bold text-rose-600 text-xs sm:text-sm">
                            Tidak Diterima
                          </span>
                        ) : (
                          <span className="font-bold text-amber-600 text-xs sm:text-sm">
                            Sedang Ditinjau
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination & Counter Footer */}
          <div className="mt-8 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
            <span>Menampilkan 1 - {riwayatList.length} dari {riwayatList.length} riwayat.</span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled
                className="w-7 h-7 rounded-lg border border-slate-200 text-slate-300 flex items-center justify-center cursor-not-allowed text-xs"
              >
                &lt;
              </button>
              <button
                type="button"
                className="w-7 h-7 rounded-lg border border-emerald-600 bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center text-xs"
              >
                1
              </button>
              <button
                type="button"
                disabled
                className="w-7 h-7 rounded-lg border border-slate-200 text-slate-300 flex items-center justify-center cursor-not-allowed text-xs"
              >
                &gt;
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Ringkasan & Informasi */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card 1: Ringkasan */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Ringkasan</h3>

            <div className="flex items-center gap-6 pt-1">
              {/* Diterima */}
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0">
                  <span className="material-symbols-outlined text-base font-bold">check_circle</span>
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-900 mr-1.5">{totalDiterima}</span>
                  <span className="text-xs font-semibold text-slate-600">Diterima</span>
                </div>
              </div>

              {/* Tidak Diterima */}
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-xs shrink-0">
                  <span className="material-symbols-outlined text-base font-bold">cancel</span>
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-900 mr-1.5">{totalTidakDiterima}</span>
                  <span className="text-xs font-semibold text-slate-600">Tidak Diterima</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Informasi */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Informasi</h3>
            <ul className="list-disc list-inside text-xs text-slate-600 space-y-2 leading-relaxed">
              <li>Riwayat pendaftaran akan tersimpan secara permanen.</li>
              <li>Anda dapat melihat detail setiap pendaftaran dan mengunduh bukti pendaftaran.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
