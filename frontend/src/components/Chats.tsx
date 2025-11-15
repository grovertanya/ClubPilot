import { UserRole } from '../App';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Check, Clock, MessageSquare } from 'lucide-react';

interface ChatsProps {
  userRole: UserRole;
  onOpenChatThread: (chatId: number) => void;
}

const mockChats = [
  {
    id: 1,
    clubName: 'Basketball Club',
    clubLogo: '🏀',
    lastMessage: "I got an exam the next morning, can we move practice?",
    timestamp: '2 hours ago',
    status: 'replied',
    sentiment: 'positive',
    isAI: true,
  },
  {
    id: 2,
    clubName: 'Photography Society',
    clubLogo: '📸',
    lastMessage: "Thanks for moving it! I can definitely make Tuesday.",
    timestamp: '1 day ago',
    status: 'approved',
    sentiment: 'positive',
    isAI: true,
  },
  {
    id: 3,
    clubName: 'Coding Bootcamp',
    clubLogo: '💻',
    lastMessage: "Looking forward to the hackathon!",
    timestamp: '3 days ago',
    status: 'approved',
    sentiment: 'positive',
    isAI: false,
  },
];

const mockCaptainChats = [
  {
    id: 1,
    memberName: 'John',
    lastMessage: "Hey John, Fridays are tough but we need you this week. Thoughts?",
    timestamp: '1 hour ago',
    status: 'pending',
    confirmed: false,
  },
  {
    id: 2,
    memberName: 'Sarah',
    lastMessage: "I understand the class conflict. Let's find another time.",
    timestamp: '2 hours ago',
    status: 'sent',
    confirmed: true,
  },
  {
    id: 3,
    memberName: 'Mike',
    lastMessage: "Thanks for letting me know about your trip!",
    timestamp: '1 day ago',
    status: 'sent',
    confirmed: false,
  },
];

export function Chats({ userRole, onOpenChatThread }: ChatsProps) {
  const chats = userRole === 'captain' ? mockCaptainChats : mockChats;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge variant="secondary" className="bg-green-500/20 text-green-400">
            <Check className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case 'replied':
        return (
          <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
            <MessageSquare className="w-3 h-3 mr-1" />
            Captain replied
          </Badge>
        );
      default:
        return null;
    }
  };

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
    <div className="p-4">
      <h1 className="text-white mb-6">Messages</h1>
      <div className="space-y-3">
        {userRole === 'member' ? (
          mockChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onOpenChatThread(chat.id)}
              className="w-full text-left"
            >
              <Card className="bg-[#1e293b] border-[#334155] p-4 hover:bg-[#293548] transition-colors">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{chat.clubLogo}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="text-white truncate">{chat.clubName}</h3>
                      <span className="text-xs text-[#64748b] whitespace-nowrap">
                        {chat.timestamp}
                      </span>
                    </div>
                    <p className="text-sm text-[#94a3b8] truncate mb-2">
                      {chat.isAI && '🤖 '}{chat.lastMessage}
                    </p>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(chat.status)}
                      {chat.sentiment && (
                        <span className="text-sm">{getSentimentEmoji(chat.sentiment)}</span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </button>
          ))
        ) : (
          mockCaptainChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onOpenChatThread(chat.id)}
              className="w-full text-left"
            >
              <Card className="bg-[#1e293b] border-[#334155] p-4 hover:bg-[#293548] transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#429ebd] flex items-center justify-center text-white">
                    {chat.memberName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="text-white truncate">{chat.memberName}</h3>
                      <span className="text-xs text-[#64748b] whitespace-nowrap">
                        {chat.timestamp}
                      </span>
                    </div>
                    <p className="text-sm text-[#94a3b8] truncate mb-2">
                      {chat.lastMessage}
                    </p>
                    <div className="flex items-center gap-2">
                      {chat.confirmed ? (
                        <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                          <Check className="w-3 h-3 mr-1" />
                          Confirmed
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-red-500/20 text-red-400">
                          Declined
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
