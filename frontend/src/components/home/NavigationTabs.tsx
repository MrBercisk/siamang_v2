import { InternshipTabKey } from '../../types/home';

interface TabItem {
  key: InternshipTabKey;
  label: string;
  icon: string;
}

const TABS: TabItem[] = [
  { key: 'timeline', label: 'Timeline', icon: 'calendar_month' },
  { key: 'bidang', label: 'Bidang Tersedia', icon: 'category' },
  { key: 'persyaratan', label: 'Persyaratan', icon: 'assignment' },
  { key: 'status', label: 'Status Pendaftaran', icon: 'account_box' },
];

interface NavigationTabsProps {
  activeTab: InternshipTabKey;
  onChange: (tab: InternshipTabKey) => void;
}

export function NavigationTabs({ activeTab, onChange }: NavigationTabsProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-2 md:p-3 mb-8">
      <div className="flex border-b border-slate-100 overflow-x-auto hide-scrollbar space-x-2 md:space-x-8 px-2">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={`flex items-center space-x-2 px-4 py-3.5 text-xs sm:text-sm font-bold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
              activeTab === tab.key
                ? 'border-[#1f877c] text-[#1f877c]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-lg">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}