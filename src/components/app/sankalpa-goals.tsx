'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import type { Sankalpa, WeeklyReportData } from "@/lib/types";
import { Sparkles } from "lucide-react";

interface SankalpaGoalsProps {
    currentSankalpa: Sankalpa;
    setSankalpa: (sankalpa: Sankalpa) => void;
    weeklyReportData: WeeklyReportData;
}

const SANKALPA_CONFIG = {
    'increase-sattvic': {
        title: 'Increase Sattvic Meals',
        description: 'Cultivate clarity and peace by favoring fresh, pure, and calming foods.',
        progress: (data: WeeklyReportData) => {
            const totalGunas = data.sattvicCount + data.rajasicCount + data.tamasicCount;
            return totalGunas > 0 ? (data.sattvicCount / totalGunas) * 100 : 0;
        },
        progressLabel: (data: WeeklyReportData) => `${data.sattvicCount} of ${data.totalMeals} meals were Sattvic this week.`,
    },
    'reduce-rajasic': {
        title: 'Reduce Rajasic Meals',
        description: 'Find balance by reducing stimulating, spicy, and overly flavorful foods.',
        progress: (data: WeeklyReportData) => {
            const totalGunas = data.sattvicCount + data.rajasicCount + data.tamasicCount;
            return totalGunas > 0 ? 100 - (data.rajasicCount / totalGunas) * 100 : 100;
        },
        progressLabel: (data: WeeklyReportData) => `${data.rajasicCount} of ${data.totalMeals} meals were Rajasic this week.`,
    },
    'reduce-tamasic': {
        title: 'Reduce Tamasic Meals',
        description: 'Enhance energy by avoiding heavy, processed, and leftover foods.',
        progress: (data: WeeklyReportData) => {
            const totalGunas = data.sattvicCount + data.rajasicCount + data.tamasicCount;
            return totalGunas > 0 ? 100 - (data.tamasicCount / totalGunas) * 100 : 100;
        },
        progressLabel: (data: WeeklyReportData) => `${data.tamasicCount} of ${data.totalMeals} meals were Tamasic this week.`,
    },
    'reduce-late-eating': {
        title: 'Reduce Late-Night Eating',
        description: 'Improve digestion and sleep by eating your last meal before sunset.',
        progress: (data: WeeklyReportData) => {
            return data.totalMeals > 0 ? 100 - (data.lateNightMeals / data.totalMeals) * 100 : 100;
        },
        progressLabel: (data: WeeklyReportData) => `You had ${data.lateNightMeals} late meals this week.`,
    },
};

export default function SankalpaGoals({ currentSankalpa, setSankalpa, weeklyReportData }: { readonly currentSankalpa: Sankalpa; readonly setSankalpa: (sankalpa: Sankalpa) => void; readonly weeklyReportData: WeeklyReportData }) {
    const activeSankalpa = SANKALPA_CONFIG[currentSankalpa];
    const progressValue = activeSankalpa.progress(weeklyReportData);

    return (
        <Card className="shadow-2xl border-primary/10 overflow-hidden bg-gradient-to-br from-background to-accent/20">
            <CardHeader className="pb-2">
                <CardTitle className="font-headline text-3xl text-center flex items-center justify-center gap-3">
                    <Sparkles className="h-6 w-6 text-primary animate-pulse" />
                    Sankalpa (Weekly Intention)
                </CardTitle>
                <CardDescription className="text-center text-base max-w-lg mx-auto">
                    A sacred vow to yourself. Set a mindful intention to align your eating habits with your higher self.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 pt-6">
                <RadioGroup
                    value={currentSankalpa}
                    onValueChange={(value: Sankalpa) => setSankalpa(value)}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                >
                    {Object.entries(SANKALPA_CONFIG).map(([key, value]) => (
                        <Label
                            key={key}
                            htmlFor={key}
                            className={`group relative flex flex-col items-start p-5 rounded-[1.5rem] border-2 bg-background/50 backdrop-blur-sm cursor-pointer transition-all duration-300 hover:border-primary/50 hover:shadow-lg ${currentSankalpa === key ? 'border-primary ring-2 ring-primary/20 bg-background shadow-xl scale-105 z-10' : 'border-muted'}`}
                        >
                            <RadioGroupItem value={key} id={key} className="sr-only" />
                            <div className="flex items-center gap-2 mb-2">
                                {currentSankalpa === key && <div className="h-2 w-2 rounded-full bg-primary animate-ping" />}
                                <span className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{value.title}</span>
                            </div>
                            <span className="text-xs text-muted-foreground leading-relaxed italic">{value.description}</span>
                        </Label>
                    ))}
                </RadioGroup>

                <div className="relative p-8 rounded-[2.5rem] bg-background shadow-inner border border-primary/5 overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Sparkles className="h-24 w-24 text-primary" />
                    </div>

                    <div className="relative z-10 flex flex-col items-center gap-6">
                        <div className="text-center">
                            <h4 className="text-xl font-headline font-bold mb-1">Your Manifestation Progress</h4>
                            <p className="text-muted-foreground text-sm">{activeSankalpa.progressLabel(weeklyReportData)}</p>
                        </div>

                        <div className="w-full max-w-xl flex items-center gap-6">
                            <div className="flex-1 space-y-2">
                                <Progress value={progressValue} className="h-4 rounded-full bg-accent" />
                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter text-muted-foreground/50">
                                    <span>Beginning</span>
                                    <span>Manifesting</span>
                                    <span>Mastery</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-4xl font-headline font-black text-primary">{Math.round(progressValue)}%</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-50">Siddhi</span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
