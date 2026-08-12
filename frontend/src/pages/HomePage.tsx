import { useState } from 'react';
import { motion } from 'motion/react';
import { HeroSection } from '../components/HeroSection';
import { CategoriesSection } from '../components/CategoriesSection';
import { InternshipInfoSection } from '../components/InternshipInfoSection';
import { ApplicationModal } from '../components/ApplicationModal';
import { InternshipCategory, TimelineSchedule, ApplicationRequirement, ApplicationStatus } from '../types/internship';
import { User } from '../types/auth';

interface HomePageProps {
  categories: InternshipCategory[];
  schedules: TimelineSchedule[];
  requirements: ApplicationRequirement[];
  applications: ApplicationStatus[];
  user: User | null;
  onNavigate: (page: 'home' | 'info' | 'register' | 'login' | 'dashboard') => void;
  onSubmitApplication: (data: {
    fieldId: string;
    fieldName: string;
    applicantName: string;
    institution: string;
    major: string;
    notes?: string;
  }) => Promise<void>;
}

export function HomePage({
  categories,
  schedules,
  requirements,
  applications,
  user,
  onNavigate,
  onSubmitApplication,
}: HomePageProps) {
  const [selectedCategory, setSelectedCategory] = useState<InternshipCategory | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleApplyCategory = (cat: InternshipCategory) => {
    setSelectedCategory(cat);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <HeroSection onActionClick={() => onNavigate('info')} />

      {/* Categories Section */}
      <CategoriesSection 
        categories={categories} 
        onSelectCategory={handleApplyCategory} 
      />

      {/* Internship Detailed Info & Timeline Section */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <InternshipInfoSection
          categories={categories}
          schedules={schedules}
          requirements={requirements}
          applications={applications}
          onApplyCategory={handleApplyCategory}
          onNavigateRegister={() => onNavigate('register')}
        />
      </motion.div>

      {/* Bottom Info Strip Banner */}
      <motion.section 
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-slate-100 border-y border-slate-200 py-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-6 flex-1">
            <div className="hidden sm:block w-20 h-20 flex-shrink-0 bg-white p-2 rounded-2xl shadow-xs border border-slate-200">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4ikSEisIsfcpmgMAKlb97wLkwAjJyICY-uvBLYe8ji5d3xMwpcZSdIy8J_JTh3sJ_E_gw61bYDGGEqNF-OlfDQSH5QWOaZ8OHwsNsgYF-BFNmAdvxHFhddOCuNntx3bbUCRXseu_CeucyrAL9SOdUMhM4g-y2MBzDQINCgm9RMRwwhA1eFenYM_z_zmlSmD0sYsBiA83KEPX7WCdbLdOKeoIRN81oSkT4ak77epkf7Yv2oAME8xXRrA"
                alt="Support Illustration"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="inline-block bg-[#D1FAE5] text-[#047857] text-[11px] font-bold px-2.5 py-0.5 rounded-full mb-2">
                INFO
              </span>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Butuh Bantuan Lebih Lanjut?
              </h3>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                Jika Anda memiliki pertanyaan terkait proses pendaftaran magang, silakan hubungi tim dukungan kami melalui kontak yang tersedia.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('info')}
            className="flex-shrink-0 bg-white border border-[#005c55] text-[#005c55] hover:bg-[#005c55] hover:text-white font-semibold text-xs py-2.5 px-5 rounded-lg transition-colors cursor-pointer"
          >
            Hubungi Kami
          </button>
        </div>
      </motion.section>

      {/* Modal Application Form */}
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

