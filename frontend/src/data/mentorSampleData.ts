import { PendaftarData } from '../components/mentor/DetailDataModal';
import { BimbinganData } from '../components/mentor/DetailBimbinganView';
import { ChatMessage } from '../types/mentor';

// Sample Bimbingan Data matching Screenshot 1, 2, and 3
export const initialBimbinganList: BimbinganData[] = [
  {
    id: 1,
    nama: 'Leona Strive',
    fotoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    kategori: 'Perencanaan dan Implementasi Sistem Informasi',
    judulProject: 'Perencanaan dan Implementasi Sistem Informasi',
    tipePendaftaran: 'Kelompok',
    lastUpdate: '20 Juni 2025',
    status: 'On Progress',
    progress: 70,
    ketua: 'Nama Ketua',
    anggota2: 'Nama Anggota',
    anggota3: 'Nama Anggota',
    progressList: [
      {
        id: 1,
        tanggal: '28 Mei 2026',
        pencapaian: 'Membuat wireframe',
        catatan: 'Lanjutkan ke hi-fi design',
        filePresentasi: 'Wireframe_v1.pdf',
      },
    ],
    laporanList: [
      {
        id: 1,
        judulLaporan: 'Sistem Informasi Aplikasi',
        fileLaporan: 'Laporan_Sistem_Informasi_Aplikasi.pdf',
        linkProject: 'https://google.drive.com/...',
        formNilai: 'Form_Nilai_Sistem_Informasi.pdf',
        status: 'disetujui',
      },
    ],
    nilai: {
      kehadiran: 0,
      kemampuanKerja: 0,
      kualitasKerja: 0,
      kerjasama: 0,
      inisiatifKreativitas: 0,
      disiplin: 0,
    },
  },
  {
    id: 2,
    nama: 'Leona Strive',
    fotoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    kategori: 'Perencanaan dan Implementasi Sistem Informasi',
    judulProject: 'Perencanaan dan Implementasi Sistem Informasi',
    tipePendaftaran: 'Kelompok',
    lastUpdate: '20 Juni 2025',
    status: 'On Progress',
    progress: 70,
    ketua: 'Nama Ketua',
    anggota2: 'Nama Anggota',
    anggota3: 'Nama Anggota',
    progressList: [
      {
        id: 1,
        tanggal: '28 Mei 2026',
        pencapaian: 'Membuat wireframe',
        catatan: 'Lanjutkan ke hi-fi design',
        filePresentasi: 'Wireframe_v1.pdf',
      },
    ],
    laporanList: [
      {
        id: 1,
        judulLaporan: 'Sistem Informasi Aplikasi',
        fileLaporan: 'Laporan_Sistem_Informasi_Aplikasi.pdf',
        linkProject: 'https://google.drive.com/...',
        formNilai: 'Form_Nilai_Sistem_Informasi.pdf',
        status: 'disetujui',
      },
    ],
    nilai: {
      kehadiran: 0,
      kemampuanKerja: 0,
      kualitasKerja: 0,
      kerjasama: 0,
      inisiatifKreativitas: 0,
      disiplin: 0,
    },
  },
];

// Sample Pendaftar Data matching Image 3
export const initialPendaftarList: PendaftarData[] = [
  {
    id: 1,
    fotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    nama: 'Leona Strive',
    email: 'leona@gmail.com',
    phone: '08123456789',
    instansi: 'Universitas Gadjah Mada',
    nim: '21/478912/SV/19231',
    kategori: 'Perencanaan dan Implementasi Sistem Informasi',
    tanggalDaftar: '20 Juni 2025',
    status: 'Diterima',
    berkas: { pasFoto: true, suratPermohonan: true, proposal: true, nda: true },
  },
  {
    id: 2,
    fotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    nama: 'Leona Strive',
    email: 'leona2@gmail.com',
    phone: '08123456780',
    instansi: 'Universitas Gadjah Mada',
    nim: '21/478913/SV/19232',
    kategori: 'Perencanaan dan Implementasi Sistem Informasi',
    tanggalDaftar: '20 Juni 2025',
    status: 'Ditolak',
    berkas: { pasFoto: true, suratPermohonan: true, proposal: true, nda: true },
  },
  {
    id: 3,
    fotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    nama: 'Leona Strive',
    email: 'budi@gmail.com',
    phone: '08123456781',
    instansi: 'Universitas Negeri Yogyakarta',
    nim: '21/478914/SV/19233',
    kategori: 'Perencanaan dan Implementasi Sistem Informasi',
    tanggalDaftar: '20 Juni 2025',
    status: 'Verifikasi',
    berkas: { pasFoto: true, suratPermohonan: true, proposal: true, nda: true },
  },
  {
    id: 4,
    fotoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    nama: 'Leona Strive',
    email: 'siti@gmail.com',
    phone: '08123456782',
    instansi: 'UPN Veteran Yogyakarta',
    nim: '21/478915/SV/19234',
    kategori: 'Perencanaan dan Implementasi Sistem Informasi',
    tanggalDaftar: '20 Juni 2025',
    status: 'Diterima',
    berkas: { pasFoto: true, suratPermohonan: true, proposal: true, nda: true },
  },
  {
    id: 5,
    fotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    nama: 'Leona Strive',
    email: 'rizky@gmail.com',
    phone: '08123456783',
    instansi: 'Universitas Amikom Yogyakarta',
    nim: '21/478916/SV/19235',
    kategori: 'Perencanaan dan Implementasi Sistem Informasi',
    tanggalDaftar: '20 Juni 2025',
    status: 'Ditolak',
    berkas: { pasFoto: true, suratPermohonan: true, proposal: true, nda: true },
  },
];

// Pesan awal Forum Diskusi
export const initialChatMessages: ChatMessage[] = [
  {
    id: 1,
    sender: 'LEONA STRIVE',
    role: 'applicant',
    message: 'Halo pak, saya izin bertanya terkait fitur tambahan yang bapak inginkan',
    timestamp: '2023-08-05 02:54:00',
  },
];