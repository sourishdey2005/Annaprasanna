'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { generateWeeklyReport } from '@/ai/flows/generate-weekly-report';
import type { Meal } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { getWeeklyReportData } from '@/lib/reports';

interface WeeklyAharaReportProps {
    weeklyMeals: Meal[];
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

export default function WeeklyAharaReport({ weeklyMeals }: WeeklyAharaReportProps) {
    const [report, setReport] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchReport = async () => {
            setIsLoading(true);
            try {
                const reportData = getWeeklyReportData(weeklyMeals);
                const result = await generateWeeklyReport({ data: reportData });
                setReport(result.report);
            } catch (error) {
                console.error("Failed to generate weekly report:", error);
                setReport("Could not generate the weekly report. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        if (weeklyMeals.length > 0) {
            fetchReport();
        } else {
             setIsLoading(false);
             setReport(null);
        }
    }, [weeklyMeals]);

    if (isLoading) {
        return <ReportLoader />;
    }

    if (!report) {
        return null;
    }

    return (
        <Card className="bg-accent border-accent-foreground/20">
            <CardContent className="p-6">
                <p className="text-accent-foreground italic">"{report}"</p>
            </CardContent>
        </Card>
    );
}
