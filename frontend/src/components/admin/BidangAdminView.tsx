import React, { useEffect, useMemo, useState } from 'react';
import { useBidangAdmin } from './hooks/useBidangAdmin';
import { BidangFormValues, BidangItem } from '../../types/bidang';
import { BidangStatsCards } from './bidang/BidangStatsCards';
import { BidangTable } from './bidang/BidangTable';
import { BidangTrashTable } from './bidang/BidangTrashTable';
import { BidangFormModal } from './bidang/BidangFormModal';

function itemToFormValues(item: BidangItem): BidangFormValues {
  return {
    name: item.name,
    status: item.status,
  };
}

type TabKey = 'aktif' | 'sampah';

export const BidangAdminView: React.FC = () => {
  const {
    bidangList,
    loading,
    error,
    createBidang,
    updateBidang,
    deleteBidang,
    toggleStatus,
    trashed,
    trashedLoading,
    trashedError,
    fetchTrashed,
    restoreBidang,
    forceDeleteBidang,
  } = useBidangAdmin();

  const [activeTab, setActiveTab] = useState<TabKey>('aktif');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedBidang, setSelectedBidang] = useState<BidangItem | null>(null);

  // Muat data Sampah begitu tab dibuka (lazy load, tidak dipanggil di awal).
  useEffect(() => {
    if (activeTab === 'sampah') {
      fetchTrashed();
    }
  }, [activeTab, fetchTrashed]);

  const filteredBidang = useMemo(
    () => bidangList.filter((b) => b.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [bidangList, searchTerm]
  );

  return (
    <div className="space-y-6 animate-fade-in font-sans text-slate-800">

      {/* PAGE HEADER & ACTION BUTTON */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Kelola Master Data Bidang
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Kelola daftar unit kerja, penanggung jawab, dan kuota kategori magang di DISKOMINFOSAN Kota Yogyakarta.
          </p>
        </div>

        {activeTab === 'aktif' && (
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="bg-[#1f877c] hover:bg-[#196e65] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-lg">add_circle</span>
            <span> Tambah Bidang Baru</span>
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
          Bidang Aktif
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
            Memuat data bidang...
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-24 text-sm font-medium text-red-500">
            Gagal memuat data: {error}
          </div>
        ) : (
          <>
            <BidangStatsCards bidangList={bidangList} />

            <BidangTable
              bidangList={filteredBidang}
              totalCount={bidangList.length}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onEdit={setSelectedBidang}
              onDelete={deleteBidang}
              onToggleStatus={toggleStatus}
            />
          </>
        )
      ) : (
        <BidangTrashTable
          bidangList={trashed}
          loading={trashedLoading}
          error={trashedError}
          onRestore={restoreBidang}
          onForceDelete={forceDeleteBidang}
        />
      )}

      {/* MODAL TAMBAH BIDANG */}
      <BidangFormModal
        mode="add"
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={createBidang}
      />

      {/* MODAL EDIT BIDANG */}
      <BidangFormModal
        mode="edit"
        open={!!selectedBidang}
        initialValues={selectedBidang ? itemToFormValues(selectedBidang) : undefined}
        onClose={() => setSelectedBidang(null)}
        onSubmit={(values) => (selectedBidang ? updateBidang(selectedBidang.id, values) : false)}
      />

    </div>
  );
};