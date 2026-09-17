import { ChangeEvent } from 'react';
import {
  ApplicationDocument,
  ApplicationRequirement,
  ApplicationStatus,
  ApplicationTeamMember,
  InternshipCategory,
  InternshipField,
  TimelineSchedule,
} from '../../types/internship';

export type {
  ApplicationDocument,
  ApplicationRequirement,
  ApplicationStatus,
  ApplicationTeamMember,
  InternshipCategory,
  InternshipField,
  TimelineSchedule,
};

export type RegistrationType = 'Individu' | 'Kelompok';

export const STEPS_LIST = [
  { num: 1, label: 'Biodata' },
  { num: 2, label: 'Tipe Pendaftaran' },
  { num: 3, label: 'Bidang & Kategori' },
  { num: 4, label: 'Berkas' },
  { num: 5, label: 'Review & Submit' },
] as const;

export interface BiodataState {
  photoUrl: string;
  photoFileName?: string;
  fullName: string;
  email: string;
  phone: string;

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