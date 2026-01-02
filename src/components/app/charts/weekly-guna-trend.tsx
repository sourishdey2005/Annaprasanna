'use client';

import { useMemo } from 'react';
import { ResponsiveContainer, AreaChart, XAxis, YAxis, Tooltip, Area, CartesianGrid } from 'recharts';
import { Meal } from '@/lib/types';
import { format, eachDayOfInterval, subDays } from 'date-fns';

interface WeeklyGunaTrendChartProps {
  meals: Meal[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <p className="font-bold text-foreground">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function WeeklyGunaTrendChart({ meals }: WeeklyGunaTrendChartProps) {
  const chartData = useMemo(() => {
    const today = new Date();
    const last7Days = eachDayOfInterval({ start: subDays(today, 6), end: today });

    const dataByDate = last7Days.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const mealsForDay = meals.filter(meal => meal.date === dateStr);
      
      return {
        date: format(day, 'MMM d'),
        Sattvic: mealsForDay.filter(m => m.guna === 'Sattvic').length,
        Rajasic: mealsForDay.filter(m => m.guna === 'Rajasic').length,
        Tamasic: mealsForDay.filter(m => m.guna === 'Tamasic').length,
      };
    });

    return dataByDate;
  }, [meals]);

  if (meals.length === 0) {
    return (
      <div className="h-64 w-full flex items-center justify-center text-muted-foreground">
        <p>Log meals to see your weekly Guna trend.</p>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="date" stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--accent))" }} />
          <Area type="monotone" dataKey="Sattvic" stackId="1" stroke="hsl(var(--chart-4))" fill="hsl(var(--chart-4), 0.5)" />
          <Area type="monotone" dataKey="Rajasic" stackId="1" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1), 0.5)" />
          <Area type="monotone" dataKey="Tamasic" stackId="1" stroke="hsl(var(--chart-3))" fill="hsl(var(--chart-3), 0.5)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
