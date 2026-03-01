'use client';

import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';

interface SankalpaRadarProps {
    data: {
        subject: string;
        A: number;
        fullMark: number;
    }[];
}

export default function SankalpaCommitmentRadar({ data }: SankalpaRadarProps) {
    return (
        <div className="h-[250px] w-full mt-4 flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                    <PolarGrid opacity={0.1} />
                    <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))', fontWeight: 600 }}
                    />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} hide />
                    <Tooltip
                        contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                    />
                    <Radar
                        name="Commitment"
                        dataKey="A"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.5}
                        dot={true}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
}
