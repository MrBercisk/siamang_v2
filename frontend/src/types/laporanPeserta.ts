export type LaporanAccessStatus = 'locked' | 'belum_upload' | 'pending' | 'ditolak' | 'diterima';

export interface LaporanItem {
  id: string;
  judulLaporan: string;
  fileLaporanUrl?: string;
  fileLaporanName?: string;
  linkGoogleDrive: string;
  formNilaiUrl?: string;
  formNilaiName?: string;
  status: 'pending' | 'ditolak' | 'diterima';
  catatanReject?: string;
  tanggalUpload: string; // sudah diformat
  canEdit: boolean;
}

export interface NilaiMagangSummary {
  isPublished: boolean;
  predikat?: string;
  rataRata?: number;
}

export interface LaporanState {
  accessStatus: LaporanAccessStatus;
  progressPercent: number;
  laporan: LaporanItem | null;
  nilai: NilaiMagangSummary | null;
}

export interface LaporanFormValues {
  judulLaporan: string;
  linkGoogleDrive: string;
}