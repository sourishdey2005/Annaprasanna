'use server';

import { identifyFoodFromImage } from '@/ai/flows/identify-food-from-image';
import type { IdentifyFoodFromImageInput } from '@/ai/flows/identify-food-from-image';
import { checkFoodCompatibility as checkFoodCompatibilityFlow } from '@/ai/flows/check-food-compatibility';

export async function analyzeFoodImage(input: IdentifyFoodFromImageInput) {
  try {
    const result = await identifyFoodFromImage(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error in analyzeFoodImage action:', error);
    return { success: false, error: 'Apologies, the food could not be recognized. Please try another image.' };
  }
}

export async function checkCompatibility(foods: string[]) {
  try {
    const result = await checkFoodCompatibilityFlow({ foods });
    return { success: true, data: result };
  } catch (error: any) {
    console.error('Error in checkCompatibility action:', error);
    // Return a more descriptive error if available
    const errorMessage = error?.message || 'Knowledge of compatibility is temporarily obscured.';
    return { success: false, error: errorMessage };
  }
}
