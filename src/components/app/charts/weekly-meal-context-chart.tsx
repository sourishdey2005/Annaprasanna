'use client';
import { useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import type { WeeklyReportData } from '@/lib/types';

interface WeeklyMealContextChartProps {
  data: WeeklyReportData;
}

const COLORS = {
  'Home-cooked': 'hsl(var(--chart-4))',
  'Outside': 'hsl(var(--chart-1))',
  'Prasadam': 'hsl(var(--chart-2))',
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <p className="font-bold text-foreground">{`${payload[0].name}: ${payload[0].value} meals`}</p>
      </div>
    );
  }
  return null;
};

const WeeklyMealContextChart = ({ data }: WeeklyMealContextChartProps) => {
  const chartData = useMemo(() => {
    return [
      { name: 'Home-cooked', value: data.homeCookedMeals },
      { name: 'Outside', value: data.outsideMeals },
      { name: 'Prasadam', value: data.prasadamMeals },
    ].filter(d => d.value > 0);
  }, [data]);

  if (chartData.length === 0) {
    return (
      <div className="h-64 w-full flex items-center justify-center text-muted-foreground">
        <p>No meal contexts logged this week.</p>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--accent))" }} />
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry) => (
              <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
            ))}
          </Pie>
           <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-foreground font-semibold capitalize"
            >
              {chartData.sort((a,b) => b.value - a.value)[0].name}
            </text>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklyMealContextChart;
