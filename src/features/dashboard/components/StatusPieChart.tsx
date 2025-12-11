
import React from 'react';
import {
    PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { STATUS_DATA } from '@/constants';

export const StatusPieChart: React.FC = () => {
    return (
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex flex-col h-[320px]">
            <h3 className="text-sm font-bold text-slate-800 uppercase mb-4">Trạng thái hợp đồng</h3>
            <div className="flex-1 w-full min-h-0 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={STATUS_DATA as any[]}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={70}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {STATUS_DATA.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                    </PieChart>
                </ResponsiveContainer>
                {/* Center text for Donut */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[60%] text-center">
                    <span className="text-2xl font-bold text-slate-800">128</span>
                    <p className="text-[10px] text-slate-400">Tổng cộng</p>
                </div>
            </div>
        </div>
    );
};
