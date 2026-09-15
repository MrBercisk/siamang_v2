import type { MouseEvent } from 'react';
import { RequirementItem } from '../../types/home';
import { CUSTOM_REQUIREMENTS_LIST } from './data/requirements';

interface PersyaratanTabProps {
  requirements?: RequirementItem[];
  onDownloadClick?: () => void;
}

export function PersyaratanTab({
  requirements = CUSTOM_REQUIREMENTS_LIST,
  onDownloadClick,
}: PersyaratanTabProps) {
  const handleDownload = (e: MouseEvent) => {
    e.preventDefault();
    if (onDownloadClick) {
      onDownloadClick();
    } else {
      alert('Munduh berkas NDA & Surat Permohonan Magang...');
    }
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex items-start gap-3">
        <div className="text-[#1f877c] mt-0.5">
          <span className="material-symbols-outlined text-2xl font-bold">assignment</span>
        </div>
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-[#1e293b]">Persyaratan Umum</h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Pastikan diri Anda sesuai dengan persyaratan yang telah ditetapkan.
          </p>
        </div>
      </div>

      {/* Grid Cards (4 Column Layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {requirements.map((req) => (
          <div
            key={req.id}
            className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-start"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#D1FAE5] text-[#1f877c] flex items-center justify-center mb-5 shadow-2xs">
              <span className="material-symbols-outlined text-2xl font-bold">{req.icon}</span>
            </div>

            <h4 className="text-sm sm:text-base font-bold text-[#1e293b] mb-2 leading-tight">
              {req.title}
            </h4>

            <p className="text-xs text-slate-600 leading-relaxed">
              {req.description}
              {req.hasDownloadLink && (
                <span>
                  {' '}
                  <a
                    href="#download"
                    onClick={handleDownload}
                    className="text-[#1f877c] font-bold underline hover:text-[#196e65]"
                  >
                    DISINI
                  </a>
                </span>
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}