import { useState } from 'react';
import { User } from '../../types/auth';
import { ApplicationStatus } from '../../types/internship';
import { PendaftarReviewDashboard } from './PendaftarReviewDashboard';
import { PendaftarAcceptedDashboard } from './PendaftarAcceptedDashboard';
import { SimulatorSwitcherBar, ApplicantStatus } from '../../components/pendaftar/layout/SimulatorSwitcherBar';

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
  const [applicantStatus, setApplicantStatus] = useState<ApplicantStatus>('review');

  return (
    <div className="relative">
      <SimulatorSwitcherBar status={applicantStatus} onChangeStatus={setApplicantStatus} />

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