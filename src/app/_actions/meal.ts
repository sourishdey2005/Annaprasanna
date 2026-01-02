'use server';

import { identifyFoodFromImage } from '@/ai/flows/identify-food-from-image';
import type { IdentifyFoodFromImageInput } from '@/ai/flows/identify-food-from-image';

export async function analyzeFoodImage(input: IdentifyFoodFromImageInput) {
  try {
    const result = await identifyFoodFromImage(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error in analyzeFoodImage action:', error);
    // It's better to return a generic error message to the client
    return { success: false, error: 'Apologies, the food could not be recognized. Please try another image.' };
  }
}
