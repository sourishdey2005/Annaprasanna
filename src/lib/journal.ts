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

export function generateFoodScripture(meals: Meal[]): string {
  let profile = "My Āhāra Profile (Personal Food Scripture)\n";
  profile += "========================================\n\n";

  // 1. Guna Tendencies
  const gunaCounts = meals.reduce((acc, meal) => {
    acc[meal.guna] = (acc[meal.guna] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const dominantGuna = Object.keys(gunaCounts).sort((a, b) => gunaCounts[b] - gunaCounts[a])[0];
  profile += `🌿 Guna Prakriti (Natural Tendency):\n`;
  profile += `Your dominant food energy appears to be ${dominantGuna}. This shapes your mental and emotional state.\n\n`;

  // 2. Meal Timing Habits
  const timingCounts = meals.reduce((acc, meal) => {
    const hour = new Date(meal.timestamp).getHours();
    let timeOfDay;
    if (hour >= 4 && hour < 10) timeOfDay = 'Morning (Kapha time)';
    else if (hour >= 10 && hour < 14) timeOfDay = 'Mid-day (Pitta time)';
    else if (hour >= 14 && hour < 18) timeOfDay = 'Afternoon (Vata time)';
    else if (hour >= 18 && hour < 22) timeOfDay = 'Evening (Kapha time)';
    else timeOfDay = 'Late Night (Pitta/Vata transition)';
    
    acc[timeOfDay] = (acc[timeOfDay] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const dominantTime = Object.keys(timingCounts).sort((a, b) => timingCounts[b] - timingCounts[a])[0];
  profile += `🕰️ Kāla Bhojana (Meal Timing Patterns):\n`;
  profile += `You most frequently eat during the ${dominantTime}. According to Ayurveda, the strongest digestive fire (agni) is during Mid-day.\n\n`;

  // 3. Meal Context
  const contextCounts = meals.reduce((acc, meal) => {
    const context = meal.meal_context || 'Unknown';
    acc[context] = (acc[context] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const dominantContext = Object.keys(contextCounts).sort((a, b) => contextCounts[b] - contextCounts[a])[0];
  profile += `🏡 Bhojana Sthāna (Place of Eating):\n`;
  profile += `Your meals are most often ${dominantContext}. The energy of the environment is absorbed with the food.\n\n`;

  // 4. Gentle Guidance
  profile += `✨ Gentle Guidance (Mārga Darśana):\n`;
  if (dominantGuna === 'Rajasic' || dominantGuna === 'Tamasic') {
    profile += `- To cultivate more clarity (Sattva), consider incorporating more fresh fruits, vegetables, and whole grains.\n`;
  }
  if (dominantTime.includes('Late Night') || dominantTime.includes('Evening')) {
      profile += `- Eating lighter in the evening supports the body's natural detoxification processes during sleep.\n`;
  }
  if (dominantContext === 'Outside') {
      profile += `- When eating out, consciously offer gratitude for the nourishment to sanctify it.\n`;
  }
  profile += `- Your path is unique. Observe these patterns with compassion, not judgment. True nourishment is a spiritual practice.\n\n`;

  profile += `May your food be your medicine and your devotion.\n\n`;

  return profile;
}
