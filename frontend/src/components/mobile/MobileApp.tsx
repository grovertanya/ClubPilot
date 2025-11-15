import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BottomTabNav } from './BottomTabNav';
import { CaptainDashboardMobile } from './captain/CaptainDashboardMobile';
import { CaptainEventsMobile } from './captain/CaptainEventsMobile';
import { CaptainChatsMobile } from './captain/CaptainChatsMobile';
import { CaptainAnalyticsMobile } from './captain/CaptainAnalyticsMobile';
import { MemberDashboardMobile } from './member/MemberDashboardMobile';
import { MemberEventsMobile } from './member/MemberEventsMobile';
import { MemberChatsMobile } from './member/MemberChatsMobile';
import { MemberAnalyticsMobile } from './member/MemberAnalyticsMobile';
import { UserRole } from '../../App';

interface MobileAppProps {
  userRole: UserRole;
  onLogout: () => void;
}

export type TabType = 'dashboard' | 'events' | 'chats' | 'analytics';

export function MobileApp({ userRole, onLogout }: MobileAppProps) {
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');

  const renderContent = () => {
    if (userRole === 'captain') {
      switch (currentTab) {
        case 'dashboard':
          return <CaptainDashboardMobile />;
        case 'events':
          return <CaptainEventsMobile />;
        case 'chats':
          return <CaptainChatsMobile />;
        case 'analytics':
          return <CaptainAnalyticsMobile />;
      }
    } else {
      switch (currentTab) {
        case 'dashboard':
          return <MemberDashboardMobile />;
        case 'events':
          return <MemberEventsMobile />;
        case 'chats':
          return <MemberChatsMobile />;
        case 'analytics':
          return <MemberAnalyticsMobile />;
      }
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0f172a]">
      <div className="flex-1 overflow-y-auto pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.25, ease: [0.165, 0.84, 0.44, 1] }}
            className="h-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
      <BottomTabNav 
        currentTab={currentTab} 
        onTabChange={setCurrentTab}
        userRole={userRole}
      />
    </div>
  );
}
