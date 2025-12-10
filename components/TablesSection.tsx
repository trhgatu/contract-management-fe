import React from 'react';
import { TOP_CUSTOMERS, WARNINGS, SOFTWARE_TYPES } from '../constants';
import { Icons } from './Icons';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

export const TablesSection: React.FC = () => {
  return (
    <div className="flex flex-col xl:flex-row gap-6 mb-6">
      
      {/* 1. TOP CUSTOMERS (40%) */}
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
                    {TOP_CUSTOMERS.map((customer) => (
                        <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-3 py-2.5 text-center">
                                <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${
                                    customer.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                                    customer.rank === 2 ? 'bg-slate-200 text-slate-700' :
                                    customer.rank === 3 ? 'bg-orange-100 text-orange-800' : 'text-slate-500'
                                }`}>
                                    {customer.rank}
                                </span>
                            </td>
                            <td className="px-3 py-2.5 font-medium text-slate-700 text-xs truncate max-w-[200px]" title={customer.name}>{customer.name}</td>
                            <td className="px-3 py-2.5 text-right text-emerald-600 font-medium text-xs">{formatCurrency(customer.revenue)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

      {/* 2. LATE WARNINGS (35%) */}
      <div className="xl:w-[35%] bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase">
                <Icons.Warning size={16} className="text-orange-500" />
                Cảnh báo hạn
            </h3>
            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">4</span>
        </div>
        <div className="p-0 overflow-y-auto max-h-[300px] flex-1">
            {WARNINGS.map((warning) => (
                <div key={warning.id} className="p-3 border-b border-slate-50 last:border-none hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                        <span className="font-semibold text-slate-700 text-xs">{warning.contractCode}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${warning.daysLate > 0 ? 'bg-rose-100 text-rose-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {warning.daysLate > 0 ? `Trễ ${warning.daysLate} ngày` : 'Sắp hết hạn'}
                        </span>
                    </div>
                    <p className="text-xs text-slate-500 mb-1 truncate">{warning.type}</p>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="flex items-center gap-1"><Icons.Calendar size={10}/> {warning.expiryDate}</span>
                        <button className="text-blue-600 font-medium hover:underline text-[10px]">Gia hạn</button>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* 3. SOFTWARE TYPES (25%) */}
      <div className="xl:w-[25%] bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase">
                <Icons.Document size={16} className="text-indigo-500" />
                Loại phần mềm
            </h3>
        </div>
        <div className="p-4 space-y-3 flex-1 overflow-y-auto">
            {SOFTWARE_TYPES.map((type, idx) => {
                const max = Math.max(...SOFTWARE_TYPES.map(t => t.count));
                const percentage = (type.count / max) * 100;
                
                return (
                    <div key={idx}>
                        <div className="flex justify-between items-center text-xs mb-1">
                            <span className="text-slate-700 font-medium truncate max-w-[150px]" title={type.name}>{type.name}</span>
                            <span className="text-slate-500">{type.count}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5">
                            <div 
                                className="h-1.5 rounded-full bg-indigo-500 transition-all duration-500" 
                                style={{ width: `${percentage}%` }}
                            ></div>
                        </div>
                    </div>
                )
            })}
        </div>
      </div>

    </div>
  );
};