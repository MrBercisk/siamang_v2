export interface PeriodeInfo {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  announcementDate: string;
  internshipStart: string;
  internshipEnd: string;
  durationInfo: string;
  systemType: string;
  isActive: boolean;
}

export interface PeriodeFormValues {
  name: string;
  startDate: string;
  endDate: string;
  announcementDate: string;
  internshipStart: string;
  internshipEnd: string;
  durationInfo: string;
  systemType: string;
  isActive: boolean;
}

export interface LowonganItem {
  id: number;
  periodeId: number;
  kategoriId: number;
  kategori: string;
  bidang: string;
  project: string;
  definisi: string;
  detailKebutuhan: string; // e.g. "PHP", "React & UI/UX"
  kuota: number;
}

export interface LowonganFormValues {
  /** id kategori dari DB; string karena terikat ke <select>. */
  kategoriId: string;
  /** Nama kategori & bidang disimpan untuk tampilan tabel; sumbernya tetap kategoriId. */
  kategori: string;
  bidang: string;
  project: string;
  definisi: string;
  detailKebutuhan: string;
  kuota: string; // string karena terikat langsung ke <input type="number">
}

export const EMPTY_LOWONGAN_FORM: LowonganFormValues = {
  kategoriId: '',
  kategori: '',
  bidang: '',
  project: '',
  definisi: '',
  detailKebutuhan: '',
  kuota: '',
};

/**
 * Opsi dropdown kategori pada form Lowongan.
 *
 * Sengaja dibuat sebagai subset dari `KategoriItem` (lihat types/kategori.ts)
 * alih-alih tipe berdiri sendiri, supaya sumber datanya jelas: hasil dari
 * `useKategoriAdmin`, bukan hook/fetch terpisah.
 */
export interface KategoriOption {
  id: number;
  name: string;
  bidangId: number;
  bidangName: string;
}

/**
 * Bentuk minimal dari KategoriItem yang dibutuhkan mapper ini, supaya file
 * ini tidak perlu tahu semua field KategoriItem (quota, description, dst).
 */
interface KategoriLike {
  id: number;
  name: string;
  bidangId: number;
  bidangName: string;
  bidangStatus: 'Aktif' | 'Nonaktif';
  deletedAt: string | null;
}

/**
 * Kategori yang boleh dipilih di form Lowongan: belum dihapus, dan bidang
 * induknya masih Aktif (kategori di bawah bidang Nonaktif disembunyikan
 * karena tidak seharusnya dibuka lowongannya).
 */
export function toKategoriOptions(kategoriList: KategoriLike[]): KategoriOption[] {
  return kategoriList
    .filter((k) => !k.deletedAt && k.bidangStatus === 'Aktif')
    .map((k) => ({ id: k.id, name: k.name, bidangId: k.bidangId, bidangName: k.bidangName }));
}

export function lowonganToFormValues(item: LowonganItem): LowonganFormValues {
  return {
    kategoriId: item.kategoriId.toString(),
    kategori: item.kategori,
    bidang: item.bidang,
    project: item.project,
    definisi: item.definisi,
    detailKebutuhan: item.detailKebutuhan,
    kuota: item.kuota.toString(),
  };
}

export function periodeToFormValues(periode: PeriodeInfo): PeriodeFormValues {
  return {
    name: periode.name,
    startDate: periode.startDate,
    endDate: periode.endDate,
    announcementDate: periode.announcementDate,
    internshipStart: periode.internshipStart,
    internshipEnd: periode.internshipEnd,
    durationInfo: periode.durationInfo,
    systemType: periode.systemType,
    isActive: periode.isActive,
  };
}