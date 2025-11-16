import { useState, useEffect, useRef } from 'react';
import { Mic, Send, Check, X, ChevronDown } from 'lucide-react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { agent, AgentWorkflow } from '../../../services/api';
import { parseEventFromText } from '../../../services/nlp';
import { fetchEventMessages, sendMemberMessage } from '../../../services/messages';

interface Message {
  member_id: string;
  name: string;
  status: string;
  suggested_message: string;
}

interface AutomatedAgentViewProps {
  eventId: string;
  onEventCreated: (eventId: string) => void;
  onCancel: () => void;
}


export function AutomatedAgentView({ eventId, onEventCreated, onCancel }: AutomatedAgentViewProps) {
  const [workflow, setWorkflow] = useState<AgentWorkflow | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // ------------ LOAD EVENT MESSAGES ------------
// --- ADD LOGGING EVERYWHERE ---

useEffect(() => {
  console.log("📨 Loading messages for event:", eventId);

  async function load() {
    try {
      const msgList = await fetchEventMessages(eventId);
      console.log("✅ Messages fetched:", msgList);
      setMessages(msgList);
    } catch (err) {
      console.error("❌ Failed to fetch messages:", err);
    }
  }
  load();
}, [eventId]);

// -------------------------------------------------------

useEffect(() => {
  console.log("🤖 Subscribing to workflow updates...");
  agent.subscribe((wf) => {
    console.log("🔄 Workflow Update:", wf);
    setWorkflow(wf);
  });

  return () => {
    console.log("🧹 Resetting agent on unmount");
    agent.reset();
  };
}, []);

// -------------------------------------------------------

const startListening = () => {
  console.log("🎤 Starting microphone speech recognition...");
  setUserInput('');
  (window as any).speechRecognition?.start();
};

// -------------------------------------------------------
const handleSubmit = async () => {
  console.log("📤 Submit Pressed. Raw userInput:", userInput);

  if (!userInput.trim()) {
    console.warn("⚠️ Tried submitting empty input.");
    return;
  }

  const parsed = parseEventFromText(userInput);
  // edit 
  console.log("✅ Parsed event data:", parsed);

  // Prevent bad parses
  if (parsed.errors.length > 0 && parsed.confidence < 0.5) {
    alert(`Parsing issues: ${parsed.errors.join(', ')}`);
    return;
  }

  try {
    // Create event using automated flow
    const response = await agent.createEventWithAutomation(
      {
        name: parsed.name,
        date: parsed.date,
        time: parsed.time,
        location: parsed.location || '',
        description: userInput,
      },
      parsed.members,
      "captain-1"
  );
  

    console.log("🎯 Received event_id from backend:", response.event_id);

    // Pass eventId back to parent
    onEventCreated(response.event_id);

    setUserInput("");
  } catch (err) {
    console.error("❌ Agent error:", err);
  }
};

// -------------------------------------------------------

const approve = async (memberId: string) => {
  console.log(`👍 Approving message for member: ${memberId}`);

  const m = messages.find((x) => x.member_id === memberId);
  if (!m) {
    console.error("❌ Tried approving unknown member:", memberId);
    return;
  }

  await sendMemberMessage(eventId, memberId, m.suggested_message);
  console.log("📨 Message sent to backend:", m);

  setMessages((prev) =>
    prev.map((x) =>
      x.member_id === memberId ? { ...x, status: 'sent' } : x
    )
  );
};

// -------------------------------------------------------

const reject = (memberId: string) => {
  console.log(`⛔ Rejecting message for member: ${memberId}`);

  setMessages((prev) =>
    prev.map((x) =>
      x.member_id === memberId ? { ...x, status: 'rejected' } : x
    )
  );
};

// -------------------------------------------------------

const sendManually = async (m: Message) => {
  console.log("📤 Manually sending message:", m);

  await sendMemberMessage(eventId, m.member_id, m.suggested_message);

  setMessages((prev) =>
    prev.map((x) =>
      x.member_id === m.member_id ? { ...x, status: 'sent' } : x
    )
  );
};

// -------------------------------------------------------

useEffect(() => {
  if (!workflow) return;
  console.log("📑 Workflow updated, total steps:", workflow.steps?.length ?? 0);
}, [workflow]);

  // ------------ WORKFLOW STEP ICON ------------
  const getStepIcon = (state: string) => {
    if (state.includes('error')) return '❌';
    if (state.includes('complete')) return '✅';
    if (state.includes('conflicts')) return '⚠️';
    if (state.includes('listening')) return '🎤';
    if (state.includes('parsing')) return '📝';
    if (state.includes('analyzing')) return '📊';
    if (state.includes('ready')) return '📨';
    if (state.includes('sending')) return '📤';
    return '⏳';
  };

  return (
    <div className="h-full flex flex-col bg-[#0f172a]">

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#334155]">
        <h2 className="text-white text-xl font-semibold">🤖 Automated Agent</h2>
        <button onClick={onCancel} className="text-[#94a3b8] text-xl">✕</button>
      </div>

      {/* Workflow Scroll */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-2">
        {!workflow ? (
          <Card className="bg-[#1e293b] border-[#334155] p-4 text-center">
            <p className="text-[#94a3b8] text-sm">Say or type your event to begin</p>
          </Card>
        ) : workflow.steps.map((step, i) => (
          <div key={i}>
            <button
              onClick={() => setExpandedStep(expandedStep === i ? null : i)}
              className="w-full text-left"
            >
              <Card className="bg-[#1e293b] border-[#334155] p-3">
                <div className="flex items-start gap-3">
                  <span className="text-xl">{getStepIcon(step.state)}</span>
                  <div className="flex-1">
                    <p className="text-white text-sm">{step.message}</p>
                    <p className="text-[#64748b] text-xs mt-1">
                      {step.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  {step.data && (
                    <ChevronDown
                      className={`w-4 h-4 text-[#94a3b8] transition-transform ${
                        expandedStep === i ? 'rotate-180' : ''
                      }`}
                    />
                  )}
                </div>

                {expandedStep === i && step.data && (
                  <div className="mt-3 pt-3 border-t border-[#334155] text-xs text-[#94a3b8]">
                    <pre className="whitespace-pre-wrap break-words">
                      {JSON.stringify(step.data, null, 2)}
                    </pre>
                  </div>
                )}
              </Card>
            </button>
          </div>
        ))}
      </div>

      {/* MESSAGE APPROVAL UI */}
      <div className="px-4 pb-3 space-y-4">
        {messages.map(m => (
          <div key={m.member_id} className="message-bubble">
            <div className="message-header">
              <span className="member-name">{m.name}</span>
              <span className="badge">{m.status.toUpperCase()}</span>
            </div>

            <p className="message-text">{m.suggested_message}</p>

            <div className="actions">
              <button className="approve-btn" onClick={() => approve(m.member_id)}>✓</button>
              <button className="reject-btn" onClick={() => reject(m.member_id)}>✕</button>
              <button className="send-btn" onClick={() => sendManually(m)}>➡</button>
            </div>
          </div>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-4 border-t border-[#334155]">
        <div className="flex gap-2">
          <input
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
            className="flex-1 bg-[#0f172a] border border-[#334155] text-white rounded-lg px-3 py-2 text-sm"
            placeholder="Type: Basketball Friday 7pm…"
          />
          <Button onClick={startListening} className="bg-[#7c3aed] p-2">
            <Mic className="w-5 h-5" />
          </Button>
          <Button onClick={handleSubmit} className="bg-[#10b981] p-2">
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
