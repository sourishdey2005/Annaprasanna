'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Waves, Plus, Minus, Droplets, Info } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function VedicWaterRitual() {
    const [glasses, setGlasses] = useState(0);
    const goal = 8;
    const percentage = Math.min((glasses / goal) * 100, 100);

    const rituals = [
        "Drink water sitting down to aid digestion.",
        "Sip water slowly, mixing it with saliva.",
        "Prefer lukewarm water to maintain Agni (digestive fire).",
        "Avoid drinking large amounts 30 mins before or after meals.",
        "Keep water in a copper vessel overnight for vitality."
    ];

    return (
        <Card className="rounded-[2.5rem] border-primary/20 shadow-2xl bg-gradient-to-br from-blue-50/50 to-background overflow-hidden h-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
                            <Waves className="h-6 w-6" />
                        </div>
                        <div>
                            <CardTitle className="font-headline text-2xl">Jala Ritual</CardTitle>
                            <CardDescription>Mindful Hydration Tracking</CardDescription>
                        </div>
                    </div>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                                    <Info className="h-4 w-4 opacity-40" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs p-4 rounded-2xl">
                                <p className="text-xs font-bold uppercase tracking-wider mb-2 opacity-60">Ayurvedic Wisdom</p>
                                <p className="text-sm">Water should be consumed in small sips throughout the day, rather than in large gulps.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </CardHeader>
            <CardContent className="space-y-8">
                <div className="text-center space-y-2">
                    <div className="text-6xl font-black font-headline text-blue-600 transition-all duration-500 scale-110">
                        {glasses} <span className="text-2xl text-muted-foreground font-medium">/ {goal}</span>
                    </div>
                    <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground opacity-60">Glasses of Prana</p>
                </div>

                <div className="space-y-4">
                    <Progress value={percentage} className="h-4 rounded-full bg-blue-100" />
                    <div className="flex justify-center gap-4">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-14 w-14 rounded-2xl border-2 hover:bg-blue-50 transition-all"
                            onClick={() => setGlasses(Math.max(0, glasses - 1))}
                        >
                            <Minus className="h-6 w-6" />
                        </Button>
                        <Button
                            size="icon"
                            className="h-14 w-14 rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all scale-110 active:scale-95"
                            onClick={() => setGlasses(glasses + 1)}
                        >
                            <Plus className="h-6 w-6" />
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-5 gap-2 pt-4">
                    {Array.from({ length: goal }).map((_, i) => (
                        <div
                            key={i}
                            className={`h-12 rounded-xl flex items-center justify-center transition-all duration-700 ${i < glasses ? 'bg-blue-600 text-white scale-100 opacity-100 rotate-0' : 'bg-blue-50 text-blue-200 scale-90 opacity-50 rotate-12'}`}
                        >
                            <Droplets className="h-5 w-5" />
                        </div>
                    ))}
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 italic text-xs text-blue-800 text-center">
                    "{rituals[glasses % rituals.length]}"
                </div>
            </CardContent>
        </Card>
    );
}
