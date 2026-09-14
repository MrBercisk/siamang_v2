import { useState } from 'react';
import { User } from '../../types/auth';
import { ApplicationStatus } from '../../types/internship';
import { RiwayatMagangView } from '../../components/pendaftar/RiwayatMagangView';
import { ProfileView } from '../../components/pendaftar/ProfileView';
import { PendaftaranFormView } from '../../components/pendaftar/pendaftaran/PendaftaranFormView';
import { ReviewHeader } from '../../components/pendaftar/layout/ReviewHeader';
import { ReviewSidebar, ReviewTab, PendaftaranLockReason } from '../../components/pendaftar/layout/ReviewSidebar';
import { HelpChatWidget } from '../../components/pendaftar/layout/HelpChatWidget';
import { ReviewDashboardTab } from '../../components/pendaftar/tabs/ReviewDashboardTab';
import { showWarningAlert } from '../../utils/swal';

interface PendaftarReviewDashboardProps {
  user: User;
  applications: ApplicationStatus[];
  onNavigate: (page: 'home' | 'info' | 'register' | 'login' | 'dashboard') => void;
  onLogout?: () => void;
}

// Menentukan boleh/tidaknya user membuka form pendaftaran baru berdasarkan
// status aplikasi terakhirnya:
// - 'reviewing'       : aplikasi terakhir masih pending/reviewing, tunggu hasil.
// - 'accepted-ongoing': aplikasi terakhir accepted & periode magangnya belum lewat.
// - locked: false     : belum pernah mendaftar, ditolak, atau accepted tapi
//                        periode magangnya sudah selesai — boleh daftar lagi.
function computePendaftaranLock(applications: ApplicationStatus[]): PendaftaranLockReason {
  if (applications.length === 0) return { locked: false };

  const latest = [...applications].sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  )[0];

  if (latest.status === 'pending' || latest.status === 'reviewing') {
    return {
      locked: true,
      reason: 'reviewing',
      registrationNumber: (latest as any).registrationNumber,
    };
  }

  if (latest.status === 'accepted') {
    const internshipEnd = latest.endDate ? new Date(latest.endDate) : null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const stillOngoing = !internshipEnd || internshipEnd >= today;

    if (stillOngoing) {
      return {
        locked: true,
        reason: 'accepted-ongoing',
        registrationNumber: (latest as any).registrationNumber,
        internshipEnd: latest.endDate,
      };
    }
  }

  return { locked: false };
}

export function PendaftarReviewDashboard({
  user,
  applications = [],
  onNavigate,
  onLogout,
}: PendaftarReviewDashboardProps) {
  const [activeTab, setActiveTab] = useState<ReviewTab>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentApplications, setCurrentApplications] =
    useState<ApplicationStatus[]>(applications);

  const pendaftaranLock = computePendaftaranLock(currentApplications);

  const handleLogout = () => {
    if (onLogout) onLogout();
    else onNavigate('home');
  };

  // Dipakai baik oleh ReviewSidebar maupun tombol "Daftar Magang" di
  // ReviewDashboardTab — satu sumber kebenaran untuk gating akses ke step
  // pendaftaran, supaya tidak ada jalur lain yang bisa melewatinya.
  const handleGoToPendaftaran = () => {
    if (pendaftaranLock.locked) {
      if (pendaftaranLock.reason === 'reviewing') {
        showWarningAlert(
          'Pendaftaran Sedang Diproses',
          `Anda sudah memiliki pendaftaran magang${
            pendaftaranLock.registrationNumber ? ` (${pendaftaranLock.registrationNumber})` : ''
          } yang masih menunggu proses peninjauan oleh verifikator. Mohon tunggu hasilnya terlebih dahulu sebelum mendaftar kembali.`
        );
      } else {
        showWarningAlert(
          'Sedang Menjalani Program Magang',
          `Pendaftaran magang Anda${
            pendaftaranLock.registrationNumber ? ` (${pendaftaranLock.registrationNumber})` : ''
          } telah diterima dan program magang Anda masih berlangsung${
            pendaftaranLock.internshipEnd ? ` hingga ${pendaftaranLock.internshipEnd}` : ''
          }. Anda dapat mendaftar kembali setelah periode magang ini selesai.`
        );
      }
      return;
    }

    setActiveTab('pendaftaran');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-800">
      <ReviewHeader
        user={user}
        onGoToProfile={() => setActiveTab('profile')}
        onNavigateHome={() => onNavigate('home')}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex relative">
        <ReviewSidebar
          activeTab={activeTab}
          onChangeTab={(tab) => {
            // Tab lain (dashboard, riwayat, profile) tetap bebas diakses —
            // hanya tab 'pendaftaran' yang perlu lewat gating.
            if (tab === 'pendaftaran') {
              handleGoToPendaftaran();
              return;
            }
            setActiveTab(tab);
          }}
          collapsed={sidebarCollapsed}
          onToggleCollapsed={() => setSidebarCollapsed(!sidebarCollapsed)}
          onLogout={handleLogout}
          pendaftaranLock={pendaftaranLock}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-x-hidden">
          {activeTab === 'dashboard' && (
            <ReviewDashboardTab
              user={user}
              applications={currentApplications}
              onGoToPendaftaran={handleGoToPendaftaran}
            />
          )}
          {activeTab === 'pendaftaran' && !pendaftaranLock.locked && (
            <PendaftaranFormView
              user={user}
              onSuccessSubmit={(result) => {
                setCurrentApplications((prev) => [result, ...prev]);
                setActiveTab('dashboard');
              }}
            />
          )}
          {activeTab === 'riwayat' && (
            <RiwayatMagangView applications={currentApplications} />
          )}
          {activeTab === 'profile' && <ProfileView user={user} />}
        </main>
      </div>

      <HelpChatWidget />
    </div>
  );
}