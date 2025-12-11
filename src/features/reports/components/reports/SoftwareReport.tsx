
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { REPORT_SOFTWARE_DATA } from '../../../../constants';
import { Icons } from '../../../../components/ui/Icons';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const SoftwareReport: React.FC = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 h-80 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-2">Tỷ trọng doanh thu theo PM</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={REPORT_SOFTWARE_DATA as any[]}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {REPORT_SOFTWARE_DATA.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend layout="vertical" verticalAlign="middle" align="right" />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
                <h3 className="font-bold text-slate-800 mb-4">Nhận định hiệu quả</h3>
                <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg shrink-0"><Icons.Check size={16} /></div>
                        <div>
                            <span className="font-bold text-slate-700 block">VTOS (40%)</span>
                            <span className="text-sm text-slate-500">Sản phẩm chủ lực, tăng trưởng 12% so với quý trước.</span>
                        </div>
                    </li>
                    <li className="flex items-start gap-3">
                        <div className="p-2 bg-green-100 text-green-600 rounded-lg shrink-0"><Icons.TrendingUp size={16} /></div>
                        <div>
                            <span className="font-bold text-slate-700 block">VSL (25%)</span>
                            <span className="text-sm text-slate-500">Đang mở rộng thị phần, tiềm năng cao.</span>
                        </div>
                    </li>
                    <li className="flex items-start gap-3">
                        <div className="p-2 bg-orange-100 text-orange-600 rounded-lg shrink-0"><Icons.Warning size={16} /></div>
                        <div>
                            <span className="font-bold text-slate-700 block">ERP (10%)</span>
                            <span className="text-sm text-slate-500">Cần đẩy mạnh marketing hoặc tối ưu chi phí triển khai.</span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
};
