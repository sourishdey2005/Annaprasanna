'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import type { Sankalpa, WeeklyReportData } from "@/lib/types";

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

export default function SankalpaGoals({ currentSankalpa, setSankalpa, weeklyReportData }: SankalpaGoalsProps) {
    const activeSankalpa = SANKALPA_CONFIG[currentSankalpa];
    const progressValue = activeSankalpa.progress(weeklyReportData);

    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="font-headline text-3xl text-center">Sankalpa (Your Intention)</CardTitle>
                <CardDescription className="text-center">Set a mindful eating goal for the week. Your progress is based on this week's meals.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <RadioGroup
                    value={currentSankalpa}
                    onValueChange={(value: Sankalpa) => setSankalpa(value)}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                >
                    {Object.entries(SANKALPA_CONFIG).map(([key, value]) => (
                        <Label
                            key={key}
                            htmlFor={key}
                            className={`flex flex-col items-center justify-center rounded-lg border-2 bg-popover p-4 cursor-pointer hover:bg-accent hover:text-accent-foreground ${currentSankalpa === key ? 'border-primary' : 'border-muted'}`}
                        >
                            <RadioGroupItem value={key} id={key} className="sr-only" />
                            <span className="font-semibold text-center">{value.title}</span>
                            <span className="text-xs text-center text-muted-foreground mt-1">{value.description}</span>
                        </Label>
                    ))}
                </RadioGroup>
                
                <div className="pt-4">
                   <h4 className="text-lg font-semibold text-center">{activeSankalpa.title} Progress</h4>
                   <div className="flex items-center gap-4 mt-2">
                       <Progress value={progressValue} className="h-4"/>
                       <span className="text-xl font-bold">{Math.round(progressValue)}%</span>
                   </div>
                   <p className="text-center text-muted-foreground text-sm mt-2">{activeSankalpa.progressLabel(weeklyReportData)}</p>
                </div>

            </CardContent>
        </Card>
    );
}
