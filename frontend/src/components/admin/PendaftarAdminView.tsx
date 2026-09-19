import React, { useEffect, useMemo, useState } from 'react';
import { usePendaftarAdmin } from './hooks/usePendaftarAdmin';
import { AdminMentorOption } from '../../types/internship';
import { PendaftarData } from '../../types/pendaftar';
import { PendaftarStatsCards } from './pendaftar/PendaftarStatsCards';
import { PendaftarTable } from './pendaftar/PendaftarTable';
import { PendaftarRejectModal } from './pendaftar/PendaftarRejectModal';
import { DetailPendaftarView } from '../mentor/DetailPendaftarView';
import { PilihMentorModal } from './pendaftar/PilihMentorModal';

const CATEGORY_OPTIONS = [
  'Perencanaan dan Implementasi Sistem Informasi',
  'Pengembangan Perangkat Lunak & UI/UX',
  'Pengelolaan Media Sosial & Informasi Publik',
  'Keamanan Siber & Jaringan Komputer',
  'Pengolahan Data Statistik Sektoral & Open Data',
];

interface PendaftarAdminViewProps {
  // Kalau di-set, otomatis buka detail pendaftar dengan id ini begitu data
  // termuat — dipakai saat admin klik notifikasi pendaftar baru dari header.
  focusApplicantId?: number | null;
  onFocusApplicantHandled?: () => void;
}

export const PendaftarAdminView: React.FC<PendaftarAdminViewProps> = ({
  focusApplicantId,
  onFocusApplicantHandled,
}) => {
  const {
    applicantList,
    loading,
    error,
    updateStatus,
    terimaApplicant,
    tolakApplicant,
    fetchAvailableMentors,
  } = usePendaftarAdmin();

  const [selectedApplicant, setSelectedApplicant] = useState<PendaftarData | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [categoryFilter, setCategoryFilter] = useState('Semua');

  const [rejectModalItem, setRejectModalItem] = useState<PendaftarData | null>(null);
  const [mentorModalItem, setMentorModalItem] = useState<PendaftarData | null>(null);
  const [availableMentors, setAvailableMentors] = useState<AdminMentorOption[]>([]);
  const [loadingMentors, setLoadingMentors] = useState(false);

  // Begitu applicantList termuat dan ada focusApplicantId dari notifikasi,
  // cari pendaftarnya dan langsung buka DetailPendaftarView.
  useEffect(() => {
    if (!focusApplicantId || loading || applicantList.length === 0) return;

    const target = applicantList.find((a) => a.id === focusApplicantId);
    if (target) {
      setSelectedApplicant(target);
    }
    // Konsumsi sinyalnya sekali saja — supaya kalau admin kembali ke tabel
    // lalu balik lagi ke tab ini, tidak auto-buka detail yang sama terus.
    onFocusApplicantHandled?.();
  }, [focusApplicantId, loading, applicantList, onFocusApplicantHandled]);

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

  const handleUpdateStatusFromDetail = async (
    id: number,
    newStatus: 'Diterima' | 'Ditolak' | 'Verifikasi',
    reason?: string
  ) => {
    const ok = await updateStatus(id, newStatus, reason);
    if (ok && selectedApplicant && selectedApplicant.id === id) {
      setSelectedApplicant((prev) =>
        prev ? { ...prev, status: newStatus, alasanPenolakan: reason ?? prev.alasanPenolakan } : null
      );
    }
  };

  const handleTerimaClick = async (item: PendaftarData) => {
    setMentorModalItem(item);
    setAvailableMentors([]);
    setLoadingMentors(true);
    const mentors = await fetchAvailableMentors(item.id);
    setAvailableMentors(mentors ?? []);
    setLoadingMentors(false);
  };

  const handleTerimaDenganMentor = async (mentorId: number): Promise<boolean> => {
    if (!mentorModalItem) return false;
    return terimaApplicant(mentorModalItem, mentorId);
  };

  const handleTolakClick = (item: PendaftarData) => {
    setRejectModalItem(item);
  };

  const handleTolakSubmit = async (reason: string): Promise<boolean> => {
    if (!rejectModalItem) return false;
    return tolakApplicant(rejectModalItem, reason);
  };

  if (selectedApplicant) {
    return (
      <DetailPendaftarView
        pendaftar={selectedApplicant}
        onBack={() => setSelectedApplicant(null)}
        onUpdateStatus={handleUpdateStatusFromDetail}
        onAccept={async (item) => {
          await handleTerimaClick(item);
          return true;
        }}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in font-sans text-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Data Pendaftar Magang
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Peninjauan dan verifikasi berkas pendaftar DISKOMINFOSAN Kota Yogyakarta. Seluruh data diisi secara mandiri oleh pendaftar.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-[#1f877c] font-bold text-xs flex items-center gap-1.5">
            <span className="material-symbols-outlined text-base">info</span>
            <span>Data Mandiri Pendaftar</span>
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24 text-sm font-medium text-slate-500">
          Memuat data pendaftar...
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-24 text-sm font-medium text-red-500">
          Gagal memuat data: {error}
        </div>
      ) : (
        <>
          <PendaftarStatsCards applicantList={applicantList} />

          <PendaftarTable
            applicantList={filteredApplicants}
            totalCount={applicantList.length}
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            categoryFilter={categoryFilter}
            categoryOptions={CATEGORY_OPTIONS}
            onSearchChange={setSearchTerm}
            onStatusFilterChange={setStatusFilter}
            onCategoryFilterChange={setCategoryFilter}
            onDetail={setSelectedApplicant}
            onTerima={handleTerimaClick}
            onTolak={handleTolakClick}
          />
        </>
      )}

      <PendaftarRejectModal
        open={!!rejectModalItem}
        applicantName={rejectModalItem?.nama}
        onClose={() => setRejectModalItem(null)}
        onSubmit={handleTolakSubmit}
      />

      <PilihMentorModal
        open={!!mentorModalItem}
        applicantName={mentorModalItem?.nama}
        bidang={mentorModalItem?.bidang}
        kategori={mentorModalItem?.kategori}
        mentors={availableMentors}
        loading={loadingMentors}
        onClose={() => setMentorModalItem(null)}
        onSubmit={handleTerimaDenganMentor}
      />
    </div>
  );
};