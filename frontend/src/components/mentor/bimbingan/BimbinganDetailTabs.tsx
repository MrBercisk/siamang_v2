import React from 'react';

export type DetailTabKey = 'progress' | 'laporan' | 'nilai';

const TABS: { key: DetailTabKey; label: string }[] = [
  { key: 'progress', label: 'Progress Magang' },
  { key: 'laporan', label: 'Laporan' },
  { key: 'nilai', label: 'Nilai' },
];

interface BimbinganDetailTabsProps {
  active: DetailTabKey;
  onChange: (tab: DetailTabKey) => void;
}

export const BimbinganDetailTabs: React.FC<BimbinganDetailTabsProps> = ({ active, onChange }) => (
  <div className="flex border-b border-slate-200 bg-slate-50/50 overflow-x-auto">
    {TABS.map((tab) => (
      <button
        key={tab.key}
        type="button"
        onClick={() => onChange(tab.key)}
        className={`px-6 py-3.5 text-xs font-bold transition-all whitespace-nowrap cursor-pointer border-b-2 ${
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