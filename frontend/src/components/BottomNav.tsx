import { LucideIcon } from 'lucide-react';
import { TabType } from '../App';

interface Tab {
  id: TabType;
  label: string;
  icon: LucideIcon;
}

interface BottomNavProps {
  tabs: Tab[];
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function BottomNav({ tabs, currentTab, onTabChange }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1e293b] border-t border-[#334155] max-w-md mx-auto">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive ? 'text-[#429ebd]' : 'text-[#64748b]'
              }`}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
