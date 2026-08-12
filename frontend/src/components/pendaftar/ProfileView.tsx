import { useState, ChangeEvent, FormEvent } from 'react';
import { User } from '../../types/auth';
import {
  showSuccessAlert,
  showErrorAlert,
  showEditConfirmAlert,
  showToast,
} from '../../utils/swal';

interface ProfileViewProps {
  user: User;
}

export function ProfileView({ user }: ProfileViewProps) {
  // Avatar state
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Personal details state
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [personalDetails, setPersonalDetails] = useState({
    nim: '123456789',
    fullName: user.name || 'Leona Strive',
    phone: '08xxxxxxxxxx',
    university: user.institution || 'Universitas Bina Sarana Informatika',
    major: 'Sistem Informasi',
  });

  // Account details state
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [accountDetails, setAccountDetails] = useState({
    email: user.email || 'leona@gmail.com',
    password: '•••••••••',
    accountCreated: 'August 01, 2025 10:00',
  });

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showErrorAlert(
          'Ukuran File Terlalu Besar',
          'Ukuran file foto profil melebihi batas maksimal 2 MB.'
        );
        return;
      }
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
      showToast('success', 'Foto profil berhasil diperbarui!');
    }
  };

  const handleSavePersonal = async (e: FormEvent) => {
    e.preventDefault();
    const confirmed = await showEditConfirmAlert({
      title: 'Simpan Personal Details?',
      text: 'Apakah Anda yakin ingin memperbarui data personal ini?',
      confirmButtonText: 'Ya, Simpan Perubahan',
    });

    if (confirmed) {
      setIsEditingPersonal(false);
      showSuccessAlert('Berhasil!', 'Personal Details berhasil diperbarui.');
    }
  };

  const handleSaveAccount = async (e: FormEvent) => {
    e.preventDefault();
    const confirmed = await showEditConfirmAlert({
      title: 'Simpan Account Details?',
      text: 'Apakah Anda yakin ingin memperbarui informasi akun Anda?',
      confirmButtonText: 'Ya, Simpan Perubahan',
    });

    if (confirmed) {
      setIsEditingAccount(false);
      showSuccessAlert('Berhasil!', 'Account Details berhasil diperbarui.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
        Profile
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Card: Foto Profil */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs flex flex-col items-center justify-center text-center space-y-5">
          <h2 className="text-sm font-bold text-slate-900 w-full text-left">
            Foto Profil
          </h2>

          <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center relative overflow-hidden shadow-inner">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Foto Profil" className="w-full h-full object-cover" />
            ) : (
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-slate-300/80 flex items-center justify-center text-slate-400">
                <span className="material-symbols-outlined text-6xl">close</span>
              </div>
            )}
          </div>

          <div className="space-y-2 w-full flex flex-col items-center">
            <label className="inline-block cursor-pointer">
              <input
                type="file"
                accept="image/jpeg,image/png"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <span className="inline-block px-6 py-2 rounded-xl border border-[#1f877c] text-[#1f877c] font-bold text-xs hover:bg-[#E6F7F3] transition-all shadow-2xs">
                Ganti Foto
              </span>
            </label>
            <span className="text-[11px] text-slate-400 block font-medium">
              JPG, PNG maks 2 MB
            </span>
          </div>
        </div>

        {/* Right Column: Personal Details & Account Details */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Card 1: Personal Details */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            {/* Card Header Bar */}
            <div className="bg-[#EDF2F7] px-5 py-3.5 flex items-center justify-between border-b border-slate-200/80">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                Personal Details
              </h3>
              <button
                type="button"
                onClick={() => setIsEditingPersonal(!isEditingPersonal)}
                className="bg-[#1f877c] hover:bg-[#196e65] text-white font-bold text-xs px-4 py-1.5 rounded-lg shadow-2xs transition-all cursor-pointer"
              >
                {isEditingPersonal ? 'Batal' : 'Edit'}
              </button>
            </div>

            {/* Card Content */}
            <div className="p-5 sm:p-6">
              {isEditingPersonal ? (
                <form onSubmit={handleSavePersonal} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">NIM</label>
                    <input
                      type="text"
                      value={personalDetails.nim}
                      onChange={(e) => setPersonalDetails({ ...personalDetails, nim: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nama Lengkap</label>
                    <input
                      type="text"
                      value={personalDetails.fullName}
                      onChange={(e) => setPersonalDetails({ ...personalDetails, fullName: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">No. Telp</label>
                    <input
                      type="text"
                      value={personalDetails.phone}
                      onChange={(e) => setPersonalDetails({ ...personalDetails, phone: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Universitas</label>
                    <input
                      type="text"
                      value={personalDetails.university}
                      onChange={(e) => setPersonalDetails({ ...personalDetails, university: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Bidang Studi</label>
                    <input
                      type="text"
                      value={personalDetails.major}
                      onChange={(e) => setPersonalDetails({ ...personalDetails, major: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-[#1f877c] text-white font-bold px-5 py-2 rounded-xl"
                  >
                    Simpan Personal Details
                  </button>
                </form>
              ) : (
                <div className="divide-y divide-slate-100 text-xs sm:text-sm">
                  <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="font-semibold text-slate-500 w-1/3">NIM</span>
                    <span className="font-bold text-slate-900 w-2/3">{personalDetails.nim}</span>
                  </div>
                  <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="font-semibold text-slate-500 w-1/3">Nama Lengkap</span>
                    <span className="font-bold text-slate-900 w-2/3">{personalDetails.fullName}</span>
                  </div>
                  <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="font-semibold text-slate-500 w-1/3">No. Telp</span>
                    <span className="font-bold text-slate-900 w-2/3">{personalDetails.phone}</span>
                  </div>
                  <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="font-semibold text-slate-500 w-1/3">Universitas</span>
                    <span className="font-bold text-slate-900 w-2/3">{personalDetails.university}</span>
                  </div>
                  <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="font-semibold text-slate-500 w-1/3">Bidang Studi</span>
                    <span className="font-bold text-slate-900 w-2/3">{personalDetails.major}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Card 2: Account Details */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            {/* Card Header Bar */}
            <div className="bg-[#EDF2F7] px-5 py-3.5 flex items-center justify-between border-b border-slate-200/80">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                Account Details
              </h3>
              <button
                type="button"
                onClick={() => setIsEditingAccount(!isEditingAccount)}
                className="bg-[#1f877c] hover:bg-[#196e65] text-white font-bold text-xs px-4 py-1.5 rounded-lg shadow-2xs transition-all cursor-pointer"
              >
                {isEditingAccount ? 'Batal' : 'Edit'}
              </button>
            </div>

            {/* Card Content */}
            <div className="p-5 sm:p-6">
              {isEditingAccount ? (
                <form onSubmit={handleSaveAccount} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={accountDetails.email}
                      onChange={(e) => setAccountDetails({ ...accountDetails, email: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Password Baru</label>
                    <input
                      type="password"
                      placeholder="Masukkan password baru"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-[#1f877c] text-white font-bold px-5 py-2 rounded-xl"
                  >
                    Simpan Account Details
                  </button>
                </form>
              ) : (
                <div className="divide-y divide-slate-100 text-xs sm:text-sm">
                  <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="font-semibold text-slate-500 w-1/3">Email</span>
                    <span className="font-bold text-slate-900 w-2/3">{accountDetails.email}</span>
                  </div>
                  <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="font-semibold text-slate-500 w-1/3">Password</span>
                    <span className="font-bold text-slate-900 w-2/3">{accountDetails.password}</span>
                  </div>
                  <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="font-semibold text-slate-500 w-1/3">Account Created</span>
                    <span className="font-bold text-slate-900 w-2/3">{accountDetails.accountCreated}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
