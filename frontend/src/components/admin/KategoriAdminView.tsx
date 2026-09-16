import React, { useEffect, useMemo, useState } from 'react';
import { useKategoriAdmin } from './hooks/useKategoriAdmin';
import { KategoriFormValues, KategoriItem } from '../../types/kategori';
import { KategoriStatsCards } from './kategori/KategoriStatsCards';
import { KategoriTable } from './kategori/KategoriTable';
import { KategoriTrashTable } from './kategori/KategoriTrashTable';
import { KategoriFormModal } from './kategori/KategoriFormModal';

function itemToFormValues(item: KategoriItem): KategoriFormValues {
  return {
    name: item.name,
    bidangId: item.bidangId,
    description: item.description || '',
  };
}

type TabKey = 'aktif' | 'sampah';

export const KategoriAdminView: React.FC = () => {
  const {
    kategoriList,
    loading,
    error,
    bidangOptions,
    createKategori,
    updateKategori,
    deleteKategori,
    trashed,
    trashedLoading,
    trashedError,
    fetchTrashed,
    restoreKategori,
    forceDeleteKategori,
  } = useKategoriAdmin();

  const [activeTab, setActiveTab] = useState<TabKey>('aktif');
  const [searchTerm, setSearchTerm] = useState('');
  const [bidangFilter, setBidangFilter] = useState<number | 'Semua'>('Semua');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedKategori, setSelectedKategori] = useState<KategoriItem | null>(null);

  // Muat data Sampah begitu tab dibuka (lazy load).
  useEffect(() => {
    if (activeTab === 'sampah') {
      fetchTrashed();
    }
  }, [activeTab, fetchTrashed]);

  const filteredKategori = useMemo(
    () =>
      kategoriList.filter((k) => {
        const matchesSearch =
          k.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          k.bidangName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesBidang = bidangFilter === 'Semua' || k.bidangId === bidangFilter;
        return matchesSearch && matchesBidang;
      }),
    [kategoriList, searchTerm, bidangFilter]
  );

  return (
    <div className="space-y-6 animate-fade-in font-sans text-slate-800">

      {/* PAGE HEADER & ACTION BUTTON */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Kelola Master Data Kategori Magang
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Atur jenis/kategori magang di DISKOMINFOSAN Kota Yogyakarta. (Pengaturan kuota lowongan berada di menu Periode Magang).
          </p>
        </div>

        {activeTab === 'aktif' && (
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="bg-[#1f877c] hover:bg-[#196e65] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-lg">add_circle</span>
            <span> Tambah Kategori Baru</span>
          </button>
        )}
      </div>

      {/* TAB SWITCHER: AKTIF / SAMPAH */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab('aktif')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 -mb-px transition-colors cursor-pointer ${
            activeTab === 'aktif'
              ? 'border-[#1f877c] text-[#1f877c]'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Kategori Aktif
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('sampah')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 -mb-px transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'sampah'
              ? 'border-[#1f877c] text-[#1f877c]'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <span className="material-symbols-outlined text-base">delete</span>
          Sampah
          {trashed.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px]">
              {trashed.length}
            </span>
          )}
        </button>
      </div>

      {activeTab === 'aktif' ? (
        loading ? (
          <div className="flex items-center justify-center py-24 text-sm font-medium text-slate-500">
            Memuat data kategori...
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-24 text-sm font-medium text-red-500">
            Gagal memuat data: {error}
          </div>
        ) : (
          <>
            <KategoriStatsCards kategoriList={kategoriList} />

            <KategoriTable
              kategoriList={filteredKategori}
              bidangOptions={bidangOptions}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              bidangFilter={bidangFilter}
              onBidangFilterChange={setBidangFilter}
              onEdit={setSelectedKategori}
              onDelete={deleteKategori}
            />
          </>
        )
      ) : (
        <KategoriTrashTable
          kategoriList={trashed}
          loading={trashedLoading}
          error={trashedError}
          onRestore={restoreKategori}
          onForceDelete={forceDeleteKategori}
        />
      )}

      {/* MODAL TAMBAH KATEGORI */}
      <KategoriFormModal
        mode="add"
        open={showAddModal}
        bidangOptions={bidangOptions}
        onClose={() => setShowAddModal(false)}
        onSubmit={createKategori}
      />

      {/* MODAL EDIT KATEGORI */}
      <KategoriFormModal
        mode="edit"
        open={!!selectedKategori}
        bidangOptions={bidangOptions}
        initialValues={selectedKategori ? itemToFormValues(selectedKategori) : undefined}
        onClose={() => setSelectedKategori(null)}
        onSubmit={(values) => (selectedKategori ? updateKategori(selectedKategori.id, values) : false)}
      />

    </div>
  );
};