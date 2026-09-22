import { apiRequest, resolveStorageUrl } from '../../../lib/api';
import { EMPTY_NILAI, NILAI_ASPECTS } from '../../../types/bimbinganMentor';
import type {
  BimbinganDetail,
  BimbinganListItem,
  BimbinganMember,
  BimbinganStatus,
  LaporanItem,
  LaporanStatus,
  NilaiKey,
  NilaiScores,
  ProgressItem,
} from '../../../types/bimbinganMentor';

/**
 * Lokasi file: src/components/mentor/hooks/bimbinganMentorApi.ts
 *
 * Semua pemanggilan API bimbingan untuk role mentor + pemetaan ke tipe frontend.
 * Hook hanya mengurus state; komponen tidak tahu endpoint. Kalau bentuk respons
 * backend berbeda, cukup ubah file ini. Detail kontrak: BIMBINGAN_MENTOR_API.md.
 * Request lewat apiRequest (lib/api.ts), URL file lewat resolveStorageUrl.
 *
 * - GET   /mentor/bimbingans                        -> { data: BackendBimbinganListItem[] }
 * - GET   /mentor/bimbingans/{id}                   -> { data: BackendBimbinganDetail }
 * - POST  /mentor/bimbingans/{id}/nilai             -> multipart, { data: BackendBimbinganDetail }
 * - PATCH /mentor/bimbingans/{id}/laporan/{laporanId} -> { status: 'disetujui' | 'ditolak' }
 */

export const BIMBINGAN_ENDPOINT = '/mentor/bimbingans';

interface ApiCollection<T> {
  data: T[];
}

interface ApiItem<T> {
  data: T;
}

type Id = number | string;

export interface BackendBimbinganListItem {
  id: Id;
  nama: string;
  fotoUrl?: string | null;
  kategori?: string | null;
  judulProject?: string | null;
  tipePendaftaran?: string | null;
  lastUpdate?: string | null; // ISO datetime atau YYYY-MM-DD
  status?: string | null; // "On Progress" | "Selesai" (huruf besar/kecil bebas)
  progress?: number | null; // 0-100
}

interface BackendMember {
  nama: string;
  isKetua?: boolean | null;
}

interface BackendProgress {
  id: Id;
  tanggal: string; // YYYY-MM-DD
  pencapaian: string;
  catatan?: string | null;
  filePresentasiUrl?: string | null;
}

interface BackendLaporan {
  id: Id;
  judulLaporan: string;
  fileLaporanUrl?: string | null;
  linkProject?: string | null;
  formNilaiUrl?: string | null;
  status?: string | null; // "pending" | "disetujui" | "ditolak"
}

type BackendNilai = Partial<Record<NilaiKey, number | null>> & {
  suratKeteranganName?: string | null;
  suratKeteranganUrl?: string | null;
};

export interface BackendBimbinganDetail extends BackendBimbinganListItem {
  anggota?: BackendMember[] | null;
  progressList?: BackendProgress[] | null;
  laporanList?: BackendLaporan[] | null;
  nilai?: BackendNilai | null;
}

// --- Format & normalisasi ---------------------------------------------------

/** "2026-09-21" atau ISO datetime -> "21 Sep 2026". Nilai tak terbaca dikembalikan apa adanya. */
export function formatTanggal(value?: string | null): string {
  if (!value) return '-';

  // YYYY-MM-DD dibuat manual agar tidak bergeser hari karena zona waktu (UTC).
  const dateOnly = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const date = dateOnly
    ? new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]))
    : new Date(value);

  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function mapStatus(value?: string | null): BimbinganStatus {
  return value && /selesai|completed|done/i.test(value) ? 'Selesai' : 'On Progress';
}

function mapLaporanStatus(value?: string | null): LaporanStatus {
  const normalized = (value ?? '').toLowerCase();
  if (normalized === 'disetujui') return 'disetujui';
  if (normalized === 'ditolak') return 'ditolak';
  return 'pending';
}

function clampProgress(value?: number | null): number {
  return Math.min(100, Math.max(0, Number(value) || 0));
}

// --- Pemetaan ---------------------------------------------------------------

export function mapListItem(item: BackendBimbinganListItem): BimbinganListItem {
  return {
    id: String(item.id),
    nama: item.nama,
    fotoUrl: resolveStorageUrl(item.fotoUrl) ?? undefined,
    kategori: item.kategori || '-',
    judulProject: item.judulProject || '-',
    tipePendaftaran: item.tipePendaftaran || '-',
    lastUpdate: formatTanggal(item.lastUpdate),
    status: mapStatus(item.status),
    progress: clampProgress(item.progress),
  };
}

function mapProgress(item: BackendProgress): ProgressItem {
  return {
    id: String(item.id),
    tanggal: formatTanggal(item.tanggal),
    pencapaian: item.pencapaian,
    catatan: item.catatan || '-',
    filePresentasiUrl: resolveStorageUrl(item.filePresentasiUrl) ?? undefined,
  };
}

function mapLaporan(item: BackendLaporan): LaporanItem {
  return {
    id: String(item.id),
    judulLaporan: item.judulLaporan,
    fileLaporanUrl: resolveStorageUrl(item.fileLaporanUrl) ?? undefined,
    linkProject: item.linkProject || undefined,
    formNilaiUrl: resolveStorageUrl(item.formNilaiUrl) ?? undefined,
    status: mapLaporanStatus(item.status),
  };
}

export function mapDetail(item: BackendBimbinganDetail): BimbinganDetail {
  const members: BimbinganMember[] = (item.anggota ?? []).map((member) => ({
    name: member.nama,
    isLeader: Boolean(member.isKetua),
  }));
  // Bila backend tidak menandai ketua, anggota pertama dianggap ketua.
  if (members.length > 0 && !members.some((member) => member.isLeader)) {
    members[0].isLeader = true;
  }

  const scores = { ...EMPTY_NILAI };
  NILAI_ASPECTS.forEach(({ key }) => {
    scores[key] = Number(item.nilai?.[key]) || 0;
  });

  return {
    ...mapListItem(item),
    members,
    progressList: (item.progressList ?? []).map(mapProgress),
    laporanList: (item.laporanList ?? []).map(mapLaporan),
    nilai: {
      scores,
      suratKeteranganName: item.nilai?.suratKeteranganName || undefined,
      suratKeteranganUrl: resolveStorageUrl(item.nilai?.suratKeteranganUrl) ?? undefined,
    },
  };
}

// --- Pemanggilan API --------------------------------------------------------

export async function fetchBimbinganList(): Promise<BimbinganListItem[]> {
  const response = await apiRequest<ApiCollection<BackendBimbinganListItem>>(BIMBINGAN_ENDPOINT);
  return response.data.map(mapListItem);
}

export async function fetchBimbinganDetail(id: string): Promise<BimbinganDetail> {
  const response = await apiRequest<ApiItem<BackendBimbinganDetail>>(`${BIMBINGAN_ENDPOINT}/${id}`);
  return mapDetail(response.data);
}

/** Simpan 6 nilai + (opsional) surat keterangan. Dikirim multipart; apiRequest menangani FormData. */
export async function submitNilai(
  id: string,
  scores: NilaiScores,
  suratFile: File | null
): Promise<BimbinganDetail> {
  const formData = new FormData();
  NILAI_ASPECTS.forEach(({ key }) => formData.append(key, String(scores[key])));
  if (suratFile) formData.append('suratKeterangan', suratFile);

  const response = await apiRequest<ApiItem<BackendBimbinganDetail>>(
    `${BIMBINGAN_ENDPOINT}/${id}/nilai`,
    { method: 'POST', data: formData }
  );
  return mapDetail(response.data);
}

export async function setLaporanStatus(
  id: string,
  laporanId: string,
  status: 'disetujui' | 'ditolak'
): Promise<void> {
  await apiRequest(`${BIMBINGAN_ENDPOINT}/${id}/laporan/${laporanId}`, {
    method: 'PATCH',
    data: { status },
  });
}