import { motion } from 'motion/react';
import { Plane, TrendingUp, Calendar, Clock, Award } from 'lucide-react';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';

export function CaptainAnalyticsMobile() {
  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-10 bg-[#0f172a] border-b border-[#1e293b] px-4 py-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#429ebd] to-[#9fe7f5] rounded-xl flex items-center justify-center">
              <Plane className="w-5 h-5 text-white transform rotate-45" />
            </div>
            <h1 className="text-xl text-[#e2e8f0]">Analytics</h1>
          </div>
          <button className="px-3 py-1 bg-[#1e293b] border border-[#334155] rounded-lg text-sm text-[#94a3b8]">
            This Month
          </button>
        </div>
      </motion.div>

      <div className="p-4 space-y-4">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <Card className="bg-[#1e293b] border-[#334155] p-4">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-5 h-5 text-[#10b981]" />
                <Badge variant="secondary" className="bg-[#10b981]/20 text-[#10b981] text-xs">
                  +5%
                </Badge>
              </div>
              <div className="text-3xl text-white mb-1">82%</div>
              <p className="text-xs text-[#94a3b8]">Avg Attendance</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <Card className="bg-[#1e293b] border-[#334155] p-4">
              <div className="flex items-center justify-between mb-2">
                <Calendar className="w-5 h-5 text-[#429ebd]" />
                <span className="text-xl">📅</span>
              </div>
              <div className="text-2xl text-white mb-1">Tuesday</div>
              <p className="text-xs text-[#94a3b8]">Best Day (90%)</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <Card className="bg-[#1e293b] border-[#334155] p-4">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-5 h-5 text-[#9fe7f5]" />
                <span className="text-xl">⏰</span>
              </div>
              <div className="text-2xl text-white mb-1">6:00 PM</div>
              <p className="text-xs text-[#94a3b8]">Best Time (91%)</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            <Card className="bg-[#1e293b] border-[#334155] p-4">
              <div className="flex items-center justify-between mb-2">
                <Award className="w-5 h-5 text-[#eab308]" />
                <span className="text-xl">🏆</span>
              </div>
              <div className="text-lg text-white mb-1">Sarah</div>
              <p className="text-xs text-[#94a3b8]">Top Member (91%)</p>
            </Card>
          </motion.div>
        </div>

        {/* Attendance Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          <Card className="bg-[#1e293b] border-[#334155] p-4">
            <h3 className="text-[#e2e8f0] mb-4">Attendance Trends</h3>
            <div className="space-y-3">
              {[
                { week: 'Week 1', predicted: 85, actual: 82 },
                { week: 'Week 2', predicted: 88, actual: 87 },
                { week: 'Week 3', predicted: 90, actual: 89 },
                { week: 'Week 4', predicted: 92, actual: 91 },
              ].map((week, index) => (
                <div key={week.week} className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#94a3b8]">{week.week}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[#429ebd]">P: {week.predicted}%</span>
                      <span className="text-[#10b981]">A: {week.actual}%</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${week.predicted}%` }}
                      transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                      className="h-6 bg-[#429ebd]/30 rounded"
                    />
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${week.actual}%` }}
                      transition={{ duration: 0.8, delay: 0.7 + index * 0.1 }}
                      className="h-6 bg-[#10b981]/30 rounded"
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Insights Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-[#429ebd]/20 to-[#9fe7f5]/10 border-[#429ebd]/30 p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <h3 className="text-[#e2e8f0] mb-2">Smart Insights</h3>
                <p className="text-sm text-[#94a3b8] mb-2">
                  Tuesday 6pm has your highest attendance (90%)
                </p>
                <p className="text-sm text-[#94a3b8]">
                  Consider scheduling more events at this time
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
