import { useState } from 'react';
import { X, Loader } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { EventData } from './mobile/MobileApp';

interface CreateEventProps {
  onCancel: () => void;
  onCreate: (event: EventData, members: string[]) => void;
  captainId: string;
}

const [members, setMembers] = useState([]);

useEffect(() => {
  fetch("http://localhost:8000/api/members")
    .then(res => res.json())
    .then(data => setMembers(data));
}, []);


export function CreateEvent({
  onCancel,
  onCreate,
  captainId,
}: CreateEventProps) {
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
      // Pass event data and selected members to parent
      onCreate(formData, selectedMembers);
    } catch (err) {
      setError('Failed to create event. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleMember = (memberId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  return (
    <div className="p-8 min-h-screen overflow-auto">
      <Card className="bg-[#1e293b] border-[#334155] max-w-2xl mx-auto">
        <div className="flex items-center justify-between p-6 border-b border-[#334155]">
          <h2 className="text-white text-2xl">Create New Event</h2>
          <button
            onClick={onCancel}
            className="text-[#94a3b8] hover:text-white transition-colors"
            disabled={loading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Event Name */}
          <div className="space-y-2">
            <Label htmlFor="event-name" className="text-[#94a3b8]">
              Event Name *
            </Label>
            <Input
              id="event-name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Debate Club Meeting"
              className="bg-[#0f172a] border-[#334155] text-white"
              required
              disabled={loading}
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preferred-date" className="text-[#94a3b8]">
                Date *
              </Label>
              <Input
                id="preferred-date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="bg-[#0f172a] border-[#334155] text-white"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferred-time" className="text-[#94a3b8]">
                Time *
              </Label>
              <Input
                id="preferred-time"
                type="time"
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
                className="bg-[#0f172a] border-[#334155] text-white"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-[#94a3b8]">
              Location
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              placeholder="Room 302"
              className="bg-[#0f172a] border-[#334155] text-white"
              disabled={loading}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-[#94a3b8]">
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Add any additional details..."
              className="bg-[#0f172a] border-[#334155] text-white min-h-[100px]"
              disabled={loading}
            />
          </div>

          {/* Invite Members */}
          <div className="space-y-3">
            <Label className="text-[#94a3b8]">Invite Members *</Label>
            <div className="grid grid-cols-2 gap-2">
              {members.map((member) => (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => toggleMember(member.id)}
                  disabled={loading}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedMembers.includes(member.id)
                      ? 'border-[#429ebd] bg-[#429ebd]/10'
                      : 'border-[#334155] bg-[#0f172a] hover:border-[#429ebd]/50'
                  } disabled:opacity-50`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{member.emoji}</span>
                    <span className="text-white text-sm">{member.name}</span>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
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
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#429ebd] hover:bg-[#3a8ba8] text-white disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create & Analyze'
              )}
            </Button>
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              disabled={loading}
              className="flex-1 border-[#334155] text-[#94a3b8] hover:bg-[#334155] disabled:opacity-50"
            >
              Cancel
            </Button>
          </div>

          <p className="text-xs text-[#64748b] text-center">
            ✨ Our AI will analyze member availability and suggest better times
          </p>
        </form>
      </Card>
    </div>
  );
}