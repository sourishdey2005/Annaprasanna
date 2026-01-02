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
};

export type Guna = 'Sattvic' | 'Rajasic' | 'Tamasic';

export type DailyTotals = {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  sattvic: number;
  rajasic: number;
  tamasic: number;
};
