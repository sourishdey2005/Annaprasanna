'use client';
import { ResponsiveContainer, PolarAngleAxis, RadialBarChart, RadialBar } from 'recharts';
import { Meal } from '@/lib/types';
import { getHours } from 'date-fns';
import { useMemo } from 'react';

interface MealTimingClockProps {
  meals: Meal[];
}

const MealTimingClock = ({ meals }: MealTimingClockProps) => {
  const chartData = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      meals: 0,
    }));

    meals.forEach(meal => {
      const hour = getHours(meal.timestamp);
      hours[hour].meals += 1;
    });

    return hours.map(h => ({
      name: `${h.hour}:00`,
      value: h.meals,
      fill: h.meals > 0 ? 'hsl(var(--primary))' : 'transparent',
    }));
  }, [meals]);

  const hasMeals = meals.length > 0;

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        {hasMeals ? (
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="20%"
            outerRadius="100%"
            barSize={10}
            data={chartData}
            startAngle={90}
            endAngle={-270}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 24]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              background={{ fill: 'hsl(var(--muted))' }}
              dataKey="value"
              cornerRadius={5}
              angleAxisId={0}
            />
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-foreground font-semibold"
            >
              24hr Cycle
            </text>
          </RadialBarChart>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <p>Log a meal to see your timing clock.</p>
          </div>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default MealTimingClock;
