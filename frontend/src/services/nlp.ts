// frontend/src/services/nlp.ts

export interface ParsedEvent {
    eventName: string;
    eventType: string;
    proposedTime: string;    // ISO string
    invitedMembers: string[]; // member IDs or names
    description?: string;
    confidence: number;
    errors: string[];
  }
  
  /**
   * Very simple placeholder parser.
   * Later we can replace this with a real NLP implementation
   * or a call to a backend NLP endpoint.
   */
  export function parseEventFromText(input: string): ParsedEvent {
    const trimmed = input.trim();
  
    return {
      eventName: trimmed || 'Untitled Event',
      eventType: 'practice',
      proposedTime: new Date().toISOString(),
      invitedMembers: [],
      description: trimmed,
      confidence: 0.3,
      errors: ['NLP parser not fully implemented yet'],
    };
  }
  