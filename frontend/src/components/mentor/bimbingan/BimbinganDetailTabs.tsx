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
  /** Tab 'nilai' dikunci sampai ada laporan berstatus 'diterima'. */
  isNilaiLocked: boolean;
}

export const BimbinganDetailTabs: React.FC<BimbinganDetailTabsProps> = ({
  active,
  onChange,
  isNilaiLocked,
}) => (
  <div className="flex border-b border-slate-200 bg-slate-50/50 overflow-x-auto">
    {TABS.map((tab) => {
      const locked = tab.key === 'nilai' && isNilaiLocked;

      return (
        <button
          key={tab.key}
          type="button"
          onClick={() => !locked && onChange(tab.key)}
          disabled={locked}
          title={locked ? 'Setujui laporan mahasiswa terlebih dahulu untuk mengisi nilai.' : undefined}
          className={`px-6 py-3.5 text-xs font-bold transition-all whitespace-nowrap border-b-2 flex items-center gap-1.5 ${
            locked
              ? 'border-transparent text-slate-300 cursor-not-allowed'
              : active === tab.key
                ? 'border-[#1f877c] text-[#1f877c] bg-white cursor-pointer'
                : 'border-transparent text-slate-500 hover:text-slate-800 cursor-pointer'
          }`}
        >
          {tab.label}
          {locked && <span className="material-symbols-outlined text-sm leading-none">lock</span>}
        </button>
      );
    })}
  </div>
);