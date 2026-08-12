import { useState } from 'react';
import { User } from '../../types/auth';
import { JadwalBimbinganAdminView } from '../../components/admin/JadwalBimbinganAdminView';
import { BidangAdminView } from '../../components/admin/BidangAdminView';
import { KategoriAdminView } from '../../components/admin/KategoriAdminView';
import { MentorAdminView } from '../../components/admin/MentorAdminView';
import { PendaftarAdminView } from '../../components/admin/PendaftarAdminView';
import { PeriodeAdminView } from '../../components/admin/PeriodeAdminView';
import { AdminHeader } from '../../components/admin/layout/AdminHeader';
import { AdminSidebar, AdminTab } from '../../components/admin/layout/AdminSidebar';
import { AdminDashboardTab } from '../../components/admin/tabs/AdminDashboardTab';
import { BimbinganSettingsTab } from '../../components/admin/tabs/BimbinganSettingsTab';

interface AdminDashboardPageProps {
  user: User;
  onNavigate: (page: 'home' | 'info' | 'register' | 'login' | 'dashboard') => void;
  onLogout?: () => void;
}

export function AdminDashboardPage({
  user,
  onNavigate,
  onLogout,
}: AdminDashboardPageProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogout = () => {
    if (onLogout) onLogout();
    else onNavigate('home');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-800">
      <AdminHeader onNavigateHome={() => onNavigate('home')} onLogout={handleLogout} />

      <div className="flex-1 flex relative">
        <AdminSidebar
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          collapsed={sidebarCollapsed}
          onToggleCollapsed={() => setSidebarCollapsed(!sidebarCollapsed)}
          onLogout={handleLogout}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-x-hidden">
          {activeTab === 'dashboard' && <AdminDashboardTab />}
          {activeTab === 'bidang' && <BidangAdminView />}
          {activeTab === 'kategori' && <KategoriAdminView />}
          {activeTab === 'mentor' && <MentorAdminView />}
          {activeTab === 'pendaftar' && <PendaftarAdminView />}
          {activeTab === 'jadwal' && <JadwalBimbinganAdminView />}
          {activeTab === 'bimbingan' && <BimbinganSettingsTab />}
          {activeTab === 'periode' && <PeriodeAdminView />}
        </main>
      </div>
    </div>
  );
}