'use client';

import { useMemo, useState, useEffect } from 'react';
import { useApp } from '@/context/AppProvider';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isAfter, parseISO, getHours } from 'date-fns';
import CalorieProgress from './charts/calorie-progress';
import MacrosChart from './charts/macros-chart';
import GunaBalanceChart from './charts/guna-balance-chart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { DailyTotals, Dosha, Sankalpa } from '@/lib/types';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import SankalpaGoals from './sankalpa-goals';
import { getWeeklyReportData } from '@/lib/reports';
import { Switch } from '@/components/ui/switch';
import DailyCalorieFlowChart from './charts/daily-calorie-flow';
import MealTimingClock from './charts/meal-timing-clock';
import { generateDailyReport } from '@/ai/flows/generate-daily-report';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles } from 'lucide-react';

function DailyReport({ todaysTotals }: { todaysTotals: DailyTotals }) {
  const [report, setReport] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      if (!todaysTotals || todaysTotals.mealCount === 0) {
        setIsLoading(false);
        setReport("Log your first meal to receive mindful insights from the Vedic tradition.");
        return;
      }
      setIsLoading(true);
      try {
        const lateNightMeals = todaysTotals.lateNightMealCount || 0;
        const result = await generateDailyReport({
          mealCount: todaysTotals.mealCount,
          sattvicCount: todaysTotals.sattvic,
          rajasicCount: todaysTotals.rajasic,
          tamasicCount: todaysTotals.tamasic,
          lateNightMeals: lateNightMeals,
          calories: todaysTotals.calories,
        });
        setReport(result.report);
      } catch (error) {
        console.error("Failed to generate daily report:", error);
        setReport("The flow of wisdom is temporarily paused. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [todaysTotals]);

  // Calculate a simple Satva Score (percentage of meals that are Sattvic)
  const satvaScore = todaysTotals.mealCount > 0
    ? Math.round((todaysTotals.sattvic / todaysTotals.mealCount) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-2">
        <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground opacity-70">Mindfulness Level</div>
        <div className="relative h-2 w-full max-w-xs bg-accent rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-primary transition-all duration-1000 ease-out"
            style={{ width: `${satvaScore}%` }}
          />
        </div>
        <div className="text-2xl font-headline font-bold text-primary">{satvaScore}% Sattvic Flow</div>
      </div>

      <div className="relative px-6 py-8 rounded-[2rem] bg-accent/30 border border-primary/10 shadow-inner">
        <Sparkles className="absolute -top-3 -left-3 h-8 w-8 text-primary/40 animate-pulse" />
        <Sparkles className="absolute -bottom-3 -right-3 h-8 w-8 text-primary/40 animate-pulse delay-700" />

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[80%]" />
          </div>
        ) : (
          <p className="text-lg italic font-medium leading-relaxed text-center">
            "{report}"
          </p>
        )}
      </div>
    </div>
  );
}


import CompatibilityChecker from './compatibility-checker';
import MindfulTimer from './mindful-timer';
import VedicMandalaInsights from './vedic-mandala-insights';
import VedicWaterRitual from './vedic-water-ritual';
import TapasFastingTimer from './tapas-fasting-timer';

export default function Dashboard() {
  const { meals, dosha, setDosha, sankalpa, setSankalpa, silentMode, setSilentMode } = useApp();
  const [calorieGoal, setCalorieGoal] = useState(2000);

  const { todaysMeals, todaysTotals, weeklyReportData } = useMemo(() => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const todaysMeals = meals.filter((meal) => meal.date === todayStr);

    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
    const weekDates = eachDayOfInterval({ start: weekStart, end: weekEnd }).map(d => format(d, 'yyyy-MM-dd'));

    const weeklyMeals = meals.filter(meal => weekDates.includes(meal.date));

    const dailyTotals: DailyTotals = todaysMeals.reduce(
      (acc: Omit<DailyTotals, 'mealCount' | 'lateNightMealCount'>, meal) => {
        acc.calories += meal.calories;
        acc.protein += meal.protein_g;
        acc.carbs += meal.carbs_g;
        acc.fats += meal.fats_g;
        if (meal.guna === 'Sattvic') acc.sattvic += 1;
        if (meal.guna === 'Rajasic') acc.rajasic += 1;
        if (meal.guna === 'Tamasic') acc.tamasic += 1;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fats: 0, sattvic: 0, rajasic: 0, tamasic: 0 }
    );
    dailyTotals.mealCount = todaysMeals.length;
    dailyTotals.lateNightMealCount = todaysMeals.filter(m => {
      const hour = getHours(m.timestamp);
      return hour >= 21 || hour < 4;
    }).length;


    const reportData = getWeeklyReportData(weeklyMeals);

    return { todaysMeals, todaysTotals: dailyTotals, weeklyReportData: reportData };
  }, [meals]);

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-12">

      <SankalpaGoals currentSankalpa={sankalpa} setSankalpa={setSankalpa} weeklyReportData={weeklyReportData} />

      <Card className="shadow-2xl border-primary/10 overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
        <CardHeader className="relative overflow-hidden pt-12 pb-8">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <Sparkles className="h-48 w-48 text-primary" />
          </div>
          <CardTitle className="font-headline text-4xl text-center">Aaj Ka Āhāra</CardTitle>
          <CardDescription className="text-center text-lg mt-2">Today's Nourishment & Mindful Flow</CardDescription>
          <div className="flex items-center space-x-2 justify-center pt-6">
            <Switch id="silent-mode" checked={silentMode} onCheckedChange={setSilentMode} />
            <Label htmlFor="silent-mode" className="text-sm font-bold uppercase tracking-widest opacity-60">Silent Mode</Label>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-10 pb-12">
          <CalorieProgress value={todaysTotals.calories} goal={calorieGoal} silentMode={silentMode} />
          {!silentMode && (
            <div className="w-full max-w-sm space-y-4">
              <div className="flex justify-between items-center px-2">
                <Label htmlFor="calorie-goal" className="font-bold text-muted-foreground">Daily Calorie Goal</Label>
                <span className="text-sm font-black text-primary bg-primary/10 px-3 py-1 rounded-full">{calorieGoal} kcal</span>
              </div>
              <Slider
                id="calorie-goal"
                min={1000}
                max={4000}
                step={50}
                value={[calorieGoal]}
                onValueChange={(value) => setCalorieGoal(value[0])}
                className="py-4"
              />
            </div>
          )}
          <DailyReport todaysTotals={todaysTotals} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-xl border-primary/5 hover:border-primary/20 transition-all">
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center gap-2">
              <div className="h-8 w-1 bg-primary rounded-full" />
              Macro Breakdown
            </CardTitle>
            <CardDescription>Today's Protein, Carbs, and Fats</CardDescription>
          </CardHeader>
          <CardContent>
            <MacrosChart data={todaysTotals} silentMode={silentMode} />
          </CardContent>
        </Card>
        <Card className="shadow-xl border-primary/5 hover:border-primary/20 transition-all">
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center gap-2">
              <div className="h-8 w-1 bg-primary rounded-full" />
              Today's Guna Balance
            </CardTitle>
            <CardDescription>Visualize your Sattvic, Rajasic, & Tamasic intake.</CardDescription>
          </CardHeader>
          <CardContent>
            <GunaBalanceChart data={todaysTotals} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <CompatibilityChecker />
        <MindfulTimer />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TapasFastingTimer />
        <VedicWaterRitual />
      </div>

      <VedicMandalaInsights meals={meals} silentMode={silentMode} />


      <Card className="shadow-2xl border-primary/10 bg-gradient-to-r from-primary/5 via-background to-primary/5">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Āhāra Dosha Alignment</CardTitle>
          <CardDescription>Select your Prakriti (constitution) to receive gentle alignment suggestions with your meals.</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            defaultValue={dosha}
            onValueChange={(value: Dosha) => setDosha(value)}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {(['Vata', 'Pitta', 'Kapha', 'Tridoshic'] as Dosha[]).map((d) => (
              <Label key={d} htmlFor={d} className={`flex flex-col items-center justify-center p-6 rounded-3xl border-2 bg-popover cursor-pointer transition-all hover:border-primary/50 ${dosha === d ? 'border-primary bg-primary/5 shadow-xl scale-105' : 'border-muted'}`}>
                <RadioGroupItem value={d} id={d} className="sr-only" />
                <span className="text-xl font-bold font-headline">{d}</span>
              </Label>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <Card className="shadow-2xl text-center bg-primary text-primary-foreground overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle,white_0%,transparent_70%)]" />
        </div>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Vedic Wisdom</CardTitle>
        </CardHeader>
        <CardContent className="relative z-10 px-8 pb-10">
          <blockquote className="text-2xl italic leading-relaxed font-headline max-w-3xl mx-auto">
            “The kind of food we eat has a subtle influence on our mind and character.”
          </blockquote>
        </CardContent>
      </Card>
    </div>
  );
}
