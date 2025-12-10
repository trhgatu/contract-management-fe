import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { CHART_DATA, STATUS_DATA } from '../constants';

const formatYAxis = (tickItem: number) => {
    if (tickItem >= 1000000000) return `${(tickItem / 1000000000).toFixed(1)}B`;
    if (tickItem >= 1000000) return `${(tickItem / 1000000).toFixed(0)}M`;
    return tickItem.toString();
};

export const ChartsSection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Chart 1: Bar Chart (Contracts) */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex flex-col h-[320px]">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase">Hợp đồng theo thời gian</h3>
            </div>
            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} dy={10} interval={0} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                        <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                            cursor={{ fill: '#f8fafc' }}
                        />
                        <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
                        <Bar dataKey="contracts" name="Hợp đồng" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={12} />
                        <Bar dataKey="appendices" name="Phụ lục" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={12} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Chart 2: Area Chart (Revenue/Expense) */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex flex-col h-[320px]">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase">Doanh thu & Chi phí</h3>
             </div>
             <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={CHART_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} dy={10} interval={1} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} tickFormatter={formatYAxis} />
                        <Tooltip 
                             formatter={(value: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumSignificantDigits: 3 }).format(value)}
                             contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                        />
                        <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
                        <Area type="monotone" dataKey="revenue" name="Doanh thu" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                        <Area type="monotone" dataKey="expense" name="Chi phí" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorExpense)" />
                    </AreaChart>
                </ResponsiveContainer>
             </div>
        </div>

        {/* Chart 3: Pie Chart (Status) */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex flex-col h-[320px]">
            <h3 className="text-sm font-bold text-slate-800 uppercase mb-4">Trạng thái hợp đồng</h3>
            <div className="flex-1 w-full min-h-0 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={STATUS_DATA}
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
                        <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px' }}/>
                    </PieChart>
                </ResponsiveContainer>
                {/* Center text for Donut */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[60%] text-center">
                    <span className="text-2xl font-bold text-slate-800">128</span>
                    <p className="text-[10px] text-slate-400">Tổng cộng</p>
                </div>
            </div>
        </div>

    </div>
  );
};