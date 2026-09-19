import { useCallback, useEffect, useState } from 'react';
import { apiRequest, ApiError } from '../../../lib/api';
import { AdminApplicationResponse, ApiCollection } from '../../../types/internship';

export interface AdminNotificationItem {
  id: number;
  registrationNumber?: string;
  nama: string;
  kategoriName?: string;
  submittedAt: string;
}

function mapNotification(item: AdminApplicationResponse): AdminNotificationItem {
  return {
    id: Number(item.id),
    registrationNumber: item.registrationNumber ?? undefined,
    nama: item.applicantName,
    kategoriName: item.kategoriName ?? undefined,
    submittedAt: item.submittedAt ?? '',
  };
}

export function useAdminNotifications(pollIntervalMs: number = 60000) {
  const [pendingApplications, setPendingApplications] = useState<AdminNotificationItem[]>([]);
  const [totalPending, setTotalPending] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchPending = useCallback(async () => {
    try {
      // Nilai enum status backend adalah 'reviewing' (lihat ApplicationService),
      // BUKAN 'pending' — samakan dengan filter index() di ApplicationAdminController.
      const res = await apiRequest<ApiCollection<AdminApplicationResponse>>(
        '/admin/applications?status=reviewing&per_page=5'
      );
      setPendingApplications(res.data.map(mapNotification));
      setTotalPending(res.data.length);
    } catch (err) {
      console.warn('Gagal memuat notifikasi admin:', err instanceof ApiError ? err.message : err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPending();
    const interval = setInterval(fetchPending, pollIntervalMs);
    return () => clearInterval(interval);
  }, [fetchPending, pollIntervalMs]);

  return { pendingApplications, totalPending, loading, refetch: fetchPending };
}