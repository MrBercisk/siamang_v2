import { useEffect, useState } from 'react';
import { User } from './types/auth';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';

import { HomePage } from './pages/HomePage';
import { InfoPage } from './pages/InfoPage';
import { RegisterPage } from './pages/RegisterPage';
import { LoginPage } from './pages/LoginPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { ForcedPasswordChangePage } from './pages/ForcedPasswordChangePage';

import { useAuth } from './hooks/useAuth';
import { useInternshipData } from './hooks/useInternshipData';
import { PageType } from './types/navigation';

export function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  
  const { user, isLoading: authLoading, error: authError, login, register, logout, changePassword } = useAuth();
  const { categories, schedules, lowongans, requirements, applications, submitApplication } = useInternshipData(Boolean(user));

  useEffect(() => {
    if (user?.must_change_password && currentPage !== 'force-change-password') {
      setCurrentPage('force-change-password');
    }
  }, [user, currentPage]);

  const handleNavigate = (page: PageType) => {
    // Blokir navigasi ke halaman lain selama password wajib diganti.
    if (user?.must_change_password && page !== 'force-change-password') {
      return;
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegisterSuccess = async (credentials: any) => {
    const success = await register(credentials);
    if (success) {
      setCurrentPage('dashboard');
    }
    return success;
  };

  const handleLoginSuccess = async (credentials: any) => {
    const success = await login(credentials);
    if (success) {
      setCurrentPage('dashboard');
    }
    return success;
  };

  const isForcedPasswordChange = currentPage === 'force-change-password';
  const isDashboard = currentPage === 'dashboard';
  const isFullScreenPage = isDashboard || isForcedPasswordChange;

  // Default fallback user for applicant dashboard preview matching screenshot
  const currentUser: User = user || {
    id: 'usr_leona',
    name: 'Leona Strive',
    email: 'leona@gmail.com',
    institution: 'Universitas Gadjah Mada',
    role: 'applicant',
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f9fb] font-sans antialiased text-[#0F172A] selection:bg-[#005c55] selection:text-white">
      {/* Top Banner Announcement (Hidden in Dashboard) */}
      {!isFullScreenPage  && (
        <AnnouncementBar message="Program magang periode kedua akan dibuka pada tanggal 5 Mei 2026" />
      )}

      {/* Main Header Nav (Hidden in Dashboard) */}
      {!isFullScreenPage  && (
        <Navbar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          user={user}
          onLogout={() => {
            logout();
            setCurrentPage('home');
          }}
        />
      )}

      {/* Main Content Body */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            categories={categories}
            lowongans={lowongans}
            schedules={schedules}
            requirements={requirements}
            applications={applications}
            user={user}
            onNavigate={handleNavigate}
            onSubmitApplication={async (data) => {
              await submitApplication(data);
            }}
          />
        )}

        {currentPage === 'info' && (
          <InfoPage
            categories={categories}
            lowongans={lowongans}
            schedules={schedules}
            requirements={requirements}
            applications={applications}
            user={user}
            onNavigate={handleNavigate}
            onSubmitApplication={async (data) => {
              await submitApplication(data);
            }}
          />
        )}

        {currentPage === 'register' && (
          <RegisterPage
            onRegister={handleRegisterSuccess}
            onNavigateLogin={() => handleNavigate('login')}
            onNavigateHome={() => handleNavigate('home')}
            isLoading={authLoading}
            authError={authError}
          />
        )}

        {currentPage === 'login' && (
          <LoginPage
            onLogin={handleLoginSuccess}
            onNavigateRegister={() => handleNavigate('register')}
            onNavigateForgotPassword={() => handleNavigate('forgot-password')}
            onNavigateHome={() => handleNavigate('home')}
            isLoading={authLoading}
            authError={authError}
          />
        )}

        {currentPage === 'forgot-password' && (
          <ForgotPasswordPage
            onNavigateLogin={() => handleNavigate('login')}
            onNavigateHome={() => handleNavigate('home')}
            onNavigateResetPassword={() => handleNavigate('reset-password')}
          />
        )}

        {currentPage === 'reset-password' && (
          <ResetPasswordPage
            onNavigateLogin={() => handleNavigate('login')}
            onNavigateHome={() => handleNavigate('home')}
          />
        )}
        {currentPage === 'force-change-password' && (
          <ForcedPasswordChangePage
            onChangePassword={changePassword}
            onSuccess={() => setCurrentPage('dashboard')}
            isLoading={authLoading}
          />
        )}

        {currentPage === 'dashboard' && (
          <DashboardPage
            user={currentUser}
            applications={applications}
            onNavigate={handleNavigate}
            onLogout={() => {
              logout();
              setCurrentPage('home');
            }}
          />
        )}
      </main>

      {!isFullScreenPage && <Footer onNavigate={(page) => handleNavigate(page)} />}
      {!isFullScreenPage && <ScrollToTop />}
    </div>
  );
}

export default App;
