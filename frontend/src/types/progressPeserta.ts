export interface ProgressItem {
  id: string;
  judulProject: string;
  /** YYYY-MM-DD, mentah dari API (dipakai juga untuk isi ulang form saat edit). */
  tanggalBimbinganRaw: string;
  /** Sudah diformat untuk tampilan, mis. "26 Mei 2023". */
  tanggalBimbingan: string;
  pencapaian: string;
  catatan: string;
  filePresentasiUrl?: string;
  fileName?: string;
  /** Sudah diformat untuk tampilan, mis. "26 Mei 2023 14:06:39". */
  tanggalUpload: string;
}

export interface ProgressFormValues {
  judulProject: string;
  /** YYYY-MM-DD, sesuai <input type="date">. */
  tanggalBimbingan: string;
  pencapaian: string;
  catatan: string;
}