'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertCircle, Ban, Droplet, Flame, Snowflake, Sparkles } from 'lucide-react';

const incompatiblePairs = [
    {
        pair: ['Milk', 'Fish'],
        reason: 'Obstruction of Srotas (channels) and skin energy.',
        icon: <Snowflake className="h-4 w-4 text-sky-400" />,
    },
    {
        pair: ['Milk', 'Salt'],
        reason: 'Slow accumulation of skin-related toxins over time.',
        icon: <Droplet className="h-4 w-4 text-blue-400" />,
    },
    {
        pair: ['Honey', 'Heating'],
        reason: 'Heated honey becomes glue-like (Ama) and indigestible.',
        icon: <Flame className="h-4 w-4 text-orange-500" />,
    },
    {
        pair: ['Lemon', 'Milk'],
        reason: 'Instant curdling disrupts the digestive fire (Agni).',
        icon: <AlertCircle className="h-4 w-4 text-yellow-500" />,
    },
    {
        pair: ['Fruit', 'Grain'],
        reason: 'Fruit digests fast, causing grain to ferment in the gut.',
        icon: <Ban className="h-4 w-4 text-destructive" />,
    },
    {
        pair: ['Radish', 'Milk'],
        reason: 'Directly antagonistic properties (Viruddha).',
        icon: <Sparkles className="h-4 w-4 text-primary" />,
    },
];

export default function CompatibilityChecker() {
    return (
        <Card className="shadow-2xl border-primary/20 bg-gradient-to-br from-background via-background to-primary/5 overflow-hidden rounded-[2.5rem]">
            <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-2xl bg-primary/10 text-primary">
                        <Ban className="h-6 w-6" />
                    </div>
                    <CardTitle className="font-headline text-3xl">Viruddha Ahara</CardTitle>
                </div>
                <CardDescription className="text-base">
                    Ancient Vedic wisdom on incompatible food pairings that create <span className="text-primary font-bold">Ama</span> (toxins) in the body.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {incompatiblePairs.map((item, index) => (
                        <div
                            key={index}
                            className="p-5 rounded-3xl bg-accent/20 border border-primary/5 hover:border-primary/20 transition-all group"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <span className="font-headline font-bold text-lg">{item.pair[0]}</span>
                                    <span className="text-xs font-black opacity-30 tracking-widest">+</span>
                                    <span className="font-headline font-bold text-lg">{item.pair[1]}</span>
                                </div>
                                <div className="h-8 w-8 rounded-full bg-background flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                    {item.icon}
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground leading-snug">
                                {item.reason}
                            </p>
                        </div>
                    ))}
                </div>
                <div className="mt-8 p-6 rounded-3xl bg-primary/5 border border-primary/10 text-center">
                    <p className="text-xs uppercase tracking-[0.2em] font-bold text-primary/60 mb-1">Ritual Insight</p>
                    <p className="text-sm italic text-muted-foreground">
                        "Eating incompatible foods is like fighting a war within one's own belly. Respect your Agni."
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
