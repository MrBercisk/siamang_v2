export interface ApiCollection<T> {
  data: T[];
}

export interface ApiItem<T> {
  data: T;
}

export interface InternshipCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  avatarUrl?: string;
  items: string[];

  detailKebutuhan?: string;
  bidangName?: string;
  kategoriName?: string;
  fieldId?: string;
  kategoriId?: string;
  kuota?: number;
  filled?: number;
  isActive?: boolean;
}

export interface TimelineSchedule {
  id: string;
  title: string;
  date: string;
  subtext: string;
  description: string;
  icon: string;
  statusColor: 'primary' | 'warning' | 'success' | 'secondary';
}

export interface InternshipField {
  id: string;
  name: string;
  quota: number;
  filled: number;
  description: string;
  requirements: string[];
  department: string;
}

export interface ApplicationRequirement {
  id: string;
  title: string;
  description: string;
  required: boolean;
  fileTypes: string[];
}

export interface ApplicationDocument {
  id: string | number;
  documentType: string;
  originalName?: string | null;
  filePath?: string | null;
  fileUrl?: string | null;
  status: string;
}

export interface ApplicationTeamMember {
  id: number;
  fullName: string;
  email?: string | null;
  phone?: string | null;
  nim?: string | null;
}

export interface ApplicationStatus {
  id: string;
  registrationNumber: string;
  applicantName: string;
  institution: string;
  major: string;
  nim?: string;
  phone?: string;
  email?: string;

  projectTitle?: string;
  skills?: string;
  tools?: string;
  startDate?: string;
  endDate?: string;
  fieldId: string;
  fieldName: string;
  kategoriName?: string;
  lowonganId?: string;
  lowongan?: string;
  registrationType?: 'Individu' | 'Kelompok';
  teamMembers?: ApplicationTeamMember[];
  documents?: ApplicationDocument[];
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  acceptedAt?: string;
  notes?: string;
  periode?: string;
  periodeStart?: string;
  periodeEnd?: string;
}

export interface AdminApplicationResponse {
  id: string | number;
  registrationNumber: string;
  applicantName: string;
  avatarUrl?: string | null;
  institution?: string | null;
  major?: string | null;
  nim?: string | null;
  phone?: string | null;
  email?: string | null;
  projectTitle?: string | null;
  skills?: string | null;
  tools?: string | null;
  semester?: string | number | null;
  startDate?: string | null;
  endDate?: string | null;
  fieldName?: string | null;
  kategoriName?: string | null;
  lowongan?: string | null;
  registrationType?: 'Individu' | 'Kelompok' | null;
  status: string;
  submittedAt?: string | null;
  notes?: string | null;
  documents?: ApplicationDocument[];
  teamMembers?: ApplicationTeamMember[];
}