import { useState } from 'react';
import { User } from '../../../types/auth';
import { ApplicationStatus } from '../../../types/internship';
import { resolveStorageUrl } from '@/src/lib/api';

type StageState = 'done' | 'active' | 'pending' | 'rejected';

interface ReviewDashboardTabProps {
  user: User;
  applications?: ApplicationStatus[];
  onGoToPendaftaran?: () => void;
}

interface Stage {
  num: number;
  label: string;
  dateLabel: string; // teks yang ditampilkan, bukan Date object
  state: StageState;
}

const formatDate = (iso?: string): string | null =>
  iso
    ? new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(iso))
    : null;

const formatDateShort = (iso?: string): string | null =>
  iso
    ? new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(iso))
    : null;

const statusLabel = (status?: ApplicationStatus['status']): string => {
  switch (status) {
    case 'accepted':
      return 'Diterima';
    case 'rejected':
      return 'Tidak Diterima';
    case 'pending':
      return 'Menunggu';
    case 'reviewing':
      return 'Sedang Ditinjau';
    default:
      return '-';
  }
};

function getStages(app: ApplicationStatus | null): Stage[] {
  if (!app) {
    return [
      { num: 1, label: 'Pendaftaran Dikirim', dateLabel: 'Belum ada data', state: 'pending' },
      { num: 2, label: 'Review Administrasi', dateLabel: 'Menunggu Informasi', state: 'pending' },
      { num: 3, label: 'Pengumuman Hasil', dateLabel: 'Menunggu Informasi', state: 'pending' },
      { num: 4, label: 'Mulai Magang', dateLabel: 'Menunggu Informasi', state: 'pending' },
    ];
  }

  const submittedLabel = formatDate(app.submittedAt) ?? '-';

  // Step 2: Review Administrasi — done kalau reviewedAt terisi, active kalau status masih 'reviewing'
  const step2State: StageState = app.reviewedAt ? 'done' : app.status === 'reviewing' ? 'active' : 'pending';
  const step2Label = app.reviewedAt
    ? formatDate(app.reviewedAt)!
    : step2State === 'active'
    ? 'Sedang Berlangsung'
    : 'Menunggu Informasi';

  // Step 3: Pengumuman Hasil — mengikuti status accepted/rejected
  let step3State: StageState = 'pending';
  let step3Label = 'Menunggu Informasi';
  if (app.status === 'accepted') {
    step3State = 'done';
    step3Label = formatDate(app.acceptedAt) ?? 'Diterima';
  } else if (app.status === 'rejected') {
    step3State = 'rejected';
    step3Label = 'Tidak Diterima';
  } else if (step2State === 'done') {
    step3State = 'active';
    step3Label = 'Sedang Berlangsung';
  }

  // Step 4: Mulai Magang — hanya relevan kalau diterima & ada startDate
  let step4State: StageState = 'pending';
  let step4Label = 'Menunggu Informasi';
  if (app.status === 'accepted' && app.startDate) {
    const start = new Date(app.startDate);
    step4State = start <= new Date() ? 'done' : 'active';
    step4Label = formatDate(app.startDate)!;
  } else if (app.status === 'rejected') {
    step4State = 'rejected';
    step4Label = '-';
  }

  return [
    { num: 1, label: 'Pendaftaran Dikirim', dateLabel: submittedLabel, state: 'done' },
    { num: 2, label: 'Review Administrasi', dateLabel: step2Label, state: step2State },
    { num: 3, label: 'Pengumuman Hasil', dateLabel: step3Label, state: step3State },
    { num: 4, label: 'Mulai Magang', dateLabel: step4Label, state: step4State },
  ];
}

export function ReviewDashboardTab({
  user,
  applications = [],
  onGoToPendaftaran,
}: ReviewDashboardTabProps) {
  const [showBuktiModal, setShowBuktiModal] = useState(false);
  const [showBerkasModal, setShowBerkasModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState<ApplicationStatus | null>(null);

  const displayName = user.name || 'Pengguna';
  const latestApp = applications.length > 0 ? applications[0] : null;
  

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Halo {displayName}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Selamat datang kembali di sistem pendaftaran magang Diskominfosan Kota Yogyakarta
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 sm:p-4 shadow-2xs flex items-center gap-3.5 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-[#E6F7F3] text-[#1f877c] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-xl font-bold">calendar_month</span>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block leading-tight">
              Periode Magang Aktif
            </span>
            <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 mt-0.5">
              {latestApp?.periode || 'Belum ada periode aktif'}
            </h4>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              {latestApp?.periodeEnd
                ? `Pendaftaran sampai ${formatDate(latestApp.periodeEnd) ?? latestApp.periodeEnd}`
                : 'Periode mengikuti data backend'}
            </span>
          </div>
        </div>
      </div>

      {/* Status Banner & Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div
          className={`lg:col-span-7 rounded-2xl p-6 shadow-2xs flex flex-col justify-between border ${
            latestApp?.status === 'accepted'
              ? 'bg-emerald-50 border-emerald-200/90'
              : latestApp?.status === 'rejected'
              ? 'bg-rose-50 border-rose-200/90'
              : 'bg-[#FFFBEB] border-amber-200/90'
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs ${
                latestApp?.status === 'accepted'
                  ? 'bg-emerald-100 text-emerald-600'
                  : latestApp?.status === 'rejected'
                  ? 'bg-rose-100 text-rose-600'
                  : 'bg-[#FEF3C7] text-amber-600'
              }`}
            >
              <span className="material-symbols-outlined text-2xl font-bold">
                {!latestApp
                  ? 'inbox'
                  : latestApp.status === 'accepted'
                  ? 'check_circle'
                  : latestApp.status === 'rejected'
                  ? 'cancel'
                  : 'hourglass_empty'}
              </span>
            </div>
            <div className="space-y-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {!latestApp
                  ? 'Belum Ada Pendaftaran'
                  : latestApp.status === 'accepted'
                  ? 'Selamat! Pendaftaran Anda Diterima'
                  : latestApp.status === 'rejected'
                  ? 'Mohon Maaf, Pendaftaran Anda Belum Diterima'
                  : latestApp.status === 'pending'
                  ? 'Pendaftaran Anda Sedang Menunggu Diproses'
                  : 'Pendaftaran Anda Sedang Ditinjau'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {!latestApp
                  ? 'Silakan lengkapi formulir pendaftaran untuk mengajukan magang pada periode yang tersedia.'
                  : latestApp.status === 'accepted'
                  ? 'Selamat bergabung! Silakan tunggu informasi lebih lanjut mengenai jadwal onboarding magang Anda.'
                  : latestApp.status === 'rejected'
                  ? 'Terima kasih atas partisipasi Anda. Anda dapat mendaftar kembali pada periode berikutnya.'
                  : 'Terima kasih telah mendaftar program magang di Diskominfosan Kota Yogyakarta. Saat ini pendaftaran Anda sedang melalui proses seleksi administrasi.'}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-2 flex flex-wrap items-center justify-between gap-3">
            {latestApp && (
              <span
                className={`inline-block px-3.5 py-1.5 rounded-full text-xs font-bold border ${
                  latestApp.status === 'accepted'
                    ? 'text-emerald-800 bg-emerald-100 border-emerald-300/80'
                    : latestApp.status === 'rejected'
                    ? 'text-rose-800 bg-rose-100 border-rose-300/80'
                    : 'text-amber-800 bg-[#FEF3C7] border-amber-300/80'
                }`}
              >
                Status: {statusLabel(latestApp.status)}
              </span>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            Detail Pendaftaran
          </h3>
          <div className="space-y-3 text-xs sm:text-sm">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-medium">No. Pendaftaran</span>
              <span className="font-extrabold text-[#1f877c] font-mono text-sm">
                {latestApp?.registrationNumber || '-'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-medium">Tanggal Daftar</span>
              <span className="font-bold text-slate-800">
                {formatDate(latestApp?.submittedAt) || '-'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-medium">Tipe Pendaftaran</span>
              <span className="font-bold text-slate-800">
                {latestApp?.registrationType || '-'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-medium">Bidang</span>
              <span className="font-bold text-slate-800">
                {latestApp?.fieldName || '-'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-medium">Kategori</span>
              <span className="font-bold text-slate-800">
                {latestApp?.kategoriName || '-'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tahapan Seleksi */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
        <h3 className="text-base font-bold text-slate-900">Tahapan Seleksi</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative">
          {getStages(latestApp).map((stage) => {
            const circleClass =
              stage.state === 'done'
                ? 'bg-[#10B981] text-white'
                : stage.state === 'active'
                ? 'bg-[#1f877c] text-white'
                : stage.state === 'rejected'
                ? 'bg-rose-500 text-white'
                : 'bg-slate-200 text-slate-600';

            const wrapperClass = stage.state === 'pending' ? 'opacity-60' : '';

            return (
              <div key={stage.num} className={`flex flex-col items-center text-center ${wrapperClass}`}>
                <div className={`w-9 h-9 rounded-full font-bold text-xs flex items-center justify-center ${circleClass}`}>
                  {stage.num}
                </div>
                <span className="text-xs font-bold text-slate-900 mt-2 block">{stage.label}</span>
                <span
                  className={`text-[11px] mt-0.5 ${
                    stage.state === 'active'
                      ? 'font-bold text-[#1f877c]'
                      : stage.state === 'rejected'
                      ? 'font-bold text-rose-600'
                      : 'text-slate-400'
                  }`}
                >
                  {stage.dateLabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Riwayat & Quick Action */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Riwayat Pendaftaran</h3>
            {onGoToPendaftaran && (
              <button
                type="button"
                onClick={onGoToPendaftaran}
                className="text-xs font-bold text-[#1f877c] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">add_circle</span>
                <span>Daftar Baru</span>
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-2">No. Registrasi</th>
                  <th className="py-3 px-2">Tanggal Daftar</th>
                  <th className="py-3 px-2">Bidang</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {applications && applications.length > 0 ? (
                  applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-2 font-mono font-bold text-[#1f877c]">{app.registrationNumber}</td>
                      <td className="py-3.5 px-2">{formatDateShort(app.submittedAt) || '-'}</td>
                      <td className="py-3.5 px-2 font-medium">{app.fieldName || '-'}</td>
                      <td className="py-3.5 px-2">
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-bold border inline-block ${
                            app.status === 'accepted'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : app.status === 'rejected'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-[#FEF3C7] text-amber-800 border-amber-300/70'
                          }`}
                        >
                          {statusLabel(app.status)}
                        </span>
                      </td>
                      <td className="py-3.5 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedApp(app);
                            setShowDetailModal(true);
                          }}
                          className="p-1.5 rounded-lg border border-slate-200 hover:border-[#1f877c] text-[#1f877c] hover:bg-[#E6F7F3] transition-colors cursor-pointer"
                          title="Lihat Detail Pendaftaran"
                        >
                          <span className="material-symbols-outlined text-lg">visibility</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 px-2 text-center text-slate-400">
                      Belum ada riwayat pendaftaran dari API.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Quick Action</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setShowBuktiModal(true)}
              disabled={!latestApp}
              className="p-4 rounded-xl bg-[#E6F7F3]/60 hover:bg-[#E6F7F3] disabled:opacity-40 disabled:cursor-not-allowed border border-emerald-100 text-slate-800 flex flex-col items-center justify-center text-center gap-2 transition-all cursor-pointer group shadow-2xs"
            >
              <div className="w-10 h-10 rounded-xl bg-white text-[#1f877c] flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-xl">download</span>
              </div>
              <span className="text-xs font-bold leading-tight">Cetak Bukti Pendaftaran</span>
            </button>

            <button
              type="button"
              onClick={() => setShowBerkasModal(true)}
              disabled={!latestApp}
              className="p-4 rounded-xl bg-[#E6F7F3]/60 hover:bg-[#E6F7F3] disabled:opacity-40 disabled:cursor-not-allowed border border-emerald-100 text-slate-800 flex flex-col items-center justify-center text-center gap-2 transition-all cursor-pointer group shadow-2xs"
            >
              <div className="w-10 h-10 rounded-xl bg-white text-[#1f877c] flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-xl">folder</span>
              </div>
              <span className="text-xs font-bold leading-tight">Lihat Berkas Saya</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showBuktiModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Bukti Pendaftaran Magang</h3>
              <span className="font-mono text-xs font-bold text-[#1f877c] bg-[#E6F7F3] px-2.5 py-1 rounded-lg">
                {latestApp?.id || '-'}
              </span>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Nama Pendaftar:</span>
                <span className="font-bold text-slate-800">{latestApp?.applicantName || user.name || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Instansi / Universitas:</span>
                <span className="font-bold text-slate-800">{latestApp?.institution || user.institution || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Bidang Penempatan:</span>
                <span className="font-bold text-slate-800">{latestApp?.fieldName || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Kategori:</span>
                <span className="font-bold text-slate-800">{latestApp?.kategoriName || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tanggal Pengajuan:</span>
                <span className="font-bold text-slate-800">{formatDate(latestApp?.submittedAt) || '-'}</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Dokumen ini merupakan bukti resmi pengajuan pendaftaran program magang DISKOMINFOSAN Kota Yogyakarta
              {latestApp?.periode ? ` Periode ${latestApp.periode}` : ''}.
            </p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowBuktiModal(false)} className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer">Tutup</button>
              <button onClick={() => { window.print(); setShowBuktiModal(false); }} className="px-4 py-2 bg-[#1f877c] hover:bg-[#196e65] text-white rounded-xl text-xs font-bold cursor-pointer">Cetak Dokumen</button>
            </div>
          </div>
        </div>
      )}

      {showBerkasModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">Berkas Lampiran Pendaftaran</h3>
            <ul className="text-xs space-y-2">
              {latestApp?.documents && latestApp.documents.length > 0 ? (
                latestApp.documents.map((doc) => {
                  const fileUrl = resolveStorageUrl(doc.filePath);
                  return (
                    <li key={doc.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <span className="font-medium text-slate-800 block truncate">{doc.documentType}</span>
                        <span className="text-[10px] text-slate-400 block truncate">{doc.originalName}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-emerald-700 font-bold text-[11px] bg-emerald-50 px-2 py-0.5 rounded">
                          {doc.status === 'uploaded' ? 'Terunggah' : doc.status}
                        </span>
                        {fileUrl && (
                          <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg border border-slate-200 hover:border-[#1f877c] text-[#1f877c] hover:bg-[#E6F7F3] cursor-pointer"
                            title="Lihat Berkas"
                          >
                            <span className="material-symbols-outlined text-base block">visibility</span>
                          </a>
                        )}
                      </div>
                    </li>
                  );
                })
              ) : (
                <li className="p-4 text-center text-slate-400 text-xs">Belum ada berkas yang diunggah.</li>
              )}
            </ul>
            <div className="flex justify-end">
              <button onClick={() => setShowBerkasModal(false)} className="px-4 py-2 bg-[#1f877c] text-white rounded-xl text-xs font-bold cursor-pointer">Tutup</button>
            </div>
          </div>
        </div>
      )}

      {showDetailModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">Detail Pendaftaran</h3>
            <div className="space-y-2 text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <strong>No. Pendaftaran:</strong>{' '}
                <span className="font-mono text-[#1f877c] font-bold">{selectedApp?.registrationNumber || '-'}</span>
              </div>
              <div><strong>Bidang:</strong> {selectedApp?.fieldName || '-'}</div>
              <div>
                <strong>Status:</strong>{' '}
                <span
                  className={`font-bold ${
                    selectedApp?.status === 'accepted'
                      ? 'text-emerald-700'
                      : selectedApp?.status === 'rejected'
                      ? 'text-rose-600'
                      : 'text-amber-700'
                  }`}
                >
                  {statusLabel(selectedApp?.status)}
                </span>
              </div>
              <div>
                <strong>Tanggal Daftar:</strong> {formatDate(selectedApp?.submittedAt) || '-'}
              </div>
              <div><strong>Instansi:</strong> {selectedApp?.institution || '-'}</div>
              <div>
                <strong>Catatan Verifikator:</strong> {selectedApp?.notes || 'Belum ada catatan dari verifikator.'}
              </div>
            </div>
            <div className="flex justify-end">
              <button onClick={() => setShowDetailModal(false)} className="px-4 py-2 bg-[#1f877c] text-white rounded-xl text-xs font-bold cursor-pointer">Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}