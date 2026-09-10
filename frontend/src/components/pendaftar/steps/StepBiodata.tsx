import { ChangeEvent } from 'react';
import { BiodataState } from '../types';
import { showWarningAlert } from '../../../utils/swal';

interface StepBiodataProps {
  biodata: BiodataState;
  setBiodata: (biodata: BiodataState) => void;
  onPhotoUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  onNext: () => void;
  lastSavedAt: string | null;
}

export function StepBiodata({ biodata, setBiodata, onPhotoUpload, onNext, lastSavedAt }: StepBiodataProps) {
  const handleNext = () => {
    // Hanya field yang ditandai wajib (*) di UI yang divalidasi
    const requiredFields: { key: keyof BiodataState; label: string }[] = [
      { key: 'university', label: 'Nama Kampus / Universitas' },
      { key: 'major', label: 'Program Studi' },
      { key: 'nim', label: 'NIM (Nomor Induk Mahasiswa)' },
      { key: 'projectTitle', label: 'Judul/Topik Project' },
      { key: 'skills', label: 'Keahlian' },
      { key: 'tools', label: 'Tools yang Dikuasai' },
    ];

    const missing = requiredFields.filter((field) => !biodata[field.key]?.toString().trim());

    if (missing.length > 0) {
      showWarningAlert(
        'Data Belum Lengkap',
        `Mohon lengkapi terlebih dahulu: ${missing.map((f) => f.label).join(', ')}.`
      );
      return;
    }

    // Validasi Periode Magang: tidak boleh kurang dari tanggal hari ini
    if (biodata.startDate || biodata.endDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (biodata.startDate) {
        const startDate = new Date(biodata.startDate);
        if (startDate < today) {
          showWarningAlert(
            'Tanggal Mulai Tidak Valid',
            'Tanggal Mulai magang tidak boleh kurang dari hari ini. Silakan pilih tanggal lain.'
          );
          return;
        }
      }

      if (biodata.endDate) {
        const endDate = new Date(biodata.endDate);
        if (endDate < today) {
          showWarningAlert(
            'Tanggal Selesai Tidak Valid',
            'Tanggal Selesai magang tidak boleh kurang dari hari ini. Silakan pilih tanggal lain.'
          );
          return;
        }
      }

      if (biodata.startDate && biodata.endDate) {
        const startDate = new Date(biodata.startDate);
        const endDate = new Date(biodata.endDate);
        if (endDate < startDate) {
          showWarningAlert(
            'Periode Magang Tidak Valid',
            'Tanggal Selesai tidak boleh lebih awal dari Tanggal Mulai. Silakan periksa kembali.'
          );
          return;
        }
      }
    }

    onNext();
  };

  const todayString = new Date().toISOString().split('T')[0];

   const formatSavedAt = (iso: string | null) => {
    if (!iso) return 'Belum ada draft tersimpan';
    const date = new Date(iso);
    const formatted = new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Jakarta',
    }).format(date);
    return `${formatted} WIB`;
  };
  const savedAtText = formatSavedAt(lastSavedAt);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-8 shadow-2xs space-y-8">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <h2 className="text-base sm:text-lg font-bold text-[#1f877c]">Informasi Personal</h2>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E6F7F3] text-[#1f877c] border border-emerald-200">
          Ketua Tim
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Foto Profil */}
        <div className="lg:col-span-4 flex flex-col items-center text-center space-y-3">
          <span className="text-xs font-bold text-slate-700 w-full text-left">Foto Profil</span>
          <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center relative overflow-hidden shadow-inner">
            {biodata.photoUrl ? (
              <img src={biodata.photoUrl} alt="Foto Profil" className="w-full h-full object-cover" />
            ) : (
              <span className="material-symbols-outlined text-4xl text-slate-400">photo_camera</span>
            )}
          </div>
          <label className="inline-block cursor-pointer">
            <input type="file" accept="image/*" onChange={onPhotoUpload} className="hidden" />
            <span className="px-5 py-2 rounded-xl bg-[#1f877c] hover:bg-[#196e65] text-white font-bold text-xs shadow-2xs transition-all inline-block">
              Upload Foto
            </span>
          </label>
          <span className="text-[10px] text-slate-400 font-medium">Format JPG/PNG, maks. 200KB</span>
        </div>

        {/* Inputs Personal */}
        <div className="lg:col-span-8 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Nama Lengkap</label>
            <input
              type="text"
              value={biodata.fullName}
              onChange={(e) => setBiodata({ ...biodata, fullName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#1f877c] outline-none"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={biodata.email}
              onChange={(e) => setBiodata({ ...biodata, email: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#1f877c] outline-none"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">No. Handphone</label>
            <input
              type="text"
              value={biodata.phone}
              onChange={(e) => setBiodata({ ...biodata, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#1f877c] outline-none"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Alamat Lengkap</label>
            <textarea
              rows={2}
              value={biodata.address}
              onChange={(e) => setBiodata({ ...biodata, address: e.target.value })}
              placeholder="Masukkan alamat lengkap sesuai KTP"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#1f877c] outline-none"
            />
          </div>
        </div>
      </div>

      {/* Informasi Akademik */}
      <div className="pt-6 border-t border-slate-100 space-y-4">
        <h2 className="text-base font-bold text-[#1f877c]">Informasi Akademik</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Nama Kampus / Universitas <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={biodata.university}
              onChange={(e) => setBiodata({ ...biodata, university: e.target.value })}
              placeholder="Masukkan Nama Kampus"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#1f877c] outline-none"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Program Studi <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={biodata.major}
              onChange={(e) => setBiodata({ ...biodata, major: e.target.value })}
              placeholder="Masukkan Program Studi"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#1f877c] outline-none"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Semester <span className="text-rose-500">*</span>
            </label>
            <select
              value={biodata.semester}
              onChange={(e) => setBiodata({ ...biodata, semester: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#1f877c] outline-none bg-white"
            >
              {Array.from({ length: 8 }, (_, i) => i + 1).map((s) => (
                <option key={s} value={String(s)}>
                  Semester {s}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="text-xs">
          <label className="block font-bold text-slate-700 mb-1">
            NIM (Nomor Induk Mahasiswa) <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={biodata.nim}
            onChange={(e) => setBiodata({ ...biodata, nim: e.target.value })}
            placeholder="Masukkan NIM"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#1f877c] outline-none"
          />
        </div>
      </div>

      {/* Informasi Project */}
      <div className="pt-6 border-t border-slate-100 space-y-4">
        <h2 className="text-base font-bold text-[#1f877c]">Informasi Project</h2>
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Judul/Topik Project <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              value={biodata.projectTitle}
              onChange={(e) => setBiodata({ ...biodata, projectTitle: e.target.value })}
              placeholder="Masukkan judul atau topik project yang diajukan"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#1f877c] outline-none"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Keahlian <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={biodata.skills}
                onChange={(e) => setBiodata({ ...biodata, skills: e.target.value })}
                placeholder="Contoh: UI/UX Design, Web Development, dll"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#1f877c] outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Tools yang Dikuasai <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={biodata.tools}
                onChange={(e) => setBiodata({ ...biodata, tools: e.target.value })}
                placeholder="Contoh: Figma, Laravel, VS Code, dll"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#1f877c] outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Periode Magang */}
      <div className="pt-6 border-t border-slate-100 space-y-4">
        <h2 className="text-base font-bold text-[#1f877c]">Periode Magang</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Tanggal Mulai</label>
            <input
              type="date"
              min={todayString}
              value={biodata.startDate}
              onChange={(e) => setBiodata({ ...biodata, startDate: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#1f877c] outline-none bg-white"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Tanggal Selesai</label>
            <input
              type="date"
              min={biodata.startDate || todayString}
              value={biodata.endDate}
              onChange={(e) => setBiodata({ ...biodata, endDate: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#1f877c] outline-none bg-white"
            />
          </div>
        </div>
      </div>

      {/* Bottom Bar Footer */}
      <div className="p-4 bg-[#E6F7F3] border border-emerald-200 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-bold text-[#1f877c]">
          <span className="material-symbols-outlined text-lg">check_circle</span>
          <div>
            <span className="block font-bold text-slate-900">
              {savedAtText ? 'Draft tersimpan otomatis' : 'Draft belum tersimpan'}
            </span>
            <span className="text-[11px] font-medium text-slate-500">
              {savedAtText ? `Terakhir disimpan ${savedAtText}` : 'Data akan tersimpan otomatis saat Anda mengisi form'}
            </span>
          </div>
        </div>

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