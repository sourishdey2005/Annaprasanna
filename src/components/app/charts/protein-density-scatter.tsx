'use client';

import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, CartesianGrid, Cell } from 'recharts';

interface ProteinDensityProps {
    data: { calories: number; protein: number; name: string; guna: string }[];
}

export default function ProteinDensityScatter({ data }: ProteinDensityProps) {
    const GUNA_COLORS: Record<string, string> = {
        'Sattvic': '#10b981',
        'Rajasic': '#ef4444',
        'Tamasic': '#f59e0b',
    };

    return (
        <div className="h-[250px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis
                        type="number"
                        dataKey="calories"
                        name="Calories"
                        unit="kcal"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis
                        type="number"
                        dataKey="protein"
                        name="Protein"
                        unit="g"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <ZAxis type="number" range={[100, 300]} />
                    <Tooltip
                        cursor={{ strokeDasharray: '3 3' }}
                        contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                    />
                    <Scatter name="Meals" data={data}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={GUNA_COLORS[entry.guna] || '#8884d8'} />
                        ))}
                    </Scatter>
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    );
}
