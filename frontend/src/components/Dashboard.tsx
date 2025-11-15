import { RefreshCw, ChevronDown } from 'lucide-react';
import { UserRole } from '../App';
import { ClubCard } from './ClubCard';
import { AttendancePrediction } from './AttendancePrediction';
import { AtRiskMembers } from './AtRiskMembers';
import { Button } from './ui/button';

interface DashboardProps {
  userRole: UserRole;
  onViewClubDetails: (clubId: number) => void;
}

const mockClubs = [
  {
    id: 1,
    name: 'Basketball Club',
    logo: '🏀',
    nextEvent: 'Friday Practice',
    nextEventTime: '7pm',
    conflictCount: 1,
    hasConflict: true,
    conflictType: 'Exam 9am Saturday',
  },
  {
    id: 2,
    name: 'Photography Society',
    logo: '📸',
    nextEvent: 'Photo Walk',
    nextEventTime: '2pm Sunday',
    conflictCount: 0,
    hasConflict: false,
  },
  {
    id: 3,
    name: 'Coding Bootcamp',
    logo: '💻',
    nextEvent: 'Hackathon Prep',
    nextEventTime: '6pm Wednesday',
    conflictCount: 0,
    hasConflict: false,
  },
];

const mockTeamData = {
  predicted: 12,
  total: 20,
  percentage: 60,
  status: 'moderate' as const,
};

const mockAtRiskMembers = [
  {
    id: 1,
    name: 'John',
    prediction: 25,
    reason: 'Usually skips Fridays',
  },
  {
    id: 2,
    name: 'Sarah',
    prediction: 40,
    reason: 'Has class conflict',
  },
  {
    id: 3,
    name: 'Mike',
    prediction: 35,
    reason: 'Away on business trip',
  },
];

export function Dashboard({ userRole, onViewClubDetails }: DashboardProps) {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-white">
          {userRole === 'captain' ? 'Team Overview' : 'Your Clubs'}
        </h1>
        {userRole === 'captain' ? (
          <button className="flex items-center gap-2 text-[#429ebd] text-sm">
            Basketball Club
            <ChevronDown className="w-4 h-4" />
          </button>
        ) : (
          <button className="text-[#429ebd]">
            <RefreshCw className="w-5 h-5" />
          </button>
        )}
      </div>

      {userRole === 'captain' ? (
        <div className="space-y-4">
          <AttendancePrediction data={mockTeamData} />
          <AtRiskMembers members={mockAtRiskMembers} />
        </div>
      ) : (
        <div className="space-y-4">
          {mockClubs.map((club) => (
            <ClubCard
              key={club.id}
              club={club}
              onViewDetails={() => onViewClubDetails(club.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
