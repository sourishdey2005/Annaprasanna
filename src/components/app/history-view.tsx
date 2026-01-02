'use client';

import { useMemo } from 'react';
import { useApp } from '@/context/AppProvider';
import { format, parseISO } from 'date-fns';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MealCard } from './meal-card';
import type { Meal } from '@/lib/types';

interface GroupedMeals {
  [date: string]: Meal[];
}

export default function HistoryView() {
  const { meals } = useApp();

  const {groupedMeals, dailyCalories} = useMemo(() => {
    const grouped = meals.reduce((acc: GroupedMeals, meal) => {
      const date = meal.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(meal);
      return acc;
    }, {});

    const dailyCals: {[date: string]: number} = {};
    for (const date in grouped) {
        dailyCals[date] = grouped[date].reduce((sum, meal) => sum + meal.calories, 0);
    }
    
    return { groupedMeals: grouped, dailyCalories: dailyCals};

  }, [meals]);

  const sortedDates = Object.keys(groupedMeals).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  if (sortedDates.length === 0) {
    return (
        <div className="container mx-auto p-4 md:p-8">
            <Card className="shadow-lg text-center">
                <CardHeader>
                <CardTitle className="font-headline text-3xl">Vibhāga (Division)</CardTitle>
                </CardHeader>
                <CardContent>
                <p className="text-muted-foreground">Your meal history is empty.</p>
                <p className="text-muted-foreground mt-2">Start by scanning a meal to begin your journey.</p>
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <h2 className="text-3xl font-headline text-center">Vibhāga (Your Meal History)</h2>
      <Accordion type="single" collapsible className="w-full space-y-4">
        {sortedDates.map((date) => (
          <Card key={date} className="shadow-lg">
            <AccordionItem value={date} className="border-b-0">
              <AccordionTrigger className="p-6 text-lg font-medium hover:no-underline">
                <div className="flex justify-between w-full items-center">
                    <span>{format(parseISO(date), 'MMMM d, yyyy')}</span>
                    <span className="text-base font-normal text-muted-foreground pr-4">
                        {Math.round(dailyCalories[date])} kcal
                    </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-6 pt-0">
                <div className="space-y-4">
                  {groupedMeals[date].map((meal) => (
                    <MealCard key={meal.id} meal={meal} />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Card>
        ))}
      </Accordion>
    </div>
  );
}
