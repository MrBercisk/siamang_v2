import { RequirementItem } from '../../../types/home';

// Data statis - didefinisikan di luar komponen agar tidak dibuat ulang setiap render
export const CUSTOM_REQUIREMENTS_LIST: RequirementItem[] = [
  {
    id: 'req1',
    icon: 'school',
    title: 'Pendidikan',
    description: 'Minimal mahasiswa semester 5 (D3) / semester 7 (S1).',
  },
  {
    id: 'req2',
    icon: 'article',
    title: 'Surat Permohonan Magang & NDA',
    description:
      'Mahasiswa wajib memiliki surat permohonan magang dari kampus dan NDA perjanjian magang DISKOMINFOSAN yang dapat di download',
    hasDownloadLink: true,
  },
  {
    id: 'req3',
    icon: 'account_circle',
    title: 'Pas Foto',
    description: 'Mahasiswa wajib memiliki pas foto ukuran 3 × 4.',
  },
  {
    id: 'req4',
    icon: 'play_circle',
    title: 'Video Perkenalan',
    description:
      'Mahasiswa wajib membuat video perkenalan dengan durasi maksimal 2 menit dan ukuran 20MB.',
  },
];