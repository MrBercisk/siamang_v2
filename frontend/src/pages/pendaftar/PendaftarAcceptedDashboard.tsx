import { useState } from 'react';
import { User } from '../../types/auth';
import { RiwayatMagangView } from '../../components/pendaftar/RiwayatMagangView';
import { ProfileView } from '../../components/pendaftar/ProfileView';
import { ProgressMagangPesertaView } from '../../components/pendaftar/ProgressMagangPesertaView';
import { LaporanMagangPesertaView } from '../../components/pendaftar/LaporanMagangPesertaView';
import { NilaiMagangPesertaView } from '../../components/pendaftar/NilaiMagangPesertaView';
import { AcceptedHeader } from '../../components/pendaftar/layout/AcceptedHeader';
import { AcceptedSidebar, AcceptedTab } from '../../components/pendaftar/layout/AcceptedSidebar';
import { AcceptedDashboardTab } from '../../components/pendaftar/tabs/AcceptedDashboardTab';
import { ForumDiskusiPesertaTab } from '../../components/pendaftar/tabs/ForumDiskusiPesertaTab';

interface PendaftarAcceptedDashboardProps {
  user: User;
  onNavigate: (page: 'home' | 'info' | 'register' | 'login' | 'dashboard') => void;
  onLogout?: () => void;
  onSwitchToReview?: () => void;
}

export function PendaftarAcceptedDashboard({
  user,
  onNavigate,
  onLogout,
  onSwitchToReview,
}: PendaftarAcceptedDashboardProps) {
  const [activeTab, setActiveTab] = useState<AcceptedTab>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogout = () => {
    if (onLogout) onLogout();
    else onNavigate('home');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-800">
      <AcceptedHeader
        user={user}
        onGoToProfile={() => setActiveTab('profile')}
        onNavigateHome={() => onNavigate('home')}
        onLogout={handleLogout}
        onSwitchToReview={onSwitchToReview}
      />

      <div className="flex-1 flex relative">
        <AcceptedSidebar
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          collapsed={sidebarCollapsed}
          onToggleCollapsed={() => setSidebarCollapsed(!sidebarCollapsed)}
          onLogout={handleLogout}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-x-hidden">
          {activeTab === 'dashboard' && <AcceptedDashboardTab />}
          {activeTab === 'progress' && <ProgressMagangPesertaView />}
          {activeTab === 'forum' && <ForumDiskusiPesertaTab user={user} />}
          {activeTab === 'laporan' && <LaporanMagangPesertaView />}
          {activeTab === 'nilai' && <NilaiMagangPesertaView user={user} />}
          {activeTab === 'riwayat' && <RiwayatMagangView />}
          {activeTab === 'profile' && <ProfileView user={user} />}
        </main>
      </div>
    </div>
  );
}