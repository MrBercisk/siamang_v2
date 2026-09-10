import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { User } from '../../types/auth';
import { ApplicationStatus } from '../../types/internship';
import { useInternshipData } from '../../hooks/useInternshipData';
import {
  showSuccessAlert,
  showWarningAlert,
  showConfirmAlert,
  showDeleteConfirmAlert,
  showToast,
} from '../../utils/swal';
import { BiodataState, DocumentFile, RegistrationType, TeamMember } from './types';
import { StepperHeader } from './steps/StepperHeader';
import { StepBiodata } from './steps/StepBiodata';
import { StepTipePendaftaran } from './steps/StepTipePendaftaran';
import { StepBidangKategori } from './steps/StepBidangKategori';
import { StepBerkas } from './steps/StepBerkas';
import { StepReviewSubmit } from './steps/StepReviewSubmit';
import { SubmissionSuccess } from './steps/SubmissionSuccess';

interface PendaftaranFormViewProps {
  user: User;
  onSubmitApplication?: (data: any) => Promise<ApplicationStatus>;
  onSuccessSubmit?: (application?: ApplicationStatus) => void;
}

const DRAFT_KEY = 'si_amang_pendaftaran_draft';

interface DraftState {
  currentStep: number;
  biodata: BiodataState;
  registrationType: RegistrationType;
  teamMembers: TeamMember[];
  selectedBidang: string;
  selectedKategori: string;
  isDeclared: boolean;
  savedAt: string;
}

function loadDraft(): DraftState | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DraftState;
  } catch {
    return null;
  }
}

function getDefaultBiodata(user: User): BiodataState {
  return {
    photoUrl: '',
    fullName: user.name || 'Leona Strive',
    email: user.email || 'leona@gmail.com',
    phone: '08123456789',
    address: 'Yogyakarta',
    university: user.institution || '',
    major: '',
    semester: '5',
    nim: '',
    projectTitle: '',
    skills: '',
    tools: '',
    startDate: '',
    endDate: '',
  };
}

export function PendaftaranFormView({
  user,
  onSubmitApplication,
  onSuccessSubmit,
}: PendaftaranFormViewProps) {
  const {
    bidangs,
    kategoriByBidang,
    submitApplication: internalSubmitApplication,
  } = useInternshipData();
  const [submittedApp, setSubmittedApp] = useState<ApplicationStatus | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Muat draft yang tersimpan (kalau ada) sekali saat komponen pertama kali dirender
  const [initialDraft] = useState<DraftState | null>(() => loadDraft());

  // Current Step: 1 = Biodata, 2 = Tipe Pendaftaran, 3 = Bidang & Kategori, 4 = Berkas, 5 = Review & Submit
  const [currentStep, setCurrentStep] = useState<number>(initialDraft?.currentStep ?? 1);

  // Step 1: Biodata State
  const [biodata, setBiodata] = useState<BiodataState>(
    initialDraft?.biodata ?? getDefaultBiodata(user)
  );

  // Step 2: Tipe Pendaftaran State
  const [registrationType, setRegistrationType] = useState<RegistrationType>(
    initialDraft?.registrationType ?? 'Kelompok'
  );
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(
    initialDraft?.teamMembers ?? [
      { id: 2, fullName: 'Sara', email: 'sara@gmail.com', phone: '08xxxxxxxxxx', nim: '12345679' },
    ]
  );

  // Step 3: Bidang & Kategori State
  const [selectedBidang, setSelectedBidang] = useState<string>(initialDraft?.selectedBidang ?? '');
  const [selectedKategori, setSelectedKategori] = useState<string>(initialDraft?.selectedKategori ?? '');

  // Step 4: Berkas State — TIDAK dipulihkan dari draft, karena File tidak bisa disimpan di localStorage.
  // User perlu mengunggah ulang berkas setelah refresh halaman.
  const [documents, setDocuments] = useState<DocumentFile[]>([
    {
      id: 1,
      name: 'Pas Foto 3 × 4',
      desc: 'Pas foto terbaru dengan latar belakang bebas',
      required: true,
      format: 'JPG / PNG',
      maxSize: '200 KB',
      fileName: undefined,
      status: 'Belum Upload Berkas',
    },
    {
      id: 2,
      name: 'Berkas Persyaratan Pendaftaran',
      desc: 'Gabungkan semua berkas persyaratan dalam 1 file PDF',
      required: true,
      format: 'PDF',
      maxSize: '2 MB',
      fileName: undefined,
      status: 'Belum Upload Berkas',
    },
    {
      id: 3,
      name: 'Surat NDA Perjanjian Magang Mahasiswa',
      desc: 'Surat NDA yang sudah ditandatangani peserta',
      required: true,
      format: 'PDF',
      maxSize: '1 MB',
      fileName: undefined,
      status: 'Belum Upload Berkas',
    },
    {
      id: 4,
      name: 'Surat Permohonan',
      desc: 'Surat permohonan magang dari kampus/institusi',
      required: true,
      format: 'PDF',
      maxSize: '1 MB',
      fileName: undefined,
      status: 'Belum Upload Berkas',
    },
    {
      id: 5,
      name: 'Video Perkenalan',
      desc: 'Video perkenalan diri (maks. 2 menit)',
      required: false,
      format: 'MP4',
      maxSize: '20 MB',
      fileName: undefined,
      status: 'Belum Upload Berkas',
    },
  ]);

  // Step 5: Pernyataan Checkbox
  const [isDeclared, setIsDeclared] = useState(initialDraft?.isDeclared ?? false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(initialDraft?.savedAt ?? null);

  // Simpan draft otomatis setiap kali data berubah (kecuali dokumen — lihat catatan di atas)
  useEffect(() => {
    if (isSubmitted) return; // jangan simpan draft lagi setelah berhasil submit

    const timeout = setTimeout(() => {
      const draft: DraftState = {
        currentStep,
        biodata,
        registrationType,
        teamMembers,
        selectedBidang,
        selectedKategori,
        isDeclared,
        savedAt: new Date().toISOString(),
      };
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
        setLastSavedAt(draft.savedAt);
      } catch {
        // localStorage penuh/diblokir — abaikan secara diam-diam, tidak kritikal
      }
    }, 500); // debounce ringan supaya tidak menulis di setiap ketikan

    return () => clearTimeout(timeout);
  }, [currentStep, biodata, registrationType, teamMembers, selectedBidang, selectedKategori, isDeclared, isSubmitted]);

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
  };

  // Cari nama asli Bidang & Kategori dari ID terpilih, untuk ditampilkan/payload
  const selectedBidangName = bidangs.find((b) => b.id === selectedBidang)?.name || '';
  const selectedKategoriName =
    (kategoriByBidang[selectedBidang] || []).find((k) => k.id === selectedKategori)?.name || '';

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
    setTeamMembers([...teamMembers, { id: newId, fullName: '', email: '', phone: '', nim: '' }]);
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
    setTeamMembers(teamMembers.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
  };

  // Handle Document Upload
  const handleDocumentUpload = (docId: number, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocuments(
        documents.map((d) =>
          d.id === docId ? { ...d, file, fileName: file.name, status: 'Berhasil Upload' } : d
        )
      );
      showToast('success', `Berkas ${file.name} siap dikirim saat submit`);
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
          d.id === docId ? { ...d, file: undefined, fileName: undefined, status: 'Belum Upload Berkas' } : d
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

    if (!confirmed) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('applicantName', biodata.fullName);
      formData.append('institution', biodata.university);
      formData.append('major', biodata.major);
      formData.append('nim', biodata.nim);
      formData.append('phone', biodata.phone);
      formData.append('email', biodata.email);
      formData.append('address', biodata.address);
      formData.append('projectTitle', biodata.projectTitle);
      formData.append('skills', biodata.skills);
      formData.append('tools', biodata.tools);
      formData.append('startDate', biodata.startDate);
      formData.append('endDate', biodata.endDate);
      formData.append('fieldId', selectedBidang);
      formData.append('fieldName', selectedBidangName);
      formData.append('kategoriName', selectedKategoriName);
      formData.append('registrationType', registrationType);
      formData.append('notes', 'Pendaftaran magang berhasil dikirim dan siap diverifikasi.');

      if (registrationType === 'Kelompok') {
        teamMembers.forEach((m, i) => {
          formData.append(`teamMembers[${i}][fullName]`, m.fullName);
          formData.append(`teamMembers[${i}][email]`, m.email);
          formData.append(`teamMembers[${i}][phone]`, m.phone);
          formData.append(`teamMembers[${i}][nim]`, m.nim);
        });
      }

      documents.forEach((d, i) => {
        if (d.file) {
          formData.append(`documents[${i}][document_type]`, d.name);
          formData.append(`documents[${i}][file]`, d.file);
        }
      });

      const result = onSubmitApplication
        ? await onSubmitApplication(formData)
        : await internalSubmitApplication(formData);

      setSubmittedApp(result);
      setIsSubmitted(true);
      clearDraft(); // hapus draft setelah berhasil submit, form tidak perlu dipulihkan lagi
      showSuccessAlert(
        'Pendaftaran Berhasil Dikirim!',
        `Data pendaftaran magang Anda (${result.id}) telah tersimpan dan sedang dalam proses peninjauan oleh verifikator.`
      );
    } catch {
      showWarningAlert('Gagal Mengirim', 'Terjadi kendala saat menyimpan pendaftaran. Silakan coba kembali.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <SubmissionSuccess
        submittedApp={submittedApp}
        selectedBidang={selectedBidangName}
        selectedKategori={selectedKategoriName}
        registrationType={registrationType}
        onSuccessSubmit={onSuccessSubmit}
        onBackToForm={() => {
          setIsSubmitted(false);
          setCurrentStep(1);
        }}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Pendaftaran Magang</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Lengkapi data berikut untuk mendaftar program magang di DISKOMINFOSAN Kota Yogyakarta
        </p>
      </div>

      <StepperHeader currentStep={currentStep} onStepClick={setCurrentStep} />

      {currentStep === 1 && (
        <StepBiodata
          biodata={biodata}
          setBiodata={setBiodata}
          onPhotoUpload={handlePhotoUpload}
          onNext={() => setCurrentStep(2)}
           lastSavedAt={lastSavedAt} 
        />
      )}

      {currentStep === 2 && (
        <StepTipePendaftaran
          registrationType={registrationType}
          setRegistrationType={setRegistrationType}
          teamMembers={teamMembers}
          biodata={biodata}
          onAddMember={handleAddMember}
          onRemoveMember={handleRemoveMember}
          onUpdateMember={handleUpdateMember}
          onBack={() => setCurrentStep(1)}
          onNext={() => setCurrentStep(3)}
        />
      )}

      {currentStep === 3 && (
        <StepBidangKategori
          bidangOptions={bidangs}
          kategoriByBidang={kategoriByBidang}
          selectedBidang={selectedBidang}
          setSelectedBidang={setSelectedBidang}
          selectedKategori={selectedKategori}
          setSelectedKategori={setSelectedKategori}
          onBack={() => setCurrentStep(2)}
          onNext={() => setCurrentStep(4)}
        />
      )}

      {currentStep === 4 && (
        <StepBerkas
          documents={documents}
          onUpload={handleDocumentUpload}
          onDelete={handleDocumentDelete}
          onBack={() => setCurrentStep(3)}
          onNext={() => setCurrentStep(5)}
        />
      )}

      {currentStep === 5 && (
        <StepReviewSubmit
          biodata={biodata}
          registrationType={registrationType}
          teamMembers={teamMembers}
          selectedBidang={selectedBidangName}
          selectedKategori={selectedKategoriName}
          documents={documents}
          isDeclared={isDeclared}
          setIsDeclared={setIsDeclared}
          onEditStep={setCurrentStep}
          onBack={() => setCurrentStep(4)}
          onSubmit={handleSubmitFinal}
        />
      )}
    </div>
  );
}