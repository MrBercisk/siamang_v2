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
  id: number;
  documentType: string;
  originalName: string;
  filePath: string;
  status: string;
}

export interface ApplicationTeamMember {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  nim: string;
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