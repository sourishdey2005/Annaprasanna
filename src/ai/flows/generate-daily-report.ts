'use server';
/**
 * @fileOverview Generates a narrative daily report based on meal data.
 *
 * - generateDailyReport - A function that generates the report.
 * - GenerateDailyReportInput - The input type for the function.
 * - GenerateDailyReportOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateDailyReportInputSchema = z.object({
  mealCount: z.number().describe('Total number of meals.'),
  sattvicCount: z.number().describe('Number of sattvic meals.'),
  rajasicCount: z.number().describe('Number of rajasic meals.'),
  tamasicCount: z.number().describe('Number of tamasic meals.'),
  lateNightMeals: z.number().describe('Number of meals eaten late at night.'),
  calories: z.number().describe('Total calories for the day.'),
});
export type GenerateDailyReportInput = z.infer<typeof GenerateDailyReportInputSchema>;

const GenerateDailyReportOutputSchema = z.object({
  report: z.string().describe("A 1-2 sentence narrative summary of the day's eating habits, acting as a 'mindful score'."),
});
export type GenerateDailyReportOutput = z.infer<typeof GenerateDailyReportOutputSchema>;

export async function generateDailyReport(input: GenerateDailyReportInput): Promise<GenerateDailyReportOutput> {
  return generateDailyReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDailyReportPrompt',
  input: { schema: GenerateDailyReportInputSchema },
  output: { schema: GenerateDailyReportOutputSchema },
  prompt: `You are a wise and compassionate Vedic nutritional guide. 
  Analyze the following daily meal data and provide a short, encouraging, 1-2 sentence narrative summary that acts as a 'mindful score'.
  Focus on the most significant pattern of the day. For example, if Guna balance was good, mention it. If late-night eating occurred, gently point it out.
  Do not use markdown or JSON. Respond with only the narrative text.

  Data:
  - Total Meals: {{{mealCount}}}
  - Sattvic Meals: {{{sattvicCount}}}
  - Rajasic Meals: {{{rajasicCount}}}
  - Tamasic Meals: {{{tamasicCount}}}
  - Late-Night Meals: {{{lateNightMeals}}}
  - Total Calories: {{{calories}}}
  `,
});

const generateDailyReportFlow = ai.defineFlow(
  {
    name: 'generateDailyReportFlow',
    inputSchema: GenerateDailyReportInputSchema,
    outputSchema: GenerateDailyReportOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
