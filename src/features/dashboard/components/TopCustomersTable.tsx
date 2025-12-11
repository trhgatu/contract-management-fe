
import React, { useState, useEffect } from 'react';
import { Icons } from '../../../components/ui/Icons';
import { dashboardService } from '@/services';

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

export const TopCustomersTable: React.FC = () => {
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await dashboardService.getTopCustomers();
                setCustomers(data || []);
            } catch (error) {
                console.error('Failed to fetch top customers', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="xl:w-[40%] bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase">
                    <Icons.Customer size={16} className="text-blue-600" />
                    Khách hàng tiêu biểu
                </h3>
                <button className="text-xs text-blue-600 hover:underline">Xem tất cả</button>
            </div>
            <div className="overflow-x-auto flex-1">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium text-xs">
                        <tr>
                            <th className="px-3 py-2 w-10 text-center">#</th>
                            <th className="px-3 py-2">Khách hàng</th>
                            <th className="px-3 py-2 text-right">Doanh thu</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            [1, 2, 3].map(i => (
                                <tr key={i} className="animate-pulse">
                                    <td colSpan={3} className="px-3 py-2.5">
                                        <div className="h-4 bg-slate-100 rounded"></div>
                                    </td>
                                </tr>
                            ))
                        ) : customers.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="px-3 py-4 text-center text-slate-400 text-xs">Chưa có dữ liệu</td>
                            </tr>
                        ) : (
                            customers.map((customer, idx) => (
                                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-3 py-2.5 text-center">
                                        <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${idx === 0 ? 'bg-yellow-100 text-yellow-700' :
                                            idx === 1 ? 'bg-slate-200 text-slate-700' :
                                                idx === 2 ? 'bg-orange-100 text-orange-800' : 'text-slate-500'
                                            }`}>
                                            {idx + 1}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2.5 font-medium text-slate-700 text-xs truncate max-w-[200px]" title={customer.name}>{customer.name}</td>
                                    <td className="px-3 py-2.5 text-right text-emerald-600 font-medium text-xs">{formatCurrency(customer.revenue)}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
