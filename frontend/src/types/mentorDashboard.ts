/** Lokasi file: src/types/mentorDashboard.ts */

export interface MentorDashboardStats {
  /** Pendaftar pada kategori yang diampu mentor. */
  totalPendaftar: number;
  diterima: number;
  ditolak: number;
}

export interface MentorStudent {
  id: string;
  name: string;
  avatarUrl?: string;
  progressPercent: number; // 0-100
  status: string;
}

export const EMPTY_MENTOR_STATS: MentorDashboardStats = {
  totalPendaftar: 0,
  diterima: 0,
  ditolak: 0,
};