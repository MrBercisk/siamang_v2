import { useState, FormEvent } from 'react';
import { LoginCredentials } from '../types/auth';
import { JogjaEmblemLogo } from '../components/JogjaEmblemLogo';

interface LoginPageProps {
  onLogin: (credentials: LoginCredentials) => Promise<boolean>;
  onNavigateRegister: () => void;
  onNavigateForgotPassword: () => void;
  onNavigateHome: () => void;
  isLoading: boolean;
}

export function LoginPage({
  onLogin,
  onNavigateRegister,
  onNavigateForgotPassword,
  onNavigateHome,
  isLoading
}: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email) {
      setErrorMessage('Silakan masukkan alamat email Anda.');
      return;
    }

    const success = await onLogin({ email, password });
    if (!success) {
      setErrorMessage('Gagal masuk. Periksa email dan password Anda.');
    }
  };

  return (
    <div className="bg-[#ECFDF5] text-slate-800 min-h-[calc(100vh-140px)] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto w-full">
        {/* Back to Home Button */}
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-700 font-medium hover:text-[#005c55] transition-colors mb-6 sm:mb-8 cursor-pointer group"
        >
          <span className="material-symbols-outlined text-base sm:text-lg group-hover:-translate-x-1 transition-transform">
            arrow_back
          </span>
          <span>Kembali ke Beranda</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column (5/12) */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
            {/* Logo */}
            <div className="flex items-center gap-3.5">
              <JogjaEmblemLogo className="w-12 h-14 shrink-0 filter drop-shadow-xs" />
              <div>
                <h3 className="text-xl font-extrabold text-[#0F172A] leading-tight">SI AMANG</h3>
                <p className="text-[11px] font-medium text-slate-500 leading-tight mt-0.5">
                  Sistem Informasi Aplikasi Magang<br />DISKOMINFOSAN Kota Yogyakarta
                </p>
              </div>
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1e293b] tracking-tight leading-tight mb-3">
                Lanjutkan perjalanan magangmu bersama <span className="text-[#1f877c]">DISKOMINFOSAN</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Buat akun untuk mendaftar, menemukan peluang magang terbaik, dan memantau progress pendaftaranmu dalam satu platform.
              </p>
            </div>

            {/* Feature List */}
            <div className="pt-2 space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[#D1FAE5] text-[#1f877c] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <span className="material-symbols-outlined text-xl">search</span>
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800">Temukan peluang magang</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Lihat lowongan dan bidang yang tersedia.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[#D1FAE5] text-[#1f877c] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <span className="material-symbols-outlined text-xl">assignment</span>
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800">Daftar mudah dan cepat</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Lengkapi data dan dokumen secara online.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[#D1FAE5] text-[#1f877c] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <span className="material-symbols-outlined text-xl">analytics</span>
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800">Pantau status pendaftaran</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Cek progres seleksi secara real-time.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Login Card (7/12) */}
          <div className="lg:col-span-7 flex justify-center">
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 sm:p-10 w-full max-w-lg">
              {/* Login Icon Header */}
              <div className="w-12 h-12 bg-emerald-50 text-[#1f877c] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xs">
                <span className="material-symbols-outlined text-2xl">login</span>
              </div>

              <h2 className="text-2xl font-bold text-[#1e293b] text-center mb-1">
                Masuk ke Akun
              </h2>

              <p className="text-xs sm:text-sm text-slate-500 text-center mb-8 leading-relaxed">
                Login untuk melanjutkan proses pendaftaran dan memantau status magang
              </p>

              {errorMessage && (
                <div className="mb-6 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-600 font-medium text-center">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2" htmlFor="login-email">
                    Email
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Contoh: leona@gmail.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#1f877c] focus:ring-2 focus:ring-[#1f877c]/20 text-xs sm:text-sm transition-colors text-slate-900 placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2" htmlFor="login-password">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Contoh: Leona123!"
                      className="w-full px-4 py-3 pr-10 rounded-xl border border-slate-200 focus:border-[#1f877c] focus:ring-2 focus:ring-[#1f877c]/20 text-xs sm:text-sm transition-colors text-slate-900 placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors cursor-pointer"
                      aria-label="Toggle password visibility"
                    >
                      <span className="material-symbols-outlined text-lg">
                        {showPassword ? 'visibility' : 'visibility_off'}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#1f877c] hover:bg-[#196e65] text-white font-bold text-sm sm:text-base rounded-xl py-3.5 transition-all shadow-sm cursor-pointer active:scale-98 disabled:opacity-50"
                  >
                    {isLoading ? 'Memproses...' : 'Masuk'}
                  </button>
                </div>
              </form>

              <div className="mt-6 text-center space-y-2">
                <p className="text-xs sm:text-sm text-slate-600">
                  Belum punya akun?{' '}
                  <button
                    type="button"
                    onClick={onNavigateRegister}
                    className="text-[#1f877c] font-semibold hover:underline cursor-pointer"
                  >
                    Buat akun!
                  </button>
                </p>

                <div>
                  <button
                    type="button"
                    onClick={onNavigateForgotPassword}
                    className="text-xs sm:text-sm text-slate-600 hover:text-[#1f877c] font-medium transition-colors cursor-pointer"
                  >
                    Lupa Password?
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
