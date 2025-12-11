
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CHART_DATA } from '../../../../constants';

export const ContractReport: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <h4 className="text-slate-500 text-xs font-bold uppercase mb-1">Tổng hợp đồng</h4>
                    <p className="text-2xl font-bold text-blue-700">128</p>
                </div>
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                    <h4 className="text-slate-500 text-xs font-bold uppercase mb-1">Đã hoàn thành</h4>
                    <p className="text-2xl font-bold text-emerald-700">80</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                    <h4 className="text-slate-500 text-xs font-bold uppercase mb-1">Đang triển khai</h4>
                    <p className="text-2xl font-bold text-yellow-700">41</p>
                </div>
                <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
                    <h4 className="text-slate-500 text-xs font-bold uppercase mb-1">Quá hạn</h4>
                    <p className="text-2xl font-bold text-rose-700">7</p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 h-80 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4">Biểu đồ tình trạng hợp đồng</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={CHART_DATA}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="contracts" name="Tổng HĐ" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="appendices" name="Phụ lục" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
