import { useState, FormEvent } from 'react';
import { JogjaEmblemLogo } from '../components/JogjaEmblemLogo';

interface ResetPasswordPageProps {
  onNavigateLogin: () => void;
  onNavigateHome: () => void;
}

export function ResetPasswordPage({ onNavigateLogin, onNavigateHome }: ResetPasswordPageProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('Konfirmasi password tidak cocok.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password minimal 8 karakter.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 800);
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
                Reset akses akun Anda
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Masukkan email terdaftar untuk menerima instruksi reset password.
              </p>
            </div>

            {/* Benefits List */}
            <div className="pt-2 space-y-3">
              <span className="text-xs font-semibold text-slate-500 block mb-2">Benefit:</span>
              
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-emerald-500 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-xs font-bold text-emerald-600">
                    check
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-slate-700">Aman</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-emerald-500 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-xs font-bold text-emerald-600">
                    check
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-slate-700">Cepat</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-emerald-500 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-xs font-bold text-emerald-600">
                    check
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-slate-700">
                  Proses verifikasi resmi
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Reset Password Form (7/12) */}
          <div className="lg:col-span-7 flex justify-center">
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 sm:p-10 w-full max-w-lg">
              {/* Lock Icon Header */}
              <div className="w-12 h-12 bg-[#D1FAE5] text-[#1f877c] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xs">
                <span className="material-symbols-outlined text-2xl">lock</span>
              </div>

              <h2 className="text-2xl font-bold text-[#1e293b] text-center mb-8">
                Buat Password Baru
              </h2>

              {errorMessage && (
                <div className="mb-6 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-600 font-medium text-center">
                  {errorMessage}
                </div>
              )}

              {isSuccess ? (
                <div className="space-y-6 text-center animate-in fade-in py-2">
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs sm:text-sm leading-relaxed">
                    <p className="font-bold text-emerald-900 mb-1 flex items-center justify-center gap-1.5">
                      <span className="material-symbols-outlined text-base">check_circle</span>
                      Password Berhasil Diperbarui!
                    </p>
                    <p>
                      Password akun Anda telah berhasil diubah. Silakan masuk menggunakan password baru Anda.
                    </p>
                  </div>

                  <button
                    onClick={onNavigateLogin}
                    className="w-full bg-[#1f877c] hover:bg-[#196e65] text-white font-bold py-3.5 rounded-xl transition-all shadow-sm cursor-pointer text-sm"
                  >
                    Masuk ke Akun
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Password Baru */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2" htmlFor="new-password">
                      Password Baru
                    </label>
                    <div className="relative">
                      <input
                        id="new-password"
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
                    <label className="block text-xs font-bold text-slate-700 mb-2" htmlFor="confirm-new-password">
                      Konfirmasi Password
                    </label>
                    <div className="relative">
                      <input
                        id="confirm-new-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
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

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-[#1f877c] hover:bg-[#196e65] text-white font-bold text-sm sm:text-base rounded-xl py-3.5 transition-all shadow-sm cursor-pointer active:scale-98 disabled:opacity-50"
                    >
                      {isLoading ? 'Memproses...' : 'Simpan Password Baru'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
