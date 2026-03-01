'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CheckFoodCompatibilityInputSchema = z.object({
    foods: z.array(z.string()).describe("A list of food items to check for compatibility."),
});

const CheckFoodCompatibilityOutputSchema = z.object({
    is_compatible: z.boolean().describe("Whether the food combination is considered compatible in Ayurveda."),
    reasoning: z.string().describe("The explanation for the compatibility or incompatibility based on Vedic principles (Viruddha Ahara)."),
    suggestion: z.string().optional().describe("A better alternative or way to consume these foods."),
});

export const checkFoodCompatibility = ai.defineFlow(
    {
        name: 'checkFoodCompatibility',
        inputSchema: CheckFoodCompatibilityInputSchema,
        outputSchema: CheckFoodCompatibilityOutputSchema,
    },
    async input => {
        if (process.env.GOOGLE_GENAI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
            throw new Error('API Key Missing: Please replace "YOUR_GEMINI_API_KEY_HERE" in your .env file with a real key from Google AI Studio.');
        }

        const { output } = await ai.generate({
            prompt: `Act as a master Ayurvedic practitioner. Analyze the compatibility of the following foods according to the principles of "Viruddha Ahara" (incompatible foods).
      
      Foods: ${input.foods.join(', ')}
      
      Return a JSON object with:
      - is_compatible: boolean
      - reasoning: concise explanation of Guna, Virya, and Vipaka interactions.
      - suggestion: optional, how to fix the meal or what to pair instead.
      
      Common incompatibilities to look for: 
      - Milk and fish
      - Milk and sour fruits
      - Honey and ghee in equal proportions
      - Hot and cold foods together.`,
            output: { schema: CheckFoodCompatibilityOutputSchema },
        });

        if (!output) throw new Error('Failed to analyze food compatibility');
        return output;
    }
);
