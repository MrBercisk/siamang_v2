import { DocumentFile } from '../types';

// Batas keamanan tambahan sesuai validasi backend (file max:20480 KB = 20MB)
export const BACKEND_MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024;

export interface FileValidationResult {
  valid: boolean;
  errorTitle?: string;
  errorMessage?: string;
}

/**
 * Mengonversi teks ukuran seperti "200 KB", "2 MB", "1 MB" menjadi jumlah byte.
 */
export function parseMaxSizeToBytes(maxSize: string): number {
  const match = maxSize.trim().match(/^([\d.]+)\s*(KB|MB|GB)$/i);
  if (!match) return BACKEND_MAX_FILE_SIZE_BYTES; // fallback aman kalau format tak dikenali

  const value = parseFloat(match[1]);
  const unit = match[2].toUpperCase();

  switch (unit) {
    case 'KB':
      return value * 1024;
    case 'MB':
      return value * 1024 * 1024;
    case 'GB':
      return value * 1024 * 1024 * 1024;
    default:
      return BACKEND_MAX_FILE_SIZE_BYTES;
  }
}

/**
 * Memetakan teks format ("JPG / PNG", "PDF", "MP4") ke daftar ekstensi & MIME type yang diizinkan.
 */
export function getAllowedTypes(format: string): { extensions: string[]; mimeTypes: string[] } {
  const normalized = format.toUpperCase();
  const extensions: string[] = [];
  const mimeTypes: string[] = [];

  if (normalized.includes('JPG') || normalized.includes('JPEG')) {
    extensions.push('jpg', 'jpeg');
    mimeTypes.push('image/jpeg');
  }
  if (normalized.includes('PNG')) {
    extensions.push('png');
    mimeTypes.push('image/png');
  }
  if (normalized.includes('PDF')) {
    extensions.push('pdf');
    mimeTypes.push('application/pdf');
  }
  if (normalized.includes('MP4')) {
    extensions.push('mp4');
    mimeTypes.push('video/mp4');
  }
  if (normalized.includes('DOC')) {
    extensions.push('doc', 'docx');
    mimeTypes.push('application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  }

  return { extensions, mimeTypes };
}

export function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(bytes % (1024 * 1024) === 0 ? 0 : 1)} MB`;
  }
  return `${Math.round(bytes / 1024)} KB`;
}

/**
 * Validasi satu file terhadap aturan dokumen (format & ukuran) sebelum diizinkan diunggah.
 * Mencerminkan aturan validasi di backend (ApplicationController::store), supaya user
 * mendapat feedback instan tanpa harus menunggu response server.
 */
export function validateDocumentFile(file: File, doc: DocumentFile): FileValidationResult {
  const { extensions, mimeTypes } = getAllowedTypes(doc.format);
  const fileExtension = file.name.split('.').pop()?.toLowerCase() ?? '';

  // Validasi format/ekstensi file
  const isExtensionValid = extensions.length === 0 || extensions.includes(fileExtension);
  const isMimeValid = mimeTypes.length === 0 || mimeTypes.includes(file.type);

  if (!isExtensionValid && !isMimeValid) {
    return {
      valid: false,
      errorTitle: 'Format Berkas Tidak Sesuai',
      errorMessage: `Berkas "${doc.name}" harus berformat ${doc.format}. Berkas yang Anda pilih (.${fileExtension || 'tidak dikenali'}) tidak diizinkan.`,
    };
  }

  // Validasi ukuran file sesuai batas per-dokumen
  const maxBytes = parseMaxSizeToBytes(doc.maxSize);
  if (file.size > maxBytes) {
    return {
      valid: false,
      errorTitle: 'Ukuran Berkas Terlalu Besar',
      errorMessage: `Ukuran berkas "${doc.name}" (${formatBytes(file.size)}) melebihi batas maksimal ${doc.maxSize}. Silakan kompres atau pilih berkas lain.`,
    };
  }

  // Validasi batas keamanan tambahan sesuai limit backend (20MB)
  if (file.size > BACKEND_MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      errorTitle: 'Ukuran Berkas Melebihi Batas Server',
      errorMessage: `Ukuran berkas "${doc.name}" melebihi batas maksimal yang diizinkan server (20 MB).`,
    };
  }

  // Validasi berkas kosong (0 byte), indikasi file rusak/corrupt
  if (file.size === 0) {
    return {
      valid: false,
      errorTitle: 'Berkas Tidak Valid',
      errorMessage: `Berkas "${doc.name}" tampak kosong atau rusak. Silakan pilih berkas lain.`,
    };
  }

  return { valid: true };
}