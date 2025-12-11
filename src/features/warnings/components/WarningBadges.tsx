import React from 'react';

export const WarningStatusBadge: React.FC<{ status: string }> = ({ status }) => {
    switch(status) {
        case 'pending': return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">Chưa xử lý</span>;
        case 'processing': return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-600 border border-blue-200">Đang xử lý</span>;
        case 'resolved': return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-600 border border-emerald-200">Đã xử lý</span>;
        default: return null;
    }
};

export const WarningTypeBadge: React.FC<{ type: string }> = ({ type }) => {
    switch(type) {
        case 'acceptance_overdue': return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-600 border border-rose-200">Quá hạn nghiệm thu</span>;
        case 'payment_overdue': return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-600 border border-rose-200">Quá hạn thanh toán</span>;
        case 'acceptance_upcoming': return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200">Sắp đến hạn nghiệm thu</span>;
        case 'payment_upcoming': return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200">Sắp đến hạn thanh toán</span>;
        default: return null;
    }
};
