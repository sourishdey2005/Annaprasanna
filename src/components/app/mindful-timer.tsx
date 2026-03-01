'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Play, Pause, RotateCcw, Timer, Music, Wind } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

export default function MindfulTimer() {
    const [timeLeft, setTimeLeft] = useState(1200); // 20 minutes default
    const [isActive, setIsActive] = useState(false);
    const [phase, setPhase] = useState<'Prarthana' | 'Ahara' | 'Vishrama'>('Prarthana');
    const { toast } = useToast();
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Phases: 
    // Prarthana (Prayer/Gratitude) - 1 min
    // Ahara (Eating) - 15-20 min
    // Vishrama (Rest) - 2 min

    const startTimer = () => setIsActive(true);
    const pauseTimer = () => setIsActive(false);
    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(1200);
        setPhase('Ahara');
    };

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            if (timerRef.current) clearInterval(timerRef.current);
            playBell();
            toast({
                title: "Sadhana Complete",
                description: "You have completed your mindful eating session. May it bring peace.",
            });
        } else {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isActive, timeLeft, toast]);

    const playBell = () => {
        // In a real app, we'd play a sound file. For now, we vibrate if supported.
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate([200, 100, 200]);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = ((1200 - timeLeft) / 1200) * 100;

    return (
        <Card className="shadow-2xl border-primary/20 bg-gradient-to-br from-background via-background to-primary/5 overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <Wind className="h-32 w-32 text-primary animate-pulse" />
            </div>
            <CardHeader className="text-center">
                <CardTitle className="font-headline text-3xl flex items-center justify-center gap-2">
                    <Music className="h-6 w-6 text-primary" />
                    Anna Sadhana
                </CardTitle>
                <CardDescription className="text-lg">Meal Meditation & Mindful Timing</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-8 py-10">
                <div className="relative group">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-all duration-700" />
                    <div className="relative h-64 w-64 rounded-full border-[12px] border-accent flex flex-col items-center justify-center bg-background shadow-2xl z-10 transition-transform hover:scale-105">
                        <span className="text-5xl font-mono font-bold tracking-tight text-primary">{formatTime(timeLeft)}</span>
                        <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground mt-2">{phase}</span>
                        <Timer className="absolute -top-4 -right-4 h-12 w-12 text-primary/20" />
                    </div>

                    {/* Pulsing rings */}
                    {isActive && (
                        <>
                            <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping opacity-20" />
                            <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping delay-700 opacity-10" />
                        </>
                    )}
                </div>

                <div className="w-full max-w-xs space-y-2">
                    <Progress value={progress} className="h-2" />
                    <div className="flex justify-between text-[10px] font-bold text-muted-foreground/60 uppercase tracking-tighter">
                        <span>Start</span>
                        <span>Mindful Intake</span>
                        <span>Rest</span>
                    </div>
                </div>

                <div className="flex gap-4">
                    {isActive ? (
                        <Button size="lg" variant="outline" className="rounded-full h-16 w-16 shadow-lg" onClick={pauseTimer}>
                            <Pause className="h-8 w-8" />
                        </Button>
                    ) : (
                        <Button size="lg" className="rounded-full h-16 w-16 shadow-xl" onClick={startTimer}>
                            <Play className="h-8 w-8 fill-current" />
                        </Button>
                    )}
                    <Button size="lg" variant="ghost" className="rounded-full h-16 w-16" onClick={resetTimer}>
                        <RotateCcw className="h-6 w-6" />
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full pt-8">
                    <div className="p-4 rounded-2xl bg-accent/40 border border-primary/5 text-center">
                        <h5 className="font-bold text-sm mb-1">Chew Thoroughly</h5>
                        <p className="text-xs text-muted-foreground italic">Aim for 32 counts per morsel.</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-accent/40 border border-primary/5 text-center">
                        <h5 className="font-bold text-sm mb-1">Silence is Golden</h5>
                        <p className="text-xs text-muted-foreground italic">Observe the taste, texture, and aroma.</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-accent/40 border border-primary/5 text-center">
                        <h5 className="font-bold text-sm mb-1">Post-Meal Rest</h5>
                        <p className="text-xs text-muted-foreground italic">Sit for 2 mins after finishing.</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
