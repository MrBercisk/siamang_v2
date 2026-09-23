import { apiRequest, resolveStorageUrl } from '../../../lib/api';
import type {
  LaporanAccessStatus,
  LaporanFormValues,
  LaporanItem,
  LaporanState,
  NilaiMagangSummary,
} from '../../../types/laporanPeserta';

export const LAPORAN_ENDPOINT = '/intern/laporan';

interface ApiItem<T> { data: T; }

type Id = number | string;

interface BackendLaporan {
  id: Id;
  judulLaporan: string;
  fileLaporanUrl?: string | null;
  fileLaporanName?: string | null;
  linkGoogleDrive: string;
  formNilaiUrl?: string | null;
  formNilaiName?: string | null;
  status: 'pending' | 'ditolak' | 'diterima';
  catatanReject?: string | null;
  tanggalUpload?: string | null;
  canEdit: boolean;
}

interface BackendNilai {
  isPublished: boolean;
  predikat?: string | null;
  rataRata?: number | null;
}

interface BackendLaporanState {
  accessStatus: LaporanAccessStatus;
  progressPercent: number;
  laporan: BackendLaporan | null;
  nilai: BackendNilai | null;
}

function formatTanggalWaktu(value?: string | null): string {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const tanggal = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  const waktu = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  return `${tanggal} ${waktu}`;
}

function mapLaporan(item: BackendLaporan): LaporanItem {
  return {
    id: String(item.id),
    judulLaporan: item.judulLaporan,
    fileLaporanUrl: resolveStorageUrl(item.fileLaporanUrl) ?? undefined,
    fileLaporanName: item.fileLaporanName || undefined,
    linkGoogleDrive: item.linkGoogleDrive,
    formNilaiUrl: resolveStorageUrl(item.formNilaiUrl) ?? undefined,
    formNilaiName: item.formNilaiName || undefined,
    status: item.status,
    catatanReject: item.catatanReject || undefined,
    tanggalUpload: formatTanggalWaktu(item.tanggalUpload),
    canEdit: item.canEdit,
  };
}

function mapNilai(item: BackendNilai): NilaiMagangSummary {
  return {
    isPublished: item.isPublished,
    predikat: item.predikat || undefined,
    rataRata: item.rataRata ?? undefined,
  };
}

export async function fetchLaporanState(): Promise<LaporanState> {
  const response = await apiRequest<ApiItem<BackendLaporanState>>(LAPORAN_ENDPOINT);
  return {
    accessStatus: response.data.accessStatus,
    progressPercent: response.data.progressPercent,
    laporan: response.data.laporan ? mapLaporan(response.data.laporan) : null,
    nilai: response.data.nilai ? mapNilai(response.data.nilai) : null,
  };
}

export async function submitLaporan(
  values: LaporanFormValues,
  fileLaporan: File | null,
  formNilai: File | null
): Promise<LaporanItem> {
  const formData = new FormData();
  formData.append('judul_laporan', values.judulLaporan);
  formData.append('link_google_drive', values.linkGoogleDrive);
  if (fileLaporan) formData.append('file_laporan', fileLaporan);
  if (formNilai) formData.append('form_nilai', formNilai);

  const response = await apiRequest<ApiItem<BackendLaporan>>(LAPORAN_ENDPOINT, {
    method: 'POST',
    data: formData,
  });
  return mapLaporan(response.data);
}