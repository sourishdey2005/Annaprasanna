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


export async function identifyFoodFromImage(input: IdentifyFoodFromImageInput): Promise<IdentifyFoodFromImageOutput> {
  return identifyFoodFromImageFlow(input);
}

const identifyFoodFromImagePrompt = ai.definePrompt({
  name: 'identifyFoodFromImagePrompt',
  input: {schema: z.object({imageUri: z.string(), dosha: z.string()})},
  output: {schema: IdentifyFoodFromImageOutputSchema},
  prompt: `Act as a Vedic Nutritionist and certified dietician.\nAnalyze the food in this image and respond ONLY in valid JSON.\n\nReturn:\n- food_name (string)\n- calories (number, kcal)\n- protein_g (number)\n- carbs_g (number)\n- fats_g (number)\n- guna (one of: Sattvic, Rajasic, Tamasic)\n- vedic_tip (short spiritual or dietary insight based on the guna)\n- dosha_suggestion (optional, gentle suggestion for the user's dosha: {{{dosha}}})\n\nBe realistic with Indian food portions.\nNo markdown. No extra commentary.\n\nImage: {{media url=imageUri}}`,
});

const identifyFoodFromImageFlow = ai.defineFlow(
  {
    name: 'identifyFoodFromImageFlow',
    inputSchema: IdentifyFoodFromImageInputSchema,
    outputSchema: IdentifyFoodFromImageOutputSchema,
  },
  async input => {
    const {output} = await identifyFoodFromImagePrompt({imageUri: input.imageUri, dosha: input.dosha});
    if (!output) {
      throw new Error('Failed to get analysis from AI');
    }
    
    output.time_of_day_wisdom = getTimeOfDayWisdom(input.timestamp);
    
    return output;
  }
);
