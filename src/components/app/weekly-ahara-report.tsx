'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { generateWeeklyReport } from '@/ai/flows/generate-weekly-report';
import type { WeeklyReportData } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

interface WeeklyAharaReportProps {
    weeklyReportData: WeeklyReportData;
}

function ReportLoader() {
    return (
        <div className="space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
        </div>
    )
}

export default function WeeklyAharaReport({ weeklyReportData }: WeeklyAharaReportProps) {
    const [report, setReport] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchReport = async () => {
            if (!weeklyReportData || weeklyReportData.totalMeals === 0) {
                 setIsLoading(false);
                 setReport(null);
                return;
            }
            setIsLoading(true);
            try {
                const result = await generateWeeklyReport({ data: weeklyReportData });
                setReport(result.report);
            } catch (error) {
                console.error("Failed to generate weekly report:", error);
                setReport("Could not generate the weekly report. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchReport();
    }, [weeklyReportData]);

    if (isLoading) {
        return <ReportLoader />;
    }

    return (
        <div className="space-y-4">
            {report && (
                 <Card className="bg-accent border-accent-foreground/20">
                    <CardContent className="p-6">
                        <p className="text-accent-foreground italic">"{report}"</p>
                    </CardContent>
                </Card>
            )}
            <div className="text-sm text-muted-foreground grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-background p-2 rounded-lg">
                    <p className="font-bold text-lg">{weeklyReportData.totalMeals}</p>
                    <p>Total Meals</p>
                </div>
                 <div className="bg-background p-2 rounded-lg">
                    <p className="font-bold text-lg">{weeklyReportData.lateNightMeals}</p>
                    <p>Late Meals</p>
                </div>
                 <div className="bg-background p-2 rounded-lg">
                    <p className="font-bold text-lg">{weeklyReportData.outsideMeals}</p>
                    <p>Outside Meals</p>
                </div>
                 <div className="bg-background p-2 rounded-lg">
                    <p className="font-bold text-lg">{weeklyReportData.largePortions}</p>
                    <p>Large Portions</p>
                </div>
            </div>
        </div>
    );
}
