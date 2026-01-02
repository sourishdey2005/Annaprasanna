'use client';

import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';

interface CalorieProgressProps {
  value: number;
  goal: number;
}

export default function CalorieProgress({ value, goal }: CalorieProgressProps) {
  const percentage = goal > 0 ? Math.min((value / goal) * 100, 100) : 0;
  const data = [{ name: 'calories', value: percentage, fill: 'hsl(var(--primary))' }];
  const endAngle = 360 * (percentage / 100) + 90;

  return (
    <div className="relative h-64 w-64">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          innerRadius="70%"
          outerRadius="100%"
          barSize={20}
          data={data}
          startAngle={90}
          endAngle={450}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <RadialBar
            background={{ fill: 'hsl(var(--muted))' }}
            dataKey="value"
            cornerRadius={10}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-bold font-headline text-foreground">{Math.round(value)}</span>
        <span className="text-muted-foreground">/ {goal} kcal</span>
      </div>
    </div>
  );
}
