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
    dateLines: ['Sedang Diverifikasi'],
    circleClassName: 'bg-amber-500 text-white',
    dateClassName: 'text-amber-600 font-bold',
  },
  {
    id: 3,
    title: 'Seleksi Mentor',
    dateLines: ['Menunggu'],
    circleClassName: 'bg-slate-200 text-slate-600',
    labelClassName: 'text-slate-600',
    dateClassName: 'text-slate-400',
    muted: true,
  },
  {
    id: 4,
    title: 'Pengumuman Final',
    dateLines: ['Menunggu'],
    circleClassName: 'bg-slate-200 text-slate-600',
    labelClassName: 'text-slate-600',
    dateClassName: 'text-slate-400',
    muted: true,
  },
];

const SEGMENT_COLORS = ['bg-emerald-500', '', ''];

interface StatusPendingPanelProps {
  onContactWhatsApp: () => void;
}

export function StatusPendingPanel({ onContactWhatsApp }: StatusPendingPanelProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs grid grid-cols-1 lg:grid-cols-12 gap-8">
        <ApplicantInfoCard
          name="LEONA STRIVE"
          badgeIcon="info"
          badgeLabel="Pending Administrasi"
          badgeClassName="text-amber-800 bg-amber-50 border border-amber-200"
          details={APPLICANT_DETAIL_ROWS}
        />

        <div className="lg:col-span-7 space-y-6">
          <h5 className="text-base font-bold text-[#1e293b]">Progres Seleksi</h5>
          <SelectionStepper steps={STEPS} segmentColors={SEGMENT_COLORS} />

          <div className="p-4 bg-amber-50/90 border border-amber-200 rounded-2xl flex items-center gap-3 text-xs text-amber-900 mt-6">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-lg">info</span>
            </div>
            <p className="leading-relaxed">
              Dokumen Anda sedang dalam proses verifikasi oleh tim kami. Mohon tunggu informasi
              selanjutnya melalui email dan aplikasi SIAMANG.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-[#E6F7F3] rounded-2xl p-6 border border-emerald-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#D1FAE5] text-[#1f877c] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">support_agent</span>
            </div>
            <div>
              <h5 className="text-sm font-bold text-[#1e293b]">Butuh Bantuan?</h5>
              <p className="text-xs text-slate-500 mt-0.5">
                Jika ada kendala atau pertanyaan terkait pendaftaran, silahkan hubungi tim kami.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onContactWhatsApp}
            className="bg-[#1f877c] hover:bg-[#196e65] text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shrink-0 cursor-pointer shadow-2xs"
          >
            <span>Hubungi Kami</span>
            <span className="material-symbols-outlined text-sm">chat</span>
          </button>
        </div>

        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/90 flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-[#D1FAE5] text-[#1f877c] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-xl">info</span>
          </div>
          <div>
            <h5 className="text-sm font-bold text-[#1e293b] mb-1.5">Informasi Penting</h5>
            <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4">
              <li>Pastikan dokumen yang Anda unggah sesuai dengan persyaratan yang ditentukan.</li>
              <li>Pengumuman hasil seleksi akan dikirimkan melalui email terdaftar.</li>
              <li>Seluruh proses seleksi tidak dipungut biaya apapun.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}