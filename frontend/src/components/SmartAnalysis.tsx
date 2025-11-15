import { useState, useEffect } from 'react';
import { Check, X, Clock, AlertTriangle } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { EventData } from '../App';

interface SmartAnalysisProps {
  event: EventData | null;
  onAcceptRecommendation: () => void;
  onViewMessages: () => void;
}

interface MemberAnalysis {
  name: string;
  status: 'free' | 'conflict';
  conflictType?: string;
  conflictTime?: string;
  likelihood?: number;
}

const memberData: MemberAnalysis[] = [
  { name: 'Miguel', status: 'free' },
  { name: 'Tom', status: 'free' },
  { name: 'Sarah', status: 'conflict', conflictType: 'CLASS', conflictTime: '4-5pm', likelihood: 40 },
  { name: 'Emma', status: 'conflict', conflictType: 'WORK', conflictTime: '6-9pm', likelihood: 25 },
  { name: 'Alex', status: 'free' },
  { name: 'Jordan', status: 'free' },
  { name: 'Casey', status: 'conflict', conflictType: 'CLASS', conflictTime: '5-6pm', likelihood: 35 },
  { name: 'Riley', status: 'free' },
];

export function SmartAnalysis({ event, onAcceptRecommendation, onViewMessages }: SmartAnalysisProps) {
  const [analyzing, setAnalyzing] = useState(true);
  const [progress, setProgress] = useState(0);
  const [visibleMembers, setVisibleMembers] = useState(0);
  const [showRecommendation, setShowRecommendation] = useState(false);

  useEffect(() => {
    // Simulate analysis progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setAnalyzing(false);
          setTimeout(() => setShowRecommendation(true), 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Show members one by one
    const memberInterval = setInterval(() => {
      setVisibleMembers((prev) => {
        if (prev >= memberData.length) {
          clearInterval(memberInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 300);

    return () => {
      clearInterval(progressInterval);
      clearInterval(memberInterval);
    };
  }, []);

  if (!event) return null;

  const freeCount = memberData.filter(m => m.status === 'free').length;
  const totalCount = memberData.length;
  const predictedPercentage = Math.round((freeCount / totalCount) * 100);

  return (
    <div className="p-8">
      <Card className="bg-[#1e293b] border-[#334155] max-w-4xl mx-auto">
        <div className="p-6 border-b border-[#334155]">
          <h2 className="text-white text-2xl mb-2">Smart Schedule Analysis</h2>
          <p className="text-[#94a3b8]">
            {event.name} • {event.date} at {event.time}
          </p>
        </div>

        <div className="p-6">
          {analyzing && (
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="w-5 h-5 text-[#429ebd] animate-spin" />
                <p className="text-[#94a3b8]">Analyzing {totalCount} members...</p>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          <div className="space-y-3 mb-6">
            {memberData.slice(0, visibleMembers).map((member, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 p-3 rounded-lg border ${
                  member.status === 'free'
                    ? 'bg-[#10b981]/5 border-[#10b981]/20'
                    : 'bg-[#ef4444]/5 border-[#ef4444]/20'
                } animate-in fade-in slide-in-from-left-2`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {member.status === 'free' ? (
                  <Check className="w-5 h-5 text-[#10b981] flex-shrink-0 mt-0.5" />
                ) : (
                  <X className="w-5 h-5 text-[#ef4444] flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white">{member.name}</span>
                    {member.status === 'free' ? (
                      <span className="text-sm text-[#10b981]">Free at {event.time}</span>
                    ) : (
                      <Badge variant="destructive" className="text-xs">
                        {member.conflictType} {member.conflictTime}
                      </Badge>
                    )}
                  </div>
                  {member.status === 'conflict' && (
                    <p className="text-sm text-[#94a3b8] ml-6 mt-1">
                      └ {member.likelihood}% likely to attend
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {!analyzing && (
            <>
              <Card className="bg-[#0f172a] border-[#334155] p-6 mb-6">
                <div className="text-center">
                  <p className="text-[#94a3b8] mb-2">Predicted Attendance</p>
                  <div className="text-5xl text-white mb-2">
                    {predictedPercentage}%
                  </div>
                  <p className="text-[#94a3b8]">
                    ({freeCount}/{totalCount} members)
                  </p>
                </div>
              </Card>

              {showRecommendation && (
                <Card className="bg-[#eab308]/10 border-[#eab308]/30 p-6 animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex items-start gap-4 mb-4">
                    <AlertTriangle className="w-6 h-6 text-[#eab308] flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-white mb-2">🟡 Low attendance predicted</h3>
                      <p className="text-[#94a3b8] mb-1">
                        Sarah has class until 5pm—try 6pm instead?
                      </p>
                      <p className="text-sm text-[#94a3b8]">
                        2 members confirmed they can attend at 6pm
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-lg p-4">
                      <p className="text-sm text-[#94a3b8] mb-1">At {event.time}</p>
                      <p className="text-2xl text-[#ef4444]">{predictedPercentage}%</p>
                      <p className="text-sm text-[#94a3b8]">({freeCount}/{totalCount}) 🔴</p>
                    </div>
                    <div className="bg-[#10b981]/10 border border-[#10b981]/20 rounded-lg p-4">
                      <p className="text-sm text-[#94a3b8] mb-1">At 6pm</p>
                      <p className="text-2xl text-[#10b981]">90%</p>
                      <p className="text-sm text-[#94a3b8]">(18/20) 🟢</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={onAcceptRecommendation}
                      className="flex-1 bg-[#429ebd] hover:bg-[#3a8ba8] text-white"
                    >
                      Reschedule to 6pm
                    </Button>
                    <Button
                      onClick={onViewMessages}
                      variant="outline"
                      className="flex-1 border-[#334155] text-[#94a3b8] hover:bg-[#334155]"
                    >
                      Keep {event.time}
                    </Button>
                  </div>
                </Card>
              )}
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
