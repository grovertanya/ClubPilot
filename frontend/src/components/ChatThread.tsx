import { ArrowLeft } from 'lucide-react';
import { UserRole } from '../App';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface ChatThreadProps {
  chatId: number;
  userRole: UserRole;
  onBack: () => void;
}

const mockThreads: Record<number, any> = {
  1: {
    clubName: 'Basketball Club',
    clubLogo: '🏀',
    messages: [
      {
        id: 1,
        sender: 'member',
        text: "I got an exam the next morning, can we move practice?",
        timestamp: '2 hours ago',
        isAI: true,
      },
      {
        id: 2,
        sender: 'captain',
        text: "Thanks for letting me know! How about Tuesday at the same time?",
        timestamp: '1 hour ago',
        sentiment: 'positive',
      },
    ],
  },
  2: {
    clubName: 'Photography Society',
    clubLogo: '📸',
    messages: [
      {
        id: 1,
        sender: 'captain',
        text: "We've moved the photo walk to Sunday 2pm instead.",
        timestamp: '1 day ago',
      },
      {
        id: 2,
        sender: 'member',
        text: "Thanks for moving it! I can definitely make Tuesday.",
        timestamp: '1 day ago',
        isAI: true,
      },
    ],
  },
};

export function ChatThread({ chatId, userRole, onBack }: ChatThreadProps) {
  const thread = mockThreads[chatId];

  if (!thread) return null;

  const getSentimentEmoji = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return '😊';
      case 'neutral':
        return '😐';
      case 'negative':
        return '😞';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <div className="sticky top-0 bg-[#1e293b] border-b border-[#334155] p-4 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-[#429ebd]">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="text-2xl">{thread.clubLogo}</div>
          <h1 className="text-white">{thread.clubName}</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {thread.messages.map((message: any) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'member' ? 'justify-start' : 'justify-end'}`}
          >
            <div className={`max-w-[80%] ${message.sender === 'member' ? '' : 'items-end'}`}>
              <Card
                className={`p-3 ${
                  message.sender === 'member'
                    ? 'bg-[#429ebd]/20 border-[#429ebd]/30'
                    : 'bg-[#1e293b] border-[#334155]'
                }`}
              >
                <p className="text-[#e2e8f0] text-sm mb-2">{message.text}</p>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-[#64748b]">{message.timestamp}</span>
                  {message.isAI && (
                    <Badge variant="secondary" className="bg-[#9fe7f5]/20 text-[#9fe7f5] text-xs">
                      🤖 AI Generated
                    </Badge>
                  )}
                </div>
              </Card>
              {message.sentiment && (
                <div className="mt-2 px-3">
                  <div className="flex items-center gap-2 text-xs text-[#94a3b8]">
                    <span>{getSentimentEmoji(message.sentiment)}</span>
                    <span>Seems understanding</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
