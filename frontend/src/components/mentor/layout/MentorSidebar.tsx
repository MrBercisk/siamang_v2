export type MentorTab = 'dashboard' | 'forum' | 'pendaftar' | 'bimbingan';

interface NavItem {
  key: MentorTab;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: 'grid_view' },
  { key: 'forum', label: 'Forum Diskusi', icon: 'chat_bubble_outline' },
  { key: 'pendaftar', label: 'Pendaftar Magang', icon: 'groups' },
  { key: 'bimbingan', label: 'Bimbingan Mahasiswa', icon: 'group_add' },
];

interface MentorSidebarProps {
  activeTab: MentorTab;
  onChangeTab: (tab: MentorTab) => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onLogout: () => void;
}

export function MentorSidebar({
  activeTab,
  onChangeTab,
  collapsed,
  onToggleCollapsed,
  onLogout,
}: MentorSidebarProps) {
  return (
    <aside
      className={`bg-white border-r border-slate-200/90 transition-all duration-300 flex flex-col justify-between relative z-20 ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Toggle Button on Sidebar border */}
      <button
        type="button"
        onClick={onToggleCollapsed}
        className="absolute -right-3.5 top-6 w-7 h-7 rounded-full bg-[#1f877c] text-white flex items-center justify-center shadow-md cursor-pointer hover:bg-[#196e65] transition-all z-30"
        title={collapsed ? 'Buka Sidebar' : 'Tutup Sidebar'}
      >
        <span className="material-symbols-outlined text-base">
          {collapsed ? 'chevron_right' : 'chevron_left'}
        </span>
      </button>

      <div className="p-3 space-y-5">
        {/* MENU Label */}
        {!collapsed && (
          <div className="px-3 pt-2">
            <span className="text-[11px] font-extrabold text-[#1f877c] tracking-wider uppercase">
              MENU
            </span>
          </div>
        )}

        {/* NAV LINKS */}
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => onChangeTab(item.key)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === item.key
                  ? 'bg-[#E6F7F3] text-[#1f877c]'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="material-symbols-outlined text-xl shrink-0">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </button>
          ))}

          <div className="pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl shrink-0">logout</span>
              {!collapsed && <span>Logout</span>}
            </button>
          </div>
        </nav>
      </div>
    </aside>
  );
}