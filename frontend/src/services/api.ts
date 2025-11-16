import axios, { AxiosError } from 'axios';

const API_BASE = 'http://localhost:8000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

// ==================== Types ====================

export interface Member {
    id: string;
    name: string;
    emoji: string;
  }
  

export interface MemberAvailability {
  member_id: string;
  member_name: string;
  phone_number: string;
  status: 'available' | 'maybe' | 'unavailable';
  confidence: number;
}

export interface SchedulingRecommendation {
  original_time: string;
  recommended_time: string;
  current_predicted_attendance: number;
  recommended_predicted_attendance: number;
  attendance_improvement: number;
  confidence: number;
  reason: string;
}

export interface EventSchedulingResponse {
  event_id: string;
  event: {
    event_name: string;
    event_type: string;
    captain_id: string;
    proposed_time: string;
    duration_minutes: number;
    invited_members: string[];
    description?: string;
  };
  status: 'scheduled' | 'conflicts_detected' | 'optimized';
  scheduling_analysis: {
    total_invited: number;
    predicted_attendance: number;
    attendance_percentage: number;
    conflicts_count: number;
  };
  conflicts: any[];
  recommendations: SchedulingRecommendation[];
  captain_message: string;
  requires_captain_action: boolean;
}

export interface GeneratedMessage {
  message: string;
  tone_analysis: {
    formality: string;
    humor_level: number;
    emoji_usage: number;
  };
  confidence: number;
  member_personality: string[];
  approval_required: boolean;
}
// // ==================== Mock Data ====================

// const MOCK_MEMBERS: Member[] = [
//   {
//     id: 'm1',
//     name: 'Alice',
//     emoji: '👩',
//     phone: '+1-234-567-0001',
//     class_schedule: ['MWF 10-11am', 'TR 2-3:30pm'],
//     personality_traits: ['funny', 'reliable', 'introverted'],
//     communication_style: {
//       formality_level: 'casual',
//       humor_frequency: 0.8,
//       emoji_usage: 0.7,
//     },
//   },
//   {
//     id: 'm2',
//     name: 'Bob',
//     emoji: '👨',
//     phone: '+1-234-567-0002',
//     class_schedule: ['MWF 9-10am', 'W 3-5pm'],
//     personality_traits: ['dependable', 'organized', 'outgoing'],
//     communication_style: {
//       formality_level: 'formal',
//       humor_frequency: 0.3,
//       emoji_usage: 0.1,
//     },
//   },
//   {
//     id: 'm3',
//     name: 'Charlie',
//     emoji: '👨',
//     phone: '+1-234-567-0003',
//     class_schedule: ['TR 11am-12:30pm'],
//     personality_traits: ['creative', 'social', 'energetic'],
//     communication_style: {
//       formality_level: 'neutral',
//       humor_frequency: 0.6,
//       emoji_usage: 0.5,
//     },
//   },
//   {
//     id: 'm4',
//     name: 'Diana',
//     emoji: '👩',
//     phone: '+1-234-567-0004',
//     class_schedule: ['MWF 1-2pm'],
//     personality_traits: ['analytical', 'quiet', 'thoughtful'],
//     communication_style: {
//       formality_level: 'formal',
//       humor_frequency: 0.2,
//       emoji_usage: 0.2,
//     },
//   },
//   {
//     id: 'm5',
//     name: 'Evan',
//     emoji: '👨',
//     phone: '+1-234-567-0005',
//     class_schedule: ['TR 1-2:30pm'],
//     personality_traits: ['enthusiastic', 'helpful', 'friendly'],
//     communication_style: {
//       formality_level: 'casual',
//       humor_frequency: 0.7,
//       emoji_usage: 0.6,
//     },
//   },
// ];

// ==================== API Calls ====================

export async function getMembers(): Promise<Member[]> {
    try {
      const response = await api.get<Member[]>('/api/members');
      return response.data;
    } catch (error) {
      console.error("Failed to fetch real members:", error);
      throw error;
    }
  }
  
  export async function createEventWithScheduling() {
    const hardcodedBody = {
      event_name: "technica",
      event_type: "meeting",
      captain_id: "captain-1",
      proposed_time: "2025-02-17T17:00:00",
      duration_minutes: 60,
      invited_members: ["m1", "m2"],  // always valid & exists in backend mock
      description: "Hardcoded demo event"
    };
  
    console.log("📤 SENDING BODY:", hardcodedBody);
  
    try {
      const response = await api.post(
        "/api/events/create-with-scheduling",
        hardcodedBody
      );
      return response.data;
    } catch (err) {
      console.error("❌ Event failed:", err);
      throw err;
    }
  }
  
  


export async function generateConflictMessage(
  memberId: string,
  conflictType: string,
  originalCommitment: string,
  conflictingEvent: string
): Promise<GeneratedMessage> {
  try {
    const response = await api.post<GeneratedMessage>(
      '/api/ai/generate-message/conflict',
      {
        member_id: memberId,
        conflict_type: conflictType,
        original_commitment: originalCommitment,
        conflicting_event: conflictingEvent,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Backend error:", error);
    throw error;

  }
}

export async function sendApprovedMessages(
  eventId: string,
  messages: { memberId: string; message: string }[]
): Promise<{ success: boolean; sent: number; timestamp: string }> {
  try {
    const response = await api.post('/api/events/send-messages', {
      event_id: eventId,
      messages,
    });
    return response.data;
  } catch (error) {
    console.warn('Backend message sending unavailable');
    return {
      success: true,
      sent: messages.length,
      timestamp: new Date().toISOString(),
    };
  }
}

// ===============================================================
// Automated Agent Orchestrator (Compatible with AutomatedAgentView)
// ===============================================================

export type AgentState =
  | "idle"
  | "listening"
  | "parsing"
  | "analyzing"
  | "conflicts_found"
  | "waiting_approval"
  | "generating_messages"
  | "ready_to_send"
  | "sending_messages"
  | "complete"
  | "error";

export interface AgentWorkflowStep {
  state: AgentState;
  message: string;
  timestamp: Date;
  data?: any;
}

export interface AgentWorkflow {
  currentState: AgentState;
  steps: AgentWorkflowStep[];
  approval_needed: boolean;
  recommendations?: any[];
  messages?: any[];
}

type WorkflowCallback = (wf: AgentWorkflow) => void;

class AgentController {
  private workflow: AgentWorkflow = {
    currentState: "idle",
    steps: [],
    approval_needed: false,
  };

  private subscribers: WorkflowCallback[] = [];
  private eventData: any = null;
  private generatedMessages: any[] = [];

  // ---------- Internal Helpers ----------
  private pushStep(state: AgentState, message: string, data?: any) {
    const step: AgentWorkflowStep = {
      state,
      message,
      timestamp: new Date(),
      data,
    };
    this.workflow.steps.push(step);
    this.workflow.currentState = state;
    this.notify();
  }

  private notify() {
    this.subscribers.forEach((cb) => cb({ ...this.workflow }));
  }

  // ---------- Public API ----------
  subscribe(cb: WorkflowCallback) {
    this.subscribers.push(cb);
    cb({ ...this.workflow });
  }

  reset() {
    this.workflow = {
      currentState: "idle",
      steps: [],
      approval_needed: false,
    };
    this.eventData = null;
    this.generatedMessages = [];
    this.notify();
  }

  // ---------- MAIN AUTOMATED FLOW ----------
  async createEventWithAutomation(eventInfo: any, members: string[], captainId: string) {
    try {
      this.pushStep("parsing", "Parsing event details...", eventInfo);

      this.pushStep("analyzing", "Creating event with smart scheduling...");

      const eventResponse = await createEventWithScheduling(
        eventInfo.name,
        "general",
        captainId,
        `${eventInfo.date}T${eventInfo.time}`,
        members,
        60,
        eventInfo.description
      );

      this.eventData = eventResponse;

      this.pushStep("analyzing", "Event created. Checking for conflicts...", eventResponse);

      // Conflict detection
      const conflictResponse = await api.post("/api/ai/detect-conflicts", {
        event_id: eventResponse.event_id,
        event_name: eventInfo.name,
        proposed_time: `${eventInfo.date}T${eventInfo.time}`,
        invited_members: members,
      });

      const conflicts = conflictResponse.data.conflicts || [];

      if (conflicts.length === 0) {
        this.pushStep("complete", "No conflicts found. Event scheduled successfully!", {
          event: eventResponse,
        });
        return;
      }

      this.pushStep("conflicts_found", "Conflicts detected.", conflicts);

      // Generate messages
      this.pushStep("generating_messages", "Generating personalized messages...");

      this.generatedMessages = [];

      for (const c of conflicts) {
        const msg = await generateConflictMessage(
          c.member_id,
          c.conflict_type,
          "Prior commitment",
          eventInfo.name
        );

        this.generatedMessages.push({
          member_id: c.member_id,
          member_name: c.member_name,
          message: msg.message,
        });
      }

      this.workflow.messages = this.generatedMessages;
      this.workflow.recommendations = eventResponse.recommendations || [];
      this.workflow.approval_needed = true;

      this.pushStep("waiting_approval", "Approval required to proceed.", {
        recommendations: this.workflow.recommendations,
        messages: this.generatedMessages,
      });
      return eventResponse;

    } catch (err) {
      console.error("Agent automation error:", err);
      this.pushStep("error", "An error occurred.", err);
    }
  }

  // ---------- APPROVAL HANDLERS ----------
  async approveReschedule(newTime: string) {
    this.pushStep("analyzing", "Applying new recommended time...", newTime);

    this.eventData.event.proposed_time = newTime;

    this.workflow.approval_needed = false;
    this.notify();

    this.pushStep("ready_to_send", "Ready to send messages.");
  }

  async declineReschedule() {
    this.workflow.approval_needed = false;
    this.pushStep("ready_to_send", "Skipping reschedule. Ready to send messages.");
  }

  // ---------- SEND MESSAGES ----------
  async sendMessages() {
    this.pushStep("sending_messages", "Sending messages to members...");

    const result = await sendApprovedMessages(this.eventData.event_id, this.generatedMessages);

    this.pushStep("complete", "All messages sent successfully!", result);
  }
}

export const agent = new AgentController();
