import { useState } from 'react';
import { ArrowLeft, AlertTriangle, Check } from 'lucide-react';
import { UserRole } from '../App';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';

interface ClubDetailsProps {
  clubId: number;
  userRole: UserRole;
  onBack: () => void;
  onViewConflictResolution: () => void;
}

const mockClubData = {
  1: {
    name: 'Basketball Club',
    logo: '🏀',
    nextEvent: {
      name: 'Friday Practice',
      date: 'Friday, Nov 15',
      time: '7pm - 9pm',
      duration: '2 hours',
    },
    conflict: {
      warning: '⚠️ Exam 9am Saturday',
      type: 'Exam',
      description: 'You have a midterm exam the morning after',
      availability: 'Free until 8pm Friday',
      eventTime: '7pm-9pm Friday',
      impact: 'Without you: 14/20 predicted',
    },
  },
};

const responseTemplates = [
  {
    id: 1,
    type: 'Formal',
    message: 'I have a commitment that evening. Could we reschedule to another day?',
  },
  {
    id: 2,
    type: 'Casual',
    message: 'I got an exam the next morning, can we move practice?',
  },
  {
    id: 3,
    type: 'Compromise',
    message: 'I can do the first hour but need to leave early for studying. That okay?',
  },
];

export function ClubDetails({ clubId, userRole, onBack, onViewConflictResolution }: ClubDetailsProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [messageSent, setMessageSent] = useState(false);
  const [sentTime, setSentTime] = useState('');

  const club = mockClubData[clubId as keyof typeof mockClubData];

  if (!club) return null;

  const handleSelectTemplate = (templateId: number) => {
    setSelectedTemplate(templateId);
    const template = responseTemplates.find((t) => t.id === templateId);
    if (template) {
      setMessage(template.message);
    }
  };

  const handleSendMessage = () => {
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    setSentTime(time);
    setMessageSent(true);
  };

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <div className="sticky top-0 bg-[#1e293b] border-b border-[#334155] p-4 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-[#429ebd]">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="text-2xl">{club.logo}</div>
          <h1 className="text-white">{club.name}</h1>
        </div>
      </div>

      <div className="p-4">
        <Tabs defaultValue="event" className="w-full">
          <TabsList className="w-full bg-[#1e293b] mb-4">
            <TabsTrigger value="event" className="flex-1">Event</TabsTrigger>
            <TabsTrigger value="conflict" className="flex-1" onClick={onViewConflictResolution}>
              Conflict
            </TabsTrigger>
          </TabsList>

          <TabsContent value="event" className="space-y-4">
            {/* Next Event Card */}
            <Card className="bg-[#1e293b] border-[#334155] p-4">
              <h3 className="text-white mb-3">Next Event</h3>
              <div className="space-y-2 text-[#94a3b8]">
                <p className="text-white">{club.nextEvent.name}</p>
                <p className="text-sm">{club.nextEvent.date}</p>
                <p className="text-sm">{club.nextEvent.time}</p>
                <p className="text-sm">Duration: {club.nextEvent.duration}</p>
              </div>

              <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-md p-3">
                <div className="flex items-center gap-2 text-red-400 text-sm mb-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{club.conflict.warning}</span>
                </div>
                <Badge variant="secondary" className="bg-red-500/20 text-red-400">
                  {club.conflict.type}
                </Badge>
              </div>
            </Card>

            {/* Conflict Description */}
            <Card className="bg-[#1e293b] border-[#334155] p-4">
              <h3 className="text-white mb-3">Conflict Details</h3>
              <div className="space-y-2 text-sm text-[#94a3b8]">
                <p>{club.conflict.description}</p>
                <p>Your availability: <span className="text-[#9fe7f5]">{club.conflict.availability}</span></p>
                <p>Event time: <span className="text-[#9fe7f5]">{club.conflict.eventTime}</span></p>
                <p className="text-red-400">{club.conflict.impact}</p>
              </div>
            </Card>

            {/* AI Response Templates */}
            <Card className="bg-[#1e293b] border-[#334155] p-4">
              <h3 className="text-white mb-3">AI Response Templates</h3>
              <div className="space-y-3 mb-4">
                {responseTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleSelectTemplate(template.id)}
                    className={`w-full text-left p-4 rounded-md border-2 transition-all ${
                      selectedTemplate === template.id
                        ? 'border-[#9fe7f5] bg-[#9fe7f5]/5'
                        : 'border-[#334155] bg-[#0f172a]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Badge variant="secondary" className="bg-[#429ebd]/20 text-[#9fe7f5]">
                        {template.type}
                      </Badge>
                      {selectedTemplate === template.id && (
                        <Check className="w-5 h-5 text-[#9fe7f5]" />
                      )}
                    </div>
                    <p className="text-sm text-[#94a3b8]">{template.message}</p>
                  </button>
                ))}
              </div>
            </Card>

            {/* Edit & Send Section */}
            {selectedTemplate && (
              <Card className="bg-[#1e293b] border-[#334155] p-4">
                <h3 className="text-white mb-3">Edit & Send</h3>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="bg-[#0f172a] border-[#334155] text-[#94a3b8] mb-3 min-h-[100px]"
                  placeholder="Edit your message..."
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={messageSent}
                  className="w-full bg-[#429ebd] hover:bg-[#3a8ba8] text-white"
                >
                  {messageSent ? (
                    <span className="flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      Message Sent
                    </span>
                  ) : (
                    'Send to Captain'
                  )}
                </Button>
                {messageSent && (
                  <p className="text-center text-sm text-[#94a3b8] mt-2">
                    Message sent at {sentTime}
                  </p>
                )}
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
