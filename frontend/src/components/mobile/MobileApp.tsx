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
import { SmartAnalysisMobile } from '../SmartAnalysisMobile';
import { MemberMessagesMobile } from '../MemberMessageView';
import { UserRole } from '../../App';

// ==================== Types ====================
export interface EventData {
  name: string;
  date: string;
  time: string;
  location: string;
  description?: string;
}

export interface SchedulingAnalysisState {
  event: EventData;
  invitedMembers: string[];
  eventId?: string;
}

interface MobileAppProps {
  userRole: UserRole;
  onLogout: () => void;
}

export type TabType = 'dashboard' | 'events' | 'chats' | 'analytics';
export type ViewType = 'normal' | 'create-event' | 'scheduling-analysis' | 'member-messages';

// Scroll wrapper component
function ScrollContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full overflow-y-auto overflow-x-hidden">
      {children}
    </div>
  );
}

export function MobileApp({ userRole, onLogout }: MobileAppProps) {
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [currentView, setCurrentView] = useState<ViewType>('normal');
  
  // Scheduling state
  const [schedulingData, setSchedulingData] = useState<SchedulingAnalysisState | null>(null);

  // ==================== Event Handlers ====================

  const handleCreateEvent = (event: EventData, invitedMembers: string[]) => {
    setSchedulingData({
      event,
      invitedMembers,
    });
    setCurrentView('scheduling-analysis');
  };

  const handleAcceptRecommendation = (newTime: string) => {
    if (schedulingData) {
      setSchedulingData({
        ...schedulingData,
        event: {
          ...schedulingData.event,
          time: newTime,
        },
      });
      setCurrentView('scheduling-analysis');
    }
  };

  const handleViewMessages = () => {
    setCurrentView('member-messages');
  };

  const handleCancelEvent = () => {
    setCurrentView('normal');
    setSchedulingData(null);
  };

  const handleConfirmEvent = () => {
    setCurrentView('normal');
    setCurrentTab('events');
    setSchedulingData(null);
  };

  // ==================== Render Logic ====================

  const renderContent = () => {
    // Handle scheduling flow views (only for captain)
    if (userRole === 'captain') {
      if (currentView === 'create-event') {
        return <CaptainEventsMobile onCreateEvent={handleCreateEvent} />;
      }
      
      if (currentView === 'scheduling-analysis' && schedulingData) {
        return (
          <SmartAnalysisMobile
            event={schedulingData.event}
            invitedMembers={schedulingData.invitedMembers}
            captainId="captain-1"
            onShowMessages={handleViewMessages}
            onConfirmReschedule={handleAcceptRecommendation}
            onCancel={handleCancelEvent}
          />
        );
      }

      if (currentView === 'member-messages' && schedulingData) {
        return (
          <MemberMessagesMobile
            event={schedulingData.event}
            invitedMembers={schedulingData.invitedMembers}
            eventId={schedulingData.eventId}
            onBack={handleCancelEvent}
            onConfirm={handleConfirmEvent}
          />
        );
      }
    }

    // Normal tab navigation
    if (userRole === 'captain') {
      switch (currentTab) {
        case 'dashboard':
          return <CaptainDashboardMobile />;
        case 'events':
          return (
            <CaptainEventsMobile 
              onCreateEvent={handleCreateEvent}
              onNavigateToAnalysis={() => setCurrentView('scheduling-analysis')}
            />
          );
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
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentTab}-${currentView}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.25, ease: [0.165, 0.84, 0.44, 1] }}
            className="h-full"
          >
            <ScrollContainer>
              {renderContent()}
            </ScrollContainer>
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Fixed Bottom Navigation */}
      {currentView === 'normal' && (
        <BottomTabNav 
          currentTab={currentTab} 
          onTabChange={setCurrentTab}
          userRole={userRole}
        />
      )}
    </div>
  );
}