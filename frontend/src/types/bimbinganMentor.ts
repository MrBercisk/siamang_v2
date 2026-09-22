/** Lokasi file: src/types/bimbinganMentor.ts */

export type BimbinganStatus = 'On Progress' | 'Selesai';
export type LaporanStatus = 'pending' | 'disetujui' | 'ditolak';

/** Satu baris di tabel daftar bimbingan mentor. */
export interface BimbinganListItem {
  id: string;
  nama: string;
  fotoUrl?: string;
  kategori: string;
  judulProject: string;
  tipePendaftaran: string;
  /** Sudah diformat untuk tampilan, mis. "21 Sep 2026". */
  lastUpdate: string;
  status: BimbinganStatus;
  /** 0-100 */
  progress: number;
}

export interface BimbinganMember {
  name: string;
  isLeader: boolean;
}

export interface ProgressItem {
  id: string;
  tanggal: string;
  pencapaian: string;
  catatan: string;
  filePresentasiUrl?: string;
}

export interface LaporanItem {
  id: string;
  judulLaporan: string;
  fileLaporanUrl?: string;
  linkProject?: string;
  formNilaiUrl?: string;
  status: LaporanStatus;
}

/** Aspek penilaian mentor — satu sumber untuk form, hitung rata-rata, dan payload API. */
export const NILAI_ASPECTS = [
  { key: 'kehadiran', label: 'Kehadiran' },
  { key: 'kemampuanKerja', label: 'Kemampuan Kerja' },
  { key: 'kualitasKerja', label: 'Kualitas kerja' },
  { key: 'kerjasama', label: 'Kerjasama' },
  { key: 'inisiatifKreativitas', label: 'Inisiatif & Kreativitas' },
  { key: 'disiplin', label: 'Disiplin' },
] as const;

export type NilaiKey = (typeof NILAI_ASPECTS)[number]['key'];
export type NilaiScores = Record<NilaiKey, number>;

export const EMPTY_NILAI: NilaiScores = {
  kehadiran: 0,
  kemampuanKerja: 0,
  kualitasKerja: 0,
  kerjasama: 0,
  inisiatifKreativitas: 0,
  disiplin: 0,
};

export interface NilaiData {
  scores: NilaiScores;
  suratKeteranganName?: string;
  suratKeteranganUrl?: string;
}

/** Detail satu bimbingan (halaman Detail Bimbingan Mahasiswa). */
export interface BimbinganDetail extends BimbinganListItem {
  members: BimbinganMember[];
  progressList: ProgressItem[];
  laporanList: LaporanItem[];
  nilai: NilaiData;
}