import { useState, FormEvent } from 'react';
import { RegisterCredentials } from '../types/auth';
import { JogjaEmblemLogo } from '../components/JogjaEmblemLogo';

interface RegisterPageProps {
  onRegister: (credentials: RegisterCredentials) => Promise<boolean>;
  onNavigateLogin: () => void;
  onNavigateHome?: () => void;
  isLoading: boolean;
}

export function RegisterPage({
  onRegister,
  onNavigateLogin,
  onNavigateHome,
  isLoading
}: RegisterPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (password !== passwordConfirmation) {
      setErrorMessage('Konfirmasi password tidak cocok.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password minimal 8 karakter.');
      return;
    }

    const success = await onRegister({
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    });

    if (!success) {
      setErrorMessage('Gagal mendaftar. Silakan periksa kembali data Anda.');
    }
  };

  return (
    <div className="bg-[#ECFDF5] text-slate-800 min-h-[calc(100vh-140px)] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto w-full">
        {/* Back to Home Button */}
        {onNavigateHome && (
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-700 font-medium hover:text-[#005c55] transition-colors mb-6 sm:mb-8 cursor-pointer group"
          >
            <span className="material-symbols-outlined text-base sm:text-lg group-hover:-translate-x-1 transition-transform">
              arrow_back
            </span>
            <span>Kembali ke Beranda</span>
          </button>
        )}

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
                Mulai perjalanan magangmu bersama <span className="text-[#1f877c]">DISKOMINFOSAN</span>
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

          {/* Right Column: Register Card (7/12) */}
          <div className="lg:col-span-7 flex justify-center">
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 sm:p-10 w-full max-w-xl">
              {/* Register Icon Header */}
              <div className="w-12 h-12 bg-emerald-50 text-[#1f877c] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xs">
                <span className="material-symbols-outlined text-2xl">person_add</span>
              </div>

              <h2 className="text-2xl font-bold text-[#1e293b] text-center mb-1">
                Buat Akun
              </h2>

              <p className="text-xs sm:text-sm text-slate-500 text-center mb-8 leading-relaxed">
                Lengkapi data di bawah ini untuk membuat akun baru
              </p>

              {errorMessage && (
                <div className="mb-6 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-600 font-medium text-center">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  {/* Nama Lengkap */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2" htmlFor="reg-name">
                      Nama Lengkap
                    </label>
                    <input
                      id="reg-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Contoh: Leona Strive"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#1f877c] focus:ring-2 focus:ring-[#1f877c]/20 text-xs sm:text-sm transition-colors text-slate-900 placeholder:text-slate-400"
                    />
                    <p className="text-[11px] text-slate-400 mt-1.5">
                      Masukkan nama lengkap sesuai dengan identitas
                    </p>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2" htmlFor="reg-email">
                      Email
                    </label>
                    <input
                      id="reg-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Contoh: leona@gmail.com"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#1f877c] focus:ring-2 focus:ring-[#1f877c]/20 text-xs sm:text-sm transition-colors text-slate-900 placeholder:text-slate-400"
                    />
                    <p className="text-[11px] text-slate-400 mt-1.5">
                      Masukkan email aktif yang dapat diakses
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  {/* Password */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2" htmlFor="reg-password">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="reg-password"
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
                    <p className="text-[11px] text-slate-400 mt-1.5">
                      Minimal 8 karakter dengan kombinasi huruf dan angka
                    </p>
                  </div>

                  {/* Konfirmasi Password */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2" htmlFor="reg-confirm-password">
                      Konfirmasi Password
                    </label>
                    <div className="relative">
                      <input
                        id="reg-confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        placeholder="Contoh: Leona123!"
                        className="w-full px-4 py-3 pr-10 rounded-xl border border-slate-200 focus:border-[#1f877c] focus:ring-2 focus:ring-[#1f877c]/20 text-xs sm:text-sm transition-colors text-slate-900 placeholder:text-slate-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors cursor-pointer"
                        aria-label="Toggle confirm password visibility"
                      >
                        <span className="material-symbols-outlined text-lg">
                          {showConfirmPassword ? 'visibility' : 'visibility_off'}
                        </span>
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1.5">
                      Masukkan ulang password anda
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#1f877c] hover:bg-[#196e65] text-white font-bold text-sm sm:text-base rounded-xl py-3.5 transition-all shadow-sm cursor-pointer active:scale-98 disabled:opacity-50"
                  >
                    {isLoading ? 'Memproses...' : 'Buat Akun'}
                  </button>
                </div>
              </form>

              {/* Divider */}
              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <span className="relative bg-white px-4 text-xs text-slate-400">atau</span>
              </div>

              <div className="text-center">
                <p className="text-xs sm:text-sm text-slate-600">
                  Sudah punya akun?{' '}
                  <button
                    type="button"
                    onClick={onNavigateLogin}
                    className="text-[#1f877c] font-semibold hover:underline cursor-pointer"
                  >
                    Masuk disini!
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
