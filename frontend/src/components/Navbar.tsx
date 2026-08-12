import { useState, useEffect } from 'react';
import { User } from '../types/auth';

interface NavbarProps {
  currentPage: 'home' | 'info' | 'register' | 'login' | 'dashboard';
  onNavigate: (page: 'home' | 'info' | 'register' | 'login' | 'dashboard') => void;
  user: User | null;
  onLogout: () => void;
}

export function Navbar({ currentPage, onNavigate, user, onLogout }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 25) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isDarkHeroPage = currentPage === 'home';

  return (
    <>
      {/* Dynamic Header Wrapper (Normal Flow at top, Floating Capsule when scrolled) */}
      <div
        className={`transition-all duration-300 ease-in-out z-40 ${
          isScrolled
            ? 'fixed top-3 sm:top-4 left-0 right-0 z-50 pointer-events-none'
            : 'relative w-full'
        }`}
      >
        <header
          className={`transition-all duration-300 ease-in-out ${
            isScrolled
              ? `pointer-events-auto mx-auto w-[92%] sm:w-[95%] max-w-6xl bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-xl px-4 sm:px-6 py-2.5 ${
                  mobileMenuOpen ? 'rounded-2xl sm:rounded-3xl' : 'rounded-full'
                }`
              : `w-full px-4 md:px-8 py-3.5 sm:py-4 ${
                  isDarkHeroPage
                    ? 'bg-[#1f877c] text-white'
                    : 'bg-white text-slate-800 border-b border-slate-100 shadow-xs'
                }`
          }`}
        >
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            {/* Brand Logo */}
            <div
              onClick={() => onNavigate('home')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-extrabold text-sm sm:text-base transition-all duration-300 shadow-xs ${
                  isScrolled
                    ? 'bg-[#005c55] text-white group-hover:bg-[#0f766e]'
                    : isDarkHeroPage
                    ? 'bg-white text-[#005c55] group-hover:bg-slate-100'
                    : 'bg-[#005c55] text-white group-hover:bg-[#0f766e]'
                }`}
              >
                <span className="material-symbols-outlined text-lg sm:text-xl">
                  shield_with_house
                </span>
              </div>
              <div>
                <span
                  className={`font-extrabold text-base sm:text-lg tracking-tight block leading-none transition-colors ${
                    isScrolled
                      ? 'text-[#005c55]'
                      : isDarkHeroPage
                      ? 'text-white'
                      : 'text-[#005c55]'
                  }`}
                >
                  SI AMANG
                </span>
                <span
                  className={`text-[10px] font-medium block mt-0.5 transition-colors ${
                    isScrolled
                      ? 'text-slate-500'
                      : isDarkHeroPage
                      ? 'text-white/80'
                      : 'text-slate-500'
                  }`}
                >
                  DISKOMINFOSAN Jogja
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 text-sm font-semibold">
              <button
                onClick={() => onNavigate('home')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full transition-all cursor-pointer ${
                  currentPage === 'home'
                    ? isScrolled
                      ? 'bg-[#005c55]/10 text-[#005c55] font-bold'
                      : isDarkHeroPage
                      ? 'bg-white/20 text-white font-bold'
                      : 'bg-[#005c55]/10 text-[#005c55] font-bold'
                    : isScrolled
                    ? 'text-slate-600 hover:text-[#005c55] hover:bg-slate-100/70'
                    : isDarkHeroPage
                    ? 'text-white/80 hover:text-white hover:bg-white/10'
                    : 'text-slate-600 hover:text-[#005c55] hover:bg-slate-100/70'
                }`}
              >
                <span className="material-symbols-outlined text-lg">home</span>
                <span>Beranda</span>
              </button>

              <button
                onClick={() => onNavigate('info')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full transition-all cursor-pointer ${
                  currentPage === 'info'
                    ? isScrolled
                      ? 'bg-[#005c55]/10 text-[#005c55] font-bold'
                      : isDarkHeroPage
                      ? 'bg-white/20 text-white font-bold'
                      : 'bg-[#005c55]/10 text-[#005c55] font-bold'
                    : isScrolled
                    ? 'text-slate-600 hover:text-[#005c55] hover:bg-slate-100/70'
                    : isDarkHeroPage
                    ? 'text-white/80 hover:text-white hover:bg-white/10'
                    : 'text-slate-600 hover:text-[#005c55] hover:bg-slate-100/70'
                }`}
              >
                <span>Informasi Magang</span>
              </button>

              {user && (
                <button
                  onClick={() => onNavigate('dashboard')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full transition-all cursor-pointer ${
                    currentPage === 'dashboard'
                      ? isScrolled
                        ? 'bg-[#005c55]/10 text-[#005c55] font-bold'
                        : isDarkHeroPage
                        ? 'bg-white/20 text-white font-bold'
                        : 'bg-[#005c55]/10 text-[#005c55] font-bold'
                      : isScrolled
                      ? 'text-slate-600 hover:text-[#005c55] hover:bg-slate-100/70'
                      : isDarkHeroPage
                      ? 'text-white/80 hover:text-white hover:bg-white/10'
                      : 'text-slate-600 hover:text-[#005c55] hover:bg-slate-100/70'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">dashboard</span>
                  <span>Dashboard Saya</span>
                </button>
              )}
            </nav>

            {/* Right Action Button */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span
                      className={`block text-xs font-bold ${
                        isScrolled
                          ? 'text-slate-800'
                          : isDarkHeroPage
                          ? 'text-white'
                          : 'text-slate-800'
                      }`}
                    >
                      {user.name}
                    </span>
                    <span
                      className={`block text-[10px] truncate max-w-[120px] ${
                        isScrolled
                          ? 'text-slate-500'
                          : isDarkHeroPage
                          ? 'text-white/70'
                          : 'text-slate-500'
                      }`}
                    >
                      {user.institution || user.email}
                    </span>
                  </div>
                  <button
                    onClick={onLogout}
                    className={`text-xs px-3.5 py-2 rounded-full transition-all font-semibold cursor-pointer border ${
                      isScrolled
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                        : isDarkHeroPage
                        ? 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                    }`}
                  >
                    Keluar
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigate('login')}
                    className={`text-xs font-semibold px-4 py-2 rounded-full transition-colors cursor-pointer ${
                      isScrolled
                        ? 'text-[#005c55] hover:bg-[#005c55]/10'
                        : isDarkHeroPage
                        ? 'text-white hover:bg-white/10'
                        : 'text-[#005c55] hover:bg-[#005c55]/10'
                    }`}
                  >
                    Masuk
                  </button>
                  <button
                    onClick={() => onNavigate('register')}
                    className={`font-semibold text-xs px-5 py-2.5 rounded-full transition-all cursor-pointer active:scale-95 shadow-md ${
                      isScrolled
                        ? 'bg-[#005c55] text-white hover:bg-[#0f766e]'
                        : isDarkHeroPage
                        ? 'bg-white text-[#005c55] hover:bg-slate-100 font-bold'
                        : 'bg-[#005c55] text-white hover:bg-[#0f766e]'
                    }`}
                  >
                    Daftar Sekarang
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-full focus:outline-none transition-colors ${
                isScrolled
                  ? 'text-slate-700 hover:bg-slate-100'
                  : isDarkHeroPage
                  ? 'text-white hover:bg-white/10'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
              aria-label="Toggle menu"
            >
              <span className="material-symbols-outlined text-2xl">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>

          {/* Mobile Dropdown Menu */}
          {mobileMenuOpen && (
            <div className={`md:hidden mt-3 pt-3 border-t space-y-2 animate-in slide-in-from-top-2 ${
              isDarkHeroPage && !isScrolled ? 'border-white/20' : 'border-slate-200/80'
            }`}>
              <button
                onClick={() => {
                  onNavigate('home');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  currentPage === 'home'
                    ? isDarkHeroPage && !isScrolled
                      ? 'bg-white/20 text-white font-bold'
                      : 'bg-[#005c55]/10 text-[#005c55] font-bold'
                    : isDarkHeroPage && !isScrolled
                    ? 'text-white/90 hover:bg-white/10'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                Beranda
              </button>
              <button
                onClick={() => {
                  onNavigate('info');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  currentPage === 'info'
                    ? isDarkHeroPage && !isScrolled
                      ? 'bg-white/20 text-white font-bold'
                      : 'bg-[#005c55]/10 text-[#005c55] font-bold'
                    : isDarkHeroPage && !isScrolled
                    ? 'text-white/90 hover:bg-white/10'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                Informasi Magang
              </button>
              {user && (
                <button
                  onClick={() => {
                    onNavigate('dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    currentPage === 'dashboard'
                      ? isDarkHeroPage && !isScrolled
                        ? 'bg-white/20 text-white font-bold'
                        : 'bg-[#005c55]/10 text-[#005c55] font-bold'
                      : isDarkHeroPage && !isScrolled
                      ? 'text-white/90 hover:bg-white/10'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Dashboard Magang Saya
                </button>
              )}

              <div className={`pt-2 border-t ${
                isDarkHeroPage && !isScrolled ? 'border-white/20' : 'border-slate-100'
              } flex flex-col gap-2`}>
                {user ? (
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <p className={`text-xs font-bold ${isDarkHeroPage && !isScrolled ? 'text-white' : 'text-slate-800'}`}>
                        {user.name}
                      </p>
                      <p className={`text-[11px] ${isDarkHeroPage && !isScrolled ? 'text-white/70' : 'text-slate-500'}`}>
                        {user.email}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        onLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="text-xs bg-rose-50 text-rose-600 px-3 py-1.5 rounded-lg font-medium cursor-pointer"
                    >
                      Keluar
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => {
                        onNavigate('login');
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full text-center py-2 text-xs font-semibold rounded-full cursor-pointer transition-colors ${
                        isDarkHeroPage && !isScrolled
                          ? 'bg-white/15 text-white hover:bg-white/25'
                          : 'bg-slate-100 text-[#005c55] hover:bg-slate-200'
                      }`}
                    >
                      Masuk
                    </button>
                    <button
                      onClick={() => {
                        onNavigate('register');
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full text-center py-2 text-xs font-bold rounded-full cursor-pointer shadow-xs transition-colors ${
                        isDarkHeroPage && !isScrolled
                          ? 'bg-white text-[#005c55] hover:bg-slate-100'
                          : 'bg-[#005c55] text-white hover:bg-[#0f766e]'
                      }`}
                    >
                      Daftar Sekarang
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </header>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white/95 backdrop-blur-md border-t border-slate-200 flex justify-around items-center h-16 z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center w-full h-full ${
            currentPage === 'home' ? 'text-[#005c55]' : 'text-slate-500 hover:text-[#005c55]'
          }`}
        >
          <span className={`material-symbols-outlined text-xl ${currentPage === 'home' ? 'fill-1' : ''}`}>
            home
          </span>
          <span className="text-[10px] font-medium mt-0.5">Home</span>
        </button>

        <button
          onClick={() => onNavigate('info')}
          className={`flex flex-col items-center justify-center w-full h-full ${
            currentPage === 'info' ? 'text-[#005c55]' : 'text-slate-500 hover:text-[#005c55]'
          }`}
        >
          <span className={`material-symbols-outlined text-xl ${currentPage === 'info' ? 'fill-1' : ''}`}>
            info
          </span>
          <span className="text-[10px] font-medium mt-0.5">Informasi</span>
        </button>

        {user ? (
          <button
            onClick={() => onNavigate('dashboard')}
            className={`flex flex-col items-center justify-center w-full h-full ${
              currentPage === 'dashboard' ? 'text-[#005c55]' : 'text-slate-500 hover:text-[#005c55]'
            }`}
          >
            <span className={`material-symbols-outlined text-xl ${currentPage === 'dashboard' ? 'fill-1' : ''}`}>
              dashboard
            </span>
            <span className="text-[10px] font-medium mt-0.5">Status</span>
          </button>
        ) : (
          <button
            onClick={() => onNavigate('register')}
            className={`flex flex-col items-center justify-center w-full h-full ${
              currentPage === 'register' ? 'text-[#005c55]' : 'text-slate-500 hover:text-[#005c55]'
            }`}
          >
            <span className={`material-symbols-outlined text-xl ${currentPage === 'register' ? 'fill-1' : ''}`}>
              app_registration
            </span>
            <span className="text-[10px] font-medium mt-0.5">Daftar</span>
          </button>
        )}
      </nav>
    </>
  );
}

