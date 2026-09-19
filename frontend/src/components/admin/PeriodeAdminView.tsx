import React, { useMemo, useState } from 'react';
import { usePeriodeAdmin } from './hooks/usePeriodeAdmin';
import { useKategoriAdmin } from './hooks/useKategoriAdmin';
import {
  LowonganItem,
  lowonganToFormValues,
  periodeToFormValues,
  toKategoriOptions,
} from '../../types/periode';
import { PeriodeInfoTable } from './periode/PeriodeInfoTable';
import { LowonganTable } from './periode/LowonganTable';
import { LowonganForm } from './periode/LowonganForm';
import { PeriodeFormModal } from './periode/PeriodeFormModal';


type ViewState = 'list' | 'add_lowongan' | 'edit_lowongan';

export const PeriodeAdminView: React.FC = () => {
  const {
    periodeData,
    periodeList,
    selectedPeriodeId,
    selectPeriode,
    lowonganList,
    loading,
    error,
    savePeriode,
    createLowongan,
    updateLowongan,
    deleteLowongan,
  } = usePeriodeAdmin();

  // Dropdown kategori memakai hook Master Data Kategori yang sama, bukan
  // fetch terpisah — supaya tidak ada dua sumber data untuk hal yang sama.
  // Hanya kategori dengan bidang induk Aktif yang ditawarkan di form.
  const { kategoriList, loading: kategoriLoading, error: kategoriError } = useKategoriAdmin();
  const kategoriOptions = useMemo(() => toKategoriOptions(kategoriList), [kategoriList]);

  const [viewState, setViewState] = useState<ViewState>('list');
  const [editingLowongan, setEditingLowongan] = useState<LowonganItem | null>(null);
  const [editingPeriode, setEditingPeriode] = useState<typeof periodeData>(null);
  const [showEditPeriodeModal, setShowEditPeriodeModal] = useState(false);

  // Search & pagination (UI-only untuk saat ini)
  const [searchPeriode, setSearchPeriode] = useState('');
  const [itemsPerPagePeriode, setItemsPerPagePeriode] = useState(10);
  const [itemsPerPageLowongan, setItemsPerPageLowongan] = useState(10);

  const periodeFormValues = useMemo(() => (editingPeriode ?? periodeData) ? periodeToFormValues(editingPeriode ?? periodeData!) : {
    name: '', startDate: '', endDate: '', announcementDate: '', internshipStart: '', internshipEnd: '', durationInfo: '', systemType: '', isActive: false,
  }, [editingPeriode, periodeData]);
  const lowonganFormValues = useMemo(
    () => (editingLowongan ? lowonganToFormValues(editingLowongan) : undefined),
    [editingLowongan]
  );

  const handleOpenAdd = () => {
    setEditingLowongan(null);
    setViewState('add_lowongan');
  };

  const handleOpenEdit = (item: LowonganItem) => {
    setEditingLowongan(item);
    setViewState('edit_lowongan');
  };

  const backToList = () => {
    setEditingLowongan(null);
    setViewState('list');
  };

  // ------------------ VIEW 1: FORM TAMBAH / EDIT LOWONGAN ------------------
  if (viewState === 'add_lowongan' || viewState === 'edit_lowongan') {
    const isEdit = viewState === 'edit_lowongan';
    return (
      <div className="space-y-6 font-sans text-slate-800 animate-fade-in">
        <LowonganForm
          mode={isEdit ? 'edit' : 'add'}
          initialValues={isEdit ? lowonganFormValues : undefined}
          kategoriOptions={kategoriOptions}
          kategoriLoading={kategoriLoading}
          kategoriError={kategoriError}
          onCancel={backToList}
          onSubmit={(values) =>
            isEdit && editingLowongan ? updateLowongan(editingLowongan.id, values) : createLowongan(values)
          }
        />
      </div>
    );
  }

  // ------------------ VIEW 2: LIST PERIODE & LOWONGAN ------------------
  return (
    <div className="space-y-6 font-sans text-slate-800 animate-fade-in">
      <div className="space-y-8">
        {/* MAIN PAGE TITLE */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Pengaturan Periode Magang</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Kelola tanggal pembukaan pendaftaran serta kuota lowongan project magang DISKOMINFOSAN.
          </p>
        </div>

        {/* MAIN WRAPPER CARD */}
        {loading ? <div className="py-16 text-center text-sm text-slate-500">Memuat data periode dan lowongan...</div> : error ? <div className="py-16 text-center text-sm text-rose-500">Gagal memuat data: {error}</div> : <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-8 space-y-10">
          <PeriodeInfoTable
            periodeList={periodeList}
            selectedPeriodeId={selectedPeriodeId}
            onSelect={selectPeriode}
            searchTerm={searchPeriode}
            onSearchChange={setSearchPeriode}
            itemsPerPage={itemsPerPagePeriode}
            onItemsPerPageChange={setItemsPerPagePeriode}
            onEdit={(periode) => {
              setEditingPeriode(periode);
              selectPeriode(periode.id);
              setShowEditPeriodeModal(true);
            }}
          />

          <hr className="border-slate-100" />

          <LowonganTable
            lowonganList={lowonganList}
            totalCount={lowonganList.length}
            itemsPerPage={itemsPerPageLowongan}
            onItemsPerPageChange={setItemsPerPageLowongan}
            onAdd={handleOpenAdd}
            onEdit={handleOpenEdit}
            onDelete={deleteLowongan}
          />
        </div>}
      </div>

      {/* MODAL EDIT PERIODE */}
      <PeriodeFormModal
        open={showEditPeriodeModal && !!editingPeriode}
        initialValues={periodeFormValues}
        onClose={() => {
          setShowEditPeriodeModal(false);
          setEditingPeriode(null);
        }}
        onSubmit={savePeriode}
      />
    </div>
  );
};