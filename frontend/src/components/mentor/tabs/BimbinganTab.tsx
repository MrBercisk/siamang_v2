import { useMemo, useState } from 'react';
import { DetailBimbinganView } from '../../../components/mentor/DetailBimbinganView';
import { BimbinganToolbar } from '../../../components/mentor/bimbingan/BimbinganToolbar';
import { BimbinganTable } from '../../../components/mentor/bimbingan/BimbinganTable';
import { BimbinganPagination } from '../../../components/mentor/bimbingan/BimbinganPagination';
import { useBimbinganMentorList } from '../../../components/mentor/hooks/useBimbinganMentorList';

export function BimbinganTab() {
  const { items, loading, error, refetch } = useBimbinganMentorList();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return items;
    return items.filter(
      (item) =>
        item.nama.toLowerCase().includes(keyword) ||
        item.kategori.toLowerCase().includes(keyword) ||
        item.judulProject.toLowerCase().includes(keyword)
    );
  }, [items, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * perPage;
  const pageItems = filtered.slice(startIndex, startIndex + perPage);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handlePerPageChange = (value: number) => {
    setPerPage(value);
    setPage(1);
  };

  // Kembali dari detail: muat ulang daftar supaya progress/status terbaru tampil.
  const handleBack = () => {
    setSelectedId(null);
    refetch();
  };

  if (selectedId) {
    return <DetailBimbinganView bimbinganId={selectedId} onBack={handleBack} />;
  }

  const emptyMessage = search.trim()
    ? `Tidak ada data yang sesuai dengan pencarian "${search.trim()}".`
    : 'Belum ada mahasiswa bimbingan.';

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-xl font-bold text-slate-900">Data Bimbingan Mahasiswa</h2>

      {loading && items.length === 0 ? (
        <div className="flex items-center justify-center py-24 text-sm font-medium text-slate-500">
          Memuat data bimbingan...
        </div>
      ) : error && items.length === 0 ? (
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
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <BimbinganToolbar
            perPage={perPage}
            onPerPageChange={handlePerPageChange}
            search={search}
            onSearchChange={handleSearchChange}
          />

          <BimbinganTable
            items={pageItems}
            startIndex={startIndex}
            emptyMessage={emptyMessage}
            onSelect={(item) => setSelectedId(item.id)}
          />

          <BimbinganPagination
            total={filtered.length}
            page={currentPage}
            perPage={perPage}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}