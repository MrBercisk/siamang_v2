import { StepperStepData } from '../../../types/home';
import { APPLICANT_DETAIL_ROWS } from '../data/applicantDetailRows';
import { ApplicantInfoCard } from './ApplicantInfoCard';
import { SelectionStepper } from './SelectionStepper';

const WHATSAPP_CONTACT_URL = 'https://wa.me/628123456789';

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
    circleClassName: 'bg-emerald-500 text-white',
    dateClassName: 'text-emerald-600 font-bold',
  },
  {
    id: 3,
    title: 'Seleksi Mentor',
    dateLines: ['11 Mei 2026', '11:00 WIB'],
    circleClassName: 'bg-emerald-500 text-white',
    dateClassName: 'text-emerald-600 font-bold',
  },
  {
    id: 4,
    title: 'Pengumuman Final',
    dateLines: ['12 Mei 2026', '09:00 WIB'],
    circleClassName: 'bg-emerald-500 text-white',
    dateClassName: 'text-emerald-600 font-bold',
  },
];

const SEGMENT_COLORS = ['bg-emerald-500', 'bg-emerald-500', 'bg-emerald-500'];

const NEXT_STEP_CARDS = [
  {
    icon: 'assignment',
    title: 'Surat Penerimaan',
    description: 'Unduh surat penerimaan untuk keperluan administrasi',
    actionLabel: 'Unduh PDF',
    actionIcon: 'download',
    onAction: () => alert('Mengunduh Surat Penerimaan (PDF)...'),
  },
  {
    icon: 'folder',
    title: 'Panduan Peserta',
    description: 'Panduan lengkap kegiatan magang bagi peserta',
    actionLabel: 'Lihat Panduan',
    actionIcon: 'chat',
    onAction: () => window.open(WHATSAPP_CONTACT_URL, '_blank'),
  },
  {
    icon: 'call',
    title: 'Hubungi Mentor',
    description: 'Informasi mentor dan kontak dapat dilihat di SIAMANG.',
    actionLabel: 'Buka SIAMANG',
    actionIcon: 'chat',
    onAction: () => window.open(WHATSAPP_CONTACT_URL, '_blank'),
  },
];

export function StatusAcceptedPanel() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs grid grid-cols-1 lg:grid-cols-12 gap-8">
        <ApplicantInfoCard
          name="LEONA STRIVE"
          badgeIcon="check_circle"
          badgeLabel="Diterima"
          badgeClassName="text-emerald-700 bg-emerald-50 border border-emerald-300"
          message="Selamat! Anda dinyatakan lolos seleksi magang DISKOMINFOSAN Kota Yogyakarta"
          messageClassName="text-[#1f877c]"
          details={APPLICANT_DETAIL_ROWS}
        />

        <div className="lg:col-span-7 space-y-6">
          <h5 className="text-base font-bold text-[#1e293b]">Progres Seleksi</h5>
          <SelectionStepper steps={STEPS} segmentColors={SEGMENT_COLORS} />

          <div className="p-4 bg-[#ECFDF5] border border-emerald-300 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#005c55] mt-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-xl text-[#1f877c] shrink-0">info</span>
              <p className="leading-relaxed">
                Anda telah diterima sebagai peserta magang. Silakan cek jadwal dan informasi
                selanjutnya pada aplikasi SIAMANG.
              </p>
            </div>

            <button
              type="button"
              onClick={() => alert('Membuka jadwal magang...')}
              className="bg-[#1f877c] hover:bg-[#196e65] text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shrink-0 shadow-2xs cursor-pointer transition-colors"
            >
              <span>Lihat Jadwal</span>
              <span className="material-symbols-outlined text-base">login</span>
            </button>
          </div>
        </div>
      </div>

      <div>
        <h5 className="text-sm font-bold text-[#1e293b] mb-4">Dokumen & Informasi Selanjutnya</h5>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {NEXT_STEP_CARDS.map((card) => (
            <div
              key={card.title}
              className="bg-[#E6F7F3] rounded-2xl p-5 border border-emerald-100 flex flex-col justify-between"
            >
              <div>
                <span className="material-symbols-outlined text-2xl text-[#1f877c] mb-2 block">
                  {card.icon}
                </span>
                <h6 className="text-sm font-bold text-[#1e293b] mb-1">{card.title}</h6>
                <p className="text-xs text-slate-600 mb-4">{card.description}</p>
              </div>
              <button
                type="button"
                onClick={card.onAction}
                className="w-fit bg-[#1f877c] hover:bg-[#196e65] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <span>{card.actionLabel}</span>
                <span className="material-symbols-outlined text-base">{card.actionIcon}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}