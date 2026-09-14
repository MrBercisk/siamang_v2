/**
 * API Client configured for Laravel REST API Integration (Sanctum / Passport)
 * Set VITE_API_BASE_URL in environment or defaults to http://localhost:8000/api
 */

const BASE_URL = (import.meta as unknown as { env?: { VITE_API_BASE_URL?: string } }).env?.VITE_API_BASE_URL || '/api';
const SERVER_ORIGIN = BASE_URL.replace(/\/api\/?$/, '');

export function getStoredToken(): string | null {
  return localStorage.getItem('si_amang_token');
}

export function setStoredToken(token: string | null) {
  if (token) {
    localStorage.setItem('si_amang_token', token);
  } else {
    localStorage.removeItem('si_amang_token');
  }
}

export class ApiError extends Error {
  status?: number;
  errors?: Record<string, string[]>;
  isNetworkError: boolean;

  constructor(
    message: string,
    status?: number,
    errors?: Record<string, string[]>,
    isNetworkError = false
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
    this.isNetworkError = isNetworkError;
  }
}

interface RequestOptions extends RequestInit {
  data?: unknown;
}

export async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const token = getStoredToken();
  const isFormData = options.data instanceof FormData;

  const headers: Record<string, string> = {
    'Accept': 'application/json',
    // Jangan set Content-Type manual untuk FormData — browser yang menentukan
    // boundary multipart secara otomatis. Kalau dipaksa 'application/json',
    // file di dalam FormData tidak akan terkirim dengan benar.
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  if (options.data) {
    config.body = isFormData ? (options.data as FormData) : JSON.stringify(options.data);
  }

  const url = `${BASE_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;

  try {
    const response = await fetch(url, config);

    if (response.status === 401) {
      setStoredToken(null);
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      // Build human-friendly message from Laravel error bag if available
      let detailedMessage = errorData.message;
      if (errorData.errors && typeof errorData.errors === 'object') {
        const firstField = Object.keys(errorData.errors)[0];
        if (firstField && Array.isArray(errorData.errors[firstField]) && errorData.errors[firstField].length > 0) {
          detailedMessage = errorData.errors[firstField][0];
        }
      }

      throw new ApiError(
        detailedMessage || `Permintaan gagal dengan status ${response.status}`,
        response.status,
        errorData.errors,
        false
      );
    }

    return await response.json();
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    // Network / offline error
    console.warn(`[SIAMANG API] Network connection failed for ${url}:`, err);
    throw new ApiError(
      'Tidak dapat terhubung ke server backend (Network/Offline error).',
      undefined,
      undefined,
      true
    );
  }
}
export interface TrackedApplication {
  id: string;
  registrationNumber: string;
  applicantName: string;
  institution?: string;
  fieldName?: string;
  kategoriName?: string;
  lowongan?: string;
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
  submittedAt?: string;
  reviewedAt?: string;
  acceptedAt?: string;
  notes?: string;
  periode?: string;
  periodeStart?: string;
  periodeEnd?: string;
}

export async function trackApplication(
  registrationNumber: string,
  email: string
): Promise<TrackedApplication> {
  const params = new URLSearchParams({
    registration_number: registrationNumber.trim(),
    email: email.trim(),
  });
  const response = await apiRequest<{ data: TrackedApplication }>(
    `/applications/track?${params.toString()}`
  );
  return response.data;
}

export function resolveStorageUrl(filePath?: string | null): string | null {
  if (!filePath) return null;
  if (/^https?:\/\//i.test(filePath)) return filePath;

  const cleanPath = filePath.replace(/^\/+/, '');
  const withStoragePrefix = cleanPath.startsWith('storage/') ? cleanPath : `storage/${cleanPath}`;

  return `${SERVER_ORIGIN}/${withStoragePrefix}`;
}

// Default initial data for preview mode fallback
export const DEFAULT_TIMELINE_SCHEDULES = [
  {
    id: '1',
    title: 'Pendaftaran Dibuka',
    date: '05 Mei 2026',
    subtext: 'Mulai Pukul 00:00',
    description: 'Pendaftaran gelombang resmi dibuka untuk seluruh mahasiswa dan siswa SMK.',
    icon: 'calendar_today',
    statusColor: 'primary' as const,
  },
  {
    id: '2',
    title: 'Pendaftaran Ditutup',
    date: '11 Mei 2026',
    subtext: 'Ditutup Pukul 23:59',
    description: 'Batas akhir pengumpulan berkas dan pendaftaran online melalui sistem.',
    icon: 'event_busy',
    statusColor: 'warning' as const,
  },
  {
    id: '3',
    title: 'Pengumuman',
    date: '14 Mei 2026',
    subtext: 'Mulai Pukul 12:00',
    description: 'Pengumuman hasil seleksi akan dikirimkan via email terdaftar dan portal ini.',
    icon: 'campaign',
    statusColor: 'success' as const,
  },
  {
    id: '4',
    title: 'Durasi Magang',
    date: '2 - 6 Bulan',
    subtext: 'Sistem Hybrid / Onsite',
    description: 'Pelaksanaan program magang berlangsung di lingkungan DISKOMINFOSAN Kota Yogyakarta.',
    icon: 'schedule',
    statusColor: 'secondary' as const,
  },
];

export const DEFAULT_CATEGORIES = [
  {
    id: 'ikp',
    title: 'Bidang Informasi dan Komunikasi Publik',
    description: 'Fokus pada kehumasan, pengelolaan media sosial, jurnalistik, dan komunikasi strategis pemerintah kota.',
    icon: 'campaign',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMEI5vM4Da6FGokyrH8YZ5rpfKOAi9_Uthsu98Njden5JDlRhAOTXViP8WDHy7pKtOTg-CPlabSgTS7yulFyd-8unk0QDOtAL51t1GagTNwO0SYNmzrTM_Ie4O4RNk7oWdP1-5bl-l6dnNWnpV9TCXbMBPjebkCt6asM6gINrUAujP4DC-AIBTz4ADskkCxyxjn7Yb2JHPrJ8wGegZB7ZeEXJjw_hpOywG5FlFyVgfhkjsF4XGftkcdQ',
    items: [
      'Layanan Informasi dan Pengaduan',
      'Humas dan Protokol',
      'Pengelolaan Konten'
    ]
  },
  {
    id: 'sisstat',
    title: 'Bidang Sistem Informasi dan Statistik',
    description: 'Pengembangan aplikasi, analisis data statistik sektoral, dan pengelolaan basis data terpusat.',
    icon: 'query_stats',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmZIpRpxKu3fUtqSoPxEMu7dP-wUv9IfqAsgpd87_zNP1Em9hBD2zfjKO297IiJdOrkWevqQ8NYr6gFn4_5CG4jDhAH_475MNGwr7Sc9QqPVdcDGd7mAkw3yXGD8nINN2vz8srcMVuHYEHBoRauhqw2kPB9-Mfg8qHygB40OwXuUapSfUgyD619wf6HMLKeXpHibtv60YRHbYL3CCF-CX4eYWD-69pYXU4OGa4iz3-8HPbjp7AYgW82g',
    items: [
      'Operasional dan Pemeliharaan Sistem Informasi',
      'Pengembangan Perangkat Lunak',
      'Data dan Statistik'
    ]
  },
  {
    id: 'persandian',
    title: 'Operasional Persandian dan Telekomunikasi',
    description: 'Keamanan informasi, kriptografi, pengelolaan sertifikat elektronik, dan audit keamanan sistem.',
    icon: 'shield_person',
    items: [
      'Persandian dan Telekomunikasi',
      'Pengamanan Informasi',
      'Pengawasan Penyelenggaraan Persandian dan Telematika'
    ]
  },
  {
    id: 'infrastruktur',
    title: 'Infrastruktur Telematika',
    description: 'Pengelolaan server, instalasi jaringan komputer, dan pemeliharaan infrastruktur TI pemerintah.',
    icon: 'lan',
    items: [
      'Infrastruktur Jaringan Teknologi Informasi',
      'Infrastruktur Pusat Data'
    ]
  }
];

export const DEFAULT_REQUIREMENTS = [
  {
    id: '1',
    title: 'Surat Pengantar Resmi',
    description: 'Surat permohonan magang/PKL resmi dari Perguruan Tinggi / Sekolah asal yang ditujukan kepada Kepala Dinas.',
    required: true,
    fileTypes: ['PDF']
  },
  {
    id: '2',
    title: 'Transkrip Nilai / KHS Terakhir',
    description: 'Salinan nilai akademis terbaru yang telah dilegalisir / disahkan oleh kampus/sekolah.',
    required: true,
    fileTypes: ['PDF']
  },
  {
    id: '3',
    title: 'Curriculum Vitae (CV) & Portofolio',
    description: 'Daftar riwayat hidup terbaru beserta karya / proyek relevan sesuai bidang magang yang dipilih.',
    required: true,
    fileTypes: ['PDF']
  },
  {
    id: '4',
    title: 'Pas Foto Terbaru',
    description: 'Foto formal ukuran 3x4 latar belakang merah/biru.',
    required: true,
    fileTypes: ['JPG', 'PNG']
  }
];