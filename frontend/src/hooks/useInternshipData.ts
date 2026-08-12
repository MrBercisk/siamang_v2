import { useState, useEffect, useCallback } from 'react';
import { InternshipCategory, TimelineSchedule, ApplicationRequirement, ApplicationStatus } from '../types/internship';
import { apiRequest, DEFAULT_CATEGORIES, DEFAULT_TIMELINE_SCHEDULES, DEFAULT_REQUIREMENTS } from '../lib/api';

export function useInternshipData() {
  const [categories, setCategories] = useState<InternshipCategory[]>(DEFAULT_CATEGORIES);
  const [schedules, setSchedules] = useState<TimelineSchedule[]>(DEFAULT_TIMELINE_SCHEDULES);
  const [requirements, setRequirements] = useState<ApplicationRequirement[]>(DEFAULT_REQUIREMENTS);
  const [applications, setApplications] = useState<ApplicationStatus[]>(() => {
    const saved = localStorage.getItem('si_amang_applications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [
      {
        id: 'APP-2026-001',
        applicantName: 'Ahmad Fauzi',
        institution: 'Universitas Gadjah Mada',
        major: 'Teknik Informatika',
        fieldId: 'sisstat',
        fieldName: 'Bidang Sistem Informasi dan Statistik',
        status: 'reviewing',
        submittedAt: '06 Mei 2026',
        notes: 'Berkas lengkap. Dalam proses verifikasi tim teknis DISKOMINFOSAN.',
      }
    ];
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBackendData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Endpoint GET /api/internships/categories
      const catData = await apiRequest<InternshipCategory[]>('/internships/categories');
      if (Array.isArray(catData) && catData.length > 0) setCategories(catData);

      // Endpoint GET /api/internships/schedules
      const schedData = await apiRequest<TimelineSchedule[]>('/internships/schedules');
      if (Array.isArray(schedData) && schedData.length > 0) setSchedules(schedData);

      // Endpoint GET /api/internships/requirements
      const reqData = await apiRequest<ApplicationRequirement[]>('/internships/requirements');
      if (Array.isArray(reqData) && reqData.length > 0) setRequirements(reqData);

      // Endpoint GET /api/applications/my-status
      const appData = await apiRequest<ApplicationStatus[]>('/applications/my-status');
      if (Array.isArray(appData)) {
        setApplications(appData);
        localStorage.setItem('si_amang_applications', JSON.stringify(appData));
      }
    } catch {
      // Use fallback default state if API backend is offline
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBackendData();
  }, [fetchBackendData]);

  const submitApplication = async (data: {
    fieldId: string;
    fieldName: string;
    applicantName: string;
    institution: string;
    major: string;
    notes?: string;
  }) => {
    setLoading(true);
    const newApp: ApplicationStatus = {
      id: `APP-2026-${Math.floor(100 + Math.random() * 900)}`,
      applicantName: data.applicantName,
      institution: data.institution,
      major: data.major,
      fieldId: data.fieldId,
      fieldName: data.fieldName,
      status: 'pending',
      submittedAt: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
      notes: 'Pendaftaran berhasil dikirim. Menunggu verifikasi berkas.',
    };

    try {
      // POST to Laravel /api/applications
      const res = await apiRequest<ApplicationStatus>('/applications', {
        method: 'POST',
        data,
      });
      const updated = [res, ...applications];
      setApplications(updated);
      localStorage.setItem('si_amang_applications', JSON.stringify(updated));
    } catch {
      // Local fallback for preview
      const updated = [newApp, ...applications];
      setApplications(updated);
      localStorage.setItem('si_amang_applications', JSON.stringify(updated));
    } finally {
      setLoading(false);
    }
    return newApp;
  };

  return {
    categories,
    schedules,
    requirements,
    applications,
    loading,
    error,
    refreshData: fetchBackendData,
    submitApplication,
  };
}
