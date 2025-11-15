import { useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';

interface ConflictResolutionProps {
  clubId: number;
  onBack: () => void;
}

const conflictSolutions = [
  {
    id: 1,
    icon: '💭',
    title: 'Attend first 30 min then leave?',
    description: 'Show up for the key drills and head out early to study',
  },
  {
    id: 2,
    icon: '🎥',
    title: 'Join online if available?',
    description: 'Participate remotely via video call or stream',
  },
  {
    id: 3,
    icon: '📹',
    title: 'Catch the recording after?',
    description: 'Watch the session recording when you have time',
  },
  {
    id: 4,
    icon: '⏸️',
    title: 'Skip this once?',
    description: 'Miss this session due to exam conflict',
    warning: true,
  },
];

export function ConflictResolution({ clubId, onBack }: ConflictResolutionProps) {
  const [selectedSolution, setSelectedSolution] = useState<number | null>(null);
  const [addToMessage, setAddToMessage] = useState(false);

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <div className="sticky top-0 bg-[#1e293b] border-b border-[#334155] p-4 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-[#429ebd]">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-white">Conflict Solutions</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <Card className="bg-[#1e293b] border-[#334155] p-4">
          <h3 className="text-white mb-2">Suggested Solutions</h3>
          <p className="text-sm text-[#94a3b8] mb-4">
            Select a solution to help resolve your scheduling conflict
          </p>
        </Card>

        {conflictSolutions.map((solution) => (
          <button
            key={solution.id}
            onClick={() => setSelectedSolution(solution.id)}
            className={`w-full text-left transition-all ${
              selectedSolution === solution.id ? 'ring-2 ring-[#9fe7f5]' : ''
            }`}
          >
            <Card className={`${
              solution.warning
                ? 'bg-red-500/10 border-red-500/20'
                : 'bg-[#1e293b] border-[#334155]'
            } p-4`}>
              <div className="flex items-start gap-3">
                <div className="text-2xl">{solution.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-white">{solution.title}</h4>
                    {solution.warning && (
                      <Badge variant="destructive" className="text-xs">
                        Warning
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-[#94a3b8]">{solution.description}</p>
                </div>
                {selectedSolution === solution.id && (
                  <Check className="w-5 h-5 text-[#9fe7f5] flex-shrink-0" />
                )}
              </div>
            </Card>
          </button>
        ))}

        {selectedSolution && (
          <Card className="bg-[#1e293b] border-[#334155] p-4">
            <div className="flex items-center gap-3">
              <Checkbox
                id="add-to-message"
                checked={addToMessage}
                onCheckedChange={(checked) => setAddToMessage(checked === true)}
                className="border-[#429ebd]"
              />
              <label
                htmlFor="add-to-message"
                className="text-sm text-[#94a3b8] cursor-pointer"
              >
                Mention this in message to captain
              </label>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
