'use client';

import { useMemo } from 'react';
import { ResponsiveContainer, LineChart, XAxis, YAxis, Tooltip, Line, CartesianGrid } from 'recharts';
import { Meal } from '@/lib/types';
import { format } from 'date-fns';

interface DailyCalorieFlowChartProps {
  meals: Meal[];
  silentMode: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <p className="font-bold text-foreground">{`${label}`}</p>
        <p className="text-sm text-muted-foreground">{`Calories: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

export default function DailyCalorieFlowChart({ meals, silentMode }: DailyCalorieFlowChartProps) {
  const chartData = useMemo(() => {
    return meals
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(meal => ({
        time: format(new Date(meal.timestamp), 'HH:mm'),
        calories: meal.calories,
      }));
  }, [meals]);
  
  if (silentMode) {
      return (
          <div className="h-64 w-full flex items-center justify-center text-muted-foreground">
              <p>Calorie flow data is hidden in Silent Mode.</p>
          </div>
      )
  }

  if (chartData.length < 2) {
    return (
      <div className="h-64 w-full flex items-center justify-center text-muted-foreground">
        <p>Log at least two meals to see your calorie flow.</p>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="time" stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--accent))" }} />
          <Line type="monotone" dataKey="calories" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4, fill: 'hsl(var(--primary))' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
