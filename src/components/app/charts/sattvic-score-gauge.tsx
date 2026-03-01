'use client';

import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface SattvicScoreGaugeProps {
    score: number; // 0 to 100
}

export default function SattvicScoreGauge({ score }: SattvicScoreGaugeProps) {
    const data = [
        { name: 'Sattvic', value: score },
        { name: 'Remaining', value: 100 - score },
    ];

    const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))'];

    return (
        <div className="h-[200px] w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="100%"
                        startAngle={180}
                        endAngle={0}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={0}
                        dataKey="value"
                        stroke="none"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={index === 0 ? 10 : 0} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
            <div className="absolute bottom-[20px] left-1/2 -translate-x-1/2 text-center">
                <div className="text-3xl font-black text-primary leading-none">{score}%</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">Sattva Purity</div>
            </div>
        </div>
    );
}
