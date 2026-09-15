// Sesuai App\Models\Bidang: $fillable = ['name', 'status'], dan
// App\Http\Controllers\Api\BidangController: Rule::in(['Aktif', 'Nonaktif']).
export type BidangStatus = 'Aktif' | 'Nonaktif';

export interface BidangItem {
  id: number;
  name: string;
  status: BidangStatus;
  /** Berasal dari `withCount('kategori')` di backend -> field `kategori_count`. */
  categoryCount: number;
}

export interface BidangFormValues {
  name: string;
  status: BidangStatus;
}

export const EMPTY_BIDANG_FORM: BidangFormValues = {
  name: '',
  status: 'Aktif',
};