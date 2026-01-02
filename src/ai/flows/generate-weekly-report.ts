'use server';
/**
 * @fileOverview Generates a narrative weekly report based on meal data.
 *
 * - generateWeeklyReport - A function that generates the report.
 * - GenerateWeeklyReportInput - The input type for the function.
 * - GenerateWeeklyReportOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { WeeklyReportData } from '@/lib/types';

const GenerateWeeklyReportInputSchema = z.object({
  data: z.object({
    totalMeals: z.number(),
    sattvicCount: z.number(),
    rajasicCount: z.number(),
    tamasicCount: z.number(),
    lateNightMeals: z.number(),
    outsideMeals: z.number(),
    proteinIntakeTrend: z.enum(['increasing', 'decreasing', 'stable']),
  }),
});
export type GenerateWeeklyReportInput = z.infer<typeof GenerateWeeklyReportInputSchema>;

const GenerateWeeklyReportOutputSchema = z.object({
  report: z.string().describe("A 1-2 sentence narrative summary of the week's eating habits."),
});
export type GenerateWeeklyReportOutput = z.infer<typeof GenerateWeeklyReportOutputSchema>;

export async function generateWeeklyReport(input: GenerateWeeklyReportInput): Promise<GenerateWeeklyReportOutput> {
  return generateWeeklyReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWeeklyReportPrompt',
  input: { schema: GenerateWeeklyReportInputSchema },
  output: { schema: GenerateWeeklyReportOutputSchema },
  prompt: `You are a wise and compassionate Vedic nutritional guide. 
  Analyze the following weekly meal data and provide a short, encouraging, 1-2 sentence narrative summary.
  Focus on the most significant pattern. For example, if Rajasic meals are high because of outside eating, connect them.
  If protein is increasing, mention it positively. If late-night eating is a habit, gently point it out.
  Do not use markdown or JSON. Respond with only the narrative text.

  Data:
  - Total Meals: {{{data.totalMeals}}}
  - Sattvic Meals: {{{data.sattvicCount}}}
  - Rajasic Meals: {{{data.rajasicCount}}}
  - Tamasic Meals: {{{data.tamasicCount}}}
  - Late-Night Meals: {{{data.lateNightMeals}}}
  - Outside Meals: {{{data.outsideMeals}}}
  - Protein Trend: {{{data.proteinIntakeTrend}}}
  `,
});

const generateWeeklyReportFlow = ai.defineFlow(
  {
    name: 'generateWeeklyReportFlow',
    inputSchema: GenerateWeeklyReportInputSchema,
    outputSchema: GenerateWeeklyReportOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
