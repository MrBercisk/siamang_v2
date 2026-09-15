import { useState } from 'react';
import { InternshipCategory, TimelineSchedule, ApplicationRequirement, ApplicationStatus } from '../types/internship';
import { InternshipInfoSection } from '../components/InternshipInfoSection';
import { ApplicationModal } from '../components/ApplicationModal';
import { User } from '../types/auth';
import { PageType } from '../types/navigation';
import { LowonganDetail } from '../hooks/useInternshipData';

interface InfoPageProps {
  categories: InternshipCategory[];
  lowongans: LowonganDetail[];
  schedules: TimelineSchedule[];
  requirements: ApplicationRequirement[];
  applications: ApplicationStatus[];
  user: User | null;
  onNavigate: (page: PageType) => void;
  onSubmitApplication: (data: {
    fieldId: string;
    fieldName: string;
    applicantName: string;
    institution: string;
    major: string;
    notes?: string;
  }) => Promise<void>;
}

export function InfoPage({
  categories,
  lowongans,
  schedules,
  requirements,
  applications,
  user,
  onNavigate,
  onSubmitApplication,
}: InfoPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<InternshipCategory | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleApplyCategory = (cat: InternshipCategory) => {
    setSelectedCategory(cat);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] py-8">
      <InternshipInfoSection
        categories={categories}
        lowongans={lowongans}
        schedules={schedules}
        requirements={requirements}
        applications={applications}
        onApplyCategory={handleApplyCategory}
        onNavigateRegister={() => onNavigate('register')}
      />

      <ApplicationModal
        category={selectedCategory}
        user={user}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={onSubmitApplication}
      />
    </div>
  );
}
