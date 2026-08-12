export type AcceptedTab = 'dashboard' | 'progress' | 'forum' | 'laporan' | 'nilai' | 'riwayat' | 'profile';

interface NavItem {
  key: AcceptedTab;
  label: string;
  icon: string;
}

const MENU_ITEMS: NavItem[] = [
  { key: 'progress', label: 'Progress Magang', icon: 'monitoring' },
  { key: 'forum', label: 'Forum Diskusi', icon: 'forum' },
  { key: 'laporan', label: 'Laporan Magang', icon: 'assignment' },
  { key: 'nilai', label: 'Nilai Magang', icon: 'emoji_events' },
];

interface AcceptedSidebarProps {
  activeTab: AcceptedTab;
  onChangeTab: (tab: AcceptedTab) => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onLogout: () => void;
}

export function AcceptedSidebar({
  activeTab,
  onChangeTab,
  collapsed,
  onToggleCollapsed,
  onLogout,
}: AcceptedSidebarProps) {
  return (
    <aside className={`bg-white border-r border-slate-200/90 transition-all duration-300 flex flex-col justify-between relative z-20 ${collapsed ? 'w-16 sm:w-20' : 'w-60 sm:w-64'}`}>
      <button
        type="button"
        onClick={onToggleCollapsed}
        className="absolute -right-3.5 top-6 w-7 h-7 rounded-full bg-[#1f877c] text-white flex items-center justify-center shadow-md hover:bg-[#196e65] transition-all cursor-pointer z-30"
      >
        <span className="material-symbols-outlined text-base">
          {collapsed ? 'chevron_right' : 'chevron_left'}
        </span>
      </button>

      <div className="p-3 sm:p-4 space-y-4">
        {!collapsed && (
          <span className="px-3 text-[10px] font-extrabold uppercase text-[#1f877c] tracking-wider block mb-1">
            MENU
          </span>
        )}

        <button
          type="button"
          onClick={() => onChangeTab('dashboard')}
          className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'dashboard' ? 'bg-[#E6F7F3] text-[#1f877c] shadow-2xs' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <span className="material-symbols-outlined text-xl">grid_view</span>
          {!collapsed && <span>Dashboard</span>}
        </button>

        {MENU_ITEMS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => onChangeTab(item.key)}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === item.key ? 'bg-[#E6F7F3] text-[#1f877c] font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-xl">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}

        <div className="pt-2 border-t border-slate-100 space-y-1">
          {!collapsed && (
            <span className="px-3 text-[10px] font-extrabold uppercase text-[#1f877c] tracking-wider block mb-1">
              AKUN
            </span>
          )}

          <button
            type="button"
            onClick={() => onChangeTab('riwayat')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'riwayat' ? 'bg-[#E6F7F3] text-[#1f877c] font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-xl">history</span>
            {!collapsed && <span>Riwayat Magang</span>}
          </button>

          <button
            type="button"
            onClick={() => onChangeTab('profile')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'profile' ? 'bg-[#E6F7F3] text-[#1f877c] font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-xl">account_circle</span>
            {!collapsed && <span>Profile Saya</span>}
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
            {!collapsed && <span>Keluar</span>}
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="p-4 border-t border-slate-100 text-center">
          <span className="text-[10px] font-medium text-slate-400 block">
            SI AMANG © 2026 DISKOMINFOSAN
          </span>
        </div>
      )}
    </aside>
  );
}