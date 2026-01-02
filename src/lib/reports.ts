'use client';
import { parseISO, getHours } from 'date-fns';
import type { Meal, WeeklyReportData } from './types';

export function getWeeklyReportData(weeklyMeals: Meal[]): WeeklyReportData {
    if (weeklyMeals.length === 0) {
        return { totalMeals: 0, sattvicCount: 0, rajasicCount: 0, tamasicCount: 0, lateNightMeals: 0, outsideMeals: 0, proteinIntakeTrend: 'stable', homeCookedMeals: 0, prasadamMeals: 0, largePortions: 0, cookingMethods: {} };
    }

    let sattvicCount = 0;
    let rajasicCount = 0;
    let tamasicCount = 0;
    let lateNightMeals = 0;
    let outsideMeals = 0;
    let homeCookedMeals = 0;
    let prasadamMeals = 0;
    let largePortions = 0;
    let cookingMethods: { [method: string]: number } = {};
    let proteinByDay: { [day: string]: { total: number, count: number } } = {};

    weeklyMeals.forEach(meal => {
        if (meal.guna === 'Sattvic') sattvicCount++;
        if (meal.guna === 'Rajasic') rajasicCount++;
        if (meal.guna === 'Tamasic') tamasicCount++;

        const hour = getHours(meal.timestamp);
        if (hour >= 21 || hour < 4) { // 9 PM to 4 AM
            lateNightMeals++;
        }

        if (meal.meal_context === 'Outside') outsideMeals++;
        if (meal.meal_context === 'Home-cooked') homeCookedMeals++;
        if (meal.meal_context === 'Prasadam') prasadamMeals++;

        if (meal.portion_awareness && meal.portion_awareness.toLowerCase().includes('larger')) {
            largePortions++;
        }

        if (meal.cooking_method) {
            cookingMethods[meal.cooking_method] = (cookingMethods[meal.cooking_method] || 0) + 1;
        }
        
        const day = meal.date;
        if(!proteinByDay[day]) {
            proteinByDay[day] = { total: 0, count: 0 };
        }
        proteinByDay[day].total += meal.protein_g;
        proteinByDay[day].count++;
    });

    const sortedDays = Object.keys(proteinByDay).sort();
    let proteinTrend: 'increasing' | 'decreasing' | 'stable' = 'stable';
    if (sortedDays.length > 2) {
        const firstDayAvg = proteinByDay[sortedDays[0]].total / proteinByDay[sortedDays[0]].count;
        const lastDayAvg = proteinByDay[sortedDays[sortedDays.length - 1]].total / proteinByDay[sortedDays[sortedDays.length - 1]].count;
        if (lastDayAvg > firstDayAvg * 1.1) {
            proteinTrend = 'increasing';
        } else if (lastDayAvg < firstDayAvg * 0.9) {
            proteinTrend = 'decreasing';
        }
    }

    return {
        totalMeals: weeklyMeals.length,
        sattvicCount,
        rajasicCount,
        tamasicCount,
        lateNightMeals,
        outsideMeals,
        homeCookedMeals,
        prasadamMeals,
        largePortions,
        cookingMethods,
        proteinIntakeTrend: proteinTrend,
    };
}
