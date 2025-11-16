import { useState } from 'react';
import { Plus, Mic } from 'lucide-react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { EventData } from '../MobileApp';
import { VoiceEventCreator } from './VoiceEventCreator';

interface CaptainEventsMobileProps {
  onCreateEvent?: (event: EventData, invitedMembers: string[]) => void;
  onNavigateToAnalysis?: () => void;
}

const AVAILABLE_MEMBERS = [
  { id: 'm1', name: 'Alice', emoji: '👩' },
  { id: 'm2', name: 'Bob', emoji: '👨' },
  { id: 'm3', name: 'Charlie', emoji: '👨' },
  { id: 'm4', name: 'Diana', emoji: '👩' },
  { id: 'm5', name: 'Evan', emoji: '👨' },
];

export function CaptainEventsMobile({
  onCreateEvent,
  onNavigateToAnalysis,
}: CaptainEventsMobileProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showVoiceCreator, setShowVoiceCreator] = useState(false);
  const [formData, setFormData] = useState<EventData>({
    name: '',
    date: '',
    time: '',
    location: '',
    description: '',
  });
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name || !formData.date || !formData.time) {
      setError('Please fill in all required fields');
      return;
    }

    if (selectedMembers.length === 0) {
      setError('Please invite at least one member');
      return;
    }

    setLoading(true);
    try {
      if (onCreateEvent) {
        onCreateEvent(formData, selectedMembers);
      }
    } catch (err) {
      setError('Failed to create event. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
      setShowCreateForm(false);
      setFormData({ name: '', date: '', time: '', location: '', description: '' });
      setSelectedMembers([]);
    }
  };

  const toggleMember = (memberId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  // Voice Creator Mode
  if (showVoiceCreator) {
    return (
      <VoiceEventCreator
        onEventCreated={(event, members) => {
          if (onCreateEvent) {
            onCreateEvent(event, members);
          }
          setShowVoiceCreator(false);
        }}
        onCancel={() => setShowVoiceCreator(false)}
      />
    );
  }

  // Manual Form Mode
  if (showCreateForm) {
    return (
      <div className="h-full flex flex-col">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between mb-4 p-4 border-b border-[#334155] flex-shrink-0">
          <h2 className="text-white text-xl font-semibold">Create New Event</h2>
          <button
            onClick={() => {
              setShowCreateForm(false);
              setError(null);
            }}
            className="text-[#94a3b8] hover:text-white text-xl"
            disabled={loading}
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4">
          <div className="space-y-4 pb-6">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Event Name */}
              <div>
                <label className="block text-[#94a3b8] text-sm mb-2">Event Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Debate Club Meeting"
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-white placeholder-[#64748b] focus:outline-none focus:border-[#429ebd]"
                  disabled={loading}
                  required
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-[#94a3b8] text-sm mb-2">Date *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#429ebd]"
                  disabled={loading}
                  required
                />
              </div>

              {/* Time */}
              <div>
                <label className="block text-[#94a3b8] text-sm mb-2">Time *</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#429ebd]"
                  disabled={loading}
                  required
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-[#94a3b8] text-sm mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="Room 302"
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-white placeholder-[#64748b] focus:outline-none focus:border-[#429ebd]"
                  disabled={loading}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[#94a3b8] text-sm mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Add details..."
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-white placeholder-[#64748b] focus:outline-none focus:border-[#429ebd] resize-none h-20"
                  disabled={loading}
                />
              </div>

              {/* Invite Members */}
              <div>
                <label className="block text-[#94a3b8] text-sm mb-3">Invite Members *</label>
                <div className="space-y-2">
                  {AVAILABLE_MEMBERS.map((member) => (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => toggleMember(member.id)}
                      disabled={loading}
                      className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                        selectedMembers.includes(member.id)
                          ? 'border-[#429ebd] bg-[#429ebd]/10'
                          : 'border-[#334155] bg-[#0f172a]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{member.emoji}</span>
                        <span className="text-white text-sm">{member.name}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {selectedMembers.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {selectedMembers.map((memberId) => {
                      const member = AVAILABLE_MEMBERS.find((m) => m.id === memberId);
                      return (
                        <Badge
                          key={memberId}
                          variant="secondary"
                          className="bg-[#429ebd]/20 text-[#9fe7f5]"
                        >
                          {member?.emoji} {member?.name}
                        </Badge>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex gap-2 pt-4 pb-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#429ebd] hover:bg-[#3a8ba8] text-white rounded-lg py-2 font-medium disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create & Analyze'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setError(null);
                  }}
                  disabled={loading}
                  className="flex-1 border border-[#334155] text-[#94a3b8] rounded-lg py-2 font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>

              <p className="text-xs text-[#64748b] text-center pb-4">
                ✨ Our AI will analyze member availability
              </p>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Main Events View
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-xl font-semibold">Events</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowVoiceCreator(true)}
            className="flex items-center gap-2 bg-[#429ebd] hover:bg-[#3a8ba8] text-white rounded-full p-2"
            title="Create event with voice"
          >
            <Mic className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 bg-[#429ebd] hover:bg-[#3a8ba8] text-white rounded-full p-2"
            title="Create event manually"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="space-y-3">
        <h3 className="text-[#94a3b8] text-sm font-semibold">Upcoming Events</h3>

        <Card className="bg-[#1e293b] border-[#334155] p-4">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-white font-medium mb-1">Basketball Practice</h4>
              <p className="text-[#94a3b8] text-sm">Friday, Nov 15 • 7:00 PM</p>
              <p className="text-[#64748b] text-xs mt-1">Room 301 • 12 members invited</p>
            </div>
            <Badge variant="secondary" className="bg-[#10b981]/20 text-[#10b981]">
              On Track
            </Badge>
          </div>
        </Card>

        <Card className="bg-[#1e293b] border-[#334155] p-4">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-white font-medium mb-1">Debate Club Meeting</h4>
              <p className="text-[#94a3b8] text-sm">Tuesday, Nov 12 • 5:00 PM</p>
              <p className="text-[#64748b] text-xs mt-1">Room 302 • 8 members invited</p>
            </div>
            <Badge variant="secondary" className="bg-[#ef4444]/20 text-[#ef4444]">
              2 Conflicts
            </Badge>
          </div>
        </Card>
      </div>

      {/* Past Events */}
      <div className="space-y-3">
        <h3 className="text-[#94a3b8] text-sm font-semibold">Past Events</h3>

        <Card className="bg-[#1e293b] border-[#334155] p-4 opacity-60">
          <div>
            <h4 className="text-white font-medium mb-1">Photo Walk</h4>
            <p className="text-[#94a3b8] text-sm">Sunday, Nov 8 • 2:00 PM</p>
            <p className="text-[#64748b] text-xs mt-1">15/18 attended</p>
          </div>
        </Card>
      </div>
    </div>
  );
}