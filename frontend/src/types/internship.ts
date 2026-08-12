export interface InternshipCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  avatarUrl?: string;
  items: string[];
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

export interface ApplicationStatus {
  id: string;
  applicantName: string;
  institution: string;
  major: string;
  fieldId: string;
  fieldName: string;
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
  submittedAt: string;
  notes?: string;
}
