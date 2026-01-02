import { config } from 'dotenv';
config();

import '@/ai/flows/classify-food-by-vedic-guna.ts';
import '@/ai/flows/identify-food-from-image.ts';
import '@/ai/flows/calculate-nutritional-information.ts';
import '@/ai/flows/provide-vedic-dietary-tip.ts';
import '@/ai/flows/generate-weekly-report.ts';
import '@/ai/flows/generate-daily-report.ts';
