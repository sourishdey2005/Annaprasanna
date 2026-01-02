'use server';

/**
 * @fileOverview A flow that calculates the nutritional information of food items.
 *
 * - calculateNutritionalInformation - A function that handles the calculation of nutritional information.
 * - CalculateNutritionalInformationInput - The input type for the calculateNutritionalInformation function.
 * - CalculateNutritionalInformationOutput - The return type for the calculateNutritionalInformation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CalculateNutritionalInformationInputSchema = z.object({
  foodImageUri: z
    .string()
    .describe(
      "A photo of food, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type CalculateNutritionalInformationInput = z.infer<typeof CalculateNutritionalInformationInputSchema>;

const CalculateNutritionalInformationOutputSchema = z.object({
  food_name: z.string().describe('The name of the food.'),
  calories: z.number().describe('The number of calories in kcal.'),
  protein_g: z.number().describe('The amount of protein in grams.'),
  carbs_g: z.number().describe('The amount of carbohydrates in grams.'),
  fats_g: z.number().describe('The amount of fats in grams.'),
  guna: z.enum(['Sattvic', 'Rajasic', 'Tamasic']).describe('The Vedic Guna classification of the food.'),
  vedic_tip: z.string().describe('A short spiritual or dietary insight based on the guna.'),
});
export type CalculateNutritionalInformationOutput = z.infer<typeof CalculateNutritionalInformationOutputSchema>;

export async function calculateNutritionalInformation(
  input: CalculateNutritionalInformationInput
): Promise<CalculateNutritionalInformationOutput> {
  return calculateNutritionalInformationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'calculateNutritionalInformationPrompt',
  input: {schema: CalculateNutritionalInformationInputSchema},
  output: {schema: CalculateNutritionalInformationOutputSchema},
  prompt: `Act as a Vedic Nutritionist and certified dietician. Analyze the food in this image and respond ONLY in valid JSON.\n      Return:\n      - food_name (string)\n      - calories (number, kcal)\n      - protein_g (number)\n      - carbs_g (number)\n      - fats_g (number)\n      - guna (one of: Sattvic, Rajasic, Tamasic)\n      - vedic_tip (short spiritual or dietary insight based on the guna)\n      Be realistic with Indian food portions. No markdown. No extra commentary.\n      Photo: {{media url=foodImageUri}}`,
});

const calculateNutritionalInformationFlow = ai.defineFlow(
  {
    name: 'calculateNutritionalInformationFlow',
    inputSchema: CalculateNutritionalInformationInputSchema,
    outputSchema: CalculateNutritionalInformationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
