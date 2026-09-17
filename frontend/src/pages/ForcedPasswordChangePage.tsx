import { useState, FormEvent } from 'react';
import { JogjaEmblemLogo } from '../components/JogjaEmblemLogo';

interface ForcedPasswordChangePageProps {
  onChangePassword: (payload: {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
  }) => Promise<boolean>;
  onSuccess: () => void;
  isLoading: boolean;
}

export function ForcedPasswordChangePage({
  onChangePassword,
  onSuccess,
  isLoading,
}: ForcedPasswordChangePageProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!currentPassword) {
      setErrorMessage('Masukkan password sementara yang diberikan admin.');
      return;
    }
    if (password.length < 8) {
      setErrorMessage('Password baru minimal 8 karakter.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Konfirmasi password tidak cocok.');
      return;
    }

    const success = await onChangePassword({
      current_password: currentPassword,
      new_password: password,
      new_password_confirmation: confirmPassword,
    });

    if (success) {
      onSuccess();
    } else {
      setErrorMessage('Gagal memperbarui password. Periksa kembali password sementara Anda.');
    }
  };

  return (
    <div className="bg-[#ECFDF5] text-slate-800 min-h-screen flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto w-full">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 sm:p-10 w-full">
          <div className="flex items-center gap-3.5 mb-6 justify-center">
            <JogjaEmblemLogo className="w-10 h-12 shrink-0 filter drop-shadow-xs" />
            <div>
              <h3 className="text-lg font-extrabold text-[#0F172A] leading-tight">SIAMANG</h3>
            </div>
          </div>

          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xs">
            <span className="material-symbols-outlined text-2xl">lock_reset</span>
          </div>

          <h2 className="text-xl font-bold text-[#1e293b] text-center mb-1">
            Ganti Password Anda
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 text-center mb-8 leading-relaxed">
            Akun Anda dibuat oleh admin dengan password sementara. Silakan buat password
            baru sebelum melanjutkan.
          </p>

          {errorMessage && (
            <div className="mb-6 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-600 font-medium text-center">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Password Sementara (dari admin)
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#1f877c] focus:ring-2 focus:ring-[#1f877c]/20 text-xs sm:text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Password Baru</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-10 rounded-xl border border-slate-200 focus:border-[#1f877c] focus:ring-2 focus:ring-[#1f877c]/20 text-xs sm:text-sm text-slate-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">
                    {showPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5">Minimal 8 karakter.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Konfirmasi Password Baru</label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#1f877c] focus:ring-2 focus:ring-[#1f877c]/20 text-xs sm:text-sm text-slate-900"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1f877c] hover:bg-[#196e65] text-white font-bold text-sm sm:text-base rounded-xl py-3.5 transition-all shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isLoading ? 'Memproses...' : 'Simpan & Lanjutkan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}