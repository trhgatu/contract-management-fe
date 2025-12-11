
import React from 'react';
import { Icons } from '../../../components/ui/Icons';
import { CustomDatePicker } from '../../../components/ui/CustomDatePicker';
import { MOCK_MD_CUSTOMERS } from '../../../constants';

interface ContractFiltersProps {
    fromDate: string;
    setFromDate: (date: string) => void;
    toDate: string;
    setToDate: (date: string) => void;
    searchCustomer: string;
    setSearchCustomer: (customer: string) => void;
    quickSearch: string;
    setQuickSearch: (search: string) => void;
    handleOpenAddModal: () => void;
}

export const ContractFilters: React.FC<ContractFiltersProps> = ({
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    searchCustomer,
    setSearchCustomer,
    quickSearch,
    setQuickSearch,
    handleOpenAddModal,
}) => {
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <div className="flex flex-col xl:flex-row gap-4 justify-between items-end xl:items-center">

                {/* Left: Filters */}
                <div className="flex flex-wrap items-end gap-3 w-full xl:w-auto">
                    <div className="w-[150px]">
                        <label className="block text-xs font-bold text-slate-700 mb-1">Từ ngày ký</label>
                        <CustomDatePicker
                            value={fromDate}
                            onChange={setFromDate}
                            placeholder="Từ ngày..."
                        />
                    </div>
                    <div className="w-[150px]">
                        <label className="block text-xs font-bold text-slate-700 mb-1">Đến ngày ký</label>
                        <CustomDatePicker
                            value={toDate}
                            onChange={setToDate}
                            placeholder="Đến ngày..."
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Khách hàng</label>
                        <select
                            value={searchCustomer}
                            onChange={e => setSearchCustomer(e.target.value)}
                            className="pl-3 pr-8 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-500 outline-none shadow-sm bg-white min-w-[200px]"
                        >
                            <option value="">-- Tất cả khách hàng --</option>
                            {MOCK_MD_CUSTOMERS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <button className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 shadow-sm flex items-center gap-2">
                        <Icons.Search size={16} /> Tra cứu
                    </button>
                </div>

                {/* Right: Quick Search & Actions */}
                <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto justify-end">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Tìm kiếm nhanh..."
                            value={quickSearch}
                            onChange={e => setQuickSearch(e.target.value)}
                            className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-500 outline-none shadow-sm w-full xl:w-64"
                        />
                        <Icons.Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                    </div>
                    <div className="h-8 w-px bg-slate-200 mx-1 hidden xl:block"></div>
                    <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-medium shadow-sm transition-all" title="Export Excel">
                        <Icons.Download size={18} /> <span className="hidden sm:inline">Xuất Excel</span>
                    </button>
                    <button
                        onClick={handleOpenAddModal}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-lg hover:shadow-blue-500/30 transition-all"
                    >
                        <Icons.Plus size={18} /> Thêm mới
                    </button>
                </div>
            </div>
        </div>
    );
};
