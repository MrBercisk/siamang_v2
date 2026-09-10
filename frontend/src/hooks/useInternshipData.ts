import { useState, useEffect, useCallback } from 'react';
import { InternshipCategory, TimelineSchedule, ApplicationRequirement, ApplicationStatus } from '../types/internship';
import { apiRequest, getStoredToken, DEFAULT_CATEGORIES, DEFAULT_TIMELINE_SCHEDULES, DEFAULT_REQUIREMENTS } from '../lib/api';

interface ApiCollection<T> {
  data: T[];
}

interface BackendBidang {
  id: number;
  name: string;
  status?: string | null;
}

interface BackendKategori {
  id: number;
  bidang_id: number;
  name: string;
  quota?: number | null;
  description?: string | null;
}

interface BackendLowongan {
  id: number;
  kategori_id: number;
  project?: string | null;
}

interface BackendPeriode {
  id: number;
  name?: string | null;
  start_date: string;
  end_date: string;
  duration_info?: string | null;
  system_type?: string | null;
  is_active: boolean;
}

interface BackendApplication {
  id: string | number;
  applicantName: string;
  institution?: string | null;
  major?: string | null;
  nim?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  projectTitle?: string | null;
  skills?: string | null;
  tools?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  fieldId: string | number;
  fieldName?: string | null;
  kategoriName?: string | null;
  registrationType?: 'Individu' | 'Kelompok';
  status: ApplicationStatus['status'];
  submittedAt?: string | null;
  notes?: string | null;
  periode?: string | null;
  periodeStart?: string | null;
  periodeEnd?: string | null;
}

interface ApiItem<T> {
  data: T;
}

export interface BidangOption {
  id: string;
  name: string;
  status?: string;
}

export interface KategoriOption {
  id: string;
  name: string;
  quota?: number;
  description?: string;
}

function mapApplication(application: BackendApplication): ApplicationStatus {
  return {
    id: String(application.id),
    applicantName: application.applicantName,
    institution: application.institution || '',
    major: application.major || '',
    nim: application.nim || undefined,
    phone: application.phone || undefined,
    email: application.email || undefined,
    address: application.address || undefined,
    projectTitle: application.projectTitle || undefined,
    skills: application.skills || undefined,
    tools: application.tools || undefined,
    startDate: application.startDate || undefined,
    endDate: application.endDate || undefined,
    fieldId: String(application.fieldId),
    fieldName: application.fieldName || 'Bidang belum ditentukan',
    kategoriName: application.kategoriName || undefined,
    registrationType: application.registrationType,
    status: application.status,
    submittedAt: application.submittedAt || '-',
    notes: application.notes || undefined,
    periode: application.periode || undefined,
    periodeStart: application.periodeStart || undefined,
    periodeEnd: application.periodeEnd || undefined,
  };
}

export function useInternshipData(isAuthenticated = false) {
  const [categories, setCategories] = useState<InternshipCategory[]>(DEFAULT_CATEGORIES);
  const [schedules, setSchedules] = useState<TimelineSchedule[]>(DEFAULT_TIMELINE_SCHEDULES);
  const [requirements, setRequirements] = useState<ApplicationRequirement[]>(DEFAULT_REQUIREMENTS);
  const [bidangs, setBidangs] = useState<BidangOption[]>([]);
  const [kategoriByBidang, setKategoriByBidang] = useState<Record<string, KategoriOption[]>>({});
  const [applications, setApplications] = useState<ApplicationStatus[]>(() => {
    const saved = localStorage.getItem('si_amang_applications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBackendData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [bidangResponse, kategoriResponse, periodeResponse, lowonganResponse] = await Promise.all([
        apiRequest<ApiCollection<BackendBidang>>('/bidangs'),
        apiRequest<ApiCollection<BackendKategori>>('/kategoris'),
        apiRequest<ApiCollection<BackendPeriode>>('/periodes'),
        apiRequest<ApiCollection<BackendLowongan>>('/lowongans'),
      ]);

      if (bidangResponse.data.length > 0) {
        setBidangs(
          bidangResponse.data
            .filter((bidang) => bidang.status !== 'nonaktif')
            .map((bidang) => ({
              id: String(bidang.id),
              name: bidang.name,
              status: bidang.status || undefined,
            }))
        );
      }

      if (kategoriResponse.data.length > 0) {
        // Kelompokkan kategori berdasarkan bidang_id, untuk dropdown Kategori yang tergantung pada Bidang
        const grouped: Record<string, KategoriOption[]> = {};
        kategoriResponse.data.forEach((kategori) => {
          const bidangId = String(kategori.bidang_id);
          if (!grouped[bidangId]) {
            grouped[bidangId] = [];
          }
          grouped[bidangId].push({
            id: String(kategori.id),
            name: kategori.name,
            quota: kategori.quota ?? undefined,
            description: kategori.description || undefined,
          });
        });
        setKategoriByBidang(grouped);

        // Tetap pertahankan `categories` (flat) untuk konsumen lama yang menampilkan daftar kategori + lowongan
        setCategories(kategoriResponse.data.map((kategori) => ({
          id: String(kategori.id),
          title: kategori.name,
          description: kategori.description || 'Peluang magang yang tersedia pada kategori ini.',
          icon: 'category',
          items: lowonganResponse.data
            .filter((lowongan) => lowongan.kategori_id === kategori.id)
            .map((lowongan) => lowongan.project || 'Lowongan magang'),
        })));
      }

      if (periodeResponse.data.length > 0) {
        setSchedules(periodeResponse.data.map((periode) => ({
          id: String(periode.id),
          title: periode.name || 'Periode Magang',
          date: `${periode.start_date} - ${periode.end_date}`,
          subtext: periode.duration_info || periode.system_type || 'Informasi periode magang',
          description: periode.is_active
            ? 'Periode pendaftaran sedang aktif.'
            : 'Periode pendaftaran telah dijadwalkan.',
          icon: 'calendar_today',
          statusColor: periode.is_active ? 'success' : 'secondary',
        })));
      }

      if (isAuthenticated && getStoredToken()) {
        const applicationResponse = await apiRequest<ApiCollection<BackendApplication>>('/applications');
        const backendApplications = applicationResponse.data.map(mapApplication);
        setApplications(backendApplications);
        localStorage.setItem('si_amang_applications', JSON.stringify(backendApplications));
      }

      // Requirements belum memiliki route backend, jadi tetap memakai data lokal.
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Gagal memuat data magang.');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchBackendData();
  }, [fetchBackendData]);

  const submitApplication = async (data: {
    fieldId: string;
    fieldName: string;
    applicantName: string;
    institution: string;
    major: string;
    nim?: string;
    phone?: string;
    email?: string;
    address?: string;
    projectTitle?: string;
    skills?: string;
    tools?: string;
    startDate?: string;
    endDate?: string;
    kategoriName?: string;
    registrationType?: 'Individu' | 'Kelompok';
    teamMembers?: Array<{
      id: number;
      fullName: string;
      email: string;
      phone: string;
      nim: string;
    }>;
    documents?: Array<{
      id: number;
      name: string;
      fileName?: string;
      status: string;
    }>;
    notes?: string;
  }) => {
    setLoading(true);
    try {
      const response = await apiRequest<ApiItem<BackendApplication>>('/applications', {
        method: 'POST',
        data,
      });
      const newApplication = mapApplication(response.data);
      setApplications((prev) => {
        const updated = [newApplication, ...prev.filter((application) => application.id !== newApplication.id)];
        localStorage.setItem('si_amang_applications', JSON.stringify(updated));
        return updated;
      });
      return newApplication;
    } finally {
      setLoading(false);
    }
  };

  return {
    categories,
    schedules,
    requirements,
    applications,
    bidangs,
    kategoriByBidang,
    loading,
    error,
    refreshData: fetchBackendData,
    submitApplication,
  };
}