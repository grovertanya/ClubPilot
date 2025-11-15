import { Plane, Calendar, MessageSquare, BarChart3 } from 'lucide-react';
import { motion } from 'motion/react';
import { TabType } from './MobileApp';
import { UserRole } from '../../App';

interface BottomTabNavProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  userRole: UserRole;
}

const tabs = [
  { id: 'dashboard' as TabType, label: 'Dashboard', icon: Plane },
  { id: 'events' as TabType, label: 'Events', icon: Calendar },
  { id: 'chats' as TabType, label: 'Chats', icon: MessageSquare },
  { id: 'analytics' as TabType, label: 'Analytics', icon: BarChart3 },
];

export function BottomTabNav({ currentTab, onTabChange, userRole }: BottomTabNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-[390px] mx-auto bg-[#0f172a] border-t border-[#1e293b]">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center justify-center flex-1 h-full relative"
              whileTap={{ scale: 0.92 }}
              transition={{ duration: 0.1 }}
            >
              <Icon 
                className={`w-6 h-6 mb-1 transition-colors ${
                  isActive ? 'text-[#429ebd]' : 'text-[#64748b]'
                }`}
              />
              <span 
                className={`text-xs transition-colors ${
                  isActive ? 'text-[#429ebd]' : 'text-[#64748b]'
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-12 bg-gradient-to-r from-[#429ebd] to-[#9fe7f5] rounded-t-full"
                  transition={{ duration: 0.2, ease: [0.215, 0.61, 0.355, 1] }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
