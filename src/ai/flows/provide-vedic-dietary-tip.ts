'use server';
/**
 * @fileOverview A Genkit flow that provides a short spiritual or dietary insight based on the Guna classification of a food item.
 *
 * - provideVedicDietaryTip - A function that generates a Vedic dietary tip based on the provided Guna.
 * - ProvideVedicDietaryTipInput - The input type for the provideVedicDietaryTip function.
 * - ProvideVedicDietaryTipOutput - The return type for the provideVedicDietaryTip function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvideVedicDietaryTipInputSchema = z.object({
  guna: z.enum(['Sattvic', 'Rajasic', 'Tamasic']).describe('The Guna classification of the food item.'),
});
export type ProvideVedicDietaryTipInput = z.infer<typeof ProvideVedicDietaryTipInputSchema>;

const ProvideVedicDietaryTipOutputSchema = z.object({
  vedicTip: z.string().describe('A short spiritual or dietary insight based on the Guna.'),
});
export type ProvideVedicDietaryTipOutput = z.infer<typeof ProvideVedicDietaryTipOutputSchema>;

export async function provideVedicDietaryTip(input: ProvideVedicDietaryTipInput): Promise<ProvideVedicDietaryTipOutput> {
  return provideVedicDietaryTipFlow(input);
}

const prompt = ai.definePrompt({
  name: 'provideVedicDietaryTipPrompt',
  input: {schema: ProvideVedicDietaryTipInputSchema},
  output: {schema: ProvideVedicDietaryTipOutputSchema},
  prompt: `You are a Vedic nutritionist providing spiritual and dietary insights based on the Guna classification of food.

  Given the Guna classification: {{{guna}}}, provide a short (under 30 words) spiritual or dietary insight.
  The tip should be directly related to the provided Guna.
  Do not include any introductory or concluding remarks, just provide the insight. Do not mention the name of the guna in the response.
  Be direct and concise.
  `,
});

const provideVedicDietaryTipFlow = ai.defineFlow(
  {
    name: 'provideVedicDietaryTipFlow',
    inputSchema: ProvideVedicDietaryTipInputSchema,
    outputSchema: ProvideVedicDietaryTipOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
