import { Card } from './ui/card';
import { Button } from './ui/button';
import { AlertCircle } from 'lucide-react';

interface ClubCardProps {
  club: {
    id: number;
    name: string;
    logo: string;
    nextEvent: string;
    nextEventTime: string;
    conflictCount: number;
    hasConflict: boolean;
    conflictType?: string;
  };
  onViewDetails: () => void;
}

export function ClubCard({ club, onViewDetails }: ClubCardProps) {
  return (
    <Card className="bg-[#1e293b] border-[#334155] p-4">
      <div className="flex items-start gap-4 mb-4">
        <div className="text-4xl">{club.logo}</div>
        <div className="flex-1">
          <h3 className="text-white mb-1">{club.name}</h3>
          <p className="text-sm text-[#94a3b8]">
            {club.nextEvent} • {club.nextEventTime}
          </p>
        </div>
      </div>

      {club.hasConflict && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-md p-3 mb-4">
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{club.conflictType}</span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-sm text-[#94a3b8]">
          {club.conflictCount > 0
            ? `${club.conflictCount} conflict${club.conflictCount > 1 ? 's' : ''} this week`
            : 'No conflicts'}
        </span>
        <Button
          onClick={onViewDetails}
          className="bg-[#429ebd] hover:bg-[#3a8ba8] text-white"
        >
          View Details
        </Button>
      </div>
    </Card>
  );
}
