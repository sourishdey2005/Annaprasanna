'use server';
/**
 * @fileOverview This file defines a Genkit flow for identifying food items from an image.
 *
 * The flow takes an image as input (data URI) and returns a JSON object containing
 * the identified food name, nutritional information (calories, protein, carbs, fats),
 * Vedic Guna classification (Sattvic, Rajasic, Tamasic), and a Vedic tip.
 *
 * @exports {identifyFoodFromImage} - The main function to trigger the flow.
 * @exports {IdentifyFoodFromImageInput} - The input type for the flow.
 * @exports {IdentifyFoodFromImageOutput} - The output type for the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyFoodFromImageInputSchema = z.object({
  imageUri: z
    .string()
    .describe(
      "A photo of a meal, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  dosha: z.enum(['Vata', 'Pitta', 'Kapha', 'Tridoshic']).describe("The user's Prakriti (dosha)."),
  timestamp: z.number().describe('The timestamp of when the meal is being eaten.'),
});
export type IdentifyFoodFromImageInput = z.infer<typeof IdentifyFoodFromImageInputSchema>;

const IdentifyFoodFromImageOutputSchema = z.object({
  food_name: z.string().describe('The name of the identified food.'),
  calories: z.number().describe('The number of calories in the food (kcal).'),
  protein_g: z.number().describe('The amount of protein in the food (grams).'),
  carbs_g: z.number().describe('The amount of carbohydrates in the food (grams).'),
  fats_g: z.number().describe('The amount of fat in the food (grams).'),
  guna: z.enum(['Sattvic', 'Rajasic', 'Tamasic']).describe('The Vedic Guna classification of the food.'),
  vedic_tip: z.string().describe('A short spiritual or dietary insight based on the Guna.'),
  dosha_suggestion: z.string().optional().describe('A gentle suggestion based on the food and the user\'s dosha. Only provide if there is a relevant suggestion.'),
  time_of_day_wisdom: z.string().optional().describe('A piece of vedic wisdom based on the time of day. Only provide if there is relevant wisdom (e.g., eating late at night).'),
  ingredient_breakdown: z.string().optional().describe('A breakdown of the major ingredients and which contributes most to the calories.'),
  portion_awareness: z.string().optional().describe('A warning if the portion size seems larger than a traditional serving. Frame it constructively.'),
  seasonal_awareness: z.string().optional().describe('A gentle warning if the food is out of season or has qualities (heating/cooling) that conflict with the current season.'),
  cooking_method: z.enum(['Fried', 'Steamed', 'Roasted', 'Raw', 'Other']).optional().describe('The primary cooking method detected.'),
  cooking_method_insight: z.string().optional().describe('An explanation of how the cooking method influences the food\'s Guna.'),
});

export type IdentifyFoodFromImageOutput = z.infer<typeof IdentifyFoodFromImageOutputSchema>;

function getTimeOfDayWisdom(timestamp: number) {
    const hour = new Date(timestamp).getHours();
    if (hour >= 21 || hour < 4) { // 9 PM to 4 AM
        return 'Eating heavy foods late at night can increase Tamasic energy and disrupt sleep cycles, making it harder for the body to rest and repair.';
    }
    if (hour >= 10 && hour <= 14) { // 10 AM to 2 PM
        return 'This is the time of Pitta dominance when digestive fire (Agni) is strongest. It is the best time to eat your largest meal of the day.';
    }
    return undefined;
}

function getCurrentSeason(timestamp: number): string {
    const month = new Date(timestamp).getMonth() + 1; // 1-12
    if (month >= 3 && month <= 5) return 'Spring';
    if (month >= 6 && month <= 8) return 'Summer';
    if (month >= 9 && month <= 11) return 'Autumn';
    return 'Winter';
}


export async function identifyFoodFromImage(input: IdentifyFoodFromImageInput): Promise<IdentifyFoodFromImageOutput> {
  return identifyFoodFromImageFlow(input);
}

const identifyFoodFromImagePrompt = ai.definePrompt({
  name: 'identifyFoodFromImagePrompt',
  input: {schema: z.object({imageUri: z.string(), dosha: z.string(), season: z.string()})},
  output: {schema: IdentifyFoodFromImageOutputSchema},
  prompt: `Act as a Vedic Nutritionist and certified dietician.\nAnalyze the food in this image and respond ONLY in valid JSON.\n\nThe user's dosha is {{{dosha}}} and the current season is {{{season}}}.

Return:
- food_name: string
- calories: number (kcal)
- protein_g: number
- carbs_g: number
- fats_g: number
- guna: 'Sattvic' | 'Rajasic' | 'Tamasic'
- vedic_tip: short spiritual or dietary insight based on the guna
- dosha_suggestion: optional, gentle suggestion for the user's dosha.
- ingredient_breakdown: optional, short analysis of major ingredients and which contributes most to calories.
- portion_awareness: optional, warning if the portion seems large, framed constructively.
- seasonal_awareness: optional, gentle warning if the food is out of season or conflicts with the current season's qualities (e.g., heating food in summer).
- cooking_method: 'Fried' | 'Steamed' | 'Roasted' | 'Raw' | 'Other'
- cooking_method_insight: optional, explanation of how the cooking method influences the food's Guna.

Be realistic with Indian food portions.
No markdown. No extra commentary.

Image: {{media url=imageUri}}`,
});

const identifyFoodFromImageFlow = ai.defineFlow(
  {
    name: 'identifyFoodFromImageFlow',
    inputSchema: IdentifyFoodFromImageInputSchema,
    outputSchema: IdentifyFoodFromImageOutputSchema,
  },
  async input => {
    const season = getCurrentSeason(input.timestamp);
    const {output} = await identifyFoodFromImagePrompt({imageUri: input.imageUri, dosha: input.dosha, season});
    if (!output) {
      throw new Error('Failed to get analysis from AI');
    }
    
    output.time_of_day_wisdom = getTimeOfDayWisdom(input.timestamp);
    
    return output;
  }
);
