import { format, parseISO } from 'date-fns';
import type { Meal } from './types';

function formatMeal(meal: Meal): string {
  let entry = `  - [${format(new Date(meal.timestamp), 'h:mm a')}] ${meal.food_name} (${meal.calories} kcal)\n`;
  entry += `    Guna: ${meal.guna}\n`;
  if (meal.meal_context) {
    entry += `    Context: ${meal.meal_context}\n`;
  }
  entry += `    Macros: P:${meal.protein_g.toFixed(0)}g, C:${meal.carbs_g.toFixed(0)}g, F:${meal.fats_g.toFixed(0)}g\n`;
  if (meal.vedic_tip) {
    entry += `    Insight: "${meal.vedic_tip}"\n`;
  }
  if (meal.dosha_suggestion) {
    entry += `    Suggestion: "${meal.dosha_suggestion}"\n`;
  }
  entry += `\n`;
  return entry;
}

export function generateVedicJournal(meals: Meal[]): string {
  if (meals.length === 0) {
    return 'No meals recorded in your journal yet.';
  }

  let journal = 'My Vedic Food Journal\n';
  journal += '======================\n\n';

  const groupedByDate: { [key: string]: Meal[] } = meals.reduce((acc, meal) => {
    const date = meal.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(meal);
    return acc;
  }, {} as { [key: string]: Meal[] });

  const sortedDates = Object.keys(groupedByDate).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  sortedDates.forEach(date => {
    journal += `${format(parseISO(date), 'EEEE, MMMM d, yyyy')}\n`;
    journal += '------------------------\n';
    groupedByDate[date]
      .sort((a, b) => a.timestamp - b.timestamp)
      .forEach(meal => {
        journal += formatMeal(meal);
      });
  });

  journal += '\nEnd of Journal.\n';

  return journal;
}
