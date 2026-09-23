import { apiRequest, resolveStorageUrl } from '../../../lib/api';
import type { ProgressItem, ProgressFormValues } from '../../../types/progressPeserta';

export const PROGRESS_ENDPOINT = '/intern/progress';

interface ApiCollection<T> {
  data: T[];
}

interface ApiItem<T> {
  data: T;
}

type Id = number | string;

interface BackendProgressItem {
  id: Id;
  judulProject: string;
  tanggalBimbingan: string; // YYYY-MM-DD
  pencapaian: string;
  catatan?: string | null;
  filePresentasiUrl?: string | null;
  fileName?: string | null;
  tanggalUpload?: string | null; // ISO datetime
}

function formatTanggal(value?: string | null): string {
  if (!value) return '-';
  const dateOnly = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const date = dateOnly
    ? new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]))
    : new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatTanggalWaktu(value?: string | null): string {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const tanggal = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  const waktu = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  return `${tanggal} ${waktu}`;
}

function mapProgressItem(item: BackendProgressItem): ProgressItem {
  return {
    id: String(item.id),
    judulProject: item.judulProject,
    tanggalBimbinganRaw: item.tanggalBimbingan,
    tanggalBimbingan: formatTanggal(item.tanggalBimbingan),
    pencapaian: item.pencapaian,
    catatan: item.catatan || '-',
    filePresentasiUrl: resolveStorageUrl(item.filePresentasiUrl) ?? undefined,
    fileName: item.fileName || undefined,
    tanggalUpload: formatTanggalWaktu(item.tanggalUpload),
  };
}

export async function fetchProgressList(): Promise<ProgressItem[]> {
  const response = await apiRequest<ApiCollection<BackendProgressItem>>(PROGRESS_ENDPOINT);
  return response.data.map(mapProgressItem);
}

export async function createProgressItem(
  values: ProgressFormValues,
  file: File
): Promise<ProgressItem> {
  const formData = new FormData();
  formData.append('judul_project', values.judulProject);
  formData.append('tanggal_bimbingan', values.tanggalBimbingan);
  formData.append('pencapaian', values.pencapaian);
  formData.append('catatan', values.catatan);
  formData.append('file_presentasi', file);

  const response = await apiRequest<ApiItem<BackendProgressItem>>(PROGRESS_ENDPOINT, {
    method: 'POST',
    data: formData,
  });
  return mapProgressItem(response.data);
}

export async function updateProgressItem(
  id: string,
  values: ProgressFormValues,
  file: File | null
): Promise<ProgressItem> {
  const formData = new FormData();
  formData.append('judul_project', values.judulProject);
  formData.append('tanggal_bimbingan', values.tanggalBimbingan);
  formData.append('pencapaian', values.pencapaian);
  formData.append('catatan', values.catatan);
  if (file) formData.append('file_presentasi', file);

  const response = await apiRequest<ApiItem<BackendProgressItem>>(
    `${PROGRESS_ENDPOINT}/${id}`,
    { method: 'POST', data: formData }
  );
  return mapProgressItem(response.data);
}