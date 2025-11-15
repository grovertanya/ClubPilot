import { UserRole } from '../App';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface CalendarProps {
  userRole: UserRole;
}

const memberCalendar = [
  { day: 'Mon', date: 11, status: 'free', label: 'No events' },
  { day: 'Tue', date: 12, status: 'free', label: 'Free evening' },
  { day: 'Wed', date: 13, status: 'conflict', label: 'Class 2-4pm' },
  { day: 'Thu', date: 14, status: 'free', label: 'Free evening' },
  { day: 'Fri', date: 15, status: 'hard-conflict', label: 'Practice + Exam' },
  { day: 'Sat', date: 16, status: 'hard-conflict', label: 'Exam 9am' },
  { day: 'Sun', date: 17, status: 'free', label: 'Free all day' },
];

const captainTeamAvailability = [
  { member: 'John', mon: 'free', tue: 'free', wed: 'conflict', thu: 'free', fri: 'conflict', sat: 'free', sun: 'free' },
  { member: 'Sarah', mon: 'free', tue: 'free', wed: 'conflict', thu: 'free', fri: 'free', sat: 'free', sun: 'free' },
  { member: 'Mike', mon: 'conflict', tue: 'free', wed: 'free', thu: 'free', fri: 'conflict', sat: 'conflict', sun: 'conflict' },
  { member: 'Emma', mon: 'free', tue: 'free', wed: 'free', thu: 'free', fri: 'free', sat: 'free', sun: 'free' },
  { member: 'Alex', mon: 'free', tue: 'conflict', wed: 'conflict', thu: 'free', fri: 'free', sat: 'free', sun: 'free' },
];

export function Calendar({ userRole }: CalendarProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'free':
        return 'bg-green-500';
      case 'conflict':
        return 'bg-yellow-500';
      case 'hard-conflict':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (userRole === 'captain') {
    return (
      <div className="p-4">
        <h1 className="text-white mb-6">Team Availability</h1>

        <Card className="bg-[#1e293b] border-[#334155] p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white">Week of Nov 11-17</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#334155]">
                  <th className="text-left text-[#94a3b8] p-2">Member</th>
                  <th className="text-center text-[#94a3b8] p-2">Mon</th>
                  <th className="text-center text-[#94a3b8] p-2">Tue</th>
                  <th className="text-center text-[#94a3b8] p-2">Wed</th>
                  <th className="text-center text-[#94a3b8] p-2">Thu</th>
                  <th className="text-center text-[#94a3b8] p-2">Fri</th>
                  <th className="text-center text-[#94a3b8] p-2">Sat</th>
                  <th className="text-center text-[#94a3b8] p-2">Sun</th>
                </tr>
              </thead>
              <tbody>
                {captainTeamAvailability.map((row) => (
                  <tr key={row.member} className="border-b border-[#334155]/50">
                    <td className="text-white p-2">{row.member}</td>
                    {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map((day) => (
                      <td key={day} className="p-2">
                        <div className={`w-6 h-6 rounded-full mx-auto ${getStatusColor(row[day as keyof typeof row] as string)}`} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="bg-[#429ebd]/20 border-[#429ebd]/30 p-4 mb-4">
          <div className="text-[#9fe7f5]">
            <p className="mb-2">💡 Insight</p>
            <p className="text-sm">3 members have conflicts 7pm-9pm Friday</p>
            <p className="text-sm mt-2">Reschedule to Tuesday: 18/20 free</p>
          </div>
        </Card>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500" />
            <span className="text-[#94a3b8]">Free</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500" />
            <span className="text-[#94a3b8]">Soft conflict</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500" />
            <span className="text-[#94a3b8]">Hard conflict</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-white mb-6">Your Availability This Week</h1>

      <Card className="bg-[#1e293b] border-[#334155] p-4 mb-4">
        <h3 className="text-white mb-4">Week of Nov 11-17</h3>
        <div className="grid grid-cols-7 gap-2">
          {memberCalendar.map((day) => (
            <button
              key={day.date}
              className="flex flex-col items-center p-2 rounded-lg hover:bg-[#0f172a] transition-colors"
            >
              <span className="text-xs text-[#94a3b8] mb-1">{day.day}</span>
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center mb-1 ${getStatusColor(
                  day.status
                )}`}
              >
                <span className="text-white text-sm">{day.date}</span>
              </div>
            </button>
          ))}
        </div>
      </Card>

      <Card className="bg-[#1e293b] border-[#334155] p-4 mb-4">
        <h3 className="text-white mb-3">Day Details</h3>
        <div className="space-y-3">
          {memberCalendar.map((day) => (
            <div key={day.date} className="flex items-center justify-between">
              <div>
                <span className="text-white">{day.day}, Nov {day.date}</span>
                <p className="text-sm text-[#94a3b8]">{day.label}</p>
              </div>
              <Badge
                variant="secondary"
                className={
                  day.status === 'free'
                    ? 'bg-green-500/20 text-green-400'
                    : day.status === 'conflict'
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-red-500/20 text-red-400'
                }
              >
                {day.status === 'free' ? 'Free' : 'Conflict'}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      <Card className="bg-[#429ebd]/20 border-[#429ebd]/30 p-4">
        <h3 className="text-[#9fe7f5] mb-3">Weekly Insight</h3>
        <div className="space-y-2 text-sm text-[#9fe7f5]">
          <p>✅ You're free: Tue/Thu/Sun evenings</p>
          <p>⚠️ Busy: Wed (class), Fri (exam)</p>
          <p className="mt-3 pt-3 border-t border-[#429ebd]/30">
            💡 Best days to attend: Tuesday or Thursday
          </p>
        </div>
      </Card>
    </div>
  );
}
