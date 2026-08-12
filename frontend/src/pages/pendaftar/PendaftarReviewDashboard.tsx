import { useState } from 'react';
import { User } from '../../types/auth';
import { ApplicationStatus } from '../../types/internship';
import { RiwayatMagangView } from '../../components/pendaftar/RiwayatMagangView';
import { ProfileView } from '../../components/pendaftar/ProfileView';
import { PendaftaranFormView } from '../../components/pendaftar/PendaftaranFormView';
import { ReviewHeader } from '../../components/pendaftar/layout/ReviewHeader';
import { ReviewSidebar, ReviewTab } from '../../components/pendaftar/layout/ReviewSidebar';
import { HelpChatWidget } from '../../components/pendaftar/layout/HelpChatWidget';
import { ReviewDashboardTab } from '../../components/pendaftar/tabs/ReviewDashboardTab';

interface PendaftarReviewDashboardProps {
  user: User;
  applications: ApplicationStatus[];
  onNavigate: (page: 'home' | 'info' | 'register' | 'login' | 'dashboard') => void;
  onLogout?: () => void;
  onSwitchToAccepted?: () => void;
}

export function PendaftarReviewDashboard({
  user,
  onNavigate,
  onLogout,
  onSwitchToAccepted,
}: PendaftarReviewDashboardProps) {
  const [activeTab, setActiveTab] = useState<ReviewTab>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogout = () => {
    if (onLogout) onLogout();
    else onNavigate('home');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-800">
      <ReviewHeader
        user={user}
        onGoToProfile={() => setActiveTab('profile')}
        onNavigateHome={() => onNavigate('home')}
        onLogout={handleLogout}
        onSwitchToAccepted={onSwitchToAccepted}
      />

      <div className="flex-1 flex relative">
        <ReviewSidebar
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          collapsed={sidebarCollapsed}
          onToggleCollapsed={() => setSidebarCollapsed(!sidebarCollapsed)}
          onLogout={handleLogout}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-x-hidden">
          {activeTab === 'dashboard' && (
            <ReviewDashboardTab user={user} onSwitchToAccepted={onSwitchToAccepted} />
          )}
          {activeTab === 'pendaftaran' && <PendaftaranFormView user={user} />}
          {activeTab === 'riwayat' && <RiwayatMagangView />}
          {activeTab === 'profile' && <ProfileView user={user} />}
        </main>
      </div>

      <HelpChatWidget />
    </div>
  );
}