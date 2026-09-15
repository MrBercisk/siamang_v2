import { StepperStepData } from '../../../types/home';
import { APPLICANT_DETAIL_ROWS } from '../data/applicantDetailRows';
import { ApplicantInfoCard } from './ApplicantInfoCard';
import { SelectionStepper } from './SelectionStepper';

const STEPS: StepperStepData[] = [
  {
    id: 1,
    title: 'Pendaftaran Diterima',
    dateLines: ['05 Mei 2026', '10:00 WIB'],
    circleClassName: 'bg-emerald-500 text-white',
    dateClassName: 'text-emerald-600 font-bold',
  },
  {
    id: 2,
    title: 'Verifikasi Dokumen',
    dateLines: ['08 Mei 2026', '14:00 WIB'],
    circleClassName: 'bg-rose-500 text-white',
    dateClassName: 'text-emerald-600 font-bold',
  },
  {
    id: 3,
    title: 'Seleksi Mentor',
    dateLines: ['11 Mei 2026', '11:00 WIB'],
    circleClassName: 'bg-rose-500 text-white',
    labelClassName: 'text-rose-600',
    dateClassName: 'text-rose-600 font-bold',
  },
  {
    id: 4,
    title: 'Pengumuman Final',
    dateLines: ['11 Mei 2026', '11:00 WIB'],
    circleClassName: 'bg-rose-500 text-white',
    labelClassName: 'text-rose-600',
    dateClassName: 'text-rose-600 font-bold',
  },
];

const SEGMENT_COLORS = ['bg-emerald-500', 'bg-rose-500', 'bg-rose-500'];

interface StatusRejectedPanelProps {
  onGoToBidang: () => void;
}

export function StatusRejectedPanel({ onGoToBidang }: StatusRejectedPanelProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs grid grid-cols-1 lg:grid-cols-12 gap-8">
        <ApplicantInfoCard
          name="LEONA STRIVE"
          badgeIcon="cancel"
          badgeLabel="Tidak Diterima"
          badgeClassName="text-rose-700 bg-rose-50 border border-rose-300"
          message="Mohon maaf, Anda belum lolos seleksi magang DISKOMINFOSAN Kota Yogyakarta"
          messageClassName="text-rose-600"
          details={APPLICANT_DETAIL_ROWS}
        />

        <div className="lg:col-span-7 space-y-6">
          <h5 className="text-base font-bold text-[#1e293b]">Progres Seleksi</h5>
          <SelectionStepper steps={STEPS} segmentColors={SEGMENT_COLORS} />

          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-xs text-rose-800 mt-6">
            <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-lg">info</span>
            </div>
            <p className="leading-relaxed">
              Dokumen anda belum sesuai dengan ketentuan yang dibutuhkan. Silakan perbaiki dan
              daftar kembali pada periode selanjutnya.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
        <div>
          <h5 className="text-base font-bold text-[#1e293b]">Tetap Semangat!</h5>
          <p className="text-xs text-slate-500 mt-0.5">
            Terus tingkatkan kemampuan Anda dan jangan ragu untuk mendaftar kembali di periode
            berikutnya.
          </p>
        </div>

        <button
          type="button"
          onClick={onGoToBidang}
          className="bg-[#1f877c] hover:bg-[#196e65] text-white px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm shrink-0 shadow-2xs cursor-pointer transition-colors"
        >
          Lihat Lowongan
        </button>
      </div>
    </div>
  );
}