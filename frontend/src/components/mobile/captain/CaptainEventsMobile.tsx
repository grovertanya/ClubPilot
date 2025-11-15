import { motion } from 'motion/react';
import { Plane, Plus, Filter, Calendar } from 'lucide-react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';

const events = [
  {
    id: 1,
    name: 'Debate Club Meeting',
    date: 'Tuesday, 6:00 PM',
    location: 'Room 302',
    prediction: 90,
    attending: 18,
    total: 20,
    avatars: ['S', 'M', 'E', 'A'],
  },
  {
    id: 2,
    name: 'Public Speaking Workshop',
    date: 'Friday, 5:00 PM',
    location: 'Room 205',
    prediction: 40,
    attending: 8,
    total: 20,
    avatars: ['J', 'T', 'R'],
  },
  {
    id: 3,
    name: 'Tournament Prep',
    date: 'Saturday, 10:00 AM',
    location: 'Main Hall',
    prediction: 75,
    attending: 15,
    total: 20,
    avatars: ['S', 'M', 'E', 'J', 'T'],
  },
];

export function CaptainEventsMobile() {
  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-10 bg-[#0f172a] border-b border-[#1e293b] px-4 py-4"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#429ebd] to-[#9fe7f5] rounded-xl flex items-center justify-center">
              <Plane className="w-5 h-5 text-white transform rotate-45" />
            </div>
            <h1 className="text-xl text-[#e2e8f0]">Upcoming Events</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="border-[#334155] text-[#94a3b8] bg-[#1e293b]"
          >
            <Filter className="w-4 h-4 mr-2" />
            This Week
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-[#334155] text-[#94a3b8] bg-[#1e293b]"
          >
            Time
          </Button>
        </div>
      </motion.div>

      <div className="p-4 space-y-4">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              duration: 0.3, 
              delay: index * 0.08,
              ease: [0.215, 0.61, 0.355, 1]
            }}
          >
            <Card className="bg-[#1e293b] border-[#334155] p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-[#e2e8f0] mb-1">{event.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-[#94a3b8]">
                    <Calendar className="w-3 h-3" />
                    <span>{event.date}</span>
                  </div>
                  <p className="text-xs text-[#64748b] mt-1">{event.location}</p>
                </div>
                <Badge
                  variant="secondary"
                  className={
                    event.prediction >= 70
                      ? 'bg-[#10b981]/20 text-[#10b981]'
                      : event.prediction >= 50
                      ? 'bg-[#eab308]/20 text-[#eab308]'
                      : 'bg-[#ef4444]/20 text-[#ef4444]'
                  }
                >
                  {event.prediction}%
                </Badge>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <div className="flex -space-x-2">
                  {event.avatars.map((avatar, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full bg-[#429ebd] border-2 border-[#1e293b] flex items-center justify-center text-white text-xs"
                    >
                      {avatar}
                    </div>
                  ))}
                </div>
                <span className="text-xs text-[#94a3b8]">
                  +{event.total - event.avatars.length} more
                </span>
              </div>

              <Button
                size="sm"
                className="w-full bg-[#429ebd] hover:bg-[#3a8ba8] text-white"
              >
                View Details
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-r from-[#429ebd] to-[#9fe7f5] rounded-full shadow-lg shadow-[#429ebd]/40 flex items-center justify-center text-white z-20"
      >
        <Plus className="w-6 h-6" />
      </motion.button>
    </div>
  );
}
