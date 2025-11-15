import { motion } from 'motion/react';
import { Plane, Search } from 'lucide-react';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';

const chats = [
  {
    id: 1,
    memberName: 'Sarah',
    avatar: 'S',
    lastMessage: 'Yeah I can make 6pm instead',
    timestamp: '2 min ago',
    unread: true,
  },
  {
    id: 2,
    memberName: 'Miguel',
    avatar: 'M',
    lastMessage: 'Thanks for the update!',
    timestamp: '1 hour ago',
    unread: false,
  },
  {
    id: 3,
    memberName: 'Emma',
    avatar: 'E',
    lastMessage: 'I might be a few minutes late',
    timestamp: '3 hours ago',
    unread: false,
  },
];

export function CaptainChatsMobile() {
  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-10 bg-[#0f172a] border-b border-[#1e293b] px-4 py-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#429ebd] to-[#9fe7f5] rounded-xl flex items-center justify-center">
              <Plane className="w-5 h-5 text-white transform rotate-45" />
            </div>
            <h1 className="text-xl text-[#e2e8f0]">Messages</h1>
          </div>
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-[#94a3b8]">
            <Search className="w-5 h-5" />
          </button>
        </div>
      </motion.div>

      <div className="p-4 space-y-3">
        {chats.map((chat, index) => (
          <motion.div
            key={chat.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              duration: 0.3, 
              delay: index * 0.08,
              ease: [0.215, 0.61, 0.355, 1]
            }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="bg-[#1e293b] border-[#334155] p-4 hover:bg-[#243245] transition-colors cursor-pointer">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#429ebd] to-[#9fe7f5] flex items-center justify-center text-white">
                  {chat.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-[#e2e8f0]">{chat.memberName}</h3>
                    <span className="text-xs text-[#64748b]">{chat.timestamp}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-[#94a3b8] truncate flex-1">
                      {chat.lastMessage}
                    </p>
                    {chat.unread && (
                      <div className="w-2 h-2 bg-[#429ebd] rounded-full" />
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
