import { useState } from 'react';
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

import { useAuth } from './hooks/useAuth';
import { useInternshipData } from './hooks/useInternshipData';

type PageType = 'home' | 'info' | 'register' | 'login' | 'dashboard' | 'forgot-password' | 'reset-password';

export function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  
  const { user, isLoading: authLoading, login, register, logout } = useAuth();
  const { categories, schedules, requirements, applications, submitApplication } = useInternshipData();

  const handleNavigate = (page: PageType) => {
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

  const isDashboard = currentPage === 'dashboard';

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
      {!isDashboard && (
        <AnnouncementBar message="Program magang periode kedua akan dibuka pada tanggal 5 Mei 2026" />
      )}

      {/* Main Header Nav (Hidden in Dashboard) */}
      {!isDashboard && (
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
          />
        )}

        {currentPage === 'login' && (
          <LoginPage
            onLogin={handleLoginSuccess}
            onNavigateRegister={() => handleNavigate('register')}
            onNavigateForgotPassword={() => handleNavigate('forgot-password')}
            onNavigateHome={() => handleNavigate('home')}
            isLoading={authLoading}
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

      {/* Footer (Hidden in Dashboard) */}
      {!isDashboard && <Footer onNavigate={(page) => handleNavigate(page)} />}

      {/* Floating Scroll To Top Button (Hidden in Dashboard) */}
      {!isDashboard && <ScrollToTop />}
    </div>
  );
}

export default App;
