'use client';

import Image from 'next/image';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Meal } from '@/lib/types';
import { Landmark, Home, UtensilsCrossed, Clock, Leaf, Sparkles, Flame, Droplets, Wind, CookingPot, ScanEye, Snowflake, Scale } from 'lucide-react';

interface MealCardProps {
  meal: Meal;
  defaultOpen?: boolean;
}

const GUNA_COLORS = {
  Sattvic: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800',
  Rajasic: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/50 dark:text-orange-300 dark:border-orange-800',
  Tamasic: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700',
};

const MEAL_CONTEXT_ICONS = {
  'Prasadam': <Landmark className="h-4 w-4" />,
  'Home-cooked': <Home className="h-4 w-4" />,
  'Outside': <UtensilsCrossed className="h-4 w-4" />,
}

function Stat({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <div className="flex flex-col items-center rounded-lg bg-accent p-3 text-center">
      <span className="text-xs text-accent-foreground/80">{label}</span>
      <span className="text-lg font-bold text-accent-foreground">{Math.round(value)}</span>
      <span className="text-xs text-accent-foreground/60">{unit}</span>
    </div>
  );
}

function WisdomPill({ icon, title, text }: { icon: React.ReactNode, title: string, text: string | undefined | null }) {
    if (!text) return null;
    return (
        <div className="flex items-start gap-4 rounded-lg border bg-background p-4">
            <div className="text-primary">{icon}</div>
            <div>
                <p className="font-semibold">{title}</p>
                <p className="text-sm text-muted-foreground italic">"{text}"</p>
            </div>
        </div>
    );
}

const COOKING_METHOD_ICONS = {
    Fried: <Flame className="h-4 w-4" />,
    Steamed: <Droplets className="h-4 w-4" />,
    Roasted: <Wind className="h-4 w-4" />,
    Raw: <Leaf className="h-4 w-4" />,
    Other: <CookingPot className="h-4 w-4" />
}

export function MealCard({ meal, defaultOpen = false }: MealCardProps) {
  const gunaColor = GUNA_COLORS[meal.guna] || GUNA_COLORS.Tamasic;
  
  return (
    <Card className="overflow-hidden bg-secondary/50">
      <Accordion type="single" collapsible defaultValue={defaultOpen ? 'item-1' : ''}>
        <AccordionItem value="item-1" className="border-b-0">
          <AccordionTrigger className="p-4 hover:no-underline">
            <div className="flex w-full items-center gap-4">
              {meal.imageUrl && (
                <Image
                  src={meal.imageUrl}
                  alt={meal.food_name}
                  width={64}
                  height={64}
                  className="rounded-lg object-cover aspect-square"
                />
              )}
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                    {meal.meal_context && MEAL_CONTEXT_ICONS[meal.meal_context]}
                    <h3 className="font-semibold text-lg">{meal.food_name}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{meal.calories} kcal</p>
              </div>
              <Badge variant="outline" className={`ml-auto mr-4 ${gunaColor}`}>{meal.guna}</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-4 pt-0">
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-2 md:gap-4">
                <Stat label="Calories" value={meal.calories} unit="kcal" />
                <Stat label="Protein" value={meal.protein_g} unit="grams" />
                <Stat label="Carbs" value={meal.carbs_g} unit="grams" />
                <Stat label="Fats" value={meal.fats_g} unit="grams" />
              </div>
               <div className="space-y-2">
                <WisdomPill icon={<Sparkles />} title="Vedic Tip" text={meal.vedic_tip} />
                <WisdomPill icon={<Leaf />} title="Dosha Suggestion" text={meal.dosha_suggestion} />
                <WisdomPill icon={<Clock />} title="Time Wisdom" text={meal.time_of_day_wisdom} />
                <WisdomPill icon={<ScanEye />} title="Ingredient Breakdown" text={meal.ingredient_breakdown} />
                <WisdomPill icon={<Scale />} title="Portion Awareness" text={meal.portion_awareness} />
                <WisdomPill icon={<Snowflake />} title="Seasonal Awareness" text={meal.seasonal_awareness} />
                {meal.cooking_method && (
                  <WisdomPill 
                    icon={COOKING_METHOD_ICONS[meal.cooking_method] || <CookingPot className="h-4 w-4" />} 
                    title={`${meal.cooking_method} Method Insight`}
                    text={meal.cooking_method_insight} 
                  />
                )}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
