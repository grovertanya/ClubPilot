import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, Loader } from 'lucide-react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { EventData } from '../MobileApp';
import * as api from '../../../services/api';

interface VoiceEventCreatorProps {
  onEventCreated: (event: EventData, members: string[]) => void;
  onCancel: () => void;
}

const AVAILABLE_MEMBERS = [
  { id: 'm1', name: 'Alice', emoji: '👩' },
  { id: 'm2', name: 'Bob', emoji: '👨' },
  { id: 'm3', name: 'Charlie', emoji: '👨' },
  { id: 'm4', name: 'Diana', emoji: '👩' },
  { id: 'm5', name: 'Evan', emoji: '👨' },
];

const ELEVENLABS_API_KEY = import.meta.env.REACT_APP_ELEVENLABS_API_KEY || '';
const ELEVENLABS_VOICE_ID = 'JBFqnCBsd6RMkjVY5ZfH'; // Default voice

export function VoiceEventCreator({ onEventCreated, onCancel }: VoiceEventCreatorProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState('');
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Initialize Web Speech API
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setStatus('Speech Recognition not supported in this browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
      setStatus('Listening... Describe your event');
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptSegment = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          setTranscript((prev) => prev + transcriptSegment + ' ');
        } else {
          interimTranscript += transcriptSegment;
        }
      }
    };

    recognition.onerror = (event: any) => {
      setStatus(`Error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  // Text-to-speech function using ElevenLabs
  const speak = async (text: string) => {
    if (!ELEVENLABS_API_KEY) {
      setStatus('ElevenLabs API key not configured');
      return;
    }

    setIsSpeaking(true);
    setStatus('Speaking...');

    try {
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'xi-api-key': ELEVENLABS_API_KEY,
          },
          body: JSON.stringify({
            text,
            model_id: 'eleven_monolingual_v1',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error('ElevenLabs API error');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.onended = () => {
          setIsSpeaking(false);
          setStatus('');
        };
        audioRef.current.play();
      }
    } catch (error) {
      console.error('TTS Error:', error);
      setStatus('Could not speak. Check API key.');
      setIsSpeaking(false);
    }
  };

  // Parse spoken text and extract event details
  const parseEventFromTranscript = async (text: string) => {
    setIsProcessing(true);
    setStatus('Parsing your event...');

    try {
      // Simple parsing logic - can be enhanced with NLP
      const eventName = extractEventName(text);
      const date = extractDate(text);
      const time = extractTime(text);
      const members = extractMembers(text);

      const event: EventData = {
        name: eventName || 'Untitled Event',
        date: date || new Date().toISOString().split('T')[0],
        time: time || '18:00',
        location: extractLocation(text) || 'TBD',
        description: text,
      };

      // Check for conflicts
      await speak(
        `Creating event: ${event.name} on ${event.date} at ${event.time} with ${
          members.length > 0 ? members.map(m => AVAILABLE_MEMBERS.find(am => am.id === m)?.name).join(' and ') : 'no members invited'
        }. Analyzing schedule...`
      );

      // Simulate conflict detection
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create the event
      onEventCreated(event, members);

      setStatus('Event created successfully!');
    } catch (error) {
      setStatus('Error parsing event. Please try again.');
      console.error('Parse error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const handleSubmit = async () => {
    if (!transcript.trim()) {
      setStatus('Please say something first');
      return;
    }
    await parseEventFromTranscript(transcript);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-xl font-semibold">🎤 Voice Event Creator</h2>
        <button
          onClick={onCancel}
          className="text-[#94a3b8] hover:text-white text-xl"
        >
          ✕
        </button>
      </div>

      {/* Microphone Card */}
      <Card className="bg-[#1e293b] border-[#334155] p-6">
        <div className="flex flex-col items-center gap-4">
          <div
            className={`rounded-full p-6 transition-all ${
              isListening ? 'bg-red-500/20 animate-pulse' : 'bg-[#429ebd]/20'
            }`}
          >
            {isListening ? (
              <MicOff className="w-12 h-12 text-red-400 animate-spin" />
            ) : (
              <Mic className="w-12 h-12 text-[#429ebd]" />
            )}
          </div>

          <p className="text-white text-center font-medium">
            {isListening ? 'Listening...' : 'Ready to listen'}
          </p>
          <p className="text-[#94a3b8] text-sm text-center">
            Say: "Create event Basketball on Friday at 7pm with Alice and Bob"
          </p>

          <div className="flex gap-2 w-full">
            <Button
              onClick={startListening}
              disabled={isListening || isProcessing || isSpeaking}
              className="flex-1 bg-[#429ebd] hover:bg-[#3a8ba8] text-white"
            >
              {isListening ? 'Listening...' : 'Start Speaking'}
            </Button>
            <Button
              onClick={stopListening}
              disabled={!isListening}
              variant="outline"
              className="flex-1 border-[#334155] text-[#94a3b8]"
            >
              Stop
            </Button>
          </div>
        </div>
      </Card>

      {/* Transcript Display */}
      {transcript && (
        <Card className="bg-[#0f172a] border-[#334155] p-4">
          <p className="text-[#94a3b8] text-xs mb-2">WHAT YOU SAID:</p>
          <p className="text-white text-sm leading-relaxed italic">"{transcript}"</p>
        </Card>
      )}

      {/* Status Display */}
      {status && (
        <Card
          className={`p-4 ${
            status.includes('Error')
              ? 'bg-red-500/10 border-red-500/30'
              : 'bg-[#10b981]/10 border-[#10b981]/30'
          }`}
        >
          <div className="flex items-center gap-2">
            {isProcessing && <Loader className="w-4 h-4 animate-spin text-[#429ebd]" />}
            {isSpeaking && <Volume2 className="w-4 h-4 animate-bounce text-[#429ebd]" />}
            <p
              className={`text-sm ${
                status.includes('Error') ? 'text-red-400' : 'text-[#10b981]'
              }`}
            >
              {status}
            </p>
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      {transcript && (
        <div className="flex gap-2">
          <Button
            onClick={handleSubmit}
            disabled={isProcessing || isSpeaking || isListening}
            className="flex-1 bg-[#10b981] hover:bg-[#059669] text-white"
          >
            {isProcessing ? 'Processing...' : 'Create Event'}
          </Button>
          <Button
            onClick={() => setTranscript('')}
            variant="outline"
            className="flex-1 border-[#334155] text-[#94a3b8]"
          >
            Clear
          </Button>
        </div>
      )}

      {/* Hidden audio element for TTS */}
      <audio ref={audioRef} className="hidden" />

      <p className="text-xs text-[#64748b] text-center">
        💡 Tip: Speak clearly and include event details like name, date, time, and members
      </p>
    </div>
  );
}

// ==================== Helper Functions ====================

function extractEventName(text: string): string {
  const eventKeywords = ['event', 'meeting', 'practice', 'session', 'club', 'gathering'];
  const lowerText = text.toLowerCase();

  for (const keyword of eventKeywords) {
    const index = lowerText.indexOf(keyword);
    if (index !== -1) {
      const afterKeyword = text.substring(index + keyword.length).trim();
      const words = afterKeyword.split(' ').slice(0, 3).join(' ');
      if (words) return words;
    }
  }

  return text.split(' ').slice(0, 3).join(' ');
}

function extractDate(text: string): string {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const lowerText = text.toLowerCase();

  for (const day of days) {
    if (lowerText.includes(day)) {
      const date = new Date();
      const currentDay = date.getDay();
      const dayIndex = days.indexOf(day);
      const daysUntil = (dayIndex - currentDay + 7) % 7 || 7;
      date.setDate(date.getDate() + daysUntil);
      return date.toISOString().split('T')[0];
    }
  }

  return '';
}

function extractTime(text: string): string {
  const timeRegex = /(\d{1,2})\s*(?::(\d{2}))?\s*(?:am|pm|a\.m|p\.m)?/i;
  const match = text.match(timeRegex);

  if (match) {
    const hour = parseInt(match[1]);
    const minute = match[2] ? parseInt(match[2]) : 0;
    const isPM = text.toLowerCase().includes('pm');
    const adjustedHour = isPM && hour !== 12 ? hour + 12 : hour === 12 && !isPM ? 0 : hour;
    return `${String(adjustedHour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  }

  return '';
}

function extractMembers(text: string): string[] {
  const members: string[] = [];
  const memberNames = ['alice', 'bob', 'charlie', 'diana', 'evan'];

  for (const name of memberNames) {
    if (text.toLowerCase().includes(name)) {
      const memberId = `m${memberNames.indexOf(name) + 1}`;
      members.push(memberId);
    }
  }

  return members;
}

function extractLocation(text: string): string {
  const locationRegex = /(?:at|in|room|location)\s+([a-zA-Z0-9\s]+?)(?:\s+(?:at|on|with)|$)/i;
  const match = text.match(locationRegex);
  return match ? match[1].trim() : '';
}