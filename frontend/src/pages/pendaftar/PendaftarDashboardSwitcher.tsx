import { useState } from 'react';
import { User } from '../../types/auth';
import { ApplicationStatus } from '../../types/internship';
import { PendaftarReviewDashboard } from './PendaftarReviewDashboard';
import { PendaftarAcceptedDashboard } from './PendaftarAcceptedDashboard';

interface PendaftarDashboardSwitcherProps {
  user: User;
  applications: ApplicationStatus[];
  onNavigate: (page: 'home' | 'info' | 'register' | 'login' | 'dashboard') => void;
  onLogout?: () => void;
}

export function PendaftarDashboardSwitcher({
  user,
  applications,
  onNavigate,
  onLogout,
}: PendaftarDashboardSwitcherProps) {
  // State for applicant status: 'review' (Pendaftaran Sedang Ditinjau) vs 'accepted' (Sudah Diterima & Aktif Magang)
  const [applicantStatus, setApplicantStatus] = useState<'review' | 'accepted'>('review');

  return (
    <div className="relative">
      {/* Top Floating Simulator Switcher Bar so user can toggle between Review and Accepted Layouts */}
      <div className="bg-slate-900 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-md border-b border-slate-700 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-400 text-base">tune</span>
          <span>Simulasi Status Pendaftar:</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setApplicantStatus('review')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              applicantStatus === 'review'
                ? 'bg-amber-400 text-slate-950 shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            1. Dalam Peninjauan (Belum Diterima)
          </button>

          <button
            type="button"
            onClick={() => setApplicantStatus('accepted')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              applicantStatus === 'accepted'
                ? 'bg-[#10B981] text-white shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            2. Sudah Diterima (Aktif Magang)
          </button>
        </div>
      </div>

      {applicantStatus === 'review' ? (
        <PendaftarReviewDashboard
          user={user}
          applications={applications}
          onNavigate={onNavigate}
          onLogout={onLogout}
          onSwitchToAccepted={() => setApplicantStatus('accepted')}
        />
      ) : (
        <PendaftarAcceptedDashboard
          user={user}
          onNavigate={onNavigate}
          onLogout={onLogout}
          onSwitchToReview={() => setApplicantStatus('review')}
        />
      )}
    </div>
  );
}
