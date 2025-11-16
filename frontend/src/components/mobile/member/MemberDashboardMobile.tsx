import { motion } from 'motion/react';
import { Plane, Calendar, AlertTriangle } from 'lucide-react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  show: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.3, ease: [0.215, 0.61, 0.355, 1] }
  },
};

export function MemberDashboardMobile() {
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
            <h1 className="text-xl text-[#e2e8f0]">Dashboard</h1>
          </div>
          <button className="w-10 h-10 bg-[#429ebd] rounded-full flex items-center justify-center text-white text-sm">
            SM
          </button>
        </div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="p-4 space-y-4"
      >

        {/* 🔥 SWAPPED: Conflicts FIRST */}
        <motion.div variants={itemVariants}>
          <h2 className="text-lg text-[#e2e8f0] mb-3">Conflicts to Resolve</h2>
          <Card className="bg-[#ef4444]/10 border-l-4 border-l-[#ef4444] p-4">
            <div className="flex items-start gap-3 mb-3">
              <AlertTriangle className="w-5 h-5 text-[#ef4444] flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-[#e2e8f0] mb-1">Debate Club Meeting</h3>
                <p className="text-sm text-[#94a3b8] mb-2">
                  ⚠️ Class 4–5pm Tuesday
                </p>
                <p className="text-xs text-[#64748b] mb-2">
                  40% likely you'll attend
                </p>
                <div className="bg-[#9fe7f5]/10 border border-[#9fe7f5]/20 rounded-lg p-2 mb-3">
                  <p className="text-xs text-[#9fe7f5]">
                    "I know you got class until 5—no pressure if you're tired!"
                  </p>
                </div>
                <Button
                  size="sm"
                  className="w-full bg-gradient-to-r from-[#429ebd] to-[#9fe7f5] text-white"
                >
                  View Details
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* 🔥 SWAPPED: Today & Upcoming SECOND */}
        <motion.div variants={itemVariants}>
          <h2 className="text-lg text-[#e2e8f0] mb-3">Today & Upcoming</h2>
          <Card className="bg-[#1e293b] border-[#334155] p-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 text-[#429ebd]" />
                    <span className="text-[#e2e8f0]">Tuesday, Jan 23</span>
                  </div>
                  <p className="text-sm text-[#94a3b8] mb-1">Debate Club • 6pm</p>
                  <Badge variant="secondary" className="bg-[#10b981]/20 text-[#10b981] text-xs">
                    Free
                  </Badge>
                </div>
              </div>

              <div className="border-t border-[#334155] pt-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-[#64748b]" />
                      <span className="text-[#94a3b8]">Wednesday, Jan 24</span>
                    </div>
                    <p className="text-sm text-[#64748b]">No events</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#334155] pt-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-[#eab308]" />
                      <span className="text-[#e2e8f0]">Thursday, Jan 25</span>
                    </div>
                    <p className="text-sm text-[#94a3b8] mb-1">Class 2pm • Debate Club? 7pm</p>
                    <Badge variant="secondary" className="bg-[#eab308]/20 text-[#eab308] text-xs">
                      Maybe
                    </Badge>
                  </div>
                </div>
              </div>

            </div>
          </Card>
        </motion.div>

      </motion.div>
    </div>
  );
}
