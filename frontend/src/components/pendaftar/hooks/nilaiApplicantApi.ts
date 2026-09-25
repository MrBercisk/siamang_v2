import { apiRequest, resolveStorageUrl } from '../../../lib/api';
import type { NilaiAspect, NilaiProfile, NilaiState, NilaiSummary } from '../../../types/nilaiPeserta';

export const NILAI_ENDPOINT = '/intern/nilai';

interface ApiItem<T> { data: T; }

interface BackendNilaiProfile {
  nama: string;
  email: string;
  nim?: string | null;
  instansi?: string | null;
  kategori?: string | null;
  judulProject?: string | null;
  periodeStart?: string | null;
  periodeEnd?: string | null;
  mentorNama?: string | null;
  mentorNip?: string | null;
}

interface BackendNilaiSummary {
  isPublished: boolean;
  predikat?: string | null;
  rataRata?: number | null;
  aspects: NilaiAspect[];
  suratKeteranganUrl?: string | null;
  suratKeteranganName?: string | null;
}

interface BackendNilaiState {
  profile: BackendNilaiProfile;
  nilai: BackendNilaiSummary | null;
}

function formatTanggalIndo(value?: string | null): string {
  if (!value) return '-';
  const [y, m, d] = value.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

function mapProfile(item: BackendNilaiProfile): NilaiProfile {
  return {
    nama: item.nama,
    email: item.email,
    nim: item.nim || undefined,
    instansi: item.instansi || undefined,
    kategori: item.kategori || undefined,
    judulProject: item.judulProject || undefined,
    periodeStart: item.periodeStart ? formatTanggalIndo(item.periodeStart) : undefined,
    periodeEnd: item.periodeEnd ? formatTanggalIndo(item.periodeEnd) : undefined,
    mentorNama: item.mentorNama || undefined,
    mentorNip: item.mentorNip || undefined,
  };
}
function mapNilai(item: BackendNilaiSummary): NilaiSummary {
  return {
    isPublished: item.isPublished,
    predikat: item.predikat || undefined,
    rataRata: item.rataRata ?? undefined,
    aspects: item.aspects ?? [],
    suratKeteranganUrl: resolveStorageUrl(item.suratKeteranganUrl) ?? undefined,
    suratKeteranganName: item.suratKeteranganName || undefined,
  };
}

export async function fetchNilaiState(): Promise<NilaiState> {
  const response = await apiRequest<ApiItem<BackendNilaiState>>(NILAI_ENDPOINT);
  return {
    profile: mapProfile(response.data.profile),
    nilai: response.data.nilai ? mapNilai(response.data.nilai) : null,
  };
}