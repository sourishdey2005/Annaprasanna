export type Meal = {
  id?: number;
  food_name: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fats_g: number;
  guna: 'Sattvic' | 'Rajasic' | 'Tamasic';
  vedic_tip: string;
  timestamp: number;
  date: string; // YYYY-MM-DD
  imageUrl?: string; // Storing image is optional, for history view
  meal_context?: 'Prasadam' | 'Home-cooked' | 'Outside';
  dosha_suggestion?: string;
  time_of_day_wisdom?: string;
  // New AI features
  ingredient_breakdown?: string;
  portion_awareness?: string;
  seasonal_awareness?: string;
  cooking_method_insight?: string;
  cooking_method?: 'Fried' | 'Steamed' | 'Roasted' | 'Raw' | 'Other';
};

export type Guna = 'Sattvic' | 'Rajasic' | 'Tamasic';
export type Dosha = 'Vata' | 'Pitta' | 'Kapha' | 'Tridoshic';

export type DailyTotals = {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  sattvic: number;
  rajasic: number;
  tamasic: number;
  mealCount: number;
  lateNightMealCount: number;
};

export type WeeklyReportData = {
    totalMeals: number;
    sattvicCount: number;
    rajasicCount: number;
    tamasicCount: number;
    lateNightMeals: number;
    outsideMeals: number;
    proteinIntakeTrend: 'increasing' | 'decreasing' | 'stable';
    homeCookedMeals: number;
    prasadamMeals: number;
    largePortions: number;
    cookingMethods: {
        [method: string]: number;
    };
}

export type Sankalpa = 'increase-sattvic' | 'reduce-rajasic' | 'reduce-tamasic' | 'reduce-late-eating';
