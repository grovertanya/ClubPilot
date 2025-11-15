import { motion } from 'motion/react';
import { Plane, TrendingUp, Award } from 'lucide-react';
import { Card } from '../../ui/card';

export function MemberAnalyticsMobile() {
  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-10 bg-[#0f172a] border-b border-[#1e293b] px-4 py-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#429ebd] to-[#9fe7f5] rounded-xl flex items-center justify-center">
            <Plane className="w-5 h-5 text-white transform rotate-45" />
          </div>
          <h1 className="text-xl text-[#e2e8f0]">Your Stats</h1>
        </div>
      </motion.div>

      <div className="p-4 space-y-4">
        {/* Main Stats */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-[#429ebd]/20 to-[#9fe7f5]/10 border-[#429ebd]/30 p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Award className="w-6 h-6 text-[#eab308]" />
              <span className="text-2xl">🏆</span>
            </div>
            <div className="text-5xl text-white mb-2">87%</div>
            <p className="text-[#94a3b8] mb-1">Attendance Rate</p>
            <p className="text-sm text-[#64748b]">14/16 events attended</p>
          </Card>
        </motion.div>

        {/* Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <Card className="bg-[#1e293b] border-[#334155] p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#e2e8f0]">Your Trend</h3>
              <TrendingUp className="w-5 h-5 text-[#10b981]" />
            </div>
            <div className="space-y-3">
              {[
                { month: 'October', rate: 75 },
                { month: 'November', rate: 82 },
                { month: 'December', rate: 87 },
              ].map((month, index) => (
                <div key={month.month} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#94a3b8]">{month.month}</span>
                    <span className="text-[#10b981]">{month.rate}%</span>
                  </div>
                  <div className="h-2 bg-[#0f172a] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${month.rate}%` }}
                      transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                      className="h-full bg-gradient-to-r from-[#429ebd] to-[#9fe7f5]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Clubs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          <Card className="bg-[#1e293b] border-[#334155] p-4">
            <h3 className="text-[#e2e8f0] mb-3">Your Clubs</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-[#0f172a] rounded-lg">
                <div>
                  <p className="text-[#e2e8f0]">Debate Club</p>
                  <p className="text-xs text-[#64748b]">12/14 attended</p>
                </div>
                <div className="text-[#10b981]">86%</div>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#0f172a] rounded-lg">
                <div>
                  <p className="text-[#e2e8f0]">Photography Society</p>
                  <p className="text-xs text-[#64748b]">2/2 attended</p>
                </div>
                <div className="text-[#10b981]">100%</div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Insight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-[#429ebd]/20 to-[#9fe7f5]/10 border-[#429ebd]/30 p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <h3 className="text-[#e2e8f0] mb-2">Keep it up!</h3>
                <p className="text-sm text-[#94a3b8]">
                  You're one of the most reliable members in Debate Club. Your consistency helps the team!
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
