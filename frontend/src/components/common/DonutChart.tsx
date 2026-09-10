import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface DonutChartProps {
  title: string;
  data: { name: string; value: number; color: string }[];
}

export const DonutChart: React.FC<DonutChartProps> = ({ title, data }) => {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center">
      <h4 className="text-sm font-semibold text-slate-800 mb-4">{title}</h4>
      <div className="w-full h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={75}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(val: number) => [`${val} (${total > 0 ? Math.round((val / total) * 100) : 0}%)`, 'Count']}
              contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
            />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              formatter={(value, entry: any) => (
                <span className="text-xs text-slate-600 font-medium">
                  {value} ({entry.payload.value})
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
