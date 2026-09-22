export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) {
    return '-';
  }
  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
      return dateString;
    }
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Format timestamp ISO 8601 dari backend (biasanya UTC, mis. dari
 * Carbon::toIso8601String()) jadi jam lokal WIB, contoh: "14:24 WIB".
 * Dipakai untuk bubble chat di Forum Diskusi (mentor & peserta).
 */
export function formatChatTime(timestamp: string | null | undefined): string {
  if (!timestamp) {
    return '';
  }
  try {
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) {
      return timestamp;
    }
    const time = new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Jakarta',
    }).format(date);
    return `${time} WIB`;
  } catch {
    return timestamp;
  }
}

export function getStatusBadgeClass(status: string): string {
  switch (status) {
    case 'accepted':
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    case 'rejected':
      return 'bg-rose-100 text-rose-800 border-rose-300';
    case 'reviewing':
      return 'bg-amber-100 text-amber-800 border-amber-300';
    case 'pending':
    default:
      return 'bg-sky-100 text-sky-800 border-sky-300';
  }
}

export function getStatusText(status: string): string {
  switch (status) {
    case 'accepted':
      return 'Diterima';
    case 'rejected':
      return 'Ditolak';
    case 'reviewing':
      return 'Sedang Diprofiling / Seleksi';
    case 'pending':
    default:
      return 'Menunggu Verifikasi';
  }
}