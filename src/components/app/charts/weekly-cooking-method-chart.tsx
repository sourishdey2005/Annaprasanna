'use client';
import { useMemo } from 'react';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar, CartesianGrid } from 'recharts';
import type { WeeklyReportData } from '@/lib/types';

interface WeeklyCookingMethodChartProps {
  data: WeeklyReportData['cookingMethods'];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <p className="font-bold text-foreground">{label}</p>
        <p className="text-sm text-muted-foreground">{`Meals: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const WeeklyCookingMethodChart = ({ data }: WeeklyCookingMethodChartProps) => {
  const chartData = useMemo(() => {
    return Object.entries(data).map(([method, count]) => ({
      name: method,
      value: count,
      fill: `hsl(var(--chart-${Object.keys(data).indexOf(method) + 1}))`,
    }));
  }, [data]);

  if (chartData.length === 0) {
    return (
      <div className="h-64 w-full flex items-center justify-center text-muted-foreground">
        <p>No cooking methods recorded this week.</p>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis type="number" stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis type="category" dataKey="name" stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--accent))" }} />
          <Bar dataKey="value" radius={[0, 8, 8, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklyCookingMethodChart;
