import { User } from '../../types/auth';
import { ApplicationStatus } from '../../types/internship';
import { PendaftarAcceptedDashboard } from './PendaftarAcceptedDashboard';
import { PendaftarReviewDashboard } from './PendaftarReviewDashboard';

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
  const isAccepted = user.role === 'intern' || user.role === 'alumni' || applications.some((application) => application.status === 'accepted');

  return (
    <div>
      {isAccepted ? (
        <PendaftarAcceptedDashboard
          user={user}
          applications={applications}
          onNavigate={onNavigate}
          onLogout={onLogout}
        />
      ) : (
        <PendaftarReviewDashboard
          user={user}
          applications={applications}
          onNavigate={onNavigate}
          onLogout={onLogout}
        />
      )}
    </div>
  );
}