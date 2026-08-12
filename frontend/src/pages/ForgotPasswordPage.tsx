import { useState, FormEvent } from 'react';
import { JogjaEmblemLogo } from '../components/JogjaEmblemLogo';

interface ForgotPasswordPageProps {
  onNavigateLogin: () => void;
  onNavigateHome: () => void;
  onNavigateResetPassword?: () => void;
}

export function ForgotPasswordPage({
  onNavigateLogin,
  onNavigateHome,
  onNavigateResetPassword
}: ForgotPasswordPageProps) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
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

          {/* Right Column: Reset Password Card (7/12) */}
          <div className="lg:col-span-7 flex justify-center">
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 sm:p-10 w-full max-w-lg">
              {isSubmitted ? (
                /* Success State: Cek Email Anda */
                <div className="text-center animate-in fade-in space-y-6 py-2">
                  {/* Email Icon Header */}
                  <div className="w-14 h-14 bg-[#D1FAE5] text-[#1f877c] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xs">
                    <span className="material-symbols-outlined text-3xl">mark_email_read</span>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-[#1e293b] text-center mb-2">
                      Cek Email Anda
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 text-center leading-relaxed">
                      Kami telah mengirim tautan reset password ke email Anda.
                      {email && (
                        <span className="block font-semibold text-slate-700 mt-1">({email})</span>
                      )}
                    </p>
                  </div>

                  {/* Action Buttons Row */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (onNavigateResetPassword) {
                          onNavigateResetPassword();
                        } else {
                          window.open('https://mail.google.com', '_blank');
                        }
                      }}
                      className="w-full sm:flex-1 bg-[#1f877c] hover:bg-[#196e65] text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-sm cursor-pointer active:scale-98 text-xs sm:text-sm"
                    >
                      Buka Email
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsLoading(true);
                        setTimeout(() => {
                          setIsLoading(false);
                          alert('Tautan reset password baru telah dikirim kembali ke email Anda.');
                        }, 800);
                      }}
                      disabled={isLoading}
                      className="w-full sm:w-auto bg-white border border-[#1f877c] text-[#1f877c] hover:bg-emerald-50 font-bold py-3.5 px-6 rounded-xl transition-all cursor-pointer text-xs sm:text-sm disabled:opacity-50"
                    >
                      {isLoading ? 'Mengirim...' : 'Kirim Ulang'}
                    </button>
                  </div>

                  {onNavigateResetPassword && (
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={onNavigateResetPassword}
                        className="text-[#1f877c] text-xs font-semibold hover:underline cursor-pointer"
                      >
                        (Simulasi) Buka link Reset Password dari email →
                      </button>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={onNavigateLogin}
                      className="text-slate-500 text-xs hover:text-[#1f877c] font-medium cursor-pointer transition-colors"
                    >
                      Kembali ke halaman Login
                    </button>
                  </div>
                </div>
              ) : (
                /* Initial State: Form Reset Password */
                <>
                  {/* Lock Icon Header */}
                  <div className="w-12 h-12 bg-[#D1FAE5] text-[#1f877c] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xs">
                    <span className="material-symbols-outlined text-2xl">lock</span>
                  </div>

                  <h2 className="text-2xl font-bold text-[#1e293b] text-center mb-2">
                    Lupa Password?
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-500 text-center mb-8 leading-relaxed">
                    Link reset password akan masuk ke email Anda.<br />
                    Cek inbox atau spam email Anda!
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2" htmlFor="reset-email">
                        Email
                      </label>
                      <input
                        id="reset-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Masukkan email akun anda"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#1f877c] focus:ring-2 focus:ring-[#1f877c]/20 text-xs sm:text-sm transition-colors text-slate-900 placeholder:text-slate-400"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#1f877c] hover:bg-[#196e65] text-white font-bold text-sm sm:text-base rounded-xl py-3.5 transition-all shadow-sm cursor-pointer active:scale-98 disabled:opacity-50"
                      >
                        {isLoading ? 'Memproses...' : 'Reset Password'}
                      </button>
                    </div>

                    <div className="pt-2 text-center">
                      <button
                        type="button"
                        onClick={onNavigateLogin}
                        className="text-[#1f877c] font-semibold text-xs sm:text-sm hover:underline cursor-pointer"
                      >
                        Kembali ke halaman Login
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
