import { apiRequest, resolveStorageUrl } from '../../../lib/api';
import type { PendaftarData, PendaftarStatus, TipeDaftar, PendaftarDocument, PendaftarTeamMember } from '../../../types/pendaftar';


export const PENDAFTAR_ENDPOINT = '/mentor/pendaftars';

interface ApiCollection<T> {
  data: T[];
}

type Id = number | string;

interface BackendDocument {
  id: Id;
  documentType: string;
  fileUrl?: string | null;
  status?: string | null;
}

interface BackendTeamMember {
  id: Id;
  fullName: string;
  nim?: string | null;
}

export interface BackendPendaftar {
  id: number;
  registrationNumber?: string | null;
  fotoUrl?: string | null;
  nama: string;
  email?: string | null;
  phone?: string | null;
  instansi?: string | null;
  nim?: string | null;
  bidang?: string | null;
  kategori?: string | null;
  projectTitle?: string | null;
  lowongan?: string | null;
  tanggalDaftar?: string | null;
  tanggalMulai?: string | null;
  tanggalSelesai?: string | null;
  status?: string | null;
  tipeDaftar?: string | null;
  jurusan?: string | null;
  semester?: string | number | null;
  keahlian?: string | null;
  tools?: string | null;
  alasanPenolakan?: string | null;
  documents?: BackendDocument[] | null;
  teamMembers?: BackendTeamMember[] | null;
}

function mapStatus(value?: string | null): PendaftarData['status'] {
  const normalized = (value ?? '').toLowerCase();
  if (['diterima', 'accepted'].includes(normalized)) return 'Diterima';
  if (['ditolak', 'rejected'].includes(normalized)) return 'Ditolak';
  return 'Verifikasi';
}

function normalizeTipeDaftar(raw: string | null | undefined, teamMemberCount: number): TipeDaftar {
  const value = (raw ?? '').toLowerCase();
  if (value.includes('kelompok') || value.includes('group') || value.includes('team')) {
    return 'Kelompok';
  }
  if (value.includes('individu') || value.includes('individual') || value.includes('solo')) {
    return 'Individu';
  }
  return teamMemberCount > 0 ? 'Kelompok' : 'Individu';
}

function mapDocument(item: BackendDocument): PendaftarDocument {
  return {
    id: String(item.id),
    documentType: item.documentType,
    fileUrl: resolveStorageUrl(item.fileUrl) ?? undefined,
    status: item.status ?? 'uploaded',
  };
}

function mapTeamMember(item: BackendTeamMember): PendaftarTeamMember {
  return {
    id: Number(item.id),
    fullName: item.fullName,
    nim: item.nim || undefined,
  };
}

export function mapPendaftar(item: BackendPendaftar): PendaftarData {
  const documents = (item.documents ?? []).map(mapDocument);
  const teamMembers = (item.teamMembers ?? []).map(mapTeamMember);
  const hasDocument = (documentType: string) =>
    documents.some((document) => document.documentType === documentType);

  return {
    id: Number(item.id),
    nama: item.nama || '',
    email: item.email ?? '',
    phone: item.phone ?? '',
    fotoUrl: resolveStorageUrl(item.fotoUrl) ?? '',
    registrationNumber: item.registrationNumber ?? undefined,
    tanggalDaftar: item.tanggalDaftar || '',
    tipeDaftar: normalizeTipeDaftar(item.tipeDaftar, teamMembers.length),
    status: mapStatus(item.status),
    alasanPenolakan: item.alasanPenolakan ?? undefined,
    instansi: item.instansi ?? '',
    jurusan: item.jurusan ?? undefined,
    nim: item.nim ?? '',
    semester: item.semester != null ? String(item.semester) : undefined,
    kategori: item.kategori ?? '',
    bidang: item.bidang ?? '',
    projectTitle: item.projectTitle ?? undefined,
    lowongan: item.lowongan ?? undefined,
    keahlian: item.keahlian ?? undefined,
    tools: item.tools ?? undefined,
    tanggalMulai: item.tanggalMulai || undefined,
    tanggalSelesai: item.tanggalSelesai || undefined,
    berkas: {
      pasFoto: hasDocument('pas_foto'),
      suratPermohonan: hasDocument('surat_permohonan'),
      proposal: hasDocument('proposal'),
      nda: hasDocument('nda'),
    },
    documents,
    teamMembers,
  };
}

export async function fetchPendaftarList(): Promise<PendaftarData[]> {
  const response = await apiRequest<ApiCollection<BackendPendaftar>>(PENDAFTAR_ENDPOINT);
  return response.data.map(mapPendaftar);
}