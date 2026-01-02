'use client';

import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip } from 'recharts';
import { DailyTotals } from '@/lib/types';

interface GunaBalanceRadarProps {
  data: Pick<DailyTotals, 'sattvic' | 'rajasic' | 'tamasic'>;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <p className="font-bold text-foreground">{`${payload[0].payload.guna}: ${payload[0].value} meals`}</p>
      </div>
    );
  }
  return null;
};

export default function GunaBalanceRadar({ data }: GunaBalanceRadarProps) {
  const chartData = [
    { guna: 'Sattvic', meals: data.sattvic },
    { guna: 'Rajasic', meals: data.rajasic },
    { guna: 'Tamasic', meals: data.tamasic },
  ];
  
  const totalMeals = data.sattvic + data.rajasic + data.tamasic;

  if (totalMeals === 0) {
    return (
      <div className="h-64 w-full flex items-center justify-center text-muted-foreground">
        <p>Log meals this week to see your Guna Balance.</p>
      </div>
    );
  }


  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="guna" />
          <Radar name="Meals" dataKey="meals" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
