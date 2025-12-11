import React from 'react';
import { Icons } from '../../../components/ui/Icons';
import { CustomDatePicker } from '../../../components/ui/CustomDatePicker';

interface WarningFiltersProps {
  filterType: string;
  setFilterType: (type: string) => void;
  filterCustomer: string;
  setFilterCustomer: (customer: string) => void;
  filterPic: string;
  setFilterPic: (pic: string) => void;
  fromDate: string;
  setFromDate: (date: string) => void;
  toDate: string;
  setToDate: (date: string) => void;
  handleClearFilter: () => void;
  handleExportExcel: () => void;
  // Add a prop for triggering search if needed, or keep it internal
  // handleSearch: () => void; 
}

const WARNING_TYPES = [
    { id: 'acceptance_upcoming', label: 'Sắp hết hạn nghiệm thu' },
    { id: 'acceptance_overdue', label: 'Quá hạn nghiệm thu' },
    { id: 'payment_upcoming', label: 'Sắp hết hạn thanh toán' },
    { id: 'payment_overdue', label: 'Quá hạn thanh toán' },
];

export const WarningFilters: React.FC<WarningFiltersProps> = ({
  filterType,
  setFilterType,
  filterCustomer,
  setFilterCustomer,
  filterPic,
  setFilterPic,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  handleClearFilter,
  handleExportExcel,
}) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 items-end">
            <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Loại cảnh báo</label>
                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-500 outline-none bg-white"
                >
                    <option value="all">Tất cả cảnh báo</option>
                    {WARNING_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Khách hàng / Hợp đồng</label>
                <div className="relative">
                  <input
                      type="text"
                      placeholder="Tìm theo tên KH, số HĐ..."
                      value={filterCustomer}
                      onChange={(e) => setFilterCustomer(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-500 outline-none"
                  />
                  <Icons.Search size={16} className="absolute left-2.5 top-2.5 text-slate-400"/>
                </div>
            </div>
             <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Người phụ trách (PIC)</label>
                 <input
                      type="text"
                      placeholder="Nhập tên nhân viên..."
                      value={filterPic}
                      onChange={(e) => setFilterPic(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-500 outline-none"
                  />
            </div>
            <div className="xl:col-span-2 flex gap-2 w-full">
                 <div className="flex-1">
                      <label className="block text-xs font-bold text-slate-700 mb-1">Từ ngày</label>
                      <CustomDatePicker value={fromDate} onChange={setFromDate} />
                 </div>
                 <div className="flex-1">
                      <label className="block text-xs font-bold text-slate-700 mb-1">Đến ngày</label>
                      <CustomDatePicker value={toDate} onChange={setToDate} />
                 </div>
            </div>
        </div>
        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
             <button onClick={handleClearFilter} className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors">
                 Xóa bộ lọc
             </button>
             <button onClick={handleExportExcel} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium shadow-sm transition-colors">
                 <Icons.Download size={16} /> Xuất Excel
             </button>
             <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-sm transition-colors">
                 <Icons.Search size={16} /> Tra cứu
             </button>
        </div>
    </div>
  );
};
