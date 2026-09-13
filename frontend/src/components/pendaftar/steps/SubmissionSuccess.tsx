import { ApplicationStatus } from '../../../types/internship';
import { RegistrationType } from '../types';

interface SubmissionSuccessProps {
  submittedApp: ApplicationStatus | null;

  selectedBidang: string;
  selectedKategori: string;
  selectedLowongan: string;

  registrationType: RegistrationType;

  onSuccessSubmit?: (application: ApplicationStatus) => void;
  onBackToForm: () => void;
}

export function SubmissionSuccess({
  submittedApp,
  selectedBidang,
  selectedKategori,
  selectedLowongan,
  registrationType,
  onSuccessSubmit,
  onBackToForm,
}: SubmissionSuccessProps) {
  const regNum = submittedApp?.id || 'REG-2026-0589';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-8 shadow-2xs text-center space-y-6 max-w-2xl mx-auto animate-in zoom-in-95">
      <div className="w-20 h-20 bg-emerald-100 text-[#1f877c] rounded-full flex items-center justify-center mx-auto text-4xl shadow-sm">
        <span className="material-symbols-outlined text-5xl">task_alt</span>
      </div>
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Pendaftaran Berhasil Dikirim!</h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
          Terima kasih telah melengkapi formulir pendaftaran magang di DISKOMINFOSAN Kota Yogyakarta. Data dan berkas Anda telah tersimpan dan sedang ditinjau oleh tim verifikator.
        </p>
      </div>

      <div className="p-4 bg-[#E6F7F3] border border-emerald-200 rounded-2xl text-left text-xs space-y-2.5">
        <div className="flex justify-between font-bold text-slate-800">
          <span>Nomor Pendaftaran:</span>
          <span className="text-[#1f877c] font-mono text-sm">{regNum}</span>
        </div>

        <div className="flex justify-between text-slate-600">
          <span>Status Pendaftaran:</span>
          <span className="font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full text-[11px]">
            Sedang Ditinjau
          </span>
        </div>

        <div className="flex justify-between text-slate-600">
          <span>Bidang Penempatan:</span>
          <span className="font-medium text-slate-800 text-right ml-4">
            {submittedApp?.fieldName || selectedBidang}
          </span>
        </div>

        <div className="flex justify-between text-slate-600">
          <span>Kategori:</span>
          <span className="font-medium text-slate-800 text-right ml-4">
            {submittedApp?.kategoriName || selectedKategori}
          </span>
        </div>

        <div className="flex justify-between text-slate-600">
          <span>Lowongan:</span>
          <span className="font-medium text-slate-800 text-right ml-4">
            {submittedApp?.lowongan || selectedLowongan}
          </span>
        </div>

        <div className="flex justify-between text-slate-600">
          <span>Tipe Pendaftaran:</span>
          <span className="font-medium text-slate-800 text-right ml-4">
            {submittedApp?.registrationType || registrationType}
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => {
            if (onSuccessSubmit && submittedApp) {
              onSuccessSubmit(submittedApp);
            } else {
              onBackToForm();
            }
          }}
          className="w-full sm:w-auto bg-[#1f877c] hover:bg-[#196e65] text-white font-bold text-xs px-6 py-3 rounded-xl transition-all cursor-pointer shadow-2xs flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">dashboard</span>
          <span>Lihat Status di Dashboard</span>
        </button>
        <button
          type="button"
          onClick={onBackToForm}
          className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 py-3 rounded-xl transition-all cursor-pointer"
        >
          Kembali ke Form
        </button>
      </div>
    </div>
  );
}