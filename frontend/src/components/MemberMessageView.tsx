import { ArrowLeft } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';

interface MemberMessageViewProps {
  onBack: () => void;
}

const messageThreads = [
  {
    member: 'Sarah',
    messages: [
      {
        sender: 'system',
        text: "Hey Sarah! Debate club meeting scheduled for Tuesday 5pm. I noticed you have class until 5pm every Tuesday—would 6pm work better for you instead? Let me know! —ClubPilot",
        time: '2:30pm',
      },
      {
        sender: 'member',
        text: "Yesss 6pm is perfect! I can make that.",
        time: '2:45pm',
      },
      {
        sender: 'system',
        text: "Perfect! I'll let the captain know. See you at 6pm! 🎉",
        time: '2:46pm',
      },
    ],
  },
  {
    member: 'Emma',
    messages: [
      {
        sender: 'system',
        text: "Hi Emma! We're planning a debate club meeting Tuesday at 5pm. I see you have work 6-9pm. Would an earlier time like 3pm work better?",
        time: '2:31pm',
      },
      {
        sender: 'member',
        text: "Actually 6pm moved to after my shift would be great!",
        time: '3:15pm',
      },
      {
        sender: 'system',
        text: "Got it! I'll suggest that to the captain. Thanks for letting me know! 👍",
        time: '3:16pm',
      },
    ],
  },
];

export function MemberMessageView({ onBack }: MemberMessageViewProps) {
  return (
    <div className="p-8">
      <Button
        onClick={onBack}
        variant="ghost"
        className="mb-6 text-[#429ebd] hover:bg-[#429ebd]/10"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Analysis
      </Button>

      <h2 className="text-white text-2xl mb-6">Member Messages</h2>

      <div className="space-y-6 max-w-3xl">
        {messageThreads.map((thread, index) => (
          <Card key={index} className="bg-[#1e293b] border-[#334155] p-6">
            <h3 className="text-white mb-4">Conversation with {thread.member}</h3>
            <div className="space-y-4">
              {thread.messages.map((message, msgIndex) => (
                <div
                  key={msgIndex}
                  className={`flex ${message.sender === 'system' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.sender === 'system'
                        ? 'bg-[#9fe7f5]/20 border border-[#9fe7f5]/30'
                        : 'bg-[#429ebd]/20 border border-[#429ebd]/30'
                    }`}
                  >
                    <p className="text-white mb-2">{message.text}</p>
                    <p className="text-xs text-[#94a3b8]">{message.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
