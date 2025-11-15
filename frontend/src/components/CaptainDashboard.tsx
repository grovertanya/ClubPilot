import { Calendar, Plus, Users, TrendingUp } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface CaptainDashboardProps {
  onCreateEvent: () => void;
  onViewLiveAttendance: () => void;
}

const upcomingEvents = [
  {
    id: 1,
    name: 'Debate Club Meeting',
    day: 'Tuesday',
    time: '6pm',
    location: 'Room 302',
    prediction: 90,
    status: 'good',
  },
  {
    id: 2,
    name: 'Public Speaking Workshop',
    day: 'Friday',
    time: '5pm',
    location: 'Room 205',
    prediction: 40,
    status: 'poor',
  },
  {
    id: 3,
    name: 'Tournament Prep',
    day: 'Saturday',
    time: '10am',
    location: 'Main Hall',
    prediction: 75,
    status: 'moderate',
  },
];

const liveAttendance = {
  eventName: 'Debate Club Meeting',
  checkedIn: 15,
  total: 20,
  recentCheckIns: [
    { name: 'Sarah', time: '6:02pm' },
    { name: 'Miguel', time: '6:04pm' },
    { name: 'Emma', time: '6:05pm' },
  ],
};

export function CaptainDashboard({ onCreateEvent, onViewLiveAttendance }: CaptainDashboardProps) {
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white text-3xl mb-2">Dashboard</h1>
          <p className="text-[#94a3b8]">{dateStr}</p>
        </div>
        <Button
          onClick={onCreateEvent}
          className="bg-[#429ebd] hover:bg-[#3a8ba8] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-[#1e293b] border-[#334155] p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#429ebd]/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-[#429ebd]" />
            </div>
            <div>
              <p className="text-[#94a3b8] text-sm mb-1">Events This Week</p>
              <p className="text-white text-2xl">3</p>
            </div>
          </div>
        </Card>

        <Card className="bg-[#1e293b] border-[#334155] p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#10b981]/20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-[#10b981]" />
            </div>
            <div>
              <p className="text-[#94a3b8] text-sm mb-1">Avg Attendance</p>
              <p className="text-white text-2xl">18/20</p>
            </div>
          </div>
        </Card>

        <Card className="bg-[#1e293b] border-[#334155] p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#9fe7f5]/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-[#9fe7f5]" />
            </div>
            <div>
              <p className="text-[#94a3b8] text-sm mb-1">Prediction Accuracy</p>
              <p className="text-white text-2xl">89%</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <Card className="bg-[#1e293b] border-[#334155] p-6">
          <h2 className="text-white text-xl mb-4">Upcoming Events</h2>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="bg-[#0f172a] border border-[#334155] rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-white mb-1">{event.name}</h3>
                    <p className="text-sm text-[#94a3b8]">
                      {event.day} {event.time} • {event.location}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={
                      event.status === 'good'
                        ? 'bg-[#10b981]/20 text-[#10b981]'
                        : event.status === 'moderate'
                        ? 'bg-[#eab308]/20 text-[#eab308]'
                        : 'bg-[#ef4444]/20 text-[#ef4444]'
                    }
                  >
                    {event.prediction}% predicted
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-[#429ebd] text-[#429ebd] hover:bg-[#429ebd]/10"
                >
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* Live Attendance */}
        <Card className="bg-[#1e293b] border-[#334155] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-xl">Live Attendance</h2>
            <div className="w-3 h-3 bg-[#10b981] rounded-full animate-pulse" />
          </div>

          <div className="bg-[#429ebd]/10 border border-[#429ebd]/30 rounded-lg p-6 mb-4">
            <p className="text-[#9fe7f5] text-sm mb-2">{liveAttendance.eventName}</p>
            <div className="text-white text-5xl mb-2">
              {liveAttendance.checkedIn}/{liveAttendance.total}
            </div>
            <p className="text-[#94a3b8] text-sm">Checked in</p>
          </div>

          <div className="space-y-2 mb-4">
            <p className="text-[#94a3b8] text-sm mb-2">Recent check-ins:</p>
            {liveAttendance.recentCheckIns.map((checkIn, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm text-[#94a3b8]"
              >
                <div className="w-2 h-2 bg-[#10b981] rounded-full" />
                <span className="text-white">{checkIn.name}</span>
                <span>checked in at {checkIn.time}</span>
              </div>
            ))}
          </div>

          <Button
            onClick={onViewLiveAttendance}
            variant="outline"
            className="w-full border-[#429ebd] text-[#429ebd] hover:bg-[#429ebd]/10"
          >
            View Full Dashboard
          </Button>
        </Card>
      </div>

      {/* Low Attendance Alert */}
      <Card className="bg-[#eab308]/10 border-[#eab308]/30 p-6 mt-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-[#eab308]/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-[#eab308] text-xl">🟡</span>
          </div>
          <div className="flex-1">
            <h3 className="text-white mb-2">Low Attendance Alert</h3>
            <p className="text-[#94a3b8] mb-4">
              Only 8/20 (40%) predicted for Friday meeting. Smart reschedule available.
            </p>
            <Button className="bg-[#429ebd] hover:bg-[#3a8ba8] text-white">
              Smart Reschedule?
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
