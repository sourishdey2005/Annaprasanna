'use client';
import { useMemo } from 'react';
import { format, eachDayOfInterval, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { Meal } from '@/lib/types';

interface ProteinHeatmapProps {
  meals: Meal[];
}

const ProteinHeatmap = ({ meals }: ProteinHeatmapProps) => {
  const proteinByDate = useMemo(() => {
    const counts: Record<string, number> = {};
    meals.forEach(meal => {
      const dateStr = meal.date;
      counts[dateStr] = (counts[dateStr] || 0) + meal.protein_g;
    });
    return counts;
  }, [meals]);

  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const getCellColor = (protein: number) => {
    if (protein === 0) return 'bg-muted/50';
    if (protein < 20) return 'bg-chart-2/30';
    if (protein < 50) return 'bg-chart-2/60';
    if (protein < 80) return 'bg-chart-2/80';
    return 'bg-chart-2';
  };
  
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <TooltipProvider>
      <div className="flex gap-4 items-start">
        <div className="grid grid-rows-7 gap-1">
             {weekDays.map(day => (
              <div key={day} className="text-xs text-muted-foreground text-right h-4 flex items-center">{day}</div>
            ))}
        </div>
        <div className="grid grid-cols-5 gap-1">
          {days.map(day => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const protein = proteinByDate[dateStr] || 0;
            return (
              <Tooltip key={dateStr}>
                <TooltipTrigger asChild>
                  <div className={`h-4 w-4 rounded-sm ${getCellColor(protein)}`} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{format(day, 'MMMM d, yyyy')}</p>
                  <p>{protein.toFixed(1)}g of protein</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ProteinHeatmap;
