import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Clock, Users, CheckCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

interface LiveAttendanceProps {
  onBack: () => void;
}

interface CheckIn {
  name: string;
  time: string;
  id: number;
}

const eventInfo = {
  name: 'Debate Club Meeting',
  day: 'Tuesday',
  date: 'Nov 12, 2024',
  time: '6pm',
  location: 'Room 302',
  expected: 18,
  total: 20,
};

const initialCheckIns: CheckIn[] = [
  { id: 1, name: 'Sarah', time: '6:02pm' },
  { id: 2, name: 'Miguel', time: '6:04pm' },
  { id: 3, name: 'Emma', time: '6:05pm' },
  { id: 4, name: 'Alex', time: '6:06pm' },
  { id: 5, name: 'Jordan', time: '6:07pm' },
  { id: 6, name: 'Casey', time: '6:08pm' },
  { id: 7, name: 'Riley', time: '6:09pm' },
  { id: 8, name: 'Morgan', time: '6:10pm' },
  { id: 9, name: 'Taylor', time: '6:11pm' },
  { id: 10, name: 'Jamie', time: '6:12pm' },
  { id: 11, name: 'Dakota', time: '6:13pm' },
  { id: 12, name: 'Quinn', time: '6:14pm' },
  { id: 13, name: 'Avery', time: '6:15pm' },
  { id: 14, name: 'Skyler', time: '6:16pm' },
  { id: 15, name: 'Cameron', time: '6:17pm' },
];

export function LiveAttendance({ onBack }: LiveAttendanceProps) {
  const [checkIns, setCheckIns] = useState<CheckIn[]>(initialCheckIns);
  const [arriving, setArriving] = useState(2);
  const [noShows, setNoShows] = useState(0);

  const checkedInCount = checkIns.length;
  const percentage = Math.round((checkedInCount / eventInfo.total) * 100);

  return (
    <div className="p-8">
      <Button
        onClick={onBack}
        variant="ghost"
        className="mb-6 text-[#429ebd] hover:bg-[#429ebd]/10"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Button>

      {/* Event Info Header */}
      <Card className="bg-[#1e293b] border-[#334155] p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-white text-3xl mb-2">{eventInfo.name}</h1>
            <div className="flex items-center gap-4 text-[#94a3b8]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{eventInfo.day}, {eventInfo.date} • {eventInfo.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{eventInfo.location}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#10b981] rounded-full animate-pulse" />
            <span className="text-[#10b981]">Live</span>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Main Counter */}
        <Card className="lg:col-span-2 bg-[#429ebd]/10 border-[#429ebd]/30 p-8">
          <div className="text-center">
            <p className="text-[#9fe7f5] mb-4">Checked In</p>
            <div className="text-8xl text-white mb-4">
              {checkedInCount}/{eventInfo.total}
            </div>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Badge variant="secondary" className="bg-[#10b981]/20 text-[#10b981]">
                <CheckCircle className="w-3 h-3 mr-1" />
                On track
              </Badge>
              <span className="text-[#94a3b8]">
                Expected: {eventInfo.expected}/{eventInfo.total} ({Math.round((eventInfo.expected / eventInfo.total) * 100)}%)
              </span>
            </div>
            <Progress value={percentage} className="h-3" />
          </div>
        </Card>

        {/* Breakdown */}
        <Card className="bg-[#1e293b] border-[#334155] p-6">
          <h3 className="text-white mb-4">Breakdown</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[#94a3b8]">Time</span>
              <span className="text-white">6:17pm</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#94a3b8]">Checked in</span>
              <span className="text-[#10b981]">{checkedInCount} members</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#94a3b8]">Arriving</span>
              <span className="text-[#eab308]">{arriving} members</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#94a3b8]">No-shows</span>
              <span className="text-[#ef4444]">{noShows} members</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Live Feed */}
      <Card className="bg-[#1e293b] border-[#334155] p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white">Live Check-in Feed</h3>
          <Users className="w-5 h-5 text-[#429ebd]" />
        </div>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {[...checkIns].reverse().map((checkIn) => (
            <div
              key={checkIn.id}
              className="flex items-center gap-3 p-3 bg-[#0f172a] rounded-lg animate-in fade-in slide-in-from-right-2"
            >
              <div className="w-8 h-8 bg-[#429ebd] rounded-full flex items-center justify-center text-white text-sm">
                {checkIn.name[0]}
              </div>
              <div className="flex-1">
                <span className="text-white">{checkIn.name}</span>
                <span className="text-[#94a3b8] ml-2">checked in at {checkIn.time}</span>
              </div>
              <CheckCircle className="w-5 h-5 text-[#10b981]" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
