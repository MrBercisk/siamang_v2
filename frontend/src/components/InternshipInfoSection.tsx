import { memo, useState } from 'react';
import {
  InternshipCategory,
  TimelineSchedule,
  ApplicationRequirement,
  ApplicationStatus,
} from '../types/internship';
import { LowonganDetail } from '../hooks/useInternshipData';
import { InternshipTabKey } from '../types/home';
import { NavigationTabs } from './home/NavigationTabs';
import { TimelineTab } from './home/TimelineTab';
import { BidangTab } from './home/BidangTab';
import { PersyaratanTab } from './home/PersyaratanTab';
import { StatusTab } from './home/StatusTab';

const WHATSAPP_CONTACT_URL = 'https://wa.me/628123456789';

interface InternshipInfoSectionProps {
  categories: InternshipCategory[];
  lowongans: LowonganDetail[];
  schedules: TimelineSchedule[];
  requirements: ApplicationRequirement[];
  applications: ApplicationStatus[];
  onApplyCategory?: (category: InternshipCategory) => void;
  onNavigateRegister?: () => void;
}

export const InternshipInfoSection = memo(function InternshipInfoSection({
  categories,
  schedules,
  onApplyCategory,
}: InternshipInfoSectionProps) {
  const [activeTab, setActiveTab] = useState<InternshipTabKey>('bidang');

  const openWhatsApp = () => {
    window.open(WHATSAPP_CONTACT_URL, '_blank');
  };

  return (
    <section className="bg-slate-50/70 py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <NavigationTabs activeTab={activeTab} onChange={setActiveTab} />

        <div className="space-y-8">
          {activeTab === 'timeline' && <TimelineTab schedules={schedules} />}

          {activeTab === 'bidang' && (
            <BidangTab
              categories={categories}
              onApplyCategory={onApplyCategory}
              onContactWhatsApp={openWhatsApp}
            />
          )}

          {activeTab === 'persyaratan' && <PersyaratanTab />}

          {activeTab === 'status' && (
            <StatusTab
              onContactWhatsApp={openWhatsApp}
              onGoToBidang={() => setActiveTab('bidang')}
            />
          )}
        </div>
      </div>
    </section>
  );
});