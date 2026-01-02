'use client';

import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar } from 'recharts';
import { DailyTotals } from '@/lib/types';
import { useTheme } from 'next-themes';

interface MacrosChartProps {
  data: Pick<DailyTotals, 'protein' | 'carbs' | 'fats'>;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              {label}
            </span>
            <span className="font-bold text-foreground">
              {payload[0].value}g
            </span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};


export default function MacrosChart({ data }: MacrosChartProps) {
  const chartData = [
    { name: 'Protein', value: data.protein.toFixed(1), fill: 'hsl(var(--chart-1))' },
    { name: 'Carbs', value: data.carbs.toFixed(1), fill: 'hsl(var(--chart-2))' },
    { name: 'Fats', value: data.fats.toFixed(1), fill: 'hsl(var(--chart-3))' },
  ];
  
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <XAxis dataKey="name" stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}g`} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--accent))", radius: 8 }} />
          <Bar dataKey="value" radius={[8, 8, 8, 8]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
