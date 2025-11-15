import { BarChart3, Calendar, TrendingUp, Settings, LogOut } from 'lucide-react';
import { PageType } from '../App';

interface SidebarProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
}

const navItems = [
  { id: 'dashboard' as PageType, label: 'Dashboard', icon: BarChart3 },
  { id: 'events' as PageType, label: 'Events', icon: Calendar },
  { id: 'analytics' as PageType, label: 'Analytics', icon: TrendingUp },
  { id: 'settings' as PageType, label: 'Settings', icon: Settings },
];

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <aside className="w-64 bg-[#1e293b] border-r border-[#334155] flex flex-col">
      <div className="p-6 border-b border-[#334155]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#429ebd] rounded-lg flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <span className="text-white text-xl">ClubPilot</span>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-[#429ebd] text-white'
                      : 'text-[#94a3b8] hover:bg-[#334155]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-[#334155]">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="w-8 h-8 bg-[#429ebd] rounded-full flex items-center justify-center text-white text-sm">
            CP
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm truncate">Captain</p>
            <p className="text-xs text-[#94a3b8] truncate">captain@club.com</p>
          </div>
        </div>
        <button className="w-full flex items-center gap-3 px-4 py-2 text-[#94a3b8] hover:text-red-400 transition-colors">
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Log out</span>
        </button>
      </div>
    </aside>
  );
}
