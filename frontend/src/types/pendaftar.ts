import { ApplicationDocument, ApplicationTeamMember } from './internship';


export type PendaftarStatus = 'Verifikasi' | 'Diterima' | 'Ditolak';
export type TipeDaftar = 'Individu' | 'Kelompok';

export interface PendaftarBerkas {
  pasFoto: boolean;
  suratPermohonan: boolean;
  proposal: boolean;
  nda: boolean;
}

export type PendaftarDocument = ApplicationDocument;
export type PendaftarTeamMember = ApplicationTeamMember;

export interface PendaftarData {
  id: number;
  registrationNumber?: string;
  fotoUrl: string;
  nama: string;
  email: string;
  phone: string;
  instansi: string;
  nim: string;
  bidang?: string;
  kategori: string;
  projectTitle?: string;
  lowongan?: string;
  tanggalDaftar: string;
  tanggalMulai?: string | null;
  tanggalSelesai?: string | null;
  status: PendaftarStatus;
  tipeDaftar: TipeDaftar;
  jurusan?: string;
  semester?: string;
  keahlian?: string;
  tools?: string;
  alasanPenolakan?: string;
  berkas: PendaftarBerkas;
  documents?: PendaftarDocument[];
  teamMembers?: PendaftarTeamMember[];
}