'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Timer, StopCircle, PlayCircle, RotateCcw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function TapasFastingTimer() {
    const [isActive, setIsActive] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const [goalSeconds, setGoalSeconds] = useState(16 * 3600); // Default 16 hours

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isActive) {
            interval = setInterval(() => {
                setSeconds((s) => s + 1);
            }, 1000);
        } else if (!isActive && seconds !== 0) {
            if (interval) clearInterval(interval);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, seconds]);

    const formatTime = (totalSeconds: number) => {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const progress = Math.min((seconds / goalSeconds) * 100, 100);

    return (
        <Card className="rounded-[2.5rem] border-primary/20 shadow-2xl bg-gradient-to-br from-orange-50/50 to-background overflow-hidden h-full">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600">
                        <Zap className="h-6 w-6" />
                    </div>
                    <div>
                        <CardTitle className="font-headline text-2xl">Tapas Timer</CardTitle>
                        <CardDescription>Intermittent Fasting & Restraint</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-10">
                <div className="text-center space-y-4">
                    <div className="text-6xl font-black font-headline tracking-tighter text-orange-600 transition-all">
                        {formatTime(seconds)}
                    </div>
                    <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground opacity-60">Hours of Purification</p>
                </div>

                <div className="space-y-4">
                    <Progress value={progress} className="h-4 rounded-full bg-orange-100" />
                    <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">
                        <span>Start</span>
                        <span>Goal: {goalSeconds / 3600}h</span>
                    </div>
                </div>

                <div className="flex justify-center gap-4">
                    {!isActive ? (
                        <Button
                            size="lg"
                            className="h-16 flex-1 rounded-2xl bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-200 gap-2 text-lg font-bold transition-all active:scale-95"
                            onClick={() => setIsActive(true)}
                        >
                            <PlayCircle className="h-6 w-6" /> Start Tapas
                        </Button>
                    ) : (
                        <Button
                            size="lg"
                            variant="outline"
                            className="h-16 flex-1 rounded-2xl border-2 border-orange-200 hover:bg-orange-50 text-orange-600 gap-2 text-lg font-bold transition-all active:scale-95"
                            onClick={() => setIsActive(false)}
                        >
                            <StopCircle className="h-6 w-6" /> Pause
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-16 w-16 rounded-2xl bg-accent/20 hover:bg-accent transition-all hover:text-destructive"
                        onClick={() => {
                            setIsActive(false);
                            setSeconds(0);
                        }}
                    >
                        <RotateCcw className="h-6 w-6" />
                    </Button>
                </div>

                <div className="flex gap-4 p-4 rounded-3xl bg-secondary/20 shadow-inner border border-white items-center">
                    <Timer className="h-8 w-8 text-muted-foreground opacity-40 ml-2" />
                    <div className="flex-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Next Goal</span>
                        <div className="flex gap-2 mt-1">
                            {[12, 16, 20, 24].map((h) => (
                                <button
                                    key={h}
                                    onClick={() => setGoalSeconds(h * 3600)}
                                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${goalSeconds / 3600 === h ? 'bg-orange-600 text-white shadow-md' : 'bg-background hover:bg-orange-50'}`}
                                >
                                    {h}h
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
