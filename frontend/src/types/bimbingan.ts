/** Lokasi file: src/types/bimbingan.ts */

export interface BimbinganItem {
  id: string;
  applicationId: string;
  registrationNumber: string;
  participantName: string;
  institution: string;
  bidangName?: string;
  kategoriName?: string;
  mentorId?: string;
  mentorName: string;
  projectTitle: string;
  registrationType?: string;
  /** Nilai mentah dari kolom bimbingan.status; UI tidak mengasumsikan daftar nilainya. */
  status: string;
  progressPercent: number; // 0-100
  lastUpdate: string | null; // ISO 8601
}