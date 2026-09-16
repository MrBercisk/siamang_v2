
export interface BidangOption {
  id: number;
  name: string;
  status: 'Aktif' | 'Nonaktif';
}

export interface KategoriItem {
  id: number;
  name: string;
  bidangId: number;
  bidangName: string;
  bidangStatus: 'Aktif' | 'Nonaktif';
  quota: number | null;
  description?: string;
  /** Berasal dari `withCount('applications')` di backend. */
  totalApplied: number;
  /** Hanya terisi untuk item di Sampah (soft-deleted). */
  deletedAt?: string | null;
}

export interface KategoriFormValues {
  name: string;
  bidangId: number | '';
  description: string;
}

export const EMPTY_KATEGORI_FORM: KategoriFormValues = {
  name: '',
  bidangId: '',
  description: '',
};