export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  } catch {
    return dateString;
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
