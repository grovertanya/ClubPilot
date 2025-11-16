import { useState } from "react";
import { Plus, Mic, Zap } from "lucide-react";
import { Card } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { EventData } from "../MobileApp";
import { VoiceEventCreator } from "./VoiceEventCreator";
import { AutomatedAgentView } from "./AutomatedAgentView";

interface CaptainEventsMobileProps {
  onCreateEvent: (event: EventData, invitedMembers: string[]) => void;
  onStartCreateEvent: () => void;
}

export function CaptainEventsMobile({
  onCreateEvent,
  onStartCreateEvent,
}: CaptainEventsMobileProps) {
  const [showVoiceCreator, setShowVoiceCreator] = useState(false);
  const [showAgent, setShowAgent] = useState(false);
  const [currentEventId, setCurrentEventId] = useState<string | null>(null);
  const [listening, setListening] = useState(false);

  // -----------------------------
  // 🎤 Show the voice creator screen (30 sec recording lives THERE)
  // -----------------------------
  function openVoiceCreator() {
    setShowVoiceCreator(true);
  }

  // When VoiceEventCreator finishes:
  function handleVoiceEventCreated(event: EventData, members: string[]) {
    // Create event in backend (normal path)
    onCreateEvent(event, members);

    // Now open the AI Agent
    setTimeout(() => {
      setCurrentEventId("temp-id"); // Backend will overwrite later
      setShowAgent(true);
    }, 300);

    // Hide the voice creator UI
    setShowVoiceCreator(false);
  }

  return (
    <div className="p-4 space-y-4">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-xl font-semibold">Events</h2>

        <div className="flex gap-2">

          {/* AI SMART AGENT */}
          <button
            onClick={() => {
              setCurrentEventId("temp-id");
              setShowAgent(true);
            }}
            className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-full p-2"
          >
            <Zap className="w-5 h-5" />
          </button>

          {/* 🎤 VOICE MODE */}
          <button
            onClick={openVoiceCreator}
            className="bg-[#429ebd] hover:bg-[#3184a1] text-white rounded-full p-2"
          >
            <Mic className="w-5 h-5" />
          </button>

          {/* ➕ MANUAL MODE */}
          <button
            onClick={onStartCreateEvent}
            className="bg-[#429ebd] hover:bg-[#3184a1] text-white rounded-full p-2"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 🎤 VOICE CREATOR SCREEN */}
      {showVoiceCreator && (
        <VoiceEventCreator
          onEventCreated={handleVoiceEventCreated}
          onCancel={() => setShowVoiceCreator(false)}
        />
      )}

      {/* 🤖 AI AGENT SCREEN */}
      {showAgent && currentEventId && (
        <AutomatedAgentView
          eventId={currentEventId}
          onEventCreated={(id) => {
            setCurrentEventId(id); // overwrite temp-id with backend real ID
            setShowAgent(false);
          }}
          onCancel={() => {
            setShowAgent(false);
          }}
        />
      )}

      {/* UPCOMING EVENTS */}
      <div className="space-y-3">
        <h3 className="text-[#94a3b8] text-sm font-semibold">Upcoming Events</h3>

        <Card className="bg-[#1e293b] border-[#334155] p-4">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-white font-medium mb-1">Basketball Practice</h4>
              <p className="text-[#94a3b8] text-sm">Friday • 7:00 PM</p>
              <p className="text-[#64748b] text-xs mt-1">12 invited</p>
            </div>
            <Badge className="bg-[#10b981]/20 text-[#10b981] border-0">
              On track
            </Badge>
          </div>
        </Card>
      </div>
    </div>
  );
}
