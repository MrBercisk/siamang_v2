export type InternshipTabKey = 'timeline' | 'bidang' | 'persyaratan' | 'status';

export type DemoApplicationStatus = 'pending' | 'accepted' | 'rejected';

export interface RequirementItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  hasDownloadLink?: boolean;
}

export interface DetailRow {
  icon: string;
  label: string;
  value: string;
}


export interface StepperStepData {
  id: number;
  title: string;
  /** Baris tanggal/keterangan, tiap elemen array = satu baris (dipisah <br />) */
  dateLines?: string[];
  circleClassName: string;
  labelClassName?: string;
  dateClassName?: string;
  /** true untuk step yang masih "menunggu" (diberi opacity-60) */
  muted?: boolean;
}