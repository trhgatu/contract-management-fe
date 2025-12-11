import React from 'react';
import { WarningItem } from '../../../types'; // Adjust path
import { WarningStatusBadge, WarningTypeBadge } from './WarningBadges'; // Adjust path

interface WarningTableProps {
  warnings: WarningItem[];
  openDetailModal: (item: WarningItem) => void;
  formatCurrency: (value: number) => string;
}

export const WarningTable: React.FC<WarningTableProps> = ({ warnings, openDetailModal, formatCurrency }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col flex-1 overflow-hidden min-h-[400px]">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-slate-100 text-slate-700 font-bold text-xs uppercase sticky top-0 z-10 shadow-sm">
                <tr>
                    <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200 text-center w-12">STT</th>
                    <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200">Loại cảnh báo</th>
                    <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200">Số hợp đồng</th>
                    <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200">Khách hàng</th>
                    <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200 text-center">Ngày đến hạn</th>
                    <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200 text-center">Ngày còn lại / Quá hạn</th>
                    <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200 text-right">Số tiền liên quan</th>
                    <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200">Người phụ trách</th>
                    <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200 text-center">Trạng thái</th>
                    <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200">Ghi chú</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {warnings.length > 0 ? warnings.map((item, idx) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50 cursor-pointer transition-colors"
                      onClick={() => openDetailModal(item)}
                    >
                        <td className="px-4 py-3 text-center text-slate-500">{idx + 1}</td>
                        <td className="px-4 py-3"><WarningTypeBadge type={item.type} /></td>
                        <td className="px-4 py-3 font-bold text-blue-700 whitespace-nowrap">{item.contractCode}</td>
                        <td className="px-4 py-3 font-medium text-slate-800 max-w-[200px] truncate" title={item.customerName}>{item.customerName}</td>
                        <td className="px-4 py-3 text-center text-slate-700 font-mono">{item.dueDate}</td>
                        <td className="px-4 py-3 text-center">
                            {item.daysDiff < 0 ? (
                                <span className="text-rose-600 font-bold">Quá hạn {Math.abs(item.daysDiff)} ngày</span>
                            ) : (
                                <span className="text-amber-600 font-bold">Còn {item.daysDiff} ngày</span>
                            )}
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-slate-700">
                            {item.amount > 0 ? formatCurrency(item.amount) : '-'}
                        </td>
                        <td className="px-4 py-3 text-slate-600">{item.pic}</td>
                        <td className="px-4 py-3 text-center"><WarningStatusBadge status={item.status} /></td>
                        <td className="px-4 py-3 text-slate-500 italic max-w-[150px] truncate">{item.note}</td>
                    </tr>
                )) : (
                    <tr><td colSpan={10} className="text-center py-12 text-slate-400">Không tìm thấy dữ liệu cảnh báo phù hợp.</td></tr>
                )}
            </tbody>
          </table>
        </div>
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex justify-between items-center text-xs text-slate-500">
            <span>Hiển thị {warnings.length} cảnh báo</span>
            <div className="flex gap-2 items-center">
                 <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-rose-500"></div> Quá hạn</div>
                 <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-amber-500"></div> Sắp đến hạn</div>
            </div>
        </div>
    </div>
  );
};
