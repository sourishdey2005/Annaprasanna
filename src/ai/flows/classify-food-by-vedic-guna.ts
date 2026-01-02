'use server';

/**
 * @fileOverview Classifies food items based on Vedic Gunas (Sattvic, Rajasic, Tamasic) using AI.
 *
 * - classifyFoodByVedicGuna - A function that handles the classification of food by Vedic Guna.
 * - ClassifyFoodByVedicGunaInput - The input type for the classifyFoodByVedicGuna function.
 * - ClassifyFoodByVedicGunaOutput - The return type for the classifyFoodByVedicGuna function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ClassifyFoodByVedicGunaInputSchema = z.object({
  foodName: z.string().describe('The name of the food to classify.'),
  calories: z.number().describe('The number of calories in the food (kcal).'),
  protein_g: z.number().describe('The grams of protein in the food.'),
  carbs_g: z.number().describe('The grams of carbohydrates in the food.'),
  fats_g: z.number().describe('The grams of fats in the food.'),
});

export type ClassifyFoodByVedicGunaInput = z.infer<typeof ClassifyFoodByVedicGunaInputSchema>;

const ClassifyFoodByVedicGunaOutputSchema = z.object({
  guna: z.enum(['Sattvic', 'Rajasic', 'Tamasic']).describe('The Vedic Guna classification of the food.'),
  vedic_tip: z.string().describe('A short spiritual or dietary insight based on the guna.'),
});

export type ClassifyFoodByVedicGunaOutput = z.infer<typeof ClassifyFoodByVedicGunaOutputSchema>;

export async function classifyFoodByVedicGuna(input: ClassifyFoodByVedicGunaInput): Promise<ClassifyFoodByVedicGunaOutput> {
  return classifyFoodByVedicGunaFlow(input);
}

const prompt = ai.definePrompt({
  name: 'classifyFoodByVedicGunaPrompt',
  input: {schema: ClassifyFoodByVedicGunaInputSchema},
  output: {schema: ClassifyFoodByVedicGunaOutputSchema},
  prompt: `Act as a Vedic Nutritionist and certified dietician.\n\nAnalyze the following food and respond ONLY in valid JSON.\n\nFood: {{{foodName}}}\nCalories: {{{calories}}} kcal\nProtein: {{{protein_g}}} g\nCarbs: {{{carbs_g}}} g\nFats: {{{fats_g}}} g\n\nReturn:\n- guna (one of: Sattvic, Rajasic, Tamasic)\n- vedic_tip (short spiritual or dietary insight based on the guna)\n\nBe realistic with Indian food portions.\nNo markdown. No extra commentary.`,
});

const classifyFoodByVedicGunaFlow = ai.defineFlow(
  {
    name: 'classifyFoodByVedicGunaFlow',
    inputSchema: ClassifyFoodByVedicGunaInputSchema,
    outputSchema: ClassifyFoodByVedicGunaOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
