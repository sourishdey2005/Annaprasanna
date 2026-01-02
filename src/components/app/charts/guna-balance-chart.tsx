'use client';

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { DailyTotals } from '@/lib/types';

interface GunaBalanceChartProps {
  data: Pick<DailyTotals, 'sattvic' | 'rajasic' | 'tamasic'>;
}

const COLORS = {
  sattvic: 'hsl(var(--chart-4))', // Tulsi Green
  rajasic: 'hsl(var(--chart-1))', // Saffron
  tamasic: 'hsl(var(--chart-3))', // Gray
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

export default function GunaBalanceChart({ data }: GunaBalanceChartProps) {
  const chartData = [
    { name: 'Sattvic', value: data.sattvic },
    { name: 'Rajasic', value: data.rajasic },
    { name: 'Tamasic', value: data.tamasic },
  ].filter(d => d.value > 0);

  if (chartData.length === 0) {
    return (
      <div className="h-64 w-full flex items-center justify-center text-muted-foreground">
        <p>No meals recorded today to show Guna balance.</p>
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
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
