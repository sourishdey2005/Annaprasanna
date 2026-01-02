'use client';

import { useMemo, useState } from 'react';
import { useApp } from '@/context/AppProvider';
import { format, parseISO, startOfWeek, endOfWeek, eachDayOfInterval, subDays } from 'date-fns';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { MealCard } from './meal-card';
import type { Meal } from '@/lib/types';
import MealConsistencyHeatmap from './meal-consistency-heatmap';
import WeeklyAharaReport from './weekly-ahara-report';
import { Button } from '@/components/ui/button';
import { Download, BookUser } from 'lucide-react';
import { generateVedicJournal, generateFoodScripture } from '@/lib/journal';
import { useToast } from '@/hooks/use-toast';
import WeeklyGunaTrendChart from './charts/weekly-guna-trend';
import { getWeeklyReportData } from '@/lib/reports';
import WeeklyCookingMethodChart from './charts/weekly-cooking-method-chart';
import WeeklyMealContextChart from './charts/weekly-meal-context-chart';


interface GroupedMeals {
  [date: string]: Meal[];
}

export default function HistoryView() {
  const { meals, silentMode } = useApp();
  const { toast } = useToast();

  const {groupedMeals, dailyCalories, weeklyMeals, last7DaysMeals, weeklyReportData} = useMemo(() => {
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
    
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
    const weekDates = eachDayOfInterval({ start: weekStart, end: weekEnd }).map(d => format(d, 'yyyy-MM-dd'));
    const currentWeekMeals = meals.filter(meal => weekDates.includes(meal.date));

    const sevenDaysAgo = subDays(new Date(), 6);
    const last7DaysInterval = eachDayOfInterval({ start: sevenDaysAgo, end: new Date() }).map(d => format(d, 'yyyy-MM-dd'));
    const mealsFromLast7Days = meals.filter(meal => last7DaysInterval.includes(meal.date));
    
    const reportData = getWeeklyReportData(currentWeekMeals);

    return { groupedMeals: grouped, dailyCalories: dailyCals, weeklyMeals: currentWeekMeals, last7DaysMeals: mealsFromLast7Days, weeklyReportData: reportData };

  }, [meals]);
  
  const handleExportJournal = () => {
    const journalText = generateVedicJournal(meals);
    const blob = new Blob([journalText], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Vedic_Journal_${format(new Date(), 'yyyy-MM-dd')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleGenerateScripture = () => {
    if (meals.length < 30) {
      toast({
        variant: 'destructive',
        title: 'Not Enough Data',
        description: `You need at least 30 logged meals to generate your Ahara Profile. You have ${meals.length}.`
      });
      return;
    }
    const scriptureText = generateFoodScripture(meals);
    const blob = new Blob([scriptureText], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `My_Ahara_Profile_${format(new Date(), 'yyyy-MM-dd')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const sortedDates = Object.keys(groupedMeals).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
       <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-3xl text-center">Saptāhika Āhāra (Weekly Report)</CardTitle>
             <CardDescription className="text-center">An overview of your eating patterns for this week.</CardDescription>
          </CardHeader>
          <CardContent>
            {weeklyMeals.length > 0 ? (
                <WeeklyAharaReport weeklyReportData={weeklyReportData} />
            ) : (
                <p className="text-muted-foreground text-center">Log some meals this week to see your report.</p>
            )}
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             <Card className="shadow-lg">
                <CardHeader>
                <CardTitle className="font-headline text-3xl text-center">Weekly Cooking Methods</CardTitle>
                <CardDescription className="text-center">How your food was prepared this week.</CardDescription>
                </CardHeader>
                <CardContent>
                    <WeeklyCookingMethodChart data={weeklyReportData.cookingMethods} />
                </CardContent>
            </Card>
             <Card className="shadow-lg">
                <CardHeader>
                <CardTitle className="font-headline text-3xl text-center">Lifestyle Balance</CardTitle>
                <CardDescription className="text-center">Home-cooked, Prasadam, and outside meals.</CardDescription>
                </CardHeader>
                <CardContent>
                    <WeeklyMealContextChart data={weeklyReportData} />
                </CardContent>
            </Card>
        </div>


      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-3xl text-center">Weekly Guna Trend</CardTitle>
          <CardDescription className="text-center">Observe the flow of gunas in your diet over the last 7 days.</CardDescription>
        </CardHeader>
        <CardContent>
          <WeeklyGunaTrendChart meals={last7DaysMeals} />
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle className="font-headline text-3xl text-center">Āhāra Niyami (Meal Consistency)</CardTitle>
            <CardDescription className="text-center">A heatmap of your meal logging consistency.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
            <MealConsistencyHeatmap meals={meals} />
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle className="font-headline text-3xl text-center">Vibhāga (Your Meal History)</CardTitle>
            <CardDescription className="text-center flex flex-wrap justify-center items-center gap-4">
                Browse past meals or generate a report.
                 <Button variant="outline" size="sm" onClick={handleGenerateScripture}>
                    <BookUser className="mr-2 h-4 w-4" />
                    Generate Ahara Profile
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportJournal}>
                    <Download className="mr-2 h-4 w-4" />
                    Export Journal
                </Button>
            </CardDescription>
        </CardHeader>
        <CardContent>
             {sortedDates.length === 0 ? (
                <div className="text-center">
                    <p className="text-muted-foreground">Your meal history is empty.</p>
                    <p className="text-muted-foreground mt-2">Start by scanning a meal to begin your journey.</p>
                </div>
            ) : (
                <Accordion type="single" collapsible className="w-full space-y-4">
                {sortedDates.map((date) => (
                <Card key={date} className="shadow-inner bg-background">
                    <AccordionItem value={date} className="border-b-0">
                    <AccordionTrigger className="p-6 text-lg font-medium hover:no-underline">
                        <div className="flex justify-between w-full items-center">
                            <span>{format(parseISO(date), 'MMMM d, yyyy')}</span>
                            {!silentMode &&
                              <span className="text-base font-normal text-muted-foreground pr-4">
                                  {Math.round(dailyCalories[date])} kcal
                              </span>
                            }
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
            )}
        </CardContent>
      </Card>
    </div>
  );
}
