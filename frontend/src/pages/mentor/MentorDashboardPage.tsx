import { useState } from 'react';
import { User } from '../../types/auth';
import { MentorHeader } from '../../components/mentor/layout/MentorHeader';
import { MentorSidebar, MentorTab } from '../../components/mentor/layout/MentorSidebar';
import { DashboardTab } from '../../components/mentor/tabs/DashboardTab';
import { ForumDiskusiTab } from '../../components/mentor/tabs/ForumDiskusiTab';
import { PendaftarTab } from '../../components/mentor/tabs/PendaftarTab';
import { BimbinganTab } from '../../components/mentor/tabs/BimbinganTab';

interface MentorDashboardPageProps {
  user: User;
  onNavigate: (page: 'home' | 'info' | 'register' | 'login' | 'dashboard') => void;
  onLogout?: () => void;
}

export function MentorDashboardPage({
  user,
  onNavigate,
  onLogout,
}: MentorDashboardPageProps) {
  const [activeTab, setActiveTab] = useState<MentorTab>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogout = () => {
    if (onLogout) onLogout();
    else onNavigate('home');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-800">
      <MentorHeader user={user} />

      <div className="flex-1 flex relative">
        <MentorSidebar
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          collapsed={sidebarCollapsed}
          onToggleCollapsed={() => setSidebarCollapsed(!sidebarCollapsed)}
          onLogout={handleLogout}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-x-hidden">
          {activeTab === 'dashboard' && <DashboardTab />}
          {activeTab === 'forum' && <ForumDiskusiTab user={user} />}
          {activeTab === 'pendaftar' && <PendaftarTab />}
          {activeTab === 'bimbingan' && <BimbinganTab />}
        </main>
      </div>
    </div>
  );
}