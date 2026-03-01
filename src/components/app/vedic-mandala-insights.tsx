'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    BarChart3,
    Flame,
    Mountain,
    Waves,
    Wind,
    Sparkles,
    Zap,
    Activity,
    Target,
    Clock,
    UtensilsCrossed
} from 'lucide-react';

import type { Meal } from '@/lib/types';
import SattvicScoreGauge from './charts/sattvic-score-gauge';
import DoshaHarmonyPie from './charts/dosha-harmony-pie';
import MoodImpactBar from './charts/mood-impact-bar';
import CookingMethodDonut from './charts/cooking-method-donut';
import MealTimingRegularityArea from './charts/meal-timing-regularity-area';
import PranaRecoveryLine from './charts/prana-recovery-line';
import ProteinDensityScatter from './charts/protein-density-scatter';
import SankalpaCommitmentRadar from './charts/sankalpa-commitment-radar';
import MealContextStackedBar from './charts/meal-context-stacked-bar';
import WeeklyAgneyoFlowArea from './charts/weekly-agneyo-flow-area';

interface VedicMandalaInsightsProps {
    meals: Meal[];
    silentMode?: boolean;
}

export default function VedicMandalaInsights({ meals, silentMode }: VedicMandalaInsightsProps) {
    const insightsData = useMemo(() => {
        // 1. Sattvic Score
        const sattvicMeals = meals.filter(m => m.guna === 'Sattvic').length;
        const sattvicScore = meals.length > 0 ? Math.round((sattvicMeals / meals.length) * 100) : 0;

        // 2. Dosha Harmony (Mocked/Derived from Guna/Cooking)
        const vata = meals.filter(m => m.guna === 'Rajasic' || m.cooking_method === 'Raw').length;
        const pitta = meals.filter(m => m.guna === 'Rajasic' || m.cooking_method === 'Fried').length;
        const kapha = meals.filter(m => m.guna === 'Tamasic' || m.cooking_method === 'Steamed').length;
        const totalDosha = (vata + pitta + kapha) || 1;

        // 3. Mood Impact
        const moods = ['Peaceful', 'Energetic', 'Heavy', 'Anxious', 'Dull'];
        const moodImpact = moods.map(mood => ({
            mood,
            value: meals.filter(m => m.mood_after_meal === mood).length,
            color: mood === 'Peaceful' ? '#10b981' : mood === 'Energetic' ? '#3b82f6' : mood === 'Heavy' ? '#f59e0b' : mood === 'Anxious' ? '#ef4444' : '#6b7280'
        }));

        // 4. Cooking Method
        const methods = ['Steamed', 'Fried', 'Raw', 'Roasted', 'Other'];
        const cookingData = methods.map(m => ({
            name: m,
            value: meals.filter(meal => meal.cooking_method === m).length
        })).filter(o => o.value > 0);

        // 5. Meal Timing regularity (Mocked relative to morning/midday/evening)
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const timingData = days.map(d => ({
            day: d,
            score: Math.floor(Math.random() * 40) + 60 // Mocking consistency
        }));

        // 6. Prana Level
        const pranaData = meals.slice(-10).map((m, i) => ({
            time: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            prana: m.mood_after_meal === 'Peaceful' ? 90 : m.mood_after_meal === 'Energetic' ? 100 : m.mood_after_meal === 'Heavy' ? 40 : 60
        }));

        // 7. Protein Density
        const scatterData = meals.slice(-20).map(m => ({
            name: m.food_name,
            calories: m.calories,
            protein: m.protein_g,
            guna: m.guna
        }));

        // 8. Sankalpa Commitment
        const commitmentData = [
            { subject: 'Consistency', A: 85, fullMark: 100 },
            { subject: 'Early Dinner', A: 70, fullMark: 100 },
            { subject: 'Mindfulness', A: 95, fullMark: 100 },
            { subject: 'Purity', A: 90, fullMark: 100 },
            { subject: 'Chewing', A: 80, fullMark: 100 },
        ];

        // 9. Context
        const contextData = days.map(d => ({
            day: d,
            'Home-cooked': Math.floor(Math.random() * 3),
            'Prasadam': Math.floor(Math.random() * 2),
            'Outside': Math.floor(Math.random() * 1),
        }));

        // 10. Agneyo Flow
        const agniData = days.map(d => ({
            day: d,
            energy: Math.floor(Math.random() * 1000) + 1500
        }));

        return {
            sattvicScore,
            doshaHarmony: { vata, pitta, kapha },
            moodImpact,
            cookingData,
            timingData,
            pranaData,
            scatterData,
            commitmentData,
            contextData,
            agniData
        };
    }, [meals]);

    return (
        <div className="space-y-10 py-10">
            <div className="flex items-center gap-4 mb-2">
                <div className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                    <Sparkles className="h-6 w-6" />
                </div>
                <div>
                    <h2 className="text-4xl font-headline font-black">Mandala Insights</h2>
                    <p className="text-muted-foreground">Strategic Vedic analytics of your journey.</p>
                </div>
            </div>

            <Tabs defaultValue="harmony" className="w-full">
                <TabsList className="grid grid-cols-2 md:grid-cols-5 h-auto p-1 bg-accent/30 rounded-[2rem] gap-2 mb-10">
                    <TabsTrigger value="harmony" className="rounded-2xl py-3 data-[state=active]:bg-background data-[state=active]:shadow-lg"><Activity className="mr-2 h-4 w-4" /> Harmony</TabsTrigger>
                    <TabsTrigger value="patterns" className="rounded-2xl py-3 data-[state=active]:bg-background data-[state=active]:shadow-lg"><Clock className="mr-2 h-4 w-4" /> Patterns</TabsTrigger>
                    <TabsTrigger value="energy" className="rounded-2xl py-3 data-[state=active]:bg-background data-[state=active]:shadow-lg"><Zap className="mr-2 h-4 w-4" /> Energy</TabsTrigger>
                    <TabsTrigger value="purity" className="rounded-2xl py-3 data-[state=active]:bg-background data-[state=active]:shadow-lg"><Mountain className="mr-2 h-4 w-4" /> Purity</TabsTrigger>
                    <TabsTrigger value="tapas" className="rounded-2xl py-3 data-[state=active]:bg-background data-[state=active]:shadow-lg"><Target className="mr-2 h-4 w-4" /> Tapas</TabsTrigger>
                </TabsList>

                <TabsContent value="harmony" className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="rounded-[2.5rem] border-primary/10 shadow-xl overflow-hidden">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xl font-headline flex items-center gap-2"><Wind className="h-5 w-5 text-blue-500" /> Dosha Harmony</CardTitle>
                                <CardDescription>Composition of biological energies in your food.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <DoshaHarmonyPie data={insightsData.doshaHarmony} />
                                <div className="flex justify-between px-6 py-4 bg-accent/20 rounded-3xl mt-4">
                                    <div className="text-center">
                                        <span className="block h-2 w-2 rounded-full bg-blue-500 mx-auto mb-1"></span>
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground">Vata</p>
                                    </div>
                                    <div className="text-center">
                                        <span className="block h-2 w-2 rounded-full bg-red-500 mx-auto mb-1"></span>
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground">Pitta</p>
                                    </div>
                                    <div className="text-center">
                                        <span className="block h-2 w-2 rounded-full bg-green-500 mx-auto mb-1"></span>
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground">Kapha</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="rounded-[2.5rem] border-primary/10 shadow-xl overflow-hidden">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xl font-headline flex items-center gap-2"><UtensilsCrossed className="h-5 w-5 text-orange-500" /> Cooking Composition</CardTitle>
                                <CardDescription>How your food is prepared impacts its Guna.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <CookingMethodDonut data={insightsData.cookingData} />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="patterns" className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="rounded-[2.5rem] border-primary/10 shadow-xl overflow-hidden">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xl font-headline flex items-center gap-2"><Clock className="h-5 w-5 text-primary" /> Timing Consistency</CardTitle>
                                <CardDescription>Regularity of your Ahara windows (0-100%).</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <MealTimingRegularityArea data={insightsData.timingData} />
                            </CardContent>
                        </Card>

                        <Card className="rounded-[2.5rem] border-primary/10 shadow-xl overflow-hidden">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xl font-headline flex items-center gap-2"><Mountain className="h-5 w-5 text-green-500" /> Meal Context</CardTitle>
                                <CardDescription>Source of your meals (Prasadam vs Outside).</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <MealContextStackedBar data={insightsData.contextData} />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="energy" className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="rounded-[2.5rem] border-primary/10 shadow-xl overflow-hidden">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xl font-headline flex items-center gap-2"><Waves className="h-5 w-5 text-blue-400" /> Prana Recovery</CardTitle>
                                <CardDescription>Post-meal vitality levels recorded (0-100).</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <PranaRecoveryLine data={insightsData.pranaData} />
                            </CardContent>
                        </Card>

                        <Card className="rounded-[2.5rem] border-primary/10 shadow-xl overflow-hidden">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xl font-headline flex items-center gap-2"><Flame className="h-5 w-5 text-orange-500" /> Agneyo Energy Flow</CardTitle>
                                <CardDescription>Estimated metabolic combustion (kcal intensity).</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <WeeklyAgneyoFlowArea data={insightsData.agniData} />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="purity" className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="rounded-[2.5rem] border-primary/10 shadow-xl overflow-hidden">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xl font-headline flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /> Sattvic Score</CardTitle>
                                <CardDescription>Overall purity percentage of your logged Ahara.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <SattvicScoreGauge score={insightsData.sattvicScore} />
                            </CardContent>
                        </Card>

                        <Card className="rounded-[2.5rem] border-primary/10 shadow-xl overflow-hidden">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xl font-headline flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary" /> Mood Correlation</CardTitle>
                                <CardDescription>How your food choices impact your psychological state.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <MoodImpactBar data={insightsData.moodImpact} />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="tapas" className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="rounded-[2.5rem] border-primary/10 shadow-xl overflow-hidden">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xl font-headline flex items-center gap-2"><Target className="h-5 w-5 text-primary" /> Sankalpa Commitment</CardTitle>
                                <CardDescription>Adherence to your sacred dietary resolution.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <SankalpaCommitmentRadar data={insightsData.commitmentData} />
                            </CardContent>
                        </Card>

                        <Card className="rounded-[2.5rem] border-primary/10 shadow-xl overflow-hidden">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xl font-headline flex items-center gap-2"><Activity className="h-5 w-5 text-primary" /> Quality vs Density</CardTitle>
                                <CardDescription>Protein concentration mapped against caloric load.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ProteinDensityScatter data={insightsData.scatterData} />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
