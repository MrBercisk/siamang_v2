import { BiodataState, RegistrationType, TeamMember } from '../types';
import { showWarningAlert } from '../../../utils/swal';

interface StepTipePendaftaranProps {
  registrationType: RegistrationType;
  setRegistrationType: (type: RegistrationType) => void;
  teamMembers: TeamMember[];
  biodata: BiodataState;
  onAddMember: () => void;
  onRemoveMember: (id: number) => void;
  onUpdateMember: (id: number, field: keyof TeamMember, value: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export function StepTipePendaftaran({
  registrationType,
  setRegistrationType,
  teamMembers,
  biodata,
  onAddMember,
  onRemoveMember,
  onUpdateMember,
  onBack,
  onNext,
}: StepTipePendaftaranProps) {
  const handleNext = () => {
    if (registrationType === 'Kelompok') {
      if (teamMembers.length < 1) {
        showWarningAlert(
          'Anggota Tim Belum Cukup',
          'Kelompok minimal harus terdiri dari 2 anggota (di luar Ketua Tim). Silakan tambahkan anggota terlebih dahulu.'
        );
        return;
      }

      const requiredFields: { key: keyof TeamMember; label: string }[] = [
        { key: 'fullName', label: 'Nama Lengkap' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'No. Handphone' },
        { key: 'nim', label: 'NIM' },
      ];

      for (let i = 0; i < teamMembers.length; i += 1) {
        const member = teamMembers[i];
        const missing = requiredFields.filter((field) => !member[field.key]?.toString().trim());

        if (missing.length > 0) {
          showWarningAlert(
            'Data Anggota Belum Lengkap',
            `Mohon lengkapi data Anggota Tim ${i + 2}: ${missing.map((f) => f.label).join(', ')}.`
          );
          return;
        }
      }
    }

    onNext();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-8 shadow-2xs space-y-6">
      <div>
        <h2 className="text-base sm:text-lg font-bold text-slate-900">Pilih Tipe Pendaftaran</h2>
        <p className="text-xs text-slate-500 mt-0.5">Pilih tipe pendaftaran yang sesuai dengan kondisi Anda.</p>
      </div>

      {/* Type Choice Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          onClick={() => setRegistrationType('Individu')}
          className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
            registrationType === 'Individu'
              ? 'border-[#1f877c] bg-[#E6F7F3]/60 shadow-xs'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-[#1f877c]">
              <span className="material-symbols-outlined text-2xl">person</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Individu</h3>
              <p className="text-xs text-slate-500 mt-1">
                Daftar sebagai peserta mandiri dan mengikuti program magang secara individu
              </p>
            </div>
            <ul className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-sm">check_circle</span>
                <span>Pendaftar hanya 1 orang</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-sm">check_circle</span>
                <span>Semua berkas atas nama pribadi</span>
              </li>
            </ul>
          </div>
        </div>

        <div
          onClick={() => setRegistrationType('Kelompok')}
          className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
            registrationType === 'Kelompok'
              ? 'border-[#1f877c] bg-[#E6F7F3]/60 shadow-xs'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-[#1f877c]">
              <span className="material-symbols-outlined text-2xl">group</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Kelompok</h3>
              <p className="text-xs text-slate-500 mt-1">
                Daftar bersama tim atau kelompok (maksimal 3 orang termasuk ketua)
              </p>
            </div>
            <ul className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-sm">check_circle</span>
                <span>Minimal 2 orang, maksimal 3 orang</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-sm">check_circle</span>
                <span>Ketua kelompok menjadi pendaftar utama</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-sm">check_circle</span>
                <span>Semua berkas dikirim dalam satu pendaftaran</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Group Details Form if Kelompok Selected */}
      {registrationType === 'Kelompok' && (
        <div className="pt-6 border-t border-slate-100 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Informasi Kelompok</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tambahkan data anggota tim Anda. Ketua tim adalah pendaftar utama (akun yang sedang login).
            </p>
          </div>

          {/* Ketua Tim Box */}
          <div className="p-5 bg-[#E6F7F3]/80 border border-emerald-200 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <span className="material-symbols-outlined text-emerald-700 text-lg">account_circle</span>
                <span>Ketua Tim (Pendaftar Utama)</span>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E6F7F3] text-[#1f877c] border border-emerald-300">
                Ketua Tim
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-slate-500 mb-1">Nama Lengkap</label>
                <input type="text" disabled value={biodata.fullName} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/80 font-bold" />
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Email</label>
                <input type="text" disabled value={biodata.email} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/80 font-bold" />
              </div>
              <div>
                <label className="block text-slate-500 mb-1">No. Handphone</label>
                <input type="text" disabled value={biodata.phone} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/80 font-bold" />
              </div>
              <div>
                <label className="block text-slate-500 mb-1">NIM</label>
                <input type="text" disabled value={biodata.nim} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/80 font-bold" />
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Nama Kampus / Universitas</label>
                <input type="text" disabled value={biodata.university} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/80 font-bold" />
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Program Studi</label>
                <input type="text" disabled value={biodata.major} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/80 font-bold" />
              </div>
            </div>
          </div>

          {/* Anggota List */}
          {teamMembers.map((member, idx) => (
            <div key={member.id} className="p-5 bg-white border border-slate-200 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <span className="material-symbols-outlined text-slate-500 text-lg">group</span>
                  <span>Anggota Tim {idx + 2}</span>
                </div>

                <button
                  type="button"
                  onClick={() => onRemoveMember(member.id)}
                  className="px-3 py-1 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                >
                  <span>Hapus Anggota</span>
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nama Lengkap <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Masukkan nama lengkap"
                    value={member.fullName}
                    onChange={(e) => onUpdateMember(member.id, 'fullName', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="Masukkan email"
                    value={member.email}
                    onChange={(e) => onUpdateMember(member.id, 'email', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    No. Handphone <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Masukkan no handphone"
                    value={member.phone}
                    onChange={(e) => onUpdateMember(member.id, 'phone', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 outline-none"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block font-bold text-slate-700 mb-1">
                    NIM (Nomor Induk Mahasiswa) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Masukkan NIM"
                    value={member.nim}
                    onChange={(e) => onUpdateMember(member.id, 'nim', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 outline-none"
                  />
                </div>
              </div>
            </div>
          ))}

          {teamMembers.length < 2 && (
            <button
              type="button"
              onClick={onAddMember}
              className="w-full py-3 rounded-2xl border-2 border-dashed border-[#1f877c] text-[#1f877c] hover:bg-[#E6F7F3]/50 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Tambah Anggota</span>
              <span className="material-symbols-outlined text-lg">add</span>
            </button>
          )}
        </div>
      )}

      {/* Info Box */}
      <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-start gap-3 text-xs text-slate-700">
        <span className="material-symbols-outlined text-emerald-700 text-lg mt-0.5">info</span>
        <div>
          <span className="font-bold text-emerald-900 block">Informasi Penting</span>
          <span>Pastikan tipe pendaftaran dipilih dengan benar karena akan mempengaruhi data yang harus diisi pada langkah selanjutnya.</span>
        </div>
      </div>

      {/* Bottom Bar Footer */}
      <div className="p-4 bg-[#E6F7F3] border border-emerald-200 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white font-bold text-xs text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
        >
          Kembali
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="px-6 py-2.5 bg-[#1f877c] hover:bg-[#196e65] text-white font-bold text-xs rounded-xl shadow-2xs transition-all cursor-pointer ml-auto"
        >
          Simpan & Lanjutkan
        </button>
      </div>
    </div>
  );
}