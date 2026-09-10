import { User } from '../types/auth';
import { ApplicationStatus } from '../types/internship';
import { PageType } from '../types/navigation';
import { PendaftarDashboardSwitcher } from './pendaftar/PendaftarDashboardSwitcher';
import { MentorDashboardPage } from './mentor/MentorDashboardPage';
import { AdminDashboardPage } from './admin/AdminDashboardPage';

interface DashboardPageProps {
  user: User;
  applications: ApplicationStatus[];
  onNavigate: (page: PageType) => void;
  onLogout?: () => void;
}

export function DashboardPage({ user, applications, onNavigate, onLogout }: DashboardPageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {user.role === 'admin' ? (
        <AdminDashboardPage
          user={user}
          onNavigate={onNavigate}
          onLogout={onLogout}
        />
      ) : user.role === 'mentor' ? (
        <MentorDashboardPage
          user={user}
          onNavigate={onNavigate}
          onLogout={onLogout}
        />
      ) : (
        <PendaftarDashboardSwitcher
          user={user}
          applications={applications}
          onNavigate={onNavigate}
          onLogout={onLogout}
        />
      )}
    </div>
  );
}
