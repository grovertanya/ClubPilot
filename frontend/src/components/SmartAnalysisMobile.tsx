import { useState, useEffect } from 'react';
import { Check, X, Loader, AlertTriangle, ChevronDown } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './Progress';
import { EventData } from './mobile/MobileApp';
import * as api from '../services/api';

interface SmartAnalysisMobileProps {
  event: EventData;
  invitedMembers: string[];
  captainId: string;
  onShowMessages: () => void;
  onConfirmReschedule: (newTime: string) => void;
  onCancel: () => void;
}

interface AnalysisState {
  loading: boolean;
  progress: number;
  visibleMembers: number;
  showRecommendations: boolean;
  selectedRecommendationIndex: number | null;
  error: string | null;
  isBackendDown: boolean;
}

export function SmartAnalysisMobile({
  event,
  invitedMembers,
  captainId,
  onShowMessages,
  onConfirmReschedule,
  onCancel,
}: SmartAnalysisMobileProps) {
  const [state, setState] = useState<AnalysisState>({
    loading: true,
    progress: 0,
    visibleMembers: 0,
    showRecommendations: false,
    selectedRecommendationIndex: null,
    error: null,
    isBackendDown: false,
  });

  const [schedulingData, setSchedulingData] =
    useState<api.EventSchedulingResponse | null>(null);
  const [members, setMembers] = useState<api.Member[]>([]);

  // Fetch members and run analysis on mount
  useEffect(() => {
    const runAnalysis = async () => {
      try {
        // Get members list
        const membersList = await api.getMembers();
        setMembers(membersList);

        // Create event with scheduling
        const proposedTime = `${event.date}T${event.time}:00`;

        const response = await api.createEventWithScheduling(
          event.name,
          'social',
          captainId,
          proposedTime,
          invitedMembers,
          60,
          event.description
        );

        setSchedulingData(response);

        // Check if backend was down
        const isDown = api.isBackendDown(response);
        setState((prev) => ({ ...prev, isBackendDown: isDown }));

        // Simulate analysis progress
        const progressInterval = setInterval(() => {
          setState((prev) => {
            const newProgress = prev.progress + 10;
            if (newProgress >= 100) {
              clearInterval(progressInterval);
              return {
                ...prev,
                progress: 100,
                loading: false,
              };
            }
            return { ...prev, progress: newProgress };
          });
        }, 150);

        // Show members one by one
        const memberInterval = setInterval(() => {
          setState((prev) => {
            const memberCount = response.member_availabilities?.length || 0;
            if (prev.visibleMembers >= memberCount) {
              clearInterval(memberInterval);
              setTimeout(() => {
                setState((p) => ({ ...p, showRecommendations: true }));
              }, 500);
              return prev;
            }
            return { ...prev, visibleMembers: prev.visibleMembers + 1 };
          });
        }, 250);

        return () => {
          clearInterval(progressInterval);
          clearInterval(memberInterval);
        };
      } catch (error) {
        console.error('Analysis error:', error);
        setState((prev) => ({
          ...prev,
          error: 'Failed to analyze scheduling',
          loading: false,
        }));
      }
    };

    runAnalysis();
  }, [event, invitedMembers, captainId]);

  if (!schedulingData) {
    return (
      <div className="p-4 text-center text-[#94a3b8]">
        <Loader className="w-8 h-8 animate-spin mx-auto mb-2" />
        <p>Loading analysis...</p>
      </div>
    );
  }

  const attendancePercentage =
    schedulingData.scheduling_analysis.attendance_percentage;
  const predictedAttendance =
    schedulingData.scheduling_analysis.predicted_attendance;
  const totalInvited = schedulingData.scheduling_analysis.total_invited;

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-lg font-semibold">Schedule Analysis</h2>
        <button
          onClick={onCancel}
          className="text-[#94a3b8] hover:text-white"
        >
          ✕
        </button>
      </div>

      {/* Backend Down Warning */}
      {state.isBackendDown && (
        <Card className="bg-yellow-500/10 border border-yellow-500/30 p-3">
          <p className="text-yellow-400 text-xs">
            📌 Demo mode: Showing mock data
          </p>
        </Card>
      )}

      {/* Error State */}
      {state.error && (
        <Card className="bg-red-500/10 border border-red-500/30 p-3">
          <p className="text-red-400 text-sm">{state.error}</p>
        </Card>
      )}

      {/* Analysis Progress */}
      {state.loading && (
        <Card className="bg-[#1e293b] border-[#334155] p-4">
          <div className="flex items-center gap-3 mb-3">
            <Loader className="w-5 h-5 text-[#429ebd] animate-spin" />
            <p className="text-[#94a3b8] text-sm">
              Analyzing {totalInvited} members...
            </p>
          </div>
          <Progress value={state.progress} className="h-2" />
        </Card>
      )}

      {/* Member Availability List */}
      <div className="space-y-2">
        <p className="text-[#94a3b8] text-xs font-semibold px-1">
          MEMBER AVAILABILITY
        </p>
        {schedulingData.member_availabilities
          ?.slice(0, state.visibleMembers)
          .map((member, index) => {
            const memberInfo = members.find((m) => m.id === member.member_id);
            return (
              <div
                key={member.member_id}
                className={`flex items-start gap-3 p-3 rounded-lg border animate-in fade-in slide-in-from-left-2 ${
                  member.status === 'available'
                    ? 'bg-[#10b981]/5 border-[#10b981]/20'
                    : member.status === 'maybe'
                      ? 'bg-[#eab308]/5 border-[#eab308]/20'
                      : 'bg-[#ef4444]/5 border-[#ef4444]/20'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {member.status === 'available' ? (
                  <Check className="w-5 h-5 text-[#10b981] flex-shrink-0 mt-0.5" />
                ) : member.status === 'maybe' ? (
                  <AlertTriangle className="w-5 h-5 text-[#eab308] flex-shrink-0 mt-0.5" />
                ) : (
                  <X className="w-5 h-5 text-[#ef4444] flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm">
                      {memberInfo?.emoji} {member.member_name}
                    </span>
                  </div>
                  <div className="text-xs text-[#94a3b8] mt-1">
                    {(member.confidence * 100).toFixed(0)}% confidence
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {!state.loading && (
        <>
          {/* Attendance Prediction Card */}
          <Card className="bg-[#0f172a] border-[#334155] p-4">
            <div className="text-center">
              <p className="text-[#94a3b8] text-xs mb-2">
                PREDICTED ATTENDANCE
              </p>
              <div className="text-4xl text-white font-bold mb-1">
                {attendancePercentage.toFixed(0)}%
              </div>
              <p className="text-[#94a3b8] text-xs">
                {predictedAttendance}/{totalInvited} members
              </p>
            </div>
          </Card>

          {/* Recommendations */}
          {state.showRecommendations &&
            schedulingData.recommendations.length > 0 && (
              <div className="space-y-2">
                <p className="text-[#94a3b8] text-xs font-semibold px-1">
                  BETTER TIMES AVAILABLE
                </p>

                {schedulingData.recommendations.map((rec, index) => {
                  const isSelected = state.selectedRecommendationIndex === index;
                  const newDate = new Date(rec.recommended_time);
                  const newAttendancePercent = Math.round(
                    (rec.recommended_predicted_attendance / totalInvited) * 100
                  );

                  return (
                    <button
                      key={index}
                      onClick={() =>
                        setState((prev) => ({
                          ...prev,
                          selectedRecommendationIndex: isSelected ? null : index,
                        }))
                      }
                      className="w-full text-left"
                    >
                      <Card
                        className={`border-2 transition-all ${
                          isSelected
                            ? 'bg-[#429ebd]/10 border-[#429ebd]/50'
                            : 'bg-[#1e293b] border-[#334155]'
                        } p-3`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1">
                            <p className="text-white text-sm font-medium">
                              {newDate.toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                              })}{' '}
                              at{' '}
                              {newDate.toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                            <p className="text-[#94a3b8] text-xs mt-1">
                              {rec.reason}
                            </p>
                          </div>
                          <ChevronDown
                            className={`w-4 h-4 text-[#94a3b8] transition-transform ${
                              isSelected ? 'rotate-180' : ''
                            }`}
                          />
                        </div>

                        {isSelected && (
                          <div className="mt-3 pt-3 border-t border-[#334155] space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="bg-[#ef4444]/10 border border-[#ef4444]/20 rounded p-2">
                                <p className="text-[#94a3b8] text-xs mb-1">
                                  Current
                                </p>
                                <p className="text-[#ef4444] text-lg font-bold">
                                  {attendancePercentage.toFixed(0)}%
                                </p>
                                <p className="text-[#94a3b8] text-xs">
                                  {predictedAttendance}/{totalInvited}
                                </p>
                              </div>
                              <div className="bg-[#10b981]/10 border border-[#10b981]/20 rounded p-2">
                                <p className="text-[#94a3b8] text-xs mb-1">
                                  Recommended
                                </p>
                                <p className="text-[#10b981] text-lg font-bold">
                                  {newAttendancePercent}%
                                </p>
                                <p className="text-[#94a3b8] text-xs">
                                  {rec.recommended_predicted_attendance}/
                                  {totalInvited}
                                </p>
                              </div>
                            </div>

                            <div className="bg-[#10b981]/5 border border-[#10b981]/20 rounded p-2">
                              <p className="text-[#10b981] text-xs font-semibold">
                                +{rec.attendance_improvement} more members
                              </p>
                            </div>

                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                onConfirmReschedule(rec.recommended_time);
                              }}
                              className="w-full bg-[#429ebd] hover:bg-[#3a8ba8] text-white text-xs py-2"
                            >
                              Reschedule to this time
                            </Button>
                          </div>
                        )}
                      </Card>
                    </button>
                  );
                })}
              </div>
            )}

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <Button
              onClick={onShowMessages}
              className="w-full bg-[#429ebd] hover:bg-[#3a8ba8] text-white text-sm py-2"
            >
              Continue to Messages
            </Button>
            <Button
              onClick={onCancel}
              variant="outline"
              className="w-full border-[#334155] text-[#94a3b8] hover:bg-[#334155] text-sm py-2"
            >
              Cancel
            </Button>
          </div>
        </>
      )}
    </div>
  );
}