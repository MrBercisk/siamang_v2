import { DocumentFile } from '../types';

// Memetakan id dokumen (state internal form) ke slug document_type yang
// dikenali backend (ApplicationController::store).
export const DOCUMENT_TYPE_SLUG_MAP: Record<number, string> = {
  1: 'pas_foto',
  2: 'berkas_persyaratan',
  3: 'nda',
  4: 'surat_permohonan',
  5: 'video_perkenalan',
};

export const INITIAL_DOCUMENTS: DocumentFile[] = [
  {
    id: 1,
    name: 'Pas Foto 3 × 4',
    desc: 'Pas foto terbaru dengan latar belakang bebas',
    required: true,
    format: 'JPG / PNG',
    maxSize: '200 KB',
    fileName: undefined,
    status: 'Belum Upload Berkas',
  },
  {
    id: 2,
    name: 'Berkas Persyaratan Pendaftaran',
    desc: 'Gabungkan semua berkas persyaratan dalam 1 file PDF',
    required: true,
    format: 'PDF',
    maxSize: '2 MB',
    fileName: undefined,
    status: 'Belum Upload Berkas',
  },
  {
    id: 3,
    name: 'Surat NDA Perjanjian Magang Mahasiswa',
    desc: 'Surat NDA yang sudah ditandatangani peserta',
    required: true,
    format: 'PDF',
    maxSize: '1 MB',
    fileName: undefined,
    status: 'Belum Upload Berkas',
  },
  {
    id: 4,
    name: 'Surat Permohonan',
    desc: 'Surat permohonan magang dari kampus/institusi',
    required: true,
    format: 'PDF',
    maxSize: '1 MB',
    fileName: undefined,
    status: 'Belum Upload Berkas',
  },
  {
    id: 5,
    name: 'Video Perkenalan',
    desc: 'Video perkenalan diri (maks. 2 menit)',
    required: false,
    format: 'MP4',
    maxSize: '20 MB',
    fileName: undefined,
    status: 'Belum Upload Berkas',
  },
];