import { useState, useEffect } from 'react';
import { ChevronDown, Loader, Check } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { EventData } from './mobile/MobileApp';
import * as api from '../services/api';

interface MemberMessagesMobileProps {
  event: EventData;
  invitedMembers: string[];
  eventId?: string;
  onBack: () => void;
  onConfirm: () => void;
}

interface GeneratedMessageState {
  memberId: string;
  memberName: string;
  status: 'available' | 'conflict';
  message: string | null;
  loading: boolean;
  error: string | null;
  tone?: api.GeneratedMessage['tone_analysis'];
  confirmed: boolean;
}

export function MemberMessagesMobile({
  event,
  invitedMembers,
  eventId,
  onBack,
  onConfirm,
}: MemberMessagesMobileProps) {
  const [messages, setMessages] = useState<GeneratedMessageState[]>([]);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<api.Member[]>([]);
  const [expandedMember, setExpandedMember] = useState<string | null>(null);
  const [sendingMessages, setSendingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initMessages = async () => {
      try {
        // Get members
        const membersList = await api.getMembers();
        setMembers(membersList);

        // Initialize message states for all invited members
        const initialMessages: GeneratedMessageState[] = invitedMembers.map(
          (memberId) => ({
            memberId,
            memberName:
              membersList.find((m) => m.id === memberId)?.name || 'Unknown',
            status: 'available', // Will be updated below
            message: null,
            loading: true,
            error: null,
            confirmed: false,
          })
        );

        setMessages(initialMessages);

        // Generate messages for all members
        for (let i = 0; i < invitedMembers.length; i++) {
          const memberId = invitedMembers[i];
          const member = membersList.find((m) => m.id === memberId);

          try {
            // Determine if member has conflict (mock logic)
            const hasConflict = Math.random() > 0.6;

            const generatedMsg = await api.generateConflictMessage(
              memberId,
              hasConflict ? 'calendar_clash' : 'confirmation',
              event.name,
              hasConflict ? 'Calendar conflict detected' : ''
            );

            setMessages((prev) => {
              const updated = [...prev];
              updated[i] = {
                ...updated[i],
                status: hasConflict ? 'conflict' : 'available',
                message: generatedMsg.message,
                tone: generatedMsg.tone_analysis,
                loading: false,
              };
              return updated;
            });
          } catch (err) {
            console.error(`Error generating message for ${memberId}:`, err);
            setMessages((prev) => {
              const updated = [...prev];
              updated[i] = {
                ...updated[i],
                loading: false,
                error: 'Failed to generate message',
              };
              return updated;
            });
          }
        }

        setLoading(false);
      } catch (err) {
        console.error('Failed to initialize messages:', err);
        setError('Failed to load members');
        setLoading(false);
      }
    };

    initMessages();
  }, [invitedMembers, event.name]);

  const handleSendMessages = async () => {
    setSendingMessages(true);
    try {
      const messagesToSend = messages
        .filter((m) => m.message && m.confirmed)
        .map((m) => ({
          memberId: m.memberId,
          message: m.message || '',
        }));

      if (messagesToSend.length === 0) {
        setError('Please confirm at least one message');
        setSendingMessages(false);
        return;
      }

      await api.sendApprovedMessages(eventId || 'event_temp', messagesToSend);

      // All sent successfully
      setTimeout(() => {
        onConfirm();
      }, 1500);
    } catch (err) {
      console.error('Error sending messages:', err);
      setError('Failed to send messages');
      setSendingMessages(false);
    }
  };

  const confirmedCount = messages.filter((m) => m.confirmed).length;
  const totalMessages = messages.filter((m) => m.message).length;

  if (loading) {
    return (
      <div className="p-4 text-center text-[#94a3b8]">
        <Loader className="w-8 h-8 animate-spin mx-auto mb-2" />
        <p className="text-sm">Generating personalized messages...</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-lg font-semibold">Member Messages</h2>
        <button
          onClick={onBack}
          className="text-[#94a3b8] hover:text-white text-xl"
        >
          ←
        </button>
      </div>

      {/* Error State */}
      {error && (
        <Card className="bg-red-500/10 border border-red-500/30 p-3">
          <p className="text-red-400 text-sm">{error}</p>
        </Card>
      )}

      {/* Info Card */}
      <Card className="bg-[#1e293b] border-[#334155] p-3">
        <p className="text-[#94a3b8] text-xs mb-2">EVENT</p>
        <p className="text-white text-sm font-semibold">{event.name}</p>
        <p className="text-[#94a3b8] text-xs mt-1">
          {event.date} at {event.time}
        </p>
      </Card>

      {/* Messages List */}
      <div className="space-y-2">
        <p className="text-[#94a3b8] text-xs font-semibold px-1">
          MESSAGES ({confirmedCount}/{totalMessages})
        </p>

        {messages.map((msg, index) => {
          const member = members.find((m) => m.id === msg.memberId);
          const isExpanded = expandedMember === msg.memberId;

          if (!msg.message && msg.error) {
            return (
              <Card
                key={msg.memberId}
                className="bg-red-500/5 border border-red-500/20 p-3"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{member?.emoji}</span>
                  <div className="flex-1">
                    <p className="text-white text-sm">{msg.memberName}</p>
                    <p className="text-red-400 text-xs">{msg.error}</p>
                  </div>
                </div>
              </Card>
            );
          }

          if (msg.loading) {
            return (
              <Card key={msg.memberId} className="bg-[#1e293b] border-[#334155] p-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{member?.emoji}</span>
                  <div className="flex-1">
                    <p className="text-white text-sm">{msg.memberName}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Loader className="w-3 h-3 animate-spin text-[#429ebd]" />
                      <p className="text-[#94a3b8] text-xs">
                        Generating message...
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            );
          }

          return (
            <button
              key={msg.memberId}
              onClick={() =>
                setExpandedMember(isExpanded ? null : msg.memberId)
              }
              className="w-full text-left"
            >
              <Card
                className={`transition-all border-2 ${
                  msg.confirmed
                    ? 'bg-[#10b981]/10 border-[#10b981]/30'
                    : msg.status === 'conflict'
                      ? 'bg-[#ef4444]/5 border-[#ef4444]/20'
                      : 'bg-[#1e293b] border-[#334155]'
                }`}
              >
                <div
                  className="p-3 flex items-start gap-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="text-lg">{member?.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-white text-sm font-medium">
                        {msg.memberName}
                      </p>
                      {msg.status === 'conflict' && (
                        <Badge
                          variant="destructive"
                          className="text-xs bg-[#ef4444]/20 text-[#ef4444]"
                        >
                          Conflict
                        </Badge>
                      )}
                      {msg.confirmed && (
                        <Check className="w-4 h-4 text-[#10b981] ml-auto" />
                      )}
                    </div>
                    <p className="text-[#94a3b8] text-xs truncate">
                      {msg.tone?.formality === 'formal' ? '📋 ' : '💬 '}
                      {msg.message}
                    </p>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-[#94a3b8] transition-transform flex-shrink-0 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </div>

                {isExpanded && (
                  <div className="px-3 pb-3 pt-0 border-t border-[#334155] space-y-3">
                    {/* Tone Analysis */}
                    <div className="space-y-1">
                      <p className="text-[#94a3b8] text-xs font-semibold">
                        TONE ANALYSIS
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-[#0f172a] rounded p-2 border border-[#334155]">
                          <p className="text-[#94a3b8] text-xs">Formality</p>
                          <p className="text-white text-xs font-medium capitalize">
                            {msg.tone?.formality}
                          </p>
                        </div>
                        <div className="bg-[#0f172a] rounded p-2 border border-[#334155]">
                          <p className="text-[#94a3b8] text-xs">Humor</p>
                          <p className="text-white text-xs font-medium">
                            {((msg.tone?.humor_level as number) * 100).toFixed(0)}%
                          </p>
                        </div>
                        <div className="bg-[#0f172a] rounded p-2 border border-[#334155]">
                          <p className="text-[#94a3b8] text-xs">Emojis</p>
                          <p className="text-white text-xs font-medium">
                            {((msg.tone?.emoji_usage as number) * 100).toFixed(0)}%
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Full Message */}
                    <div className="space-y-1">
                      <p className="text-[#94a3b8] text-xs font-semibold">
                        MESSAGE
                      </p>
                      <div className="bg-[#0f172a] rounded p-3 border border-[#334155]">
                        <p className="text-white text-sm leading-relaxed">
                          {msg.message}
                        </p>
                      </div>
                    </div>

                    {/* Confirm Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMessages((prev) =>
                          prev.map((m) =>
                            m.memberId === msg.memberId
                              ? { ...m, confirmed: !m.confirmed }
                              : m
                          )
                        );
                      }}
                      className={`w-full py-2 rounded font-medium text-sm transition-all ${
                        msg.confirmed
                          ? 'bg-[#10b981] text-white'
                          : 'bg-[#334155] text-[#94a3b8] hover:bg-[#429ebd]/20'
                      }`}
                    >
                      {msg.confirmed ? (
                        <span className="flex items-center justify-center gap-2">
                          <Check className="w-4 h-4" />
                          Confirmed
                        </span>
                      ) : (
                        'Approve & Send'
                      )}
                    </button>
                  </div>
                )}
              </Card>
            </button>
          );
        })}
      </div>

      {/* Send Button */}
      <Button
        onClick={handleSendMessages}
        disabled={sendingMessages || confirmedCount === 0}
        className="w-full bg-[#429ebd] hover:bg-[#3a8ba8] text-white py-3 disabled:opacity-50 font-medium"
      >
        {sendingMessages ? (
          <>
            <Loader className="w-4 h-4 mr-2 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            Send {confirmedCount} Message{confirmedCount !== 1 ? 's' : ''}
          </>
        )}
      </Button>
    </div>
  );
}