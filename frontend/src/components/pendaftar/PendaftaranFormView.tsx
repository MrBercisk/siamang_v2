import { useState, ChangeEvent, FormEvent } from 'react';
import { User } from '../../types/auth';
import {
  showSuccessAlert,
  showWarningAlert,
  showConfirmAlert,
  showDeleteConfirmAlert,
  showToast,
} from '../../utils/swal';

interface PendaftaranFormViewProps {
  user: User;
  onSuccessSubmit?: () => void;
}

interface TeamMember {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  nim: string;
}

interface DocumentFile {
  id: number;
  name: string;
  desc: string;
  required: boolean;
  format: string;
  maxSize: string;
  fileName?: string;
  status: 'Berhasil Upload' | 'Belum Upload Berkas';
}

export function PendaftaranFormView({ user, onSuccessSubmit }: PendaftaranFormViewProps) {
  // Current Step: 1 = Biodata, 2 = Tipe Pendaftaran, 3 = Bidang & Kategori, 4 = Berkas, 5 = Review & Submit
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Biodata State
  const [biodata, setBiodata] = useState({
    photoUrl: '',
    fullName: user.name || 'Leona Strive',
    email: user.email || 'leona@gmail.com',
    phone: '08123456789',
    address: 'Yogyakarta',
    university: user.institution || 'Universitas Bina Sarana Informatika',
    major: 'Sistem Informasi',
    semester: '5',
    nim: '12345678',
    projectTitle: 'Sistem Informasi Aplikasi Dagang',
    skills: 'Web Developer',
    tools: 'Codeigniter 4',
    startDate: '2026-06-01',
    endDate: '2026-09-01',
  });

  // Step 2: Tipe Pendaftaran State
  const [registrationType, setRegistrationType] = useState<'Individu' | 'Kelompok'>('Kelompok');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: 2,
      fullName: 'Berlina',
      email: 'berlina@gmail.com',
      phone: '08xxxxxxxxxx',
      nim: '12345679',
    },
    {
      id: 3,
      fullName: 'Trisiana',
      email: 'trisi@gmail.com',
      phone: '08xxxxxxxxxx',
      nim: '12345680',
    },
  ]);

  // Step 3: Bidang & Kategori State
  const [selectedBidang, setSelectedBidang] = useState<string>('Bidang Sistem Informasi dan Statistik');
  const [selectedKategori, setSelectedKategori] = useState<string>('Perencanaan dan Implementasi Sistem Informasi');

  // Step 4: Berkas State
  const [documents, setDocuments] = useState<DocumentFile[]>([
    {
      id: 1,
      name: 'Pas Foto 3 × 4',
      desc: 'Pas foto terbaru dengan latar belakang bebas',
      required: true,
      format: 'JPG / PNG',
      maxSize: '200 KB',
      fileName: 'pas_foto_leona.jpg',
      status: 'Berhasil Upload',
    },
    {
      id: 2,
      name: 'Berkas Persyaratan Pendaftaran',
      desc: 'Gabungkan semua berkas persyaratan dalam 1 file PDF',
      required: true,
      format: 'PDF',
      maxSize: '2 MB',
      fileName: 'berkas_leona.pdf',
      status: 'Berhasil Upload',
    },
    {
      id: 3,
      name: 'Surat NDA Perjanjian Magang Mahasiswa',
      desc: 'Surat NDA yang sudah ditandatangani peserta',
      required: true,
      format: 'PDF',
      maxSize: '1 MB',
      fileName: 'NDA_leona.pdf',
      status: 'Berhasil Upload',
    },
    {
      id: 4,
      name: 'Surat Permohonan',
      desc: 'Surat permohonan magang dari kampus/institusi',
      required: true,
      format: 'PDF',
      maxSize: '1 MB',
      fileName: 'permohonan_leona.pdf',
      status: 'Berhasil Upload',
    },
    {
      id: 5,
      name: 'Video Perkenalan',
      desc: 'Video perkenalan diri (maks. 2 menit)',
      required: false,
      format: 'MP4',
      maxSize: '20 MB',
      fileName: 'perkenalan_leona.mp4',
      status: 'Berhasil Upload',
    },
  ]);

  // Step 5: Pernyataan Checkbox
  const [isDeclared, setIsDeclared] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Photo Upload Handler
  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBiodata({ ...biodata, photoUrl: URL.createObjectURL(file) });
      showToast('success', 'Foto profil berhasil diunggah!');
    }
  };

  // Add Member to Group
  const handleAddMember = () => {
    if (teamMembers.length >= 2) {
      showWarningAlert(
        'Batas Maksimal Anggota',
        'Maksimal anggota kelompok adalah 3 orang (termasuk Ketua Tim).'
      );
      return;
    }
    const newId = teamMembers.length + 2;
    setTeamMembers([
      ...teamMembers,
      {
        id: newId,
        fullName: '',
        email: '',
        phone: '',
        nim: '',
      },
    ]);
    showToast('success', 'Anggota tim berhasil ditambahkan');
  };

  // Remove Member
  const handleRemoveMember = async (id: number) => {
    const confirmed = await showDeleteConfirmAlert({
      title: 'Hapus Anggota Tim?',
      text: 'Apakah Anda yakin ingin menghapus data anggota kelompok ini?',
      confirmButtonText: 'Ya, Hapus Anggota',
    });

    if (confirmed) {
      setTeamMembers(teamMembers.filter((m) => m.id !== id));
      showToast('info', 'Anggota tim berhasil dihapus');
    }
  };

  // Update Member
  const handleUpdateMember = (id: number, field: keyof TeamMember, value: string) => {
    setTeamMembers(
      teamMembers.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  // Handle Document Upload
  const handleDocumentUpload = (docId: number, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocuments(
        documents.map((d) =>
          d.id === docId
            ? { ...d, fileName: file.name, status: 'Berhasil Upload' }
            : d
        )
      );
      showToast('success', `Berkas ${file.name} berhasil diunggah!`);
    }
  };

  // Handle Document Delete
  const handleDocumentDelete = async (docId: number) => {
    const confirmed = await showDeleteConfirmAlert({
      title: 'Hapus Berkas Pendaftaran?',
      text: 'Apakah Anda yakin ingin menghapus berkas pendaftaran ini?',
      confirmButtonText: 'Ya, Hapus Berkas',
    });

    if (confirmed) {
      setDocuments(
        documents.map((d) =>
          d.id === docId
            ? { ...d, fileName: undefined, status: 'Belum Upload Berkas' }
            : d
        )
      );
      showToast('info', 'Berkas berhasil dihapus');
    }
  };

  // Handle Submit Final Pendaftaran
  const handleSubmitFinal = async (e: FormEvent) => {
    e.preventDefault();
    if (!isDeclared) {
      showWarningAlert(
        'Pernyataan Belum Dicentang',
        'Silakan centang pernyataan kebenaran data terlebih dahulu sebelum melakukan submit.'
      );
      return;
    }

    const confirmed = await showConfirmAlert({
      title: 'Konfirmasi Kirim Pendaftaran',
      text: 'Apakah Anda yakin seluruh data dan berkas pendaftaran Anda sudah benar dan lengkap? Data yang sudah dikirim tidak dapat diubah.',
      confirmButtonText: 'Ya, Kirim Pendaftaran',
      cancelButtonText: 'Batal',
      icon: 'question',
    });

    if (confirmed) {
      setIsSubmitted(true);
      showSuccessAlert(
        'Pendaftaran Berhasil Dikirim!',
        'Data pendaftaran magang Anda telah tersimpan dan sedang dalam proses peninjauan oleh verifikator.'
      );
      if (onSuccessSubmit) {
        onSuccessSubmit();
      }
    }
  };

  const stepsList = [
    { num: 1, label: 'Biodata' },
    { num: 2, label: 'Tipe Pendaftaran' },
    { num: 3, label: 'Bidang & Kategori' },
    { num: 4, label: 'Berkas' },
    { num: 5, label: 'Review & Submit' },
  ];

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 p-8 shadow-2xs text-center space-y-6 max-w-2xl mx-auto animate-in zoom-in-95">
        <div className="w-20 h-20 bg-emerald-100 text-[#1f877c] rounded-full flex items-center justify-center mx-auto text-4xl shadow-sm">
          <span className="material-symbols-outlined text-5xl">task_alt</span>
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Pendaftaran Berhasil Dikirim!
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            Terima kasih telah melengkapi formulir pendaftaran magang di DISKOMINFOSAN Kota Yogyakarta. Data dan berkas Anda telah tersimpan dan sedang ditinjau oleh tim verifikator.
          </p>
        </div>

        <div className="p-4 bg-[#E6F7F3] border border-emerald-200 rounded-2xl text-left text-xs space-y-2">
          <div className="flex justify-between font-bold text-slate-800">
            <span>Nomor Pendaftaran:</span>
            <span className="text-[#1f877c] font-mono">REG-2026-0589</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Status Pendaftaran:</span>
            <span className="font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full text-[11px]">
              Sedang Ditinjau
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsSubmitted(false)}
          className="bg-[#1f877c] hover:bg-[#196e65] text-white font-bold text-xs px-6 py-3 rounded-xl transition-all cursor-pointer shadow-2xs"
        >
          Lihat Status & Detail Pendaftaran
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Pendaftaran Magang
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Lengkapi data berikut untuk mendaftar program magang di DISKOMINFOSAN Kota Yogyakarta
        </p>
      </div>

      {/* Stepper Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-2xs overflow-x-auto">
        <div className="min-w-[650px] flex items-center justify-between relative px-4">
          {stepsList.map((step, idx) => {
            const isActive = currentStep === step.num;
            const isCompleted = currentStep > step.num;

            return (
              <div key={step.num} className="flex-1 flex items-center relative">
                <div
                  className="flex flex-col items-center cursor-pointer group"
                  onClick={() => setCurrentStep(step.num)}
                >
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full font-extrabold text-xs sm:text-sm flex items-center justify-center transition-all ${
                      isActive || isCompleted
                        ? 'bg-[#1f877c] text-white shadow-xs'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {step.num}
                  </div>
                  <span
                    className={`text-[11px] sm:text-xs font-bold mt-2 whitespace-nowrap transition-colors ${
                      isActive
                        ? 'text-[#1f877c]'
                        : isCompleted
                        ? 'text-slate-800'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>

                {/* Connecting Line */}
                {idx < stepsList.length - 1 && (
                  <div className="flex-1 h-[3px] mx-3 sm:mx-6 bg-slate-200 rounded-full relative -top-3">
                    <div
                      className="h-full bg-[#1f877c] transition-all duration-300 rounded-full"
                      style={{
                        width: isCompleted ? '100%' : '0%',
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP 1: BIODATA */}
      {currentStep === 1 && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-8 shadow-2xs space-y-8">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-base sm:text-lg font-bold text-[#1f877c]">
              Informasi Personal
            </h2>
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
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
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
                <label className="block font-bold text-slate-700 mb-1">Nama Kampus / Universitas <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  value={biodata.university}
                  onChange={(e) => setBiodata({ ...biodata, university: e.target.value })}
                  placeholder="Masukkan Nama Kampus"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#1f877c] outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Program Studi <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  value={biodata.major}
                  onChange={(e) => setBiodata({ ...biodata, major: e.target.value })}
                  placeholder="Masukkan Program Studi"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#1f877c] outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Semester <span className="text-rose-500">*</span></label>
                <select
                  value={biodata.semester}
                  onChange={(e) => setBiodata({ ...biodata, semester: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#1f877c] outline-none bg-white"
                >
                  <option value="1">Semester 1</option>
                  <option value="2">Semester 2</option>
                  <option value="3">Semester 3</option>
                  <option value="4">Semester 4</option>
                  <option value="5">Semester 5</option>
                  <option value="6">Semester 6</option>
                  <option value="7">Semester 7</option>
                  <option value="8">Semester 8</option>
                </select>
              </div>
            </div>
            <div className="text-xs">
              <label className="block font-bold text-slate-700 mb-1">NIM (Nomor Induk Mahasiswa) <span className="text-rose-500">*</span></label>
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
                <label className="block font-bold text-slate-700 mb-1">Judul/Topik Project <span className="text-rose-500">*</span></label>
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
                  <label className="block font-bold text-slate-700 mb-1">Keahlian <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    value={biodata.skills}
                    onChange={(e) => setBiodata({ ...biodata, skills: e.target.value })}
                    placeholder="Contoh: UI/UX Design, Web Development, dll"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#1f877c] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tools yang Dikuasai <span className="text-rose-500">*</span></label>
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
                  value={biodata.startDate}
                  onChange={(e) => setBiodata({ ...biodata, startDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#1f877c] outline-none bg-white"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tanggal Selesai</label>
                <input
                  type="date"
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
                <span className="block font-bold text-slate-900">Draft tersimpan otomatis</span>
                <span className="text-[11px] font-medium text-slate-500">Terakhir disimpan 05 Mei 2025, 19:00 WIB</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-6 py-2.5 bg-[#1f877c] hover:bg-[#196e65] text-white font-bold text-xs rounded-xl shadow-2xs transition-all cursor-pointer ml-auto"
            >
              Simpan & Lanjutkan
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: TIPE PENDAFTARAN */}
      {currentStep === 2 && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-8 shadow-2xs space-y-6">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Pilih Tipe Pendaftaran</h2>
            <p className="text-xs text-slate-500 mt-0.5">Pilih tipe pendaftaran yang sesuai dengan kondisi Anda.</p>
          </div>

          {/* Type Choice Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Individu */}
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

            {/* Kelompok */}
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
                      onClick={() => handleRemoveMember(member.id)}
                      className="px-3 py-1 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <span>Hapus Anggota</span>
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Nama Lengkap <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        placeholder="Masukkan nama lengkap"
                        value={member.fullName}
                        onChange={(e) => handleUpdateMember(member.id, 'fullName', e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Email <span className="text-rose-500">*</span></label>
                      <input
                        type="email"
                        placeholder="Masukkan email"
                        value={member.email}
                        onChange={(e) => handleUpdateMember(member.id, 'email', e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">No. Handphone <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        placeholder="Masukkan no handphone"
                        value={member.phone}
                        onChange={(e) => handleUpdateMember(member.id, 'phone', e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 outline-none"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block font-bold text-slate-700 mb-1">NIM (Nomor Induk Mahasiswa) <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        placeholder="Masukkan NIM"
                        value={member.nim}
                        onChange={(e) => handleUpdateMember(member.id, 'nim', e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {teamMembers.length < 2 && (
                <button
                  type="button"
                  onClick={handleAddMember}
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
              onClick={() => setCurrentStep(1)}
              className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white font-bold text-xs text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
            >
              Kembali
            </button>

            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-6 py-2.5 bg-[#1f877c] hover:bg-[#196e65] text-white font-bold text-xs rounded-xl shadow-2xs transition-all cursor-pointer ml-auto"
            >
              Simpan & Lanjutkan
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: BIDANG & KATEGORI */}
      {currentStep === 3 && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-8 shadow-2xs space-y-6">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Pilih Bidang & Kategori</h2>
            <p className="text-xs text-slate-500 mt-0.5">Pilih bidang & kategori sesuai dengan minat dan keahlian Anda.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Pilih Bidang <span className="text-rose-500">*</span></label>
              <select
                value={selectedBidang}
                onChange={(e) => setSelectedBidang(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#1f877c] outline-none bg-white font-semibold text-slate-800"
              >
                <option value="Bidang Sistem Informasi dan Statistik">Bidang Sistem Informasi dan Statistik</option>
                <option value="Bidang Persandian dan Telekomunikasi">Bidang Persandian dan Telekomunikasi</option>
                <option value="Bidang Komunikasi dan Informasi Publik">Bidang Komunikasi dan Informasi Publik</option>
                <option value="Bidang Infrastructure dan SPBE">Bidang Infrastructure dan SPBE</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Pilih Kategori <span className="text-rose-500">*</span></label>
              <select
                value={selectedKategori}
                onChange={(e) => setSelectedKategori(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#1f877c] outline-none bg-white font-semibold text-slate-800"
              >
                <option value="Perencanaan dan Implementasi Sistem Informasi">Perencanaan dan Implementasi Sistem Informasi</option>
                <option value="Pengembangan Aplikasi Web & Mobile">Pengembangan Aplikasi Web & Mobile</option>
                <option value="Desain Komunikasi Visual & Konten Digital">Desain Komunikasi Visual & Konten Digital</option>
                <option value="Jaringan dan Keamanan Siber">Jaringan dan Keamanan Siber</option>
              </select>
            </div>
          </div>

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
              onClick={() => setCurrentStep(2)}
              className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white font-bold text-xs text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
            >
              Kembali
            </button>

            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="px-6 py-2.5 bg-[#1f877c] hover:bg-[#196e65] text-white font-bold text-xs rounded-xl shadow-2xs transition-all cursor-pointer ml-auto"
            >
              Simpan & Lanjutkan
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: BERKAS */}
      {currentStep === 4 && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-8 shadow-2xs space-y-6">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Upload Berkas Pendaftaran</h2>
            <p className="text-xs text-slate-500 mt-0.5">Pastikan semua berkas sesuai dengan ketentuan yang berlaku.</p>
          </div>

          {/* Alert Info */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-center gap-3 text-xs text-slate-700">
            <span className="material-symbols-outlined text-emerald-700 text-lg">info</span>
            <div>
              <span className="font-bold text-emerald-900 mr-1">Informasi:</span>
              <span>Semua berkas wajib diunggah dalam format yang sesuai dan dalam kondisi jelas terbaca.</span>
            </div>
          </div>

          {/* Table of Documents */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-700 font-bold">
                  <th className="py-3 px-2">No</th>
                  <th className="py-3 px-2">Jenis Berkas</th>
                  <th className="py-3 px-2">Keterangan</th>
                  <th className="py-3 px-2">Format</th>
                  <th className="py-3 px-2">Ukuran Maks</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {documents.map((doc, idx) => (
                  <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-2 font-medium text-slate-500">{idx + 1}</td>
                    <td className="py-4 px-2">
                      <span className="font-bold text-slate-900 block">{doc.name}</span>
                      <span className="text-[11px] text-slate-400 block mt-0.5">{doc.desc}</span>
                    </td>
                    <td className="py-4 px-2">
                      {doc.required ? (
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          Wajib
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          Optional
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-2 font-medium text-slate-600">{doc.format}</td>
                    <td className="py-4 px-2 font-medium text-slate-600">{doc.maxSize}</td>
                    <td className="py-4 px-2">
                      {doc.status === 'Berhasil Upload' ? (
                        <span className="font-bold text-emerald-600 text-xs">Berhasil Upload</span>
                      ) : (
                        <span className="text-slate-400 font-medium">Belum Upload Berkas</span>
                      )}
                    </td>
                    <td className="py-4 px-2 text-center">
                      {doc.status === 'Berhasil Upload' ? (
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => alert(`Melihat berkas: ${doc.fileName}`)}
                            className="p-1.5 rounded-lg border border-slate-200 hover:border-[#1f877c] text-emerald-700 hover:bg-[#E6F7F3] cursor-pointer"
                            title="Lihat Berkas"
                          >
                            <span className="material-symbols-outlined text-base">visibility</span>
                          </button>
                          <label className="p-1.5 rounded-lg border border-slate-200 hover:border-[#1f877c] text-emerald-700 hover:bg-[#E6F7F3] cursor-pointer inline-block">
                            <input type="file" onChange={(e) => handleDocumentUpload(doc.id, e)} className="hidden" />
                            <span className="material-symbols-outlined text-base block">edit</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => handleDocumentDelete(doc.id)}
                            className="p-1.5 rounded-lg border border-slate-200 hover:border-rose-400 text-rose-500 hover:bg-rose-50 cursor-pointer"
                            title="Hapus Berkas"
                          >
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                        </div>
                      ) : (
                        <label className="p-2 rounded-xl border border-[#1f877c] text-[#1f877c] hover:bg-[#E6F7F3] font-bold text-xs cursor-pointer inline-flex items-center gap-1">
                          <input type="file" onChange={(e) => handleDocumentUpload(doc.id, e)} className="hidden" />
                          <span className="material-symbols-outlined text-base">upload</span>
                        </label>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom Bar Footer */}
          <div className="p-4 bg-[#E6F7F3] border border-emerald-200 rounded-2xl flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white font-bold text-xs text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
            >
              Kembali
            </button>

            <button
              type="button"
              onClick={() => setCurrentStep(5)}
              className="px-6 py-2.5 bg-[#1f877c] hover:bg-[#196e65] text-white font-bold text-xs rounded-xl shadow-2xs transition-all cursor-pointer ml-auto"
            >
              Simpan & Lanjutkan
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: REVIEW & SUBMIT */}
      {currentStep === 5 && (
        <form onSubmit={handleSubmitFinal} className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-8 shadow-2xs space-y-8">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">Review Pendaftaran</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Periksa kembali seluruh data yang telah Anda lengkapi sebelum melakukan submit.
              </p>
            </div>

            {/* SECTION 1: BIODATA */}
            <div className="p-5 sm:p-6 bg-white border border-slate-200 rounded-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#E6F7F3] text-[#1f877c] flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-lg">account_circle</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Biodata</h3>
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-3.5 py-1.5 rounded-xl border border-[#1f877c] text-[#1f877c] hover:bg-[#E6F7F3] font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                >
                  <span>Ubah</span>
                  <span className="material-symbols-outlined text-sm">edit_note</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                {/* Informasi Personal */}
                <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-100 space-y-2">
                  <h4 className="font-bold text-[#1f877c] text-xs border-b border-slate-200/80 pb-1.5">Informasi Personal</h4>
                  <div><span className="text-slate-400 block font-medium">Nama Lengkap</span><span className="font-bold text-slate-900">{biodata.fullName}</span></div>
                  <div><span className="text-slate-400 block font-medium">Email</span><span className="font-bold text-slate-900">{biodata.email}</span></div>
                  <div><span className="text-slate-400 block font-medium">No. Handphone</span><span className="font-bold text-slate-900">{biodata.phone}</span></div>
                  <div><span className="text-slate-400 block font-medium">Alamat Lengkap</span><span className="font-bold text-slate-900">{biodata.address}</span></div>
                </div>

                {/* Informasi Akademik */}
                <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-100 space-y-2">
                  <h4 className="font-bold text-[#1f877c] text-xs border-b border-slate-200/80 pb-1.5">Informasi Akademik</h4>
                  <div><span className="text-slate-400 block font-medium">Nama Kampus / Universitas</span><span className="font-bold text-slate-900">{biodata.university}</span></div>
                  <div><span className="text-slate-400 block font-medium">Program Studi</span><span className="font-bold text-slate-900">{biodata.major}</span></div>
                  <div><span className="text-slate-400 block font-medium">Semester</span><span className="font-bold text-slate-900">{biodata.semester}</span></div>
                  <div><span className="text-slate-400 block font-medium">NIM</span><span className="font-bold text-slate-900">{biodata.nim}</span></div>
                </div>

                {/* Informasi Project */}
                <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-100 space-y-2">
                  <h4 className="font-bold text-[#1f877c] text-xs border-b border-slate-200/80 pb-1.5">Informasi Project</h4>
                  <div><span className="text-slate-400 block font-medium">Judul / Informasi project</span><span className="font-bold text-slate-900">{biodata.projectTitle}</span></div>
                  <div><span className="text-slate-400 block font-medium">Keahlian</span><span className="font-bold text-slate-900">{biodata.skills}</span></div>
                  <div><span className="text-slate-400 block font-medium">Tools yang dikuasai</span><span className="font-bold text-slate-900">{biodata.tools}</span></div>
                </div>

                {/* Periode Magang */}
                <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-100 space-y-2">
                  <h4 className="font-bold text-[#1f877c] text-xs border-b border-slate-200/80 pb-1.5">Periode Magang</h4>
                  <div><span className="text-slate-400 block font-medium">Tanggal Mulai</span><span className="font-bold text-slate-900">{biodata.startDate}</span></div>
                  <div><span className="text-slate-400 block font-medium">Tanggal Selesai</span><span className="font-bold text-slate-900">{biodata.endDate}</span></div>
                </div>
              </div>
            </div>

            {/* SECTION 2: TIPE PENDAFTARAN */}
            <div className="p-5 sm:p-6 bg-white border border-slate-200 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#E6F7F3] text-[#1f877c] flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-lg">group</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Tipe Pendaftaran</h3>
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-3.5 py-1.5 rounded-xl border border-[#1f877c] text-[#1f877c] hover:bg-[#E6F7F3] font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                >
                  <span>Ubah</span>
                  <span className="material-symbols-outlined text-sm">edit_note</span>
                </button>
              </div>

              <div className="text-xs text-slate-700 flex items-center gap-6">
                <div><span className="text-slate-400 font-medium mr-2">Tipe Pendaftaran:</span><span className="font-bold text-slate-900">{registrationType}</span></div>
                {registrationType === 'Kelompok' && (
                  <div><span className="text-slate-400 font-medium mr-2">Jumlah Anggota:</span><span className="font-bold text-slate-900">{teamMembers.length + 1} Orang</span></div>
                )}
              </div>

              {registrationType === 'Kelompok' && (
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold text-slate-900">Anggota Kelompok</h4>

                  {/* Ketua */}
                  <div className="p-3.5 bg-[#E6F7F3]/70 border border-emerald-200 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#E6F7F3] text-[#1f877c] border border-emerald-300">Ketua Tim</span>
                      <span className="font-bold text-slate-900">{biodata.fullName}</span>
                    </div>
                    <span className="text-slate-600">{biodata.email}</span>
                    <span className="text-slate-600">{biodata.phone}</span>
                  </div>

                  {/* Anggota List */}
                  {teamMembers.map((m, i) => (
                    <div key={m.id} className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-500 w-24">Anggota {i + 2}</span>
                        <span className="font-bold text-slate-900">{m.fullName || 'Belum diisi'}</span>
                      </div>
                      <span className="text-slate-600">{m.email || '-'}</span>
                      <span className="text-slate-600">{m.phone || '-'}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SECTION 3: BIDANG & KATEGORI */}
            <div className="p-5 sm:p-6 bg-white border border-slate-200 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#E6F7F3] text-[#1f877c] flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-lg">category</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Bidang & Kategori</h3>
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-3.5 py-1.5 rounded-xl border border-[#1f877c] text-[#1f877c] hover:bg-[#E6F7F3] font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                >
                  <span>Ubah</span>
                  <span className="material-symbols-outlined text-sm">edit_note</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 font-bold block mb-1">Bidang yang dipilih</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedBidang}</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 font-bold block mb-1">Kategori yang dipilih</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedKategori}</span>
                </div>
              </div>
            </div>

            {/* SECTION 4: BERKAS PENDAFTARAN */}
            <div className="p-5 sm:p-6 bg-white border border-slate-200 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#E6F7F3] text-[#1f877c] flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-lg">folder</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Berkas Pendaftaran</h3>
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="px-3.5 py-1.5 rounded-xl border border-[#1f877c] text-[#1f877c] hover:bg-[#E6F7F3] font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                >
                  <span>Ubah</span>
                  <span className="material-symbols-outlined text-sm">edit_note</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-700 font-bold">
                      <th className="py-2.5 px-2">No</th>
                      <th className="py-2.5 px-2">Jenis Berkas</th>
                      <th className="py-2.5 px-2">File</th>
                      <th className="py-2.5 px-2">Ukuran</th>
                      <th className="py-2.5 px-2">Status</th>
                      <th className="py-2.5 px-2 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {documents.map((doc, idx) => (
                      <tr key={doc.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-2 font-medium text-slate-500">{idx + 1}</td>
                        <td className="py-3 px-2 font-bold text-slate-900">{doc.name}</td>
                        <td className="py-3 px-2 text-slate-600 font-mono">{doc.fileName || '-'}</td>
                        <td className="py-3 px-2 text-slate-500">{doc.maxSize}</td>
                        <td className="py-3 px-2">
                          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            Lengkap
                          </span>
                        </td>
                        <td className="py-3 px-2 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => alert(`Melihat berkas: ${doc.fileName}`)}
                              className="p-1.5 rounded-lg border border-slate-200 hover:border-[#1f877c] text-emerald-700 hover:bg-[#E6F7F3] cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-base">visibility</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setCurrentStep(4)}
                              className="p-1.5 rounded-lg border border-slate-200 hover:border-[#1f877c] text-emerald-700 hover:bg-[#E6F7F3] cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-base">edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => alert('Fitur hapus berkas pada mode review')}
                              className="p-1.5 rounded-lg border border-slate-200 hover:border-rose-400 text-rose-500 hover:bg-rose-50 cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-base">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SECTION 5: PERNYATAAN */}
            <div className="p-5 bg-[#E6F7F3] border border-emerald-200 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                <span className="material-symbols-outlined text-emerald-700 text-lg">verified</span>
                <span>Pernyataan</span>
              </div>

              <label className="flex items-start gap-3 cursor-pointer text-xs text-slate-700 leading-relaxed">
                <input
                  type="checkbox"
                  checked={isDeclared}
                  onChange={(e) => setIsDeclared(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-emerald-400 text-[#1f877c] focus:ring-[#1f877c] cursor-pointer"
                />
                <span>
                  Saya menyatakan bahwa semua data yang saya isi adalah benar dan dapat dipertanggungjawabkan. Saya memahami bahwa data yang sudah di submit tidak dapat diubah.
                </span>
              </label>
            </div>

            {/* Bottom Bar Footer Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white font-bold text-xs text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
              >
                Kembali
              </button>

              <button
                type="submit"
                className="px-6 py-3 bg-[#1f877c] hover:bg-[#196e65] text-white font-bold text-xs rounded-xl shadow-2xs transition-all cursor-pointer"
              >
                Submit Pendaftaran
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
