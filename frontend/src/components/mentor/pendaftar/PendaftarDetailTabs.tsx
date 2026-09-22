import React from 'react';

export type PendaftarDetailTabKey = 'personal' | 'akademik' | 'project' | 'kelompok';

const TABS: { key: PendaftarDetailTabKey; label: string }[] = [
  { key: 'personal', label: 'Informasi Personal' },
  { key: 'akademik', label: 'Informasi Akademik' },
  { key: 'project', label: 'Informasi Project' },
  { key: 'kelompok', label: 'Informasi Kelompok' },
];

interface PendaftarDetailTabsProps {
  active: PendaftarDetailTabKey;
  onChange: (tab: PendaftarDetailTabKey) => void;
}

export const PendaftarDetailTabs: React.FC<PendaftarDetailTabsProps> = ({ active, onChange }) => (
  <div className="flex border-b border-slate-200 overflow-x-auto bg-slate-50/50">
    {TABS.map((tab) => (
      <button
        key={tab.key}
        type="button"
        onClick={() => onChange(tab.key)}
        className={`px-5 py-3.5 text-xs font-bold transition-all whitespace-nowrap cursor-pointer border-b-2 ${
          active === tab.key
            ? 'border-[#1f877c] text-[#1f877c] bg-white'
            : 'border-transparent text-slate-500 hover:text-slate-800'
        }`}
      >
        {tab.label}
      </button>
    ))}
  </div>
);