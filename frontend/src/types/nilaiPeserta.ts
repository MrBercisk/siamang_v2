export interface NilaiAspect {
  key: string;
  label: string;
  skor: number;
}

export interface NilaiSummary {
  isPublished: boolean;
  predikat?: string;
  rataRata?: number;
  aspects: NilaiAspect[];
  suratKeteranganUrl?: string;
  suratKeteranganName?: string;
}

export interface NilaiProfile {
  nama: string;
  email: string;
  nim?: string;
  instansi?: string;
  kategori?: string;
  judulProject?: string;
  periodeStart?: string;
  periodeEnd?: string;
  mentorNama?: string;
  mentorNip?: string;
}

export interface NilaiState {
  profile: NilaiProfile;
  nilai: NilaiSummary | null;
}