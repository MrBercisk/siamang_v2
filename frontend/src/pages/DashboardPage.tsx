import { useState } from 'react';
import { User } from '../types/auth';
import { ApplicationStatus } from '../types/internship';
import { PendaftarDashboardSwitcher } from './pendaftar/PendaftarDashboardSwitcher';
import { MentorDashboardPage } from './mentor/MentorDashboardPage';
import { AdminDashboardPage } from './admin/AdminDashboardPage';

interface DashboardPageProps {
  user: User;
  applications: ApplicationStatus[];
  onNavigate: (page: 'home' | 'info' | 'register' | 'login' | 'dashboard') => void;
  onLogout?: () => void;
}

export function DashboardPage({ user, applications, onNavigate, onLogout }: DashboardPageProps) {
  // Active role view: 'applicant' | 'mentor' | 'admin'
  const [activeRoleView, setActiveRoleView] = useState<'applicant' | 'mentor' | 'admin'>(
    user.role === 'admin' ? 'admin' : user.role === 'mentor' ? 'mentor' : 'applicant'
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Top Role Selector Bar for easy previewing */}
      <div className="bg-slate-900 text-slate-200 px-4 py-1.5 text-xs flex items-center justify-between border-b border-slate-800 z-50">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-xs text-[#10B981]">admin_panel_settings</span>
          <span className="font-medium text-[11px]">Mode Portal SI AMANG:</span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setActiveRoleView('applicant')}
            className={`px-2.5 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
              activeRoleView === 'applicant'
                ? 'bg-[#1f877c] text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Portal Pendaftar Magang
          </button>
          <span className="text-slate-700">|</span>
          <button
            type="button"
            onClick={() => setActiveRoleView('mentor')}
            className={`px-2.5 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
              activeRoleView === 'mentor'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Portal Mentor DISKOMINFOSAN
          </button>
          <span className="text-slate-700">|</span>
          <button
            type="button"
            onClick={() => setActiveRoleView('admin')}
            className={`px-2.5 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
              activeRoleView === 'admin'
                ? 'bg-sky-500 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Portal Admin SI AMANG
          </button>
        </div>
      </div>

      {activeRoleView === 'admin' ? (
        <AdminDashboardPage
          user={{ ...user, role: 'admin', name: 'Admin', email: 'adminsiamang@gmail.com' }}
          onNavigate={onNavigate}
          onLogout={onLogout}
        />
      ) : activeRoleView === 'mentor' ? (
        <MentorDashboardPage
          user={{ ...user, role: 'mentor' }}
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
