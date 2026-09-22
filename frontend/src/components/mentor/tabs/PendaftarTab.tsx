import { useMemo, useState } from 'react';
import { usePendaftarMentorList } from '../../../components/mentor/hooks/usePendaftarMentorList';
import { PendaftarMentorStatsCards } from '../../../components/mentor/pendaftar/PendaftarMentorStatsCards';
import { PendaftarMentorTable } from '../../../components/mentor/pendaftar/PendaftarMentorTable';
import { DetailPendaftarView } from '../../../components/mentor/DetailPendaftarView';
import type { PendaftarData } from '../../../types/pendaftar';

export function PendaftarTab() {
  const { applicantList, loading, error, refetch } = usePendaftarMentorList();

  const [selectedApplicant, setSelectedApplicant] = useState<PendaftarData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [categoryFilter, setCategoryFilter] = useState('Semua');

  // Diambil dari data yang termuat, bukan daftar tetap — mentor bisa mengampu
  // lebih dari satu kategori (lihat MentorDashboardService::getStats).
  const categoryOptions = useMemo(
    () =>
      Array.from(new Set(applicantList.map((a) => a.kategori).filter((k): k is string => Boolean(k)))),
    [applicantList]
  );

  const filteredApplicants = useMemo(
    () =>
      applicantList.filter((app) => {
        const term = searchTerm.toLowerCase();
        const matchesSearch =
          (app.nama ?? '').toLowerCase().includes(term) ||
          (app.instansi ?? '').toLowerCase().includes(term) ||
          (app.nim ?? '').toLowerCase().includes(term) ||
          (app.kategori ?? '').toLowerCase().includes(term);

        const matchesStatus = statusFilter === 'Semua' || app.status === statusFilter;
        const matchesCategory = categoryFilter === 'Semua' || app.kategori === categoryFilter;

        return matchesSearch && matchesStatus && matchesCategory;
      }),
    [applicantList, searchTerm, statusFilter, categoryFilter]
  );

  // Kembali dari detail: muat ulang, siapa tahu admin mengubah status sementara mentor melihat.
  const handleBack = () => {
    setSelectedApplicant(null);
    refetch();
  };

  if (selectedApplicant) {
    // Tanpa onUpdateStatus/onAccept -> tombol Terima/Tolak otomatis tersembunyi (baca saja).
    return <DetailPendaftarView pendaftar={selectedApplicant} onBack={handleBack} />;
  }

  return (
    <div className="space-y-6 animate-fade-in font-sans text-slate-800">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Pendaftar Magang</h1>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Tinjau berkas pendaftar pada kategori yang Anda ampu. Keputusan terima/tolak dilakukan oleh admin.
        </p>
      </div>

      {loading && applicantList.length === 0 ? (
        <div className="flex items-center justify-center py-24 text-sm font-medium text-slate-500">
          Memuat data pendaftar...
        </div>
      ) : error && applicantList.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-24 text-sm font-medium text-red-500">
          <span>Gagal memuat data: {error}</span>
          <button
            type="button"
            onClick={refetch}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold cursor-pointer"
          >
            Coba lagi
          </button>
        </div>
      ) : (
        <>
          <PendaftarMentorStatsCards applicantList={applicantList} />

          <PendaftarMentorTable
            applicantList={filteredApplicants}
            totalCount={applicantList.length}
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            categoryFilter={categoryFilter}
            categoryOptions={categoryOptions}
            onSearchChange={setSearchTerm}
            onStatusFilterChange={setStatusFilter}
            onCategoryFilterChange={setCategoryFilter}
            onDetail={setSelectedApplicant}
          />
        </>
      )}
    </div>
  );
}