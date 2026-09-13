import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { User } from '../../../types/auth';
import { ApplicationStatus } from '../../../types/internship';
import { useInternshipData } from '../../../hooks/useInternshipData';
import { ApiError } from '../../../lib/api';
import {
  showSuccessAlert,
  showWarningAlert,
  showConfirmAlert,
  showDeleteConfirmAlert,
  showToast,
} from '../../../utils/swal';
import { BiodataState, DocumentFile, RegistrationType, TeamMember } from '../types';
import {
  PROFILE_PHOTO_KEY,
  saveDocumentFileToDb,
  deleteDocumentFileFromDb,
  getAllDocumentFilesFromDb,
  getFileFromDb,
  clearAllDocumentFilesFromDb,
} from '../lib/documentFileStorage';
import { formatBytes, validateDocumentFile } from '../lib/fileValidation';
import { DraftState, DRAFT_KEY, loadDraft, getDefaultBiodata } from '../lib/draftStorage';
import { DOCUMENT_TYPE_SLUG_MAP, INITIAL_DOCUMENTS } from '../lib/documentDefinitions';

interface UsePendaftaranFormArgs {
  user: User;
  onSubmitApplication?: (data: any) => Promise<ApplicationStatus>;
  onSuccessSubmit?: (application: ApplicationStatus) => void;
}

/**
 * Semua state, efek pemulihan/persistensi, dan handler untuk alur
 * Pendaftaran Magang (5 langkah). Diekstrak dari PendaftaranFormView.tsx
 * supaya komponen itu sendiri cukup jadi lapisan render saja.
 */
export function usePendaftaranForm({ user, onSubmitApplication, onSuccessSubmit }: UsePendaftaranFormArgs) {
  const {
    bidangs,
    kategoriByBidang,
    lowonganByKategori,
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
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialDraft?.teamMembers ?? []);

  // Step 3: Bidang & Kategori State
  const [selectedBidang, setSelectedBidang] = useState<string>(initialDraft?.selectedBidang ?? '');
  const [selectedKategori, setSelectedKategori] = useState<string>(initialDraft?.selectedKategori ?? '');
  const [selectedLowongan, setSelectedLowongan] = useState<string>(initialDraft?.selectedLowongan ?? '');

  // Step 4: Berkas State — metadata-nya statis di sini, tapi File asli
  // dipulihkan secara async dari IndexedDB lewat effect di bawah.
  const [documents, setDocuments] = useState<DocumentFile[]>(INITIAL_DOCUMENTS);
  const [isRestoringFiles, setIsRestoringFiles] = useState<boolean>(true);

  // Pulihkan berkas dokumen (id 1-5) dari IndexedDB sekali saat mount.
  useEffect(() => {
    let cancelled = false;

    getAllDocumentFilesFromDb()
      .then((filesById) => {
        if (cancelled || Object.keys(filesById).length === 0) return;

        setDocuments((prev) =>
          prev.map((doc) => {
            const restoredFile = filesById[doc.id];
            if (!restoredFile) return doc;
            return {
              ...doc,
              file: restoredFile,
              fileName: restoredFile.name,
              status: 'Berhasil Upload',
            };
          })
        );
      })
      .catch(() => {
        // IndexedDB tidak tersedia/diblokir (mis. mode private browsing) —
        // abaikan diam-diam, user tinggal upload ulang secara manual.
      })
      .finally(() => {
        if (!cancelled) setIsRestoringFiles(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Pulihkan foto profil dari IndexedDB, terpisah dari dokumen di atas.
  // Wajib dilakukan karena biodata.photoUrl yang tersimpan di draft
  // localStorage adalah blob: URL lama yang sudah tidak valid lagi setelah
  // refresh — tanpa ini, thumbnail & modal preview foto akan tampak rusak/kosong.
  useEffect(() => {
    let cancelled = false;

    getFileFromDb(PROFILE_PHOTO_KEY)
      .then((restoredFile) => {
        if (cancelled || !restoredFile) return;
        const freshUrl = URL.createObjectURL(restoredFile);
        setBiodata((prev) => ({
          ...prev,
          photoUrl: freshUrl,
          photoFileName: restoredFile.name,
        }));
      })
      .catch(() => {
        // IndexedDB tidak tersedia/diblokir — abaikan diam-diam, user
        // tinggal upload ulang foto profilnya secara manual.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Step 5: Pernyataan Checkbox
  const [isDeclared, setIsDeclared] = useState(initialDraft?.isDeclared ?? false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(initialDraft?.savedAt ?? null);

  // Simpan draft otomatis setiap kali data berubah (kecuali dokumen, karena
  // File-nya sendiri sudah dipersist terpisah lewat IndexedDB di atas)
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
        selectedLowongan,
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
  }, [
    currentStep,
    biodata,
    registrationType,
    teamMembers,
    selectedBidang,
    selectedKategori,
    selectedLowongan,
    isDeclared,
    isSubmitted,
  ]);

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
  };

  // Cari nama asli Bidang & Kategori dari ID terpilih, untuk ditampilkan/payload
  const selectedBidangName = bidangs.find((b) => b.id === selectedBidang)?.name || '';
  const selectedKategoriName =
    (kategoriByBidang[selectedBidang] || []).find((k) => k.id === selectedKategori)?.name || '';

  const selectedLowonganData = (lowonganByKategori[selectedKategori] || []).find(
    (lowongan) => lowongan.id === selectedLowongan
  );
  const selectedLowonganName = selectedLowonganData?.project || '';

  // Photo Upload Handler
  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const maxPhotoBytes = 2 * 1024 * 1024;

    if (!isImage) {
      showWarningAlert('Format Foto Tidak Sesuai', 'Foto profil harus berupa file gambar (JPG/PNG).');
      e.target.value = '';
      return;
    }

    if (file.size > maxPhotoBytes) {
      showWarningAlert(
        'Ukuran Foto Terlalu Besar',
        `Ukuran foto (${formatBytes(file.size)}) melebihi batas maksimal 2 MB. Silakan pilih foto lain.`
      );
      e.target.value = '';
      return;
    }

    // Revoke URL lama dulu (kalau ada) supaya tidak bocor memori sebelum diganti.
    if (biodata.photoUrl) {
      URL.revokeObjectURL(biodata.photoUrl);
    }

    setBiodata({ ...biodata, photoUrl: URL.createObjectURL(file), photoFileName: file.name });
    saveDocumentFileToDb(PROFILE_PHOTO_KEY, file).catch(() => {
      showWarningAlert(
        'Foto Tidak Tersimpan Permanen',
        'Foto profil berhasil diunggah untuk sesi ini, tetapi gagal disimpan untuk pemulihan otomatis. Jika halaman di-refresh sebelum submit, Anda perlu mengunggah ulang foto ini.'
      );
    });
    showToast('success', 'Foto profil berhasil diunggah!');
  };

  const handlePhotoDelete = () => {
    if (biodata.photoUrl) {
      URL.revokeObjectURL(biodata.photoUrl);
    }
    setBiodata({ ...biodata, photoUrl: '', photoFileName: undefined });
    deleteDocumentFileFromDb(PROFILE_PHOTO_KEY).catch(() => {});
    showToast('info', 'Foto profil berhasil dihapus');
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

  // Handle Document Upload — dengan validasi format & ukuran sebelum diterima
  const handleDocumentUpload = (docId: number, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const doc = documents.find((d) => d.id === docId);
    if (!doc) return;

    const validation = validateDocumentFile(file, doc);

    if (!validation.valid) {
      showWarningAlert(validation.errorTitle || 'Berkas Tidak Valid', validation.errorMessage || '');
      e.target.value = ''; // reset input supaya user bisa pilih ulang file yang sama jika perlu
      return;
    }

    setDocuments(
      documents.map((d) =>
        d.id === docId ? { ...d, file, fileName: file.name, status: 'Berhasil Upload' } : d
      )
    );

    // Simpan ke IndexedDB supaya tidak hilang kalau halaman di-refresh
    // sebelum submit final. Dijalankan async tanpa memblokir UI.
    saveDocumentFileToDb(docId, file).catch(() => {
      showWarningAlert(
        'Berkas Tidak Tersimpan Permanen',
        `Berkas "${doc.name}" berhasil diunggah untuk sesi ini, tetapi gagal disimpan untuk pemulihan otomatis. Jika halaman di-refresh sebelum submit, Anda perlu mengunggah ulang berkas ini.`
      );
    });

    showToast('success', `Berkas ${file.name} siap dikirim saat submit`);
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
      deleteDocumentFileFromDb(docId).catch(() => {
        // Kalau gagal hapus dari IndexedDB, tidak kritikal — cuma
        // berpotensi ada file "yatim" tersimpan yang tidak lagi dipakai.
      });
      showToast('info', 'Berkas berhasil dihapus');
    }
  };

  // Validasi kelengkapan berkas wajib — dipanggil sebelum submit final
  const validateRequiredDocuments = (): boolean => {
    const missingDocs = documents.filter((d) => d.required && !d.file);

    if (missingDocs.length > 0) {
      showWarningAlert(
        'Berkas Wajib Belum Lengkap',
        `Mohon unggah berkas berikut terlebih dahulu: ${missingDocs.map((d) => d.name).join(', ')}.`
      );
      return false;
    }

    return true;
  };

  // Handle Submit Final Pendaftaran
  const handleSubmitFinal = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateRequiredDocuments()) {
      return;
    }

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
      formData.append('lowonganId', selectedLowongan);
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

      // agree atau tidak
      formData.append('isDeclared', isDeclared ? '1' : '0');

      documents.forEach((d, i) => {
        if (d.file) {
          const slug = DOCUMENT_TYPE_SLUG_MAP[d.id];
          if (!slug) {
            // Lewati dokumen yang belum punya padanan enum di backend,
            // supaya tidak menyebabkan seluruh transaction gagal.
            return;
          }
          formData.append(`documents[${i}][document_type]`, slug);
          formData.append(`documents[${i}][file]`, d.file);
        }
      });

      const result = onSubmitApplication
        ? await onSubmitApplication(formData)
        : await internalSubmitApplication(formData);

      setSubmittedApp(result);
      setIsSubmitted(true);
      onSuccessSubmit?.(result);

      clearDraft(); // hapus draft setelah berhasil submit, form tidak perlu dipulihkan lagi
      clearAllDocumentFilesFromDb().catch(() => {});
      showSuccessAlert(
        'Pendaftaran Berhasil Dikirim!',
        `Data pendaftaran magang Anda (${result.id}) telah tersimpan dan sedang dalam proses peninjauan oleh verifikator.`
      );
    } catch (err) {
      // Tampilkan pesan error asli dari backend (mis. field mana yang
      // tidak valid) kalau ada, daripada pesan generik yang membingungkan.
      const message =
        err instanceof ApiError && err.message
          ? err.message
          : 'Terjadi kendala saat menyimpan pendaftaran. Silakan coba kembali.';
      showWarningAlert('Gagal Mengirim', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    // data referensi
    bidangs,
    kategoriByBidang,
    lowonganByKategori,

    // state umum
    submittedApp,
    isSubmitting,
    isRestoringFiles,
    currentStep,
    setCurrentStep,
    isSubmitted,
    setIsSubmitted,
    lastSavedAt,

    // biodata
    biodata,
    setBiodata,
    handlePhotoUpload,
    handlePhotoDelete,

    // tipe pendaftaran & anggota tim
    registrationType,
    setRegistrationType,
    teamMembers,
    handleAddMember,
    handleRemoveMember,
    handleUpdateMember,

    // bidang & kategori
    selectedBidang,
    setSelectedBidang,
    selectedKategori,
    setSelectedKategori,
    selectedLowongan,
    setSelectedLowongan,
    selectedBidangName,
    selectedKategoriName,
    selectedLowonganName,

    // dokumen
    documents,
    handleDocumentUpload,
    handleDocumentDelete,
    validateRequiredDocuments,

    // pernyataan & submit
    isDeclared,
    setIsDeclared,
    handleSubmitFinal,
  };
}