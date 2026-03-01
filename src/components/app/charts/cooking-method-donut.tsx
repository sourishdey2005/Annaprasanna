'use client';

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface CookingMethodDonutProps {
    data: { name: string; value: number }[];
}

const COLORS = [
    '#f59e0b', // Amber (Steamed)
    '#ef4444', // Red (Fried)
    '#3b82f6', // Blue (Boiled)
    '#10b981', // Green (Raw)
    '#8b5cf6', // Indigo (Other)
];

export default function CookingMethodDonut({ data }: CookingMethodDonutProps) {
    return (
        <div className="h-[250px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={8} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                    />
                    <Legend align="right" verticalAlign="middle" layout="vertical" iconType="circle" wrapperStyle={{ paddingLeft: '20px' }} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
