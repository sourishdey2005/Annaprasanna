'use client';

import { useMemo, useState } from 'react';
import { useApp } from '@/context/AppProvider';
import { format } from 'date-fns';
import CalorieProgress from './charts/calorie-progress';
import MacrosChart from './charts/macros-chart';
import GunaBalanceChart from './charts/guna-balance-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DailyTotals } from '@/lib/types';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

export default function Dashboard() {
  const { meals } = useApp();
  const [calorieGoal, setCalorieGoal] = useState(2000);

  const todaysTotals: DailyTotals = useMemo(() => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const todaysMeals = meals.filter((meal) => meal.date === todayStr);

    return todaysMeals.reduce(
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
          </CardHeader>
          <CardContent>
            <MacrosChart data={todaysTotals} />
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Guna Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <GunaBalanceChart data={todaysTotals} />
          </CardContent>
        </Card>
      </div>

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
