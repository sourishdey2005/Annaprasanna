'use client';

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

interface DoshaHarmonyPieProps {
    data: {
        vata: number;
        pitta: number;
        kapha: number;
    };
}

export default function DoshaHarmonyPie({ data }: DoshaHarmonyPieProps) {
    const chartData = [
        { name: 'Vata', value: data.vata, color: '#3b82f6' }, // Blue (Sky/Air)
        { name: 'Pitta', value: data.pitta, color: '#ef4444' }, // Red (Fire)
        { name: 'Kapha', value: data.kapha, color: '#10b981' }, // Green (Earth/Water)
    ];

    return (
        <div className="h-[250px] w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={85}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} cornerRadius={8} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                    />
                </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-x-0 inset-y-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="text-2xl font-black text-primary leading-none">Dosha</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">Balance</div>
            </div>
        </div>
    );
}
