export type BidangStatus = 'Aktif' | 'Nonaktif';

export interface BidangOption {
  id: number;
  name: string;
  status: BidangStatus;
}

export interface KategoriItem {
  id: number;
  name: string;
  bidangId: number;
  bidangName: string;
  bidangStatus: BidangStatus;
  quota: number | null;
  description?: string;
  totalApplied: number;
  deletedAt: string | null;
}

export interface KategoriFormValues {
  bidangId: number | '';
  name: string;
  description: string;
}

export const EMPTY_KATEGORI_FORM: KategoriFormValues = {
  bidangId: '',
  name: '',
  description: '',
};

export function kategoriToFormValues(item: KategoriItem): KategoriFormValues {
  return {
    bidangId: item.bidangId,
    name: item.name,
    description: item.description ?? '',
  };
}