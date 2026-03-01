'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sparkles, AlertTriangle, CheckCircle2, XCircle, Plus, Eraser } from 'lucide-react';
import { checkCompatibility } from '@/app/_actions/meal';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function CompatibilityChecker() {
    const [foods, setFoods] = useState<string[]>([]);
    const [currentFood, setCurrentFood] = useState('');
    const [result, setResult] = useState<{ is_compatible: boolean; reasoning: string; suggestion?: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const addFood = () => {
        if (currentFood.trim() && !foods.includes(currentFood.trim())) {
            setFoods([...foods, currentFood.trim()]);
            setCurrentFood('');
        }
    };

    const removeFood = (food: string) => {
        setFoods(foods.filter((f) => f !== food));
        setResult(null);
    };

    const handleCheck = async () => {
        if (foods.length < 2) {
            toast({
                title: "More ingredients needed",
                description: "Add at least two food items to check their compatibility.",
            });
            return;
        }

        setIsLoading(true);
        setResult(null);
        try {
            const response = await checkCompatibility(foods);
            if (response.success && response.data) {
                setResult(response.data);
            } else {
                throw new Error(response.error);
            }
        } catch (error) {
            console.error("Compatibility analysis error:", error);
            toast({
                variant: "destructive",
                title: "Analysis Failed",
                description: "The stars of compatibility are currently aligned in shadow.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const clearAll = () => {
        setFoods([]);
        setResult(null);
    };

    return (
        <Card className="shadow-2xl border-primary/20 bg-gradient-to-br from-background to-accent/20 overflow-hidden">
            <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Viruddha Ahara Checker
                </CardTitle>
                <CardDescription>Check for incompatible food combinations (Viruddha Ahara) according to Ayurveda.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex gap-2">
                    <Input
                        placeholder="e.g. Milk, Fish, Lemon..."
                        value={currentFood}
                        onChange={(e) => setCurrentFood(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addFood()}
                        className="rounded-xl border-primary/20"
                    />
                    <Button onClick={addFood} variant="secondary" className="rounded-xl">
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex flex-wrap gap-2 min-h-[40px]">
                    {foods.map((food) => (
                        <Badge key={food} variant="outline" className="pl-3 pr-1 py-1 rounded-full border-primary/30 bg-primary/5 flex items-center gap-1 group">
                            {food}
                            <button onClick={() => removeFood(food)} className="hover:text-destructive transition-colors p-1">
                                <XCircle className="h-3 w-3" />
                            </button>
                        </Badge>
                    ))}
                    {foods.length === 0 && <span className="text-sm text-muted-foreground italic opacity-50">Add foods to start...</span>}
                </div>

                <div className="flex gap-3">
                    <Button className="flex-1 rounded-xl h-12 shadow-lg" onClick={handleCheck} disabled={isLoading || foods.length < 2}>
                        {isLoading ? "Consulting Vedic Texts..." : "Check Compatibility"}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={clearAll} title="Clear All">
                        <Eraser className="h-5 w-5" />
                    </Button>
                </div>

                {isLoading && (
                    <div className="space-y-3 p-6 rounded-2xl bg-accent/20 border border-primary/10">
                        <Skeleton className="h-6 w-1/3" />
                        <Skeleton className="h-20 w-full" />
                    </div>
                )}

                {result && (
                    <div className={`p-6 rounded-3xl border animate-in slide-in-from-top-4 duration-500 ${result.is_compatible ? 'bg-green-500/5 border-green-500/20' : 'bg-destructive/5 border-destructive/20'}`}>
                        <div className="flex items-center gap-3 mb-3">
                            {result.is_compatible ? (
                                <CheckCircle2 className="h-6 w-6 text-green-600" />
                            ) : (
                                <AlertTriangle className="h-6 w-6 text-destructive" />
                            )}
                            <h4 className={`font-bold text-lg ${result.is_compatible ? 'text-green-700' : 'text-destructive'}`}>
                                {result.is_compatible ? 'Harmonious Combination' : 'Incompatible Combination'}
                            </h4>
                        </div>

                        <p className="text-muted-foreground leading-relaxed mb-4 italic">
                            "{result.reasoning}"
                        </p>

                        {result.suggestion && (
                            <div className="pt-4 border-t border-current/10">
                                <span className="text-xs font-bold uppercase tracking-widest opacity-50">Master's Suggestion</span>
                                <p className="text-sm mt-1">{result.suggestion}</p>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
