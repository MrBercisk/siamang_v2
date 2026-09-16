export type BidangStatus = 'Aktif' | 'Nonaktif';

export interface BidangItem {
  id: number;
  name: string;
  status: BidangStatus;
  /** Berasal dari `withCount('kategori')` di backend -> field `kategori_count`. */
  categoryCount: number;
  /** Terisi kalau bidang sedang berada di sampah (soft-deleted). */
  deletedAt?: string | null;
}

export interface BidangFormValues {
  name: string;
  status: BidangStatus;
}

export const EMPTY_BIDANG_FORM: BidangFormValues = {
  name: '',
  status: 'Aktif',
};