import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

import { BottomTabNav } from "./BottomTabNav";
import { CaptainDashboardMobile } from "./captain/CaptainDashboardMobile";
import { CaptainEventsMobile } from "./captain/CaptainEventsMobile";
import { CaptainChatsMobile } from "./captain/CaptainChatsMobile";
import { CaptainAnalyticsMobile } from "./captain/CaptainAnalyticsMobile";

import { MemberDashboardMobile } from "./member/MemberDashboardMobile";
import { MemberEventsMobile } from "./member/MemberEventsMobile";
import { MemberChatsMobile } from "./member/MemberChatsMobile";
import { MemberAnalyticsMobile } from "./member/MemberAnalyticsMobile";

import { SmartSchedulingView } from "../SmartSchedulingView";
import { MemberMessagesMobile } from "../MemberMessageView";
import { CreateEvent } from "../CreateEvent";

import { UserRole } from "../../App";
import { createEventWithScheduling, EventSchedulingResponse } from "../../services/api";
import { VoiceEventCreator } from "./captain/VoiceEventCreator"; 

// ================= TYPES ======================
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
  schedulingResponse: EventSchedulingResponse;
}

export type TabType = "dashboard" | "events" | "chats" | "analytics";
export type ViewType = "normal" | "create-event" | "scheduling-analysis" | "member-messages";

// Scroll wrapper
function ScrollContainer({ children }: { children: React.ReactNode }) {
  return <div className="h-full overflow-y-auto overflow-x-hidden">{children}</div>;
}

interface MobileAppProps {
  userRole: UserRole;
  onLogout: () => void;
}

export function MobileApp({ userRole, onLogout }: MobileAppProps) {
  const [currentTab, setCurrentTab] = useState<TabType>("dashboard");
  const [currentView, setCurrentView] = useState<ViewType>("normal");

  const [schedulingData, setSchedulingData] = useState<SchedulingAnalysisState | null>(null);

  // ========= CREATE EVENT HANDLER ==========
  const handleCreateEvent = async (event: EventData, invitedMembers: string[]) => {
    console.log("📤 FRONTEND → Sending scheduling request:", {
      event_name: event.name,
      event_type: "meeting",
      captain_id: "captain-1",
      proposed_time: `${event.date}T${event.time}:00`,
      duration_minutes: 60,
      invited_members: invitedMembers,
      description: event.description,
    });

    const proposedTime = `${event.date}T${event.time}:00`;

    try {
      const response = await createEventWithScheduling(
        event.name,
        "meeting",
        "captain-1",
        proposedTime,
        invitedMembers,
        60,
        event.description
      );
      

      setSchedulingData({
        event,
        invitedMembers,
        eventId: response.event_id,
        schedulingResponse: response,
      });

      setCurrentView("scheduling-analysis");
    } catch (error) {
      console.error("Scheduling failed:", error);
      alert("Failed to analyze scheduling");
    }
  };

  const handleConfirmEvent = () => {
    setCurrentView("normal");
    setCurrentTab("events");
    setSchedulingData(null);
  };

  const handleCancelEvent = () => {
    setCurrentView("normal");
    setSchedulingData(null);
  };

  const handleShowMessages = () => {
    setCurrentView("member-messages");
  };

  const handleRescheduleTime = (newTimeIso: string) => {
    if (!schedulingData) return;

    const newDate = newTimeIso.slice(0, 10);
    const newTime = newTimeIso.slice(11, 16); // HH:MM

    setSchedulingData({
      ...schedulingData,
      event: {
        ...schedulingData.event,
        date: newDate,
        time: newTime,
      },
    });
  };

  // ==================== Render Logic ====================

  const renderContent = () => {
    if (userRole === "captain") {
      // CREATE EVENT PAGE
      if (currentView === "create-event") {
        return (
          <CreateEvent
            onCancel={() => setCurrentView("normal")}
            onCreate={handleCreateEvent}
          />
        );
      }

      // SMART SCHEDULING PAGE
      if (currentView === "scheduling-analysis" && schedulingData) {
        return (
          <SmartSchedulingView
            eventName={schedulingData.event.name}
            eventType="meeting"
            proposedTime={`${schedulingData.event.date}T${schedulingData.event.time}:00`}
            invitedMembers={schedulingData.invitedMembers}
            captainId="captain-1"
            schedulingResponse={schedulingData.schedulingResponse}
            onReschedule={handleRescheduleTime}
            onShowMessages={handleShowMessages}
            onCancel={handleCancelEvent}
          />
        );
      }

      // MEMBER MESSAGES PAGE
      if (currentView === "member-messages" && schedulingData) {
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

      // NORMAL TAB VIEW
      switch (currentTab) {
        case "dashboard":
          return <CaptainDashboardMobile />;
        case "events":
          return (
            <CaptainEventsMobile
              onCreateEvent={handleCreateEvent}
              onStartCreateEvent={() => setCurrentView("create-event")}
            />
          );
        case "chats":
          return <CaptainChatsMobile />;
        case "analytics":
          return <CaptainAnalyticsMobile />;
      }
    }

    // MEMBER FLOWS
    switch (currentTab) {
      case "dashboard":
        return <MemberDashboardMobile />;
      case "events":
        return <div className="member-dashboard">
        <MemberEventsMobile />
      </div>
      case "chats":
        return <MemberChatsMobile />;
      case "analytics":
        return <MemberAnalyticsMobile />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0f172a]">
      <div className="flex-1 overflow-y-auto overflow-x-hidden pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentTab}-${currentView}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.25 }}
            className="h-full"
          >
            <ScrollContainer>{renderContent()}</ScrollContainer>
          </motion.div>
        </AnimatePresence>
      </div>

      {currentView === "normal" && (
        <BottomTabNav
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          userRole={userRole}
        />
      )}
    </div>
  );
}
