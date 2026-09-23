import { apiRequest } from '../../../lib/api';
import type { InternDashboardSummary, JadwalBimbinganItem } from '../../../types/dashboard';

interface ApiItem<T> { data: T; }
interface ApiCollection<T> { data: T[]; }

export async function fetchInternDashboardSummary(): Promise<InternDashboardSummary> {
  const response = await apiRequest<ApiItem<InternDashboardSummary>>('/intern/dashboard');
  return response.data;
}

export async function fetchInternJadwalBimbingan(
  month: number,
  year: number
): Promise<JadwalBimbinganItem[]> {
  const response = await apiRequest<ApiCollection<JadwalBimbinganItem>>(
    `/intern/jadwal-bimbingans?month=${month}&year=${year}`
  );
  return response.data;
}