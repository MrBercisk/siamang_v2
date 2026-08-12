import { useState } from 'react';
import { DetailPendaftarView } from '../../../components/mentor/DetailPendaftarView';
import { PendaftarData } from '../../../components/mentor/DetailDataModal';
import { initialPendaftarList } from '../../../data/mentorSampleData';

type PendaftarFilter = 'all' | 'verifikasi' | 'diterima' | 'ditolak';

export function PendaftarTab() {
  const [pendaftarList, setPendaftarList] = useState<PendaftarData[]>(initialPendaftarList);
  const [selectedPendaftar, setSelectedPendaftar] = useState<PendaftarData | null>(null);
  const [pendaftarFilter, setPendaftarFilter] = useState<PendaftarFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleUpdateStatus = (id: number, newStatus: 'Diterima' | 'Ditolak' | 'Verifikasi') => {
    setPendaftarList(
      pendaftarList.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
  };

  // Counts for tabs
  const countVerifikasi = pendaftarList.filter((p) => p.status === 'Verifikasi').length;
  const countDiterima = pendaftarList.filter((p) => p.status === 'Diterima').length;
  const countDitolak = pendaftarList.filter((p) => p.status === 'Ditolak').length;

  // Filtered List
  const filteredPendaftar = pendaftarList.filter((p) => {
    const matchesTab =
      pendaftarFilter === 'all'
        ? true
        : pendaftarFilter === 'verifikasi'
        ? p.status === 'Verifikasi'
        : pendaftarFilter === 'diterima'
        ? p.status === 'Diterima'
        : p.status === 'Ditolak';

    const matchesSearch =
      p.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.kategori.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.instansi.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  if (selectedPendaftar) {
    return (
      <DetailPendaftarView
        pendaftar={selectedPendaftar}
        onBack={() => setSelectedPendaftar(null)}
        onUpdateStatus={handleUpdateStatus}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-xl font-bold text-slate-900">Data Pendaftar Magang</h2>

      {/* MAIN CONTAINER */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">

        {/* TABS HEADER */}
        <div className="flex border-b border-slate-200 overflow-x-auto">
          <button
            type="button"
            onClick={() => setPendaftarFilter('all')}
            className={`px-6 py-3.5 text-xs font-bold transition-all whitespace-nowrap cursor-pointer border-b-2 ${
              pendaftarFilter === 'all'
                ? 'border-[#1f877c] text-[#1f877c]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Semua Pendaftar
          </button>
          <button
            type="button"
            onClick={() => setPendaftarFilter('verifikasi')}
            className={`px-6 py-3.5 text-xs font-bold transition-all whitespace-nowrap cursor-pointer border-b-2 ${
              pendaftarFilter === 'verifikasi'
                ? 'border-[#1f877c] text-[#1f877c]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Menunggu Verifikasi ({countVerifikasi})
          </button>
          <button
            type="button"
            onClick={() => setPendaftarFilter('diterima')}
            className={`px-6 py-3.5 text-xs font-bold transition-all whitespace-nowrap cursor-pointer border-b-2 ${
              pendaftarFilter === 'diterima'
                ? 'border-[#1f877c] text-[#1f877c]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Diterima ({countDiterima})
          </button>
          <button
            type="button"
            onClick={() => setPendaftarFilter('ditolak')}
            className={`px-6 py-3.5 text-xs font-bold transition-all whitespace-nowrap cursor-pointer border-b-2 ${
              pendaftarFilter === 'ditolak'
                ? 'border-[#1f877c] text-[#1f877c]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Ditolak ({countDitolak})
          </button>
        </div>

        {/* CONTROLS BAR: ITEMS PER PAGE & SEARCH */}
        <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 text-xs">
          <div className="flex items-center gap-2 text-slate-600 font-medium">
            <span>Tampilkan</span>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white font-bold text-slate-800 focus:outline-hidden focus:border-[#1f877c]"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
            </select>
            <span>data per halaman</span>
          </div>

          <div className="w-full sm:w-64 relative">
            <input
              type="text"
              placeholder="Cari ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium focus:outline-hidden focus:border-[#1f877c] focus:ring-1 focus:ring-[#1f877c]"
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-900 font-bold bg-slate-50/50">
                <th className="py-4 px-4 text-center w-12">No</th>
                <th className="py-4 px-4">Foto Profil</th>
                <th className="py-4 px-4">Nama</th>
                <th className="py-4 px-4">Kategori</th>
                <th className="py-4 px-4">Tanggal Daftar</th>
                <th className="py-4 px-4 text-center">Status</th>
                <th className="py-4 px-4 text-center w-20">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPendaftar.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-medium">
                    Tidak ada data pendaftar yang cocok.
                  </td>
                </tr>
              ) : (
                filteredPendaftar.map((p, idx) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-4 text-center font-bold text-slate-500">
                      {idx + 1}
                    </td>
                    <td className="py-4 px-4">
                      <img
                        src={p.fotoUrl}
                        alt={p.nama}
                        className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-2xs"
                      />
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-900">{p.nama}</td>
                    <td className="py-4 px-4 text-slate-700 max-w-xs leading-relaxed font-medium">
                      {p.kategori}
                    </td>
                    <td className="py-4 px-4 text-slate-600 font-medium whitespace-nowrap">
                      {p.tanggalDaftar}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {p.status === 'Diterima' ? (
                        <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          Diterima
                        </span>
                      ) : p.status === 'Ditolak' ? (
                        <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                          Ditolak
                        </span>
                      ) : (
                        <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          Verifikasi
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedPendaftar(p)}
                        className="w-8 h-8 rounded-lg border border-[#1f877c]/30 text-[#1f877c] hover:bg-[#E6F7F3] flex items-center justify-center cursor-pointer transition-all mx-auto"
                        title="Lihat Detail Data"
                      >
                        <span className="material-symbols-outlined text-lg">visibility</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER PAGINATION */}
        <div className="p-4 sm:p-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <span>
            Menampilkan 1 - {filteredPendaftar.length} dari {filteredPendaftar.length} entri.
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-600 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <button
              type="button"
              className="w-8 h-8 rounded-lg bg-[#1f877c] text-white font-bold flex items-center justify-center shadow-2xs cursor-pointer"
            >
              1
            </button>
            <button
              type="button"
              className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-600 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}