import { motion } from 'motion/react';
import { Plane, Plus, TrendingUp, Calendar, Users } from 'lucide-react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  show: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.3, ease: [0.215, 0.61, 0.355, 1] }
  },
};

const upcomingEvents = [
  {
    id: 1,
    name: 'Basketball Practice',
    day: 'Friday',
    time: '7:00 PM',
    location: 'ARM 302',
    prediction: 90,
    attending: 18,
    total: 20,
  },
];

export function CaptainDashboardMobile() {
  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.215, 0.61, 0.355, 1] }}
        className="sticky top-0 z-10 bg-[#0f172a] border-b border-[#1e293b] px-4 py-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#429ebd] to-[#9fe7f5] rounded-xl flex items-center justify-center">
              <Plane className="w-5 h-5 text-white transform rotate-45" />
            </div>
            <h1 className="text-xl text-[#e2e8f0]">Dashboard</h1>
          </div>
          <button className="w-10 h-10 bg-[#429ebd] rounded-full flex items-center justify-center text-white">
            CP
          </button>
        </div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="p-4 space-y-4"
      >
        {/* Upcoming Events Section */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg text-[#e2e8f0]">Upcoming Events</h2>
            <Button
              size="sm"
              className="bg-gradient-to-r from-[#429ebd] to-[#9fe7f5] text-white"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {upcomingEvents.map((event, index) => (
          <motion.div
            key={event.id}
            variants={itemVariants}
            custom={index}
          >
            <Card className="bg-[#1e293b] border-[#334155] p-4">
              <div className="mb-3">
                <h3 className="text-[#e2e8f0] mb-1">{event.name}</h3>
                <div className="flex items-center gap-2 text-sm text-[#94a3b8]">
                  <Calendar className="w-3 h-3" />
                  <span>{event.day}, {event.time}</span>
                  <span>•</span>
                  <span>{event.location}</span>
                </div>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#94a3b8]">Predicted attendance</span>
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
                    {event.prediction}% ({event.attending}/{event.total})
                  </Badge>
                </div>
                <div className="h-2 bg-[#0f172a] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${event.prediction}%` }}
                    transition={{ duration: 1, delay: 0.3 + index * 0.1, ease: [0.215, 0.61, 0.355, 1] }}
                    className="h-full bg-gradient-to-r from-[#429ebd] to-[#9fe7f5]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="text-[#429ebd] text-sm">💡 Smart Insights</button>
                <Button
                  size="sm"
                  className="ml-auto bg-[#429ebd] hover:bg-[#3a8ba8] text-white"
                >
                  View Details
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}

        {/* Low Attendance Alert */}
        <motion.div variants={itemVariants}>
          <Card className="bg-[#ef4444]/10 border-l-4 border-l-[#ef4444] p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div className="flex-1">
                <h3 className="text-[#e2e8f0] mb-1">Low Attendance Alert</h3>
                <p className="text-sm text-[#94a3b8] mb-3">
                  Only 8/20 predicted for Friday
                </p>
                <Button
                  size="sm"
                  className="w-full bg-gradient-to-r from-[#429ebd] to-[#9fe7f5] text-white"
                >
                  Smart Reschedule
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Live Attendance Card */}
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-[#429ebd]/20 to-[#9fe7f5]/10 border-[#429ebd]/30 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[#e2e8f0]">Live Attendance</h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse" />
                <span className="text-[#10b981] text-sm">Live</span>
              </div>
            </div>
            <div className="text-center mb-3">
              <div className="text-5xl text-white mb-1">15/20</div>
              <p className="text-sm text-[#94a3b8]">Checked in now</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-[#94a3b8]">
                <div className="w-2 h-2 bg-[#10b981] rounded-full" />
                <span className="text-[#e2e8f0]">Sarah</span>
                <span>checked in at 6:02pm</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#94a3b8]">
                <div className="w-2 h-2 bg-[#10b981] rounded-full" />
                <span className="text-[#e2e8f0]">Miguel</span>
                <span>checked in at 6:04pm</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
