
import { MOCK_MD_STATUS } from '../../constants';

export const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

export const getContractStatusText = (statusCode: string | undefined) => {
    // 1. Try to find in Master Data
    const status = MOCK_MD_STATUS.find(s => s.code === statusCode || s.id === statusCode);
    if (status) {
        return { text: status.name, color: status.color || 'bg-slate-100 text-slate-600' };
    }

    // 2. Fallback for legacy data/hardcoded string if needed
    switch (statusCode) {
        case 'ST01': return { text: 'Chưa thực hiện', color: 'text-slate-500 bg-slate-100' };
        case 'ST02': return { text: 'Đang triển khai', color: 'text-blue-600 bg-blue-100' };
        case 'ST03': return { text: 'Hoàn thành', color: 'text-emerald-600 bg-emerald-100' };
        case 'pending': return { text: 'Mới tạo', color: 'text-slate-500 bg-slate-100' };
        case 'active': return { text: 'Đang thực hiện', color: 'text-blue-600 bg-blue-100' };
        case 'completed': return { text: 'Đã hoàn thành', color: 'text-emerald-600 bg-emerald-100' };
        default: return { text: statusCode || 'Mới tạo', color: 'text-slate-500 bg-slate-100' };
    }
};
