import { useState } from 'react';
import { X } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { EventData } from '../App';

interface CreateEventProps {
  onCancel: () => void;
  onCreate: (event: EventData) => void;
}

export function CreateEvent({ onCancel, onCreate }: CreateEventProps) {
  const [formData, setFormData] = useState<EventData>({
    name: '',
    date: '',
    time: '',
    location: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(formData);
  };

  return (
    <div className="p-8">
      <Card className="bg-[#1e293b] border-[#334155] max-w-2xl mx-auto">
        <div className="flex items-center justify-between p-6 border-b border-[#334155]">
          <h2 className="text-white text-2xl">Create New Event</h2>
          <button
            onClick={onCancel}
            className="text-[#94a3b8] hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="event-name" className="text-[#94a3b8]">
              Event Name
            </Label>
            <Input
              id="event-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Debate Club Meeting"
              className="bg-[#0f172a] border-[#334155] text-white"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preferred-date" className="text-[#94a3b8]">
                Preferred Date
              </Label>
              <Input
                id="preferred-date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="bg-[#0f172a] border-[#334155] text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferred-time" className="text-[#94a3b8]">
                Preferred Time
              </Label>
              <Input
                id="preferred-time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="bg-[#0f172a] border-[#334155] text-white"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-[#94a3b8]">
              Location
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Room 302"
              className="bg-[#0f172a] border-[#334155] text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-[#94a3b8]">
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add any additional details..."
              className="bg-[#0f172a] border-[#334155] text-white min-h-[100px]"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-[#429ebd] hover:bg-[#3a8ba8] text-white"
            >
              Create Event
            </Button>
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              className="flex-1 border-[#334155] text-[#94a3b8] hover:bg-[#334155]"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
