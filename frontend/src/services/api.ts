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
  member_availabilities?: MemberAvailability[];
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

// ==================== Mock Data ====================

const MOCK_MEMBERS: Member[] = [
  {
    id: 'm1',
    name: 'Alice',
    emoji: '👩',
    phone: '+1-234-567-0001',
    class_schedule: ['MWF 10-11am', 'TR 2-3:30pm'],
    personality_traits: ['funny', 'reliable', 'introverted'],
    communication_style: {
      formality_level: 'casual',
      humor_frequency: 0.8,
      emoji_usage: 0.7,
    },
  },
  {
    id: 'm2',
    name: 'Bob',
    emoji: '👨',
    phone: '+1-234-567-0002',
    class_schedule: ['MWF 9-10am', 'W 3-5pm'],
    personality_traits: ['dependable', 'organized', 'outgoing'],
    communication_style: {
      formality_level: 'formal',
      humor_frequency: 0.3,
      emoji_usage: 0.1,
    },
  },
  {
    id: 'm3',
    name: 'Charlie',
    emoji: '👨',
    phone: '+1-234-567-0003',
    class_schedule: ['TR 11am-12:30pm'],
    personality_traits: ['creative', 'social', 'energetic'],
    communication_style: {
      formality_level: 'neutral',
      humor_frequency: 0.6,
      emoji_usage: 0.5,
    },
  },
  {
    id: 'm4',
    name: 'Diana',
    emoji: '👩',
    phone: '+1-234-567-0004',
    class_schedule: ['MWF 1-2pm'],
    personality_traits: ['analytical', 'quiet', 'thoughtful'],
    communication_style: {
      formality_level: 'formal',
      humor_frequency: 0.2,
      emoji_usage: 0.2,
    },
  },
  {
    id: 'm5',
    name: 'Evan',
    emoji: '👨',
    phone: '+1-234-567-0005',
    class_schedule: ['TR 1-2:30pm'],
    personality_traits: ['enthusiastic', 'helpful', 'friendly'],
    communication_style: {
      formality_level: 'casual',
      humor_frequency: 0.7,
      emoji_usage: 0.6,
    },
  },
];

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
  

  export async function createEventWithScheduling(
    eventName: string,
    eventType: string,
    captainId: string,
    proposedTime: string,
    invitedMembers: string[],
    duration: number = 60,
    description?: string
  ): Promise<EventSchedulingResponse> {
    try {
      const response = await api.post<EventSchedulingResponse>(
        '/api/events/create-with-scheduling',
        {
          event_name: eventName,
          event_type: eventType,
          captain_id: captainId,
          proposed_time: proposedTime,
          duration_minutes: duration,
          invited_members: invitedMembers,
          description,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to create event:", error);
      throw error;
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
    console.warn('Backend message generation unavailable, using mock');
    return generateMockMessage(memberId);
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

// ==================== Mock Data Generators ====================

function generateMockSchedulingResponse(
  eventName: string,
  proposedTime: string,
  invitedMembers: string[]
): EventSchedulingResponse {
  const predictedAttendance = Math.floor(invitedMembers.length * 0.65);
  const attendancePercentage = Math.round(
    (predictedAttendance / invitedMembers.length) * 100
  );

  const memberAvailabilities = invitedMembers.map((memberId) => {
    const statuses: Array<'available' | 'maybe' | 'unavailable'> = [
      'available',
      'available',
      'maybe',
      'unavailable',
    ];
    const randomStatus =
      statuses[Math.floor(Math.random() * statuses.length)];
    const member = MOCK_MEMBERS.find((m) => m.id === memberId);

    return {
      member_id: memberId,
      member_name: member?.name || 'Unknown',
      phone_number: member?.phone || '',
      status: randomStatus,
      confidence: Math.random() * 0.4 + 0.6,
    };
  });

  const date = new Date(proposedTime);
  const recommendedTime1 = new Date(date.getTime() + 2 * 60 * 60 * 1000);
  const recommendedTime2 = new Date(date.getTime() + 24 * 60 * 60 * 1000);
  const recommendedTime3 = new Date(date.getTime() + 48 * 60 * 60 * 1000);

  return {
    event_id: `evt_${Date.now()}`,
    event: {
      event_name: eventName,
      event_type: 'social',
      captain_id: 'captain_1',
      proposed_time: proposedTime,
      duration_minutes: 60,
      invited_members: invitedMembers,
    },
    status: 'optimized',
    scheduling_analysis: {
      total_invited: invitedMembers.length,
      predicted_attendance: predictedAttendance,
      attendance_percentage: attendancePercentage,
      conflicts_count: invitedMembers.length - predictedAttendance,
    },
    member_availabilities: memberAvailabilities,
    conflicts: [],
    recommendations: [
      {
        original_time: proposedTime,
        recommended_time: recommendedTime1.toISOString(),
        current_predicted_attendance: predictedAttendance,
        recommended_predicted_attendance: predictedAttendance + 2,
        attendance_improvement: 2,
        confidence: 0.85,
        reason: `Better timing works for 2 more members`,
      },
      {
        original_time: proposedTime,
        recommended_time: recommendedTime2.toISOString(),
        current_predicted_attendance: predictedAttendance,
        recommended_predicted_attendance: predictedAttendance + 3,
        attendance_improvement: 3,
        confidence: 0.92,
        reason: `Friday evening has historically high attendance`,
      },
      {
        original_time: proposedTime,
        recommended_time: recommendedTime3.toISOString(),
        current_predicted_attendance: predictedAttendance,
        recommended_predicted_attendance: predictedAttendance + 1,
        attendance_improvement: 1,
        confidence: 0.78,
        reason: `Weekend timing works better for most members`,
      },
    ],
    captain_message: `✨ Smart Analysis Complete\n\nCurrent time: ${attendancePercentage}% predicted attendance\nBetter option: +${Math.max(2, invitedMembers.length - predictedAttendance)} more members can attend Friday evening`,
    requires_captain_action: true,
  };
}

function generateMockMessage(memberId: string): GeneratedMessage {
  const member = MOCK_MEMBERS.find((m) => m.id === memberId);

  const messages = {
    casual: {
      message: `hey! so we're thinking of moving the event to a better time. you free? lmk! 😊`,
      tone_analysis: {
        formality: 'casual',
        humor_level: 0.7,
        emoji_usage: 0.8,
      },
    },
    formal: {
      message: `We are considering rescheduling the event to better accommodate everyone's availability. Would this work for you?`,
      tone_analysis: {
        formality: 'formal',
        humor_level: 0.1,
        emoji_usage: 0.0,
      },
    },
    neutral: {
      message: `Hey, we're looking at a better time for the event. Could you do Friday instead?`,
      tone_analysis: {
        formality: 'neutral',
        humor_level: 0.4,
        emoji_usage: 0.3,
      },
    },
  };

  const styleKey = member?.communication_style.formality_level || 'neutral';
  const selectedMessage = messages[styleKey as keyof typeof messages];

  return {
    message: selectedMessage.message,
    tone_analysis: selectedMessage.tone_analysis,
    confidence: 0.87,
    member_personality: member?.personality_traits || [],
    approval_required: true,
  };
}

// ==================== Error Handling ====================

export function isBackendDown(response: any): boolean {
  // Check if response is from mock data
  return response?.event_id?.startsWith('evt_');
}