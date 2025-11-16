import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import {
  Loader2,
  Check,
  XCircle,
  Clock,
  Users,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { getMembers, EventSchedulingResponse } from "../services/api";

interface SmartSchedulingViewProps {
  eventName: string;
  eventType: string;
  proposedTime: string;
  invitedMembers: string[];
  captainId: string;
  schedulingResponse: EventSchedulingResponse;
  onReschedule: (newTime: string) => void;
  onShowMessages: () => void;
  onCancel: () => void;
}

// Simple Pie Chart Component
function PieChart({ percentage }: { percentage: number }) {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-24 h-24">
      <svg className="transform -rotate-90 w-24 h-24">
        {/* Background circle */}
        <circle
          cx="48"
          cy="48"
          r="45"
          fill="none"
          stroke="#1e293b"
          strokeWidth="8"
        />
        {/* Progress circle */}
        <circle
          cx="48"
          cy="48"
          r="45"
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0ea5e9" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-white">{percentage}%</span>
      </div>
    </div>
  );
}

// Member Prediction Card with Slide Animation
function MemberPredictionCard({ member, index }: { member: any; index: number }) {
  const [showPercentage, setShowPercentage] = useState(false);
  const predictedChance = member.available ? 95 : 15; // Mock percentage for visual

  useEffect(() => {
    const timer = setTimeout(() => setShowPercentage(true), 300 + index * 220);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.22,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      className={`
        relative overflow-hidden rounded-xl border backdrop-blur-sm
        ${member.available 
          ? 'bg-gradient-to-br from-[#10b981]/10 via-[#059669]/5 to-transparent border-[#10b981]/30' 
          : 'bg-gradient-to-br from-[#f97373]/10 via-[#ef4444]/5 to-transparent border-[#f97373]/30'
        }
      `}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3 flex-1">
          <motion.span 
            className="text-2xl"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: index * 0.22 + 0.1, type: "spring" }}
          >
            {member.emoji}
          </motion.span>
          <div className="flex-1">
            <p className="text-sm text-white font-medium">
              {member.name}
            </p>
            <p className="text-[11px] text-[#94a3b8] font-light">{member.reason}</p>
          </div>
        </div>
        
        {/* Animated percentage meter */}
        <div className="flex items-center gap-3">
          <AnimatePresence>
            {showPercentage && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-2"
              >
                <div className="relative w-16 h-2 bg-[#1e293b] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${predictedChance}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className={`h-full rounded-full ${
                      member.available 
                        ? 'bg-gradient-to-r from-[#10b981] to-[#22c55e]'
                        : 'bg-gradient-to-r from-[#f97373] to-[#ef4444]'
                    }`}
                  />
                </div>
                <span className={`text-xs font-semibold min-w-[3ch] ${
                  member.available ? 'text-[#10b981]' : 'text-[#f97373]'
                }`}>
                  {predictedChance}%
                </span>
              </motion.div>
            )}
          </AnimatePresence>
          
          {member.available ? (
            <Check className="w-5 h-5 text-[#10b981]" />
          ) : (
            <XCircle className="w-5 h-5 text-[#f97373]" />
          )}
        </div>
      </div>
      
      {/* Subtle shimmer effect */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{ 
          duration: 1.5, 
          delay: index * 0.22 + 0.5,
          ease: "easeInOut"
        }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
      />
    </motion.div>
  );
}

export function SmartSchedulingView({
  eventName,
  eventType,
  proposedTime,
  invitedMembers,
  captainId,
  schedulingResponse,
  onReschedule,
  onShowMessages,
  onCancel,
}: SmartSchedulingViewProps) {
  const [overallAttendance, setOverallAttendance] = useState<number | null>(
    null
  );
  const [memberPredictions, setMemberPredictions] = useState<
    {
      id: string;
      name: string;
      emoji: string;
      available: boolean;
      reason?: string;
    }[]
  >([]);
  const [conflicts, setConflicts] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // hydrate from existing schedulingResponse, but animate members line-by-line
  useEffect(() => {
    async function hydrate() {
      const members = await getMembers();
      const analysis = schedulingResponse.scheduling_analysis;

      setOverallAttendance(Math.round(analysis.attendance_percentage));
      setConflicts(schedulingResponse.conflicts || []);
      setRecommendations(schedulingResponse.recommendations || []);

      const filled: any[] = [];
      for (const id of schedulingResponse.event.invited_members) {
        const m = members.find((mm) => mm.id === id);
        const conflict = (schedulingResponse.conflicts || []).find(
          (c: any) => c.member_id === id
        );

        filled.push({
          id,
          name: m?.name || "Member",
          emoji: m?.emoji || "👤",
          available: !conflict,
          reason: conflict ? "Has a conflict" : "Good to go",
        });

        setMemberPredictions([...filled]);
        await new Promise((res) => setTimeout(res, 220));
      }
    }

    hydrate();
  }, [schedulingResponse]);

  const bestRecommendation = recommendations[0];

  const handleApplyBest = () => {
    if (!bestRecommendation) return;
    onReschedule(bestRecommendation.recommended_time);
    setStep(2);
  };

  const handleShowMessagesClick = () => {
    setStep(3);
    onShowMessages();
  };

  return (
    <div className="h-full bg-[#020617] flex flex-col">
      {/* HEADER */}
      <div className="p-4 border-b border-[#1e293b] bg-gradient-to-r from-[#020617] via-[#020617] to-[#0f172a]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#64748b] font-medium">
              Smart Scheduling
            </p>
            <h2 className="text-white text-lg font-semibold mt-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#38bdf8]" />
              {eventName}
            </h2>
            <p className="text-xs text-[#64748b] mt-1 font-light">
              {new Date(proposedTime).toLocaleString()} · {eventType}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-[#64748b] mb-1 font-medium">
              Step {step} of 3
            </p>
            <div className="flex gap-1 justify-end">
              {[1, 2, 3].map((s) => (
                <span
                  key={s}
                  className={`h-1.5 w-5 rounded-full transition-all ${
                    s <= step ? "bg-[#38bdf8]" : "bg-[#1f2937]"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Attendance summary with pie chart */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Card className="bg-gradient-to-br from-[#0f172a] to-[#020617] border border-[#1e293b] p-5 rounded-2xl relative overflow-hidden">
            <div className="absolute -right-10 -top-10 h-32 w-32 bg-[#38bdf8]/5 rounded-full blur-3xl" />
            <div className="relative flex items-center justify-between gap-4">
              <div className="flex-1">
                <p className="text-[10px] text-[#9ca3af] uppercase tracking-[0.15em] font-medium mb-2">
                  Predicted attendance
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-white">
                    {overallAttendance === null ? (
                      <Loader2 className="w-8 h-8 animate-spin text-[#38bdf8]" />
                    ) : (
                      `${overallAttendance}%`
                    )}
                  </span>
                </div>
                <p className="text-xs text-[#64748b] mt-2 font-light">
                  Based on all invited members
                </p>
                <div className="flex flex-col gap-1.5 mt-3 text-xs text-[#9ca3af]">
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    {schedulingResponse.scheduling_analysis.predicted_attendance}/
                    {schedulingResponse.scheduling_analysis.total_invited} expected
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {schedulingResponse.event.duration_minutes} min duration
                  </span>
                </div>
              </div>
              
              {/* Pie Chart */}
              {overallAttendance !== null && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3, type: "spring" }}
                >
                  <PieChart percentage={overallAttendance} />
                </motion.div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Member availability list with slide-in animations */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.05 }}
        >
          <Card className="bg-[#0f172a] border border-[#1e293b] p-4 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-white">
                Member availability
              </p>
              <span className="text-[11px] text-[#64748b] font-light">
                {memberPredictions.length}/{invitedMembers.length} scanned
              </span>
            </div>

            {memberPredictions.length === 0 && (
              <div className="flex justify-center py-6">
                <Loader2 className="w-5 h-5 text-[#38bdf8] animate-spin" />
              </div>
            )}

            <div className="space-y-2">
              {memberPredictions.map((m, idx) => (
                <MemberPredictionCard key={m.id} member={m} index={idx} />
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Recommendations - EMPHASIZED with COLORS */}
        {recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.08 }}
            className="relative"
          >
            {/* Red/Cyan accent bar on the left */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#38bdf8] via-[#0ea5e9] to-[#7c3aed] rounded-l-2xl" />
            
            <Card className="bg-gradient-to-br from-[#38bdf8]/10 via-[#0ea5e9]/5 to-transparent border-2 border-[#38bdf8]/40 p-4 rounded-2xl space-y-3 shadow-xl shadow-[#38bdf8]/20 ml-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#38bdf8]" />
                  <p className="text-sm font-bold text-white">
                    Suggested better times
                  </p>
                </div>
                <span className="px-2 py-1 bg-[#38bdf8]/20 text-[#38bdf8] text-[10px] uppercase tracking-wide font-bold rounded-full">
                  AI Optimized
                </span>
              </div>
              <div className="space-y-2">
                {recommendations.map((rec: any, idx: number) => {
                  const improvedPercentage = Math.round(
                    (rec.recommended_predicted_attendance /
                      schedulingResponse.scheduling_analysis.total_invited) *
                      100
                  );
                  const dt = new Date(rec.recommended_time);
                  const isBest = idx === 0;
                  
                  // Color coding based on percentage
                  const getColorClasses = () => {
                    if (improvedPercentage >= 80) {
                      return {
                        bg: "bg-gradient-to-br from-[#22c55e]/20 via-[#10b981]/10 to-transparent",
                        border: "border-[#22c55e]",
                        shadow: "shadow-lg shadow-[#22c55e]/20",
                        hoverShadow: "hover:shadow-xl hover:shadow-[#22c55e]/30",
                        text: "text-[#22c55e]"
                      };
                    } else if (improvedPercentage >= 60) {
                      return {
                        bg: "bg-gradient-to-br from-[#eab308]/20 via-[#f59e0b]/10 to-transparent",
                        border: "border-[#eab308]",
                        shadow: "shadow-lg shadow-[#eab308]/20",
                        hoverShadow: "hover:shadow-xl hover:shadow-[#eab308]/30",
                        text: "text-[#eab308]"
                      };
                    } else {
                      return {
                        bg: "bg-gradient-to-br from-[#f97373]/20 via-[#ef4444]/10 to-transparent",
                        border: "border-[#f97373]",
                        shadow: "shadow-lg shadow-[#f97373]/20",
                        hoverShadow: "hover:shadow-xl hover:shadow-[#f97373]/30",
                        text: "text-[#f97373]"
                      };
                    }
                  };
                  
                  const colors = getColorClasses();

                  return (
                    <motion.button
                      key={idx}
                      onClick={() => isBest && handleApplyBest()}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: idx * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className={`w-full rounded-xl border px-4 py-3 transition-all ${
                        isBest
                          ? `${colors.bg} ${colors.border} ${colors.shadow} ${colors.hoverShadow}`
                          : "bg-[#020617]/60 backdrop-blur-sm border-[#1e293b] hover:border-[#38bdf8]/30"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-left">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-[10px] text-[#9ca3af] uppercase tracking-[0.1em] font-medium">
                              Option {idx + 1}
                            </p>
                            {isBest && (
                              <motion.span 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.3, type: "spring" }}
                                className="px-2 py-0.5 bg-gradient-to-r from-[#22c55e] to-[#10b981] text-white text-[9px] uppercase tracking-wider font-bold rounded-full shadow-lg shadow-[#22c55e]/30"
                              >
                                ⭐ Best fit
                              </motion.span>
                            )}
                          </div>
                          <p className="text-base text-white font-bold mb-1">
                            {dt.toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}{" "}
                            <span className={isBest ? colors.text : "text-[#38bdf8]"}>·</span>{" "}
                            {dt.toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                          <div className="flex items-center gap-3 text-[11px]">
                            <span className="text-[#94a3b8] font-light">
                              Predicted:{" "}
                              <span className={`font-bold ${isBest ? colors.text : "text-[#38bdf8]"}`}>
                                {improvedPercentage}%
                              </span>
                            </span>
                            <span className="text-[#22c55e] font-semibold">
                              +{rec.attendance_improvement} more
                            </span>
                          </div>
                        </div>
                        {isBest && (
                          <ArrowRight className="w-5 h-5 text-[#38bdf8]" />
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </Card>
          </motion.div>
        )}
      </div>

      {/* FOOTER ACTIONS */}
      <div className="border-t border-[#1e293b] bg-[#020617] px-4 py-3 flex flex-col gap-2">
        <div className="flex gap-2">
          <button
            disabled={!bestRecommendation}
            onClick={handleApplyBest}
            className="
              flex-1 relative overflow-hidden rounded-2xl
              bg-gradient-to-r from-[#38bdf8] via-[#0ea5e9] to-[#38bdf8]
              bg-[length:200%_100%]
              hover:bg-[position:100%_0]
              transition-all duration-500
              text-white font-semibold tracking-tight
              py-3 px-6
              shadow-lg shadow-[#38bdf8]/30
              hover:shadow-xl hover:shadow-[#38bdf8]/40
              hover:scale-[1.02]
              disabled:opacity-50 disabled:cursor-not-allowed
              group
            "
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {bestRecommendation ? (
                <>
                  <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  <span>Use best suggested time</span>
                </>
              ) : (
                "Analyzing options…"
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </button>
          <Button
            variant="outline"
            onClick={handleShowMessagesClick}
            className="flex-1 border-[#1f2937] text-[#e5e7eb] hover:text-white rounded-2xl font-light hover:bg-[#1e293b]/50 transition-all"
          >
            Continue to messages
          </Button>
        </div>
        <button
          onClick={onCancel}
          className="text-[11px] text-[#6b7280] text-center hover:text-[#9ca3af] mt-1 font-light transition-colors"
        >
          Skip for now and keep original time
        </button>
      </div>
    </div>
  );
}
// import { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "motion/react";
// import { Card } from "./ui/card";
// import { Button } from "./ui/button";
// import {
//   Loader2,
//   Check,
//   XCircle,
//   Clock,
//   Users,
//   Sparkles,
//   ArrowRight,
//   TrendingUp,
// } from "lucide-react";
// import { getMembers, EventSchedulingResponse } from "../services/api";

// interface SmartSchedulingViewProps {
//   eventName: string;
//   eventType: string;
//   proposedTime: string;
//   invitedMembers: string[];
//   captainId: string;
//   schedulingResponse: EventSchedulingResponse;
//   onReschedule: (newTime: string) => void;
//   onShowMessages: () => void;
//   onCancel: () => void;
// }

// // Simple Pie Chart Component
// function PieChart({ percentage }: { percentage: number }) {
//   const circumference = 2 * Math.PI * 45;
//   const strokeDashoffset = circumference - (percentage / 100) * circumference;

//   return (
//     <div className="relative w-24 h-24">
//       <svg className="transform -rotate-90 w-24 h-24">
//         {/* Background circle */}
//         <circle
//           cx="48"
//           cy="48"
//           r="45"
//           fill="none"
//           stroke="#1e293b"
//           strokeWidth="8"
//         />
//         {/* Progress circle */}
//         <circle
//           cx="48"
//           cy="48"
//           r="45"
//           fill="none"
//           stroke="url(#gradient)"
//           strokeWidth="8"
//           strokeDasharray={circumference}
//           strokeDashoffset={strokeDashoffset}
//           strokeLinecap="round"
//           className="transition-all duration-1000 ease-out"
//         />
//         <defs>
//           <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
//             <stop offset="0%" stopColor="#38bdf8" />
//             <stop offset="100%" stopColor="#0ea5e9" />
//           </linearGradient>
//         </defs>
//       </svg>
//       <div className="absolute inset-0 flex items-center justify-center">
//         <span className="text-2xl font-bold text-white">{percentage}%</span>
//       </div>
//     </div>
//   );
// }

// // Member Prediction Card with Slide Animation
// function MemberPredictionCard({ member, index }: { member: any; index: number }) {
//   const [showPercentage, setShowPercentage] = useState(false);
//   const predictedChance = member.available ? 95 : 15; // Mock percentage for visual

//   useEffect(() => {
//     const timer = setTimeout(() => setShowPercentage(true), 300 + index * 220);
//     return () => clearTimeout(timer);
//   }, [index]);

//   return (
//     <motion.div
//       initial={{ x: -100, opacity: 0 }}
//       animate={{ x: 0, opacity: 1 }}
//       transition={{ 
//         duration: 0.4, 
//         delay: index * 0.22,
//         type: "spring",
//         stiffness: 100,
//         damping: 15
//       }}
//       className={`
//         relative overflow-hidden rounded-xl border backdrop-blur-sm
//         ${member.available 
//           ? 'bg-gradient-to-br from-[#10b981]/10 via-[#059669]/5 to-transparent border-[#10b981]/30' 
//           : 'bg-gradient-to-br from-[#f97373]/10 via-[#ef4444]/5 to-transparent border-[#f97373]/30'
//         }
//       `}
//     >
//       <div className="flex items-center justify-between px-4 py-3">
//         <div className="flex items-center gap-3 flex-1">
//           <motion.span 
//             className="text-2xl"
//             initial={{ scale: 0, rotate: -180 }}
//             animate={{ scale: 1, rotate: 0 }}
//             transition={{ delay: index * 0.22 + 0.1, type: "spring" }}
//           >
//             {member.emoji}
//           </motion.span>
//           <div className="flex-1">
//             <p className="text-sm text-white font-medium">
//               {member.name}
//             </p>
//             <p className="text-[11px] text-[#94a3b8] font-light">{member.reason}</p>
//           </div>
//         </div>
        
//         {/* Animated percentage meter */}
//         <div className="flex items-center gap-3">
//           <AnimatePresence>
//             {showPercentage && (
//               <motion.div
//                 initial={{ width: 0, opacity: 0 }}
//                 animate={{ width: "auto", opacity: 1 }}
//                 transition={{ duration: 0.5 }}
//                 className="flex items-center gap-2"
//               >
//                 <div className="relative w-16 h-2 bg-[#1e293b] rounded-full overflow-hidden">
//                   <motion.div
//                     initial={{ width: 0 }}
//                     animate={{ width: `${predictedChance}%` }}
//                     transition={{ duration: 0.8, delay: 0.2 }}
//                     className={`h-full rounded-full ${
//                       member.available 
//                         ? 'bg-gradient-to-r from-[#10b981] to-[#22c55e]'
//                         : 'bg-gradient-to-r from-[#f97373] to-[#ef4444]'
//                     }`}
//                   />
//                 </div>
//                 <span className={`text-xs font-semibold min-w-[3ch] ${
//                   member.available ? 'text-[#10b981]' : 'text-[#f97373]'
//                 }`}>
//                   {predictedChance}%
//                 </span>
//               </motion.div>
//             )}
//           </AnimatePresence>
          
//           {member.available ? (
//             <Check className="w-5 h-5 text-[#10b981]" />
//           ) : (
//             <XCircle className="w-5 h-5 text-[#f97373]" />
//           )}
//         </div>
//       </div>
      
//       {/* Subtle shimmer effect */}
//       <motion.div
//         initial={{ x: '-100%' }}
//         animate={{ x: '100%' }}
//         transition={{ 
//           duration: 1.5, 
//           delay: index * 0.22 + 0.5,
//           ease: "easeInOut"
//         }}
//         className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
//       />
//     </motion.div>
//   );
// }

// export function SmartSchedulingView({
//   eventName,
//   eventType,
//   proposedTime,
//   invitedMembers,
//   captainId,
//   schedulingResponse,
//   onReschedule,
//   onShowMessages,
//   onCancel,
// }: SmartSchedulingViewProps) {
//   const [overallAttendance, setOverallAttendance] = useState<number | null>(
//     null
//   );
//   const [memberPredictions, setMemberPredictions] = useState<
//     {
//       id: string;
//       name: string;
//       emoji: string;
//       available: boolean;
//       reason?: string;
//     }[]
//   >([]);
//   const [conflicts, setConflicts] = useState<any[]>([]);
//   const [recommendations, setRecommendations] = useState<any[]>([]);
//   const [step, setStep] = useState<1 | 2 | 3>(1);

//   // hydrate from existing schedulingResponse, but animate members line-by-line
//   useEffect(() => {
//     async function hydrate() {
//       const members = await getMembers();
//       const analysis = schedulingResponse.scheduling_analysis;

//       setOverallAttendance(Math.round(analysis.attendance_percentage));
//       setConflicts(schedulingResponse.conflicts || []);
//       setRecommendations(schedulingResponse.recommendations || []);

//       const filled: any[] = [];
//       for (const id of schedulingResponse.event.invited_members) {
//         const m = members.find((mm) => mm.id === id);
//         const conflict = (schedulingResponse.conflicts || []).find(
//           (c: any) => c.member_id === id
//         );

//         filled.push({
//           id,
//           name: m?.name || "Member",
//           emoji: m?.emoji || "👤",
//           available: !conflict,
//           reason: conflict ? "Has a conflict" : "Good to go",
//         });

//         setMemberPredictions([...filled]);
//         await new Promise((res) => setTimeout(res, 220));
//       }
//     }

//     hydrate();
//   }, [schedulingResponse]);

//   const bestRecommendation = recommendations[0];

//   const handleApplyBest = () => {
//     if (!bestRecommendation) return;
//     onReschedule(bestRecommendation.recommended_time);
//     setStep(2);
//   };

//   const handleShowMessagesClick = () => {
//     setStep(3);
//     onShowMessages();
//   };

//   return (
//     <div className="h-full bg-[#020617] flex flex-col">
//       {/* HEADER */}
//       <div className="p-4 border-b border-[#1e293b] bg-gradient-to-r from-[#020617] via-[#020617] to-[#0f172a]">
//         <div className="flex items-center justify-between">
//           <div>
//             <p className="text-[10px] uppercase tracking-[0.25em] text-[#64748b] font-medium">
//               Smart Scheduling
//             </p>
//             <h2 className="text-white text-lg font-semibold mt-1 flex items-center gap-2">
//               <Sparkles className="w-4 h-4 text-[#38bdf8]" />
//               {eventName}
//             </h2>
//             <p className="text-xs text-[#64748b] mt-1 font-light">
//               {new Date(proposedTime).toLocaleString()} · {eventType}
//             </p>
//           </div>
//           <div className="text-right">
//             <p className="text-[10px] text-[#64748b] mb-1 font-medium">
//               Step {step} of 3
//             </p>
//             <div className="flex gap-1 justify-end">
//               {[1, 2, 3].map((s) => (
//                 <span
//                   key={s}
//                   className={`h-1.5 w-5 rounded-full transition-all ${
//                     s <= step ? "bg-[#38bdf8]" : "bg-[#1f2937]"
//                   }`}
//                 />
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* MAIN */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-4">
//         {/* Attendance summary with pie chart */}
//         <motion.div
//           initial={{ opacity: 0, y: 12 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.25 }}
//         >
//           <Card className="bg-gradient-to-br from-[#0f172a] to-[#020617] border border-[#1e293b] p-5 rounded-2xl relative overflow-hidden">
//             <div className="absolute -right-10 -top-10 h-32 w-32 bg-[#38bdf8]/5 rounded-full blur-3xl" />
//             <div className="relative flex items-center justify-between gap-4">
//               <div className="flex-1">
//                 <p className="text-[10px] text-[#9ca3af] uppercase tracking-[0.15em] font-medium mb-2">
//                   Predicted attendance
//                 </p>
//                 <div className="flex items-baseline gap-2">
//                   <span className="text-3xl font-bold text-white">
//                     {overallAttendance === null ? (
//                       <Loader2 className="w-8 h-8 animate-spin text-[#38bdf8]" />
//                     ) : (
//                       `${overallAttendance}%`
//                     )}
//                   </span>
//                 </div>
//                 <p className="text-xs text-[#64748b] mt-2 font-light">
//                   Based on all invited members
//                 </p>
//                 <div className="flex flex-col gap-1.5 mt-3 text-xs text-[#9ca3af]">
//                   <span className="inline-flex items-center gap-1.5">
//                     <Users className="w-3.5 h-3.5" />
//                     {schedulingResponse.scheduling_analysis.predicted_attendance}/
//                     {schedulingResponse.scheduling_analysis.total_invited} expected
//                   </span>
//                   <span className="inline-flex items-center gap-1.5">
//                     <Clock className="w-3.5 h-3.5" />
//                     {schedulingResponse.event.duration_minutes} min duration
//                   </span>
//                 </div>
//               </div>
              
//               {/* Pie Chart */}
//               {overallAttendance !== null && (
//                 <motion.div
//                   initial={{ scale: 0, opacity: 0 }}
//                   animate={{ scale: 1, opacity: 1 }}
//                   transition={{ duration: 0.5, delay: 0.3, type: "spring" }}
//                 >
//                   <PieChart percentage={overallAttendance} />
//                 </motion.div>
//               )}
//             </div>
//           </Card>
//         </motion.div>

//         {/* Member availability list with slide-in animations */}
//         <motion.div
//           initial={{ opacity: 0, y: 12 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.25, delay: 0.05 }}
//         >
//           <Card className="bg-[#0f172a] border border-[#1e293b] p-4 rounded-2xl space-y-3">
//             <div className="flex items-center justify-between">
//               <p className="text-sm font-semibold text-white">
//                 Member availability
//               </p>
//               <span className="text-[11px] text-[#64748b] font-light">
//                 {memberPredictions.length}/{invitedMembers.length} scanned
//               </span>
//             </div>

//             {memberPredictions.length === 0 && (
//               <div className="flex justify-center py-6">
//                 <Loader2 className="w-5 h-5 text-[#38bdf8] animate-spin" />
//               </div>
//             )}

//             <div className="space-y-2">
//               {memberPredictions.map((m, idx) => (
//                 <MemberPredictionCard key={m.id} member={m} index={idx} />
//               ))}
//             </div>
//           </Card>
//         </motion.div>

//         {/* Recommendations - EMPHASIZED with COLORS */}
//         {recommendations.length > 0 && (
//           <motion.div
//             initial={{ opacity: 0, y: 12 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.25, delay: 0.08 }}
//           >
//             <Card className="bg-gradient-to-br from-[#38bdf8]/10 via-[#0ea5e9]/5 to-transparent border-2 border-[#38bdf8]/40 p-4 rounded-2xl space-y-3 shadow-xl shadow-[#38bdf8]/20">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <TrendingUp className="w-4 h-4 text-[#38bdf8]" />
//                   <p className="text-sm font-bold text-white">
//                     Suggested better times
//                   </p>
//                 </div>
//                 <span className="px-2 py-1 bg-[#38bdf8]/20 text-[#38bdf8] text-[10px] uppercase tracking-wide font-bold rounded-full">
//                   AI Optimized
//                 </span>
//               </div>

//               <div className="space-y-2">
//                 {recommendations.map((rec: any, idx: number) => {
//                   const improvedPercentage = Math.round(
//                     (rec.recommended_predicted_attendance /
//                       schedulingResponse.scheduling_analysis.total_invited) *
//                       100
//                   );
//                   const dt = new Date(rec.recommended_time);
//                   const isBest = idx === 0;

//                   return (
//                     <motion.button
//                       key={idx}
//                       onClick={() => isBest && handleApplyBest()}
//                       initial={{ opacity: 0, scale: 0.95 }}
//                       animate={{ opacity: 1, scale: 1 }}
//                       transition={{ duration: 0.3, delay: idx * 0.1 }}
//                       whileHover={{ scale: 1.02 }}
//                       className={`w-full rounded-xl border px-4 py-3 transition-all ${
//                         isBest
//                           ? "bg-gradient-to-br from-[#38bdf8]/20 via-[#0ea5e9]/10 to-[#7c3aed]/5 border-[#38bdf8] shadow-lg shadow-[#38bdf8]/20"
//                           : "bg-[#020617]/60 backdrop-blur-sm border-[#1e293b] hover:border-[#38bdf8]/30"
//                       }`}
//                     >
//                       <div className="flex items-center justify-between">
//                         <div className="text-left">
//                           <div className="flex items-center gap-2 mb-1">
//                             <p className="text-[10px] text-[#9ca3af] uppercase tracking-[0.1em] font-medium">
//                               Option {idx + 1}
//                             </p>
//                             {isBest && (
//                               <motion.span 
//                                 initial={{ scale: 0 }}
//                                 animate={{ scale: 1 }}
//                                 transition={{ delay: 0.3, type: "spring" }}
//                                 className="px-2 py-0.5 bg-gradient-to-r from-[#22c55e] to-[#10b981] text-white text-[9px] uppercase tracking-wider font-bold rounded-full shadow-lg shadow-[#22c55e]/30"
//                               >
//                                 ⭐ Best fit
//                               </motion.span>
//                             )}
//                           </div>
//                           <p className="text-base text-white font-bold mb-1">
//                             {dt.toLocaleDateString("en-US", {
//                               weekday: "short",
//                               month: "short",
//                               day: "numeric",
//                             })}{" "}
//                             <span className="text-[#38bdf8]">·</span>{" "}
//                             {dt.toLocaleTimeString("en-US", {
//                               hour: "2-digit",
//                               minute: "2-digit",
//                             })}
//                           </p>
//                           <div className="flex items-center gap-3 text-[11px]">
//                             <span className="text-[#94a3b8] font-light">
//                               Predicted:{" "}
//                               <span className="text-[#38bdf8] font-bold">
//                                 {improvedPercentage}%
//                               </span>
//                             </span>
//                             <span className="text-[#22c55e] font-semibold">
//                               +{rec.attendance_improvement} more
//                             </span>
//                           </div>
//                         </div>
//                         {isBest && (
//                           <ArrowRight className="w-5 h-5 text-[#38bdf8]" />
//                         )}
//                       </div>
//                     </motion.button>
//                   );
//                 })}
//               </div>
//             </Card>
//           </motion.div>
//         )}
//       </div>

//       {/* FOOTER ACTIONS */}
//       <div className="border-t border-[#1e293b] bg-[#020617] px-4 py-3 flex flex-col gap-2">
//         <div className="flex gap-2">
//           <button
//             disabled={!bestRecommendation}
//             onClick={handleApplyBest}
//             className="
//               flex-1 relative overflow-hidden rounded-2xl
//               bg-gradient-to-r from-[#38bdf8] via-[#0ea5e9] to-[#38bdf8]
//               bg-[length:200%_100%]
//               hover:bg-[position:100%_0]
//               transition-all duration-500
//               text-white font-semibold tracking-tight
//               py-3 px-6
//               shadow-lg shadow-[#38bdf8]/30
//               hover:shadow-xl hover:shadow-[#38bdf8]/40
//               hover:scale-[1.02]
//               disabled:opacity-50 disabled:cursor-not-allowed
//               group
//             "
//           >
//             <span className="relative z-10 flex items-center justify-center gap-2">
//               {bestRecommendation ? (
//                 <>
//                   <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
//                   <span>Use best suggested time</span>
//                 </>
//               ) : (
//                 "Analyzing options…"
//               )}
//             </span>
//             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
//           </button>
//           <Button
//             variant="outline"
//             onClick={handleShowMessagesClick}
//             className="flex-1 border-[#1f2937] text-[#e5e7eb] hover:text-white rounded-2xl font-light hover:bg-[#1e293b]/50 transition-all"
//           >
//             Continue to messages
//           </Button>
//         </div>
//         <button
//           onClick={onCancel}
//           className="text-[11px] text-[#6b7280] text-center hover:text-[#9ca3af] mt-1 font-light transition-colors"
//         >
//           Skip for now and keep original time
//         </button>
//       </div>
//     </div>
//   );
// }