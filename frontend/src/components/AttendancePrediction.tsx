import { Card } from './ui/card';
import { Button } from './ui/button';
import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

interface AttendancePredictionProps {
  data: {
    predicted: number;
    total: number;
    percentage: number;
    status: 'good' | 'moderate' | 'poor';
  };
}

export function AttendancePrediction({ data }: AttendancePredictionProps) {
  const getStatusConfig = () => {
    switch (data.status) {
      case 'good':
        return {
          icon: CheckCircle,
          color: 'text-green-400',
          bgColor: 'bg-green-500/10',
          label: 'Looking good',
        };
      case 'moderate':
        return {
          icon: AlertTriangle,
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-500/10',
          label: 'Moderate concern',
        };
      case 'poor':
        return {
          icon: AlertCircle,
          color: 'text-red-400',
          bgColor: 'bg-red-500/10',
          label: 'Low attendance',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <Card className="bg-[#1e293b] border-[#334155] p-6">
      <h3 className="text-white mb-4">Attendance Prediction</h3>
      
      <div className="flex items-center justify-center mb-6">
        <div className="text-center">
          <div className="text-5xl text-white mb-2">
            {data.predicted}/{data.total}
          </div>
          <div className="text-2xl text-[#94a3b8]">{data.percentage}%</div>
        </div>
      </div>

      <div className={`${config.bgColor} rounded-md p-3 mb-4`}>
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${config.color}`} />
          <span className={config.color}>{config.label}</span>
        </div>
      </div>

      <Button className="w-full bg-[#429ebd] hover:bg-[#3a8ba8] text-white">
        Suggestion: Consider rescheduling
      </Button>
    </Card>
  );
}
