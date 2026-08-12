import { useState } from 'react';
import { DetailBimbinganView, BimbinganData } from '../../../components/mentor/DetailBimbinganView';
import { initialBimbinganList } from '../../../data/mentorSampleData';

export function BimbinganTab() {
  const [bimbinganList, setBimbinganList] = useState<BimbinganData[]>(initialBimbinganList);
  const [selectedBimbingan, setSelectedBimbingan] = useState<BimbinganData | null>(null);
  const [bimbinganSearch, setBimbinganSearch] = useState('');
  const [bimbinganItemsPerPage, setBimbinganItemsPerPage] = useState(10);

  if (selectedBimbingan) {
    return (
      <DetailBimbinganView
        bimbingan={selectedBimbingan}
        onBack={() => setSelectedBimbingan(null)}
        onUpdateBimbingan={(updated) => {
          setBimbinganList((prev) =>
            prev.map((item) => (item.id === updated.id ? updated : item))
          );
          setSelectedBimbingan(updated);
        }}
      />
    );
  }

  const filteredList = bimbinganList.filter(
    (b) =>
      b.nama.toLowerCase().includes(bimbinganSearch.toLowerCase()) ||
      b.kategori.toLowerCase().includes(bimbinganSearch.toLowerCase()) ||
      b.judulProject.toLowerCase().includes(bimbinganSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-xl font-bold text-slate-900">Data Bimbingan Mahasiswa</h2>

      {/* MAIN TABLE CONTAINER */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">

        {/* TOP CONTROLS */}
        <div className="p-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
            <span>Tampilkan</span>
            <select
              value={bimbinganItemsPerPage}
              onChange={(e) => setBimbinganItemsPerPage(Number(e.target.value))}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-bold text-slate-800 focus:outline-hidden focus:border-[#1f877c]"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>data per halaman</span>
          </div>

          <div className="relative min-w-[240px]">
            <input
              type="text"
              placeholder="Cari ..."
              value={bimbinganSearch}
              onChange={(e) => setBimbinganSearch(e.target.value)}
              className="w-full pl-3 pr-8 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-[#1f877c]"
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-y border-slate-200 text-slate-900 font-bold bg-white">
                <th className="py-4 px-4 text-center w-12">No</th>
                <th className="py-4 px-4">Nama Mahasiswa</th>
                <th className="py-4 px-4">Kategori</th>
                <th className="py-4 px-4">Judul Project</th>
                <th className="py-4 px-4">Last Update</th>
                <th className="py-4 px-4 text-center">Status</th>
                <th className="py-4 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.map((student, index) => (
                <tr key={student.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-4 text-center font-bold text-slate-400">
                    {index + 1}
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-900">
                    {student.nama}
                  </td>
                  <td className="py-4 px-4 text-slate-600 max-w-[200px] leading-relaxed">
                    {student.kategori}
                  </td>
                  <td className="py-4 px-4 text-slate-600 max-w-[200px] leading-relaxed">
                    {student.judulProject}
                  </td>
                  <td className="py-4 px-4 text-slate-600 whitespace-nowrap">
                    {student.lastUpdate}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-block px-4 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-300">
                      {student.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => setSelectedBimbingan(student)}
                      className="p-1.5 rounded-lg border border-[#1f877c] text-[#1f877c] hover:bg-[#E6F7F3] cursor-pointer inline-flex items-center justify-center transition-all"
                      title="Detail Bimbingan Mahasiswa"
                    >
                      <span className="material-symbols-outlined text-lg">
                        visibility
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER */}
        <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            Menampilkan 1 - {bimbinganList.length} dari {bimbinganList.length} entri.
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-400 cursor-not-allowed"
              disabled
            >
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <button
              type="button"
              className="w-8 h-8 rounded-lg bg-[#1f877c] text-white font-bold flex items-center justify-center"
            >
              1
            </button>
            <button
              type="button"
              className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-400 cursor-not-allowed"
              disabled
            >
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}