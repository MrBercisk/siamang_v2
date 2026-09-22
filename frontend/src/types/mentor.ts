export interface KategoriOption {
  id: number;
  name: string;
  bidangName: string;
}

export interface MentorItem {
  id: number;
  name: string;
  nip?: string;
  email: string;
  phone?: string;
  position?: string;
  status: 'Aktif' | 'Nonaktif';
  /** Kategori yang dikelola mentor ini, dari pivot kategori_mentor. */
  categories: KategoriOption[];
  /** Berasal dari `withCount('bimbingans')` di backend. */
  totalMentees: number;
}

export interface MentorFormValues {
  name: string;
  nip: string;
  email: string;
  phone: string;
  position: string;
  status: 'Aktif' | 'Nonaktif';
  kategoriIds: number[];
}

export const EMPTY_MENTOR_FORM: MentorFormValues = {
  name: '',
  nip: '',
  email: '',
  phone: '',
  position: '',
  status: 'Aktif',
  kategoriIds: [],
};

export interface MentorCreateResult {
  success: boolean;
  temporaryPassword?: string;
}

export interface ChatMessage {
  id: number | string;
  bimbinganId: number | string;
  senderId?: number | string;
  sender: string;
  role: 'mentor' | 'applicant';
  message: string;
  timestamp: string;
}