import { User } from '../../../types/auth';
import { ApplicationStatus } from '../../../types/internship';
import { usePendaftaranForm } from './hooks/usePendaftaranForm';
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
  onSuccessSubmit?: (application: ApplicationStatus) => void;
}

export function PendaftaranFormView({
  user,
  onSubmitApplication,
  onSuccessSubmit,
}: PendaftaranFormViewProps) {
  const form = usePendaftaranForm({ user, onSubmitApplication, onSuccessSubmit });

  if (form.isSubmitted) {
    return (
      <SubmissionSuccess
        submittedApp={form.submittedApp}
        selectedBidang={form.selectedBidangName}
        selectedKategori={form.selectedKategoriName}
        selectedLowongan={form.selectedLowonganName}
        registrationType={form.registrationType}
        onSuccessSubmit={onSuccessSubmit}
        onBackToForm={() => {
          form.setIsSubmitted(false);
          form.setCurrentStep(1);
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

      <StepperHeader
        currentStep={form.currentStep}
        maxAccessibleStep={form.maxAccessibleStep}
        onStepClick={form.goToStep}
      />

      {form.currentStep === 1 && (
        <StepBiodata
          biodata={form.biodata}
          periode={form.periode}
          setBiodata={form.setBiodata}
          onPhotoUpload={form.handlePhotoUpload}
          onPhotoDelete={form.handlePhotoDelete}
          onNext={form.goToNextStep}
          lastSavedAt={form.lastSavedAt}
        />
      )}

      {form.currentStep === 2 && (
        <StepTipePendaftaran
          registrationType={form.registrationType}
          setRegistrationType={form.setRegistrationType}
          teamMembers={form.teamMembers}
          biodata={form.biodata}
          onAddMember={form.handleAddMember}
          onRemoveMember={form.handleRemoveMember}
          onUpdateMember={form.handleUpdateMember}
          onBack={form.goToPreviousStep}
          onNext={form.goToNextStep}
        />
      )}

      {form.currentStep === 3 && (
        <StepBidangKategori
          bidangOptions={form.bidangs}
          kategoriByBidang={form.kategoriByBidang}
          lowonganByKategori={form.lowonganByKategori}
          selectedBidang={form.selectedBidang}
          setSelectedBidang={form.setSelectedBidang}
          selectedKategori={form.selectedKategori}
          setSelectedKategori={form.setSelectedKategori}
          selectedLowongan={form.selectedLowongan}
          setSelectedLowongan={form.setSelectedLowongan}
          onBack={form.goToPreviousStep}
          onNext={form.goToNextStep}
        />
      )}

      {form.currentStep === 4 && (
        <StepBerkas
          documents={form.documents}
          onUpload={form.handleDocumentUpload}
          onDelete={form.handleDocumentDelete}
          onBack={form.goToPreviousStep}
          onNext={() => {
            if (form.validateRequiredDocuments()) {
              form.goToNextStep();
            }
          }}
        />
      )}

      {form.currentStep === 5 && (
        <StepReviewSubmit
          biodata={form.biodata}
          registrationType={form.registrationType}
          teamMembers={form.teamMembers}
          selectedBidang={form.selectedBidangName}
          selectedKategori={form.selectedKategoriName}
          selectedLowongan={form.selectedLowonganName}
          documents={form.documents}
          isDeclared={form.isDeclared}
          setIsDeclared={form.setIsDeclared}
          onEditStep={form.goToStep}
          onBack={form.goToPreviousStep}
          onSubmit={form.handleSubmitFinal}
        />
      )}
    </div>
  );
}