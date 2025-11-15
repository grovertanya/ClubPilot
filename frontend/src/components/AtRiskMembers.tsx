import { Card } from './ui/card';
import { AlertCircle } from 'lucide-react';

interface AtRiskMember {
  id: number;
  name: string;
  prediction: number;
  reason: string;
}

interface AtRiskMembersProps {
  members: AtRiskMember[];
}

export function AtRiskMembers({ members }: AtRiskMembersProps) {
  return (
    <Card className="bg-[#1e293b] border-[#334155] p-4">
      <h3 className="text-white mb-4">At-Risk Members</h3>
      <div className="space-y-3">
        {members.map((member) => (
          <button
            key={member.id}
            className="w-full bg-red-500/10 border border-red-500/20 rounded-md p-3 text-left hover:bg-red-500/20 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2 flex-1">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-white mb-1">{member.name}</div>
                  <div className="text-sm text-[#94a3b8]">{member.reason}</div>
                </div>
              </div>
              <div className="text-red-400 text-sm whitespace-nowrap">
                {member.prediction}% likely
              </div>
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
}
