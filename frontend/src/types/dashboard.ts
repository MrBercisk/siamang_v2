export interface InternDashboardSummary {
  progressPercent: number;
  judulProject: string | null;
  internshipEndDate: string | null;
  remainingDays: number | null;
  totalBimbingan: number;
  nextBimbinganDate: string | null;
  nextBimbinganTime: string | null;
}

export interface JadwalBimbinganItem {
  id: number | string;
  title: string;
  date: string; // 'YYYY-MM-DD'
  time: string | null;
  location?: string | null;
  meetLink?: string | null;
  notes?: string | null;
}