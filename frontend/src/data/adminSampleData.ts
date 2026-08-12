export interface MonthlyDataPoint {
  month: string;
  accepted: number;
  rejected: number;
}

// Data grafik pendaftar per bulan (Tab Dashboard)
export const monthlyData: MonthlyDataPoint[] = [
  { month: 'Jan', accepted: 5, rejected: 6 },
  { month: 'Feb', accepted: 2, rejected: 3 },
  { month: 'Mar', accepted: 4, rejected: 5 },
  { month: 'Apr', accepted: 1, rejected: 6 },
  { month: 'Mei', accepted: 2, rejected: 3 },
  { month: 'Jun', accepted: 2, rejected: 7 },
  { month: 'Jul', accepted: 4, rejected: 3 },
  { month: 'Agu', accepted: 7, rejected: 2 },
  { month: 'Sep', accepted: 7, rejected: 5 },
  { month: 'Okt', accepted: 2, rejected: 8 },
  { month: 'Nov', accepted: 5, rejected: 5 },
  { month: 'Des', accepted: 3, rejected: 4 },
];