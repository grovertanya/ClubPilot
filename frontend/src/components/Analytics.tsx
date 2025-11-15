import { TrendingUp, Award, Users, Target } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

export function Analytics() {
  const predictionAccuracy = {
    current: 89,
    trend: '+2%',
    predicted: 90,
    actual: 90,
  };

  const topPerformers = [
    { name: 'Sarah', attendance: 95, events: 20 },
    { name: 'Miguel', attendance: 92, events: 19 },
    { name: 'Emma', attendance: 90, events: 18 },
  ];

  const bestTimes = [
    { day: 'Tuesday', time: '6pm', attendance: 90 },
    { day: 'Thursday', time: '7pm', attendance: 85 },
    { day: 'Saturday', time: '10am', attendance: 80 },
  ];

  const weeklyData = [
    { week: 'Week 1', predicted: 85, actual: 82 },
    { week: 'Week 2', predicted: 88, actual: 87 },
    { week: 'Week 3', predicted: 90, actual: 89 },
    { week: 'Week 4', predicted: 92, actual: 91 },
  ];

  return (
    <div className="p-8">
      <h1 className="text-white text-3xl mb-8">Analytics</h1>

      {/* Prediction Accuracy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="bg-[#1e293b] border-[#334155] p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-white text-xl mb-2">Prediction Accuracy</h2>
              <p className="text-[#94a3b8] text-sm">How well our AI predicts attendance</p>
            </div>
            <Badge variant="secondary" className="bg-[#10b981]/20 text-[#10b981]">
              <TrendingUp className="w-3 h-3 mr-1" />
              {predictionAccuracy.trend}
            </Badge>
          </div>

          <div className="text-center mb-6">
            <div className="text-6xl text-white mb-2">{predictionAccuracy.current}%</div>
            <p className="text-[#94a3b8]">Accuracy Score</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#0f172a] border border-[#334155] rounded-lg p-4 text-center">
              <p className="text-[#94a3b8] text-sm mb-1">Last Event</p>
              <p className="text-2xl text-white">{predictionAccuracy.predicted}%</p>
              <p className="text-xs text-[#94a3b8]">Predicted</p>
            </div>
            <div className="bg-[#0f172a] border border-[#334155] rounded-lg p-4 text-center">
              <p className="text-[#94a3b8] text-sm mb-1">Actual</p>
              <p className="text-2xl text-[#10b981]">{predictionAccuracy.actual}%</p>
              <p className="text-xs text-[#94a3b8]">18/20 attended</p>
            </div>
          </div>
        </Card>

        {/* Attendance Trend Chart */}
        <Card className="bg-[#1e293b] border-[#334155] p-6">
          <h2 className="text-white text-xl mb-6">Attendance Trend</h2>
          <div className="space-y-4">
            {weeklyData.map((week, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#94a3b8]">{week.week}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-[#429ebd]">Predicted: {week.predicted}%</span>
                    <span className="text-[#10b981]">Actual: {week.actual}%</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div
                    className="h-8 bg-[#429ebd]/30 rounded"
                    style={{ width: `${week.predicted}%` }}
                  />
                  <div
                    className="h-8 bg-[#10b981]/30 rounded"
                    style={{ width: `${week.actual}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <Card className="bg-[#1e293b] border-[#334155] p-6">
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-6 h-6 text-[#eab308]" />
            <h2 className="text-white text-xl">Top Performers</h2>
          </div>
          <div className="space-y-4">
            {topPerformers.map((performer, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-[#0f172a] border border-[#334155] rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#429ebd] rounded-full flex items-center justify-center text-white">
                    {performer.name[0]}
                  </div>
                  <div>
                    <p className="text-white">{performer.name}</p>
                    <p className="text-sm text-[#94a3b8]">{performer.events} events</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl text-[#10b981]">{performer.attendance}%</p>
                  <p className="text-xs text-[#94a3b8]">Attendance</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Best Times */}
        <Card className="bg-[#1e293b] border-[#334155] p-6">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-6 h-6 text-[#429ebd]" />
            <h2 className="text-white text-xl">Best Times for Events</h2>
          </div>
          <div className="space-y-4">
            {bestTimes.map((time, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-[#0f172a] border border-[#334155] rounded-lg"
              >
                <div>
                  <p className="text-white">{time.day}</p>
                  <p className="text-sm text-[#94a3b8]">{time.time}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl text-white">{time.attendance}%</p>
                  <p className="text-xs text-[#94a3b8]">Avg attendance</p>
                </div>
              </div>
            ))}
          </div>

          <Card className="bg-[#429ebd]/10 border-[#429ebd]/30 p-4 mt-6">
            <p className="text-[#9fe7f5] text-sm">
              💡 <span className="text-white">Insight:</span> Tuesday 6pm has the highest average attendance (90%). Consider scheduling important events at this time.
            </p>
          </Card>
        </Card>
      </div>
    </div>
  );
}
