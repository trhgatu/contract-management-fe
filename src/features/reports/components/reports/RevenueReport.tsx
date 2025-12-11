
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { REPORT_PROFIT_DATA } from '../../../../constants';

export const RevenueReport: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 h-96 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-800">Doanh thu thực tế vs Dự kiến</h3>
                    <div className="flex gap-2 text-sm">
                        <span className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500 rounded-full"></div> Thực tế</span>
                        <span className="flex items-center gap-1"><div className="w-3 h-3 bg-indigo-300 rounded-full"></div> Dự kiến</span>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={REPORT_PROFIT_DATA}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="revenue" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Thực tế" />
                        <Area type="monotone" dataKey="profit" stackId="1" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.4} name="Dự kiến" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
