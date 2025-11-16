import { motion } from 'motion/react';
import { Plane } from 'lucide-react';
import { Card } from '../../ui/card';

const messages = [
  {
    id: 1,
    sender: 'system',
    text: "Hey Member 2, just checking if you're all set for \"Technica Meeting\" happening at 17:00. Let me know!",
    time: '2:30pm',
  },
  {
    id: 2,
    sender: 'member',
    text: "Yeah 6pm is perfect!",
    time: '2:45pm',
  },
];

export function MemberChatsMobile() {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-[#0f172a] border-b border-[#1e293b] px-4 py-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#429ebd] to-[#9fe7f5] rounded-xl flex items-center justify-center">
            <Plane className="w-5 h-5 text-white transform rotate-45" />
          </div>
          <div>
            <h1 className="text-lg text-[#e2e8f0]">Technica Team</h1>
            <p className="text-xs text-[#64748b]">20 members</p>
          </div>
        </div>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, x: message.sender === 'system' ? -30 : 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              duration: 0.2, 
              delay: index * 0.1,
              ease: [0.215, 0.61, 0.355, 1]
            }}
            className={`flex ${message.sender === 'system' ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl p-3 ${
                message.sender === 'system'
                  ? 'bg-[#9fe7f5]/20 border border-[#9fe7f5]/30'
                  : 'bg-[#429ebd]/20 border border-[#429ebd]/30'
              }`}
            >
              <p className="text-sm text-[#e2e8f0] mb-1">{message.text}</p>
              <p className="text-xs text-[#64748b]">{message.time}</p>
              {message.sender === 'system' && index === 0 && (
                <div className="mt-2 pt-2 border-t border-[#9fe7f5]/20">
                  <p className="text-xs text-[#9fe7f5]">🤖 AI Generated in your tone</p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-[#1e293b]">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 bg-[#1e293b] border border-[#334155] rounded-full px-4 py-2 text-sm text-[#e2e8f0] placeholder:text-[#64748b] focus:outline-none focus:border-[#429ebd]"
          />
          <button className="w-10 h-10 bg-gradient-to-r from-[#429ebd] to-[#9fe7f5] rounded-full flex items-center justify-center text-white">
            ✈️
          </button>
        </div>
      </div>
    </div>
  );
}
