import React, { useMemo, useState } from 'react';
import { useMentorAdmin } from './hooks/useMentorAdmin';
import { MentorFormValues, MentorItem } from '../../types/mentor';
import { MentorStatsCards } from './mentor/MentorStatsCards';
import { MentorTable } from './mentor/MentorTable';
import { MentorFormModal } from './mentor/MentorFormModal';

function itemToFormValues(item: MentorItem): MentorFormValues {
  return {
    name: item.name,
    nip: item.nip || '',
    email: item.email,
    phone: item.phone || '',
    position: item.position || '',
    status: item.status,
    kategoriIds: item.categories.map((c) => c.id),
  };
}

export const MentorAdminView: React.FC = () => {
  const { mentorList, loading, error, kategoriOptions, createMentor, updateMentor, deleteMentor } =
    useMentorAdmin();

  const [searchTerm, setSearchTerm] = useState('');
  const [kategoriFilter, setKategoriFilter] = useState<number | 'Semua'>('Semua');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<MentorItem | null>(null);

  const filteredMentors = useMemo(
    () =>
      mentorList.filter((m) => {
        const matchesSearch =
          m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (m.nip || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesKategori =
          kategoriFilter === 'Semua' || m.categories.some((c) => c.id === kategoriFilter);

        return matchesSearch && matchesKategori;
      }),
    [mentorList, searchTerm, kategoriFilter]
  );

  return (
    <div className="space-y-6 animate-fade-in font-sans text-slate-800">

      {/* PAGE HEADER & ACTION BUTTON */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Daftar Pembimbing Lapangan (Mentor)
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Kelola data mentor DISKOMINFOSAN dan alokasi kategori magang yang dibimbing/dikelola masing-masing mentor.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="bg-[#1f877c] hover:bg-[#196e65] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-lg">person_add</span>
          <span> Tambah Mentor Baru</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24 text-sm font-medium text-slate-500">
          Memuat data mentor...
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-24 text-sm font-medium text-red-500">
          Gagal memuat data: {error}
        </div>
      ) : (
        <>
          <MentorStatsCards mentorList={mentorList} />

          <MentorTable
            mentorList={filteredMentors}
            kategoriOptions={kategoriOptions}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            kategoriFilter={kategoriFilter}
            onKategoriFilterChange={setKategoriFilter}
            onEdit={setSelectedMentor}
            onDelete={deleteMentor}
          />
        </>
      )}

      {/* MODAL TAMBAH MENTOR */}
      <MentorFormModal
        mode="add"
        open={showAddModal}
        kategoriOptions={kategoriOptions}
        onClose={() => setShowAddModal(false)}
        onSubmit={createMentor}
      />

      {/* MODAL EDIT MENTOR */}
      <MentorFormModal
        mode="edit"
        open={!!selectedMentor}
        kategoriOptions={kategoriOptions}
        initialValues={selectedMentor ? itemToFormValues(selectedMentor) : undefined}
        onClose={() => setSelectedMentor(null)}
        onSubmit={(values) => (selectedMentor ? updateMentor(selectedMentor.id, values) : false)}
      />

    </div>
  );
};