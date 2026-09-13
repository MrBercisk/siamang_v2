import { User } from '../../../types/auth';
import { BiodataState, RegistrationType, TeamMember } from '../types';

export const DRAFT_KEY = 'si_amang_pendaftaran_draft';

export interface DraftState {
  currentStep: number;
  biodata: BiodataState;
  registrationType: RegistrationType;
  teamMembers: TeamMember[];
  selectedBidang: string;
  selectedKategori: string;
  selectedLowongan: string;
  isDeclared: boolean;
  savedAt: string;
}

export function loadDraft(): DraftState | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DraftState;
  } catch {
    return null;
  }
}

export function getDefaultBiodata(user: User): BiodataState {
  return {
    photoUrl: '',
    fullName: user.name || 'Leona Strive',
    email: user.email || 'leona@gmail.com',
    phone: '08123456789',
    address: 'Yogyakarta',
    university: user.institution || '',
    major: '',
    semester: '5',
    nim: '',
    projectTitle: '',
    skills: '',
    tools: '',
    startDate: '',
    endDate: '',
  };
}