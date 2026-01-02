'use client';

import { useMemo, useState } from 'react';
import { useApp } from '@/context/AppProvider';
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import CalorieProgress from './charts/calorie-progress';
import MacrosChart from './charts/macros-chart';
import GunaBalanceRadar from './charts/guna-balance-radar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { DailyTotals, Dosha } from '@/lib/types';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function Dashboard() {
  const { meals, dosha, setDosha } = useApp();
  const [calorieGoal, setCalorieGoal] = useState(2000);

  const { todaysTotals, weeklyGunaTotals } = useMemo(() => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const todaysMeals = meals.filter((meal) => meal.date === todayStr);

    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
    const weekDates = eachDayOfInterval({ start: weekStart, end: weekEnd }).map(d => format(d, 'yyyy-MM-dd'));

    const weeklyMeals = meals.filter(meal => weekDates.includes(meal.date));

    const dailyTotals = todaysMeals.reduce(
      (acc: DailyTotals, meal) => {
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
    
    const weeklyTotals = weeklyMeals.reduce((acc, meal) => {
        if (meal.guna === 'Sattvic') acc.sattvic += 1;
        if (meal.guna === 'Rajasic') acc.rajasic += 1;
        if (meal.guna === 'Tamasic') acc.tamasic += 1;
        return acc;
    }, { sattvic: 0, rajasic: 0, tamasic: 0 });


    return { todaysTotals: dailyTotals, weeklyGunaTotals: weeklyTotals };
  }, [meals]);
  
  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-3xl text-center">Aaj Ka Āhāra (Today's Nourishment)</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <CalorieProgress value={todaysTotals.calories} goal={calorieGoal} />
          <div className="w-full max-w-sm space-y-4">
            <div className="flex justify-between items-center">
              <Label htmlFor="calorie-goal">Daily Calorie Goal: {calorieGoal} kcal</Label>
            </div>
            <Slider
              id="calorie-goal"
              min={1000}
              max={4000}
              step={50}
              value={[calorieGoal]}
              onValueChange={(value) => setCalorieGoal(value[0])}
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Macro Breakdown</CardTitle>
            <CardDescription>Today's Protein, Carbs, and Fats</CardDescription>
          </CardHeader>
          <CardContent>
            <MacrosChart data={todaysTotals} />
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">This Week's Guna Balance</CardTitle>
            <CardDescription>Visualize your Sattvic, Rajasic, & Tamasic intake.</CardDescription>
          </CardHeader>
          <CardContent>
            <GunaBalanceRadar data={weeklyGunaTotals} />
          </CardContent>
        </Card>
      </div>

       <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Āhāra Dosha Alignment</CardTitle>
            <CardDescription>Select your Prakriti (constitution) to receive gentle alignment suggestions with your meals.</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              defaultValue={dosha}
              onValueChange={(value: Dosha) => setDosha(value)}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {(['Vata', 'Pitta', 'Kapha', 'Tridoshic'] as Dosha[]).map((d) => (
                <div key={d} className="flex items-center space-x-2">
                  <RadioGroupItem value={d} id={d} />
                  <Label htmlFor={d} className="text-lg font-medium">{d}</Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
      </Card>

       <Card className="shadow-lg text-center bg-accent">
        <CardHeader>
          <CardTitle className="font-headline text-accent-foreground">Vedic Wisdom</CardTitle>
        </CardHeader>
        <CardContent>
          <blockquote className="text-lg italic text-accent-foreground/80">
            “The kind of food we eat has a subtle influence on our mind and character.”
          </blockquote>
        </CardContent>
      </Card>
    </div>
  );
}
