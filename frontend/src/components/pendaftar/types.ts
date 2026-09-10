import { ChangeEvent } from 'react';

export type RegistrationType = 'Individu' | 'Kelompok';

export interface BiodataState {
  photoUrl: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  university: string;
  major: string;
  semester: string;
  nim: string;
  projectTitle: string;
  skills: string;
  tools: string;
  startDate: string;
  endDate: string;
}

export interface TeamMember {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  nim: string;
}

export interface DocumentFile {
  id: number;
  name: string;
  desc: string;
  required: boolean;
  format: string;
  maxSize: string;
  fileName?: string;
  status: 'Berhasil Upload' | 'Belum Upload Berkas';
}

export const STEPS_LIST = [
  { num: 1, label: 'Biodata' },
  { num: 2, label: 'Tipe Pendaftaran' },
  { num: 3, label: 'Bidang & Kategori' },
  { num: 4, label: 'Berkas' },
  { num: 5, label: 'Review & Submit' },
] as const;

export type FileChangeHandler = (event: ChangeEvent<HTMLInputElement>) => void;
