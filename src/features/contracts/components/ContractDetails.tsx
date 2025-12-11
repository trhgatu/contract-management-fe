
import React, { useState } from 'react';
import { Icons } from '../../../components/ui/Icons';
import { Contract, ContractAttachment } from '../../../types';
import { formatCurrency, getContractStatusText } from '../utils';

interface ContractDetailsProps {
    selectedContract: Contract | undefined;
    openViewFilesModal: (title: string, files: ContractAttachment[]) => void;
}

export const ContractDetails: React.FC<ContractDetailsProps> = ({ selectedContract, openViewFilesModal }) => {
    const [activeDetailTab, setActiveDetailTab] = useState<'payment' | 'expense' | 'member'>('payment');

    if (!selectedContract) {
        return (
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col min-h-[300px] overflow-hidden">
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                    <Icons.Contract size={48} className="text-slate-200 mb-2" />
                    <p>Chọn một hợp đồng để xem chi tiết</p>
                </div>
            </div>
        );
    }

    // Safe defaults for arrays that might be undefined
    const paymentTerms = selectedContract.paymentTerms || [];
    const expenses = selectedContract.expenses || [];
    const members = selectedContract.members || [];

    // Handle supplier lookup - might be object or ID
    const getSupplierName = (supplierId: any) => {
        if (!supplierId) return '-';
        // If supplierId is an object with name property
        if (typeof supplierId === 'object' && supplierId.name) {
            return supplierId.name;
        }
        // Otherwise just return the ID/string
        return supplierId;
    };

    // Handle status display - might be object or string
    const getStatusDisplay = (status: any) => {
        if (!status) return { text: '-', color: 'bg-slate-100 text-slate-600' };

        // If status is an object with name
        if (typeof status === 'object') {
            const statusName = status.name || status.code || '-';
            const statusColor = status.color || 'bg-slate-100 text-slate-600';
            return { text: statusName, color: statusColor };
        }

        // Otherwise use the utility function
        return getContractStatusText(status);
    };

    return (
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col min-h-[300px] overflow-hidden">
            <div className="flex items-center px-4 border-b border-slate-200 bg-slate-50/50">
                <button
                    onClick={() => setActiveDetailTab('payment')}
                    className={`py-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${activeDetailTab === 'payment' ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    <Icons.Dollar size={16} /> Điều khoản thanh toán
                </button>
                <button
                    onClick={() => setActiveDetailTab('expense')}
                    className={`py-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${activeDetailTab === 'expense' ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    <Icons.Chart size={16} /> Chi phí
                </button>
                <button
                    onClick={() => setActiveDetailTab('member')}
                    className={`py-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${activeDetailTab === 'member' ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    <Icons.Users size={16} /> Thành viên dự án
                </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto bg-white">
                {activeDetailTab === 'payment' && (
                    <table className="w-full text-sm text-left border border-slate-100 rounded-lg overflow-hidden">
                        <thead className="bg-slate-50 text-slate-700 font-bold text-xs uppercase">
                            <tr>
                                <th className="px-4 py-2 border-b">Đợt thanh toán</th>
                                <th className="px-4 py-2 border-b">Nội dung</th>
                                <th className="px-4 py-2 border-b text-center">Tỷ lệ (%)</th>
                                <th className="px-4 py-2 border-b text-right">Giá trị (VNĐ)</th>
                                <th className="px-4 py-2 border-b text-center">Ngày thu tiền</th>
                                <th className="px-4 py-2 border-b text-center">Trạng thái thanh toán</th>
                                <th className="px-4 py-2 border-b text-center">Trạng thái hóa đơn</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paymentTerms.length > 0 ? paymentTerms.map(term => (
                                <tr key={term.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-3 font-medium text-slate-700">{term.batch}</td>
                                    <td className="px-4 py-3 text-slate-600">{term.content}</td>
                                    <td className="px-4 py-3 text-center">{term.ratio}%</td>
                                    <td className="px-4 py-3 text-right font-bold text-slate-700">{formatCurrency(term.value)}</td>
                                    <td className="px-4 py-3 text-center text-slate-600">{term.collectionDate || '-'}</td>
                                    <td className="px-4 py-3 text-center">
                                        {term.isCollected ? (
                                            <span className="text-emerald-600 font-bold text-xs flex items-center justify-center gap-1"><Icons.Check size={14} /> Đã thu tiền</span>
                                        ) : (
                                            <span className="text-slate-400 font-bold text-xs flex items-center justify-center gap-1"><Icons.X size={14} /> Chưa thu tiền</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        {term.invoiceStatus === 'exported' ? (
                                            <span className="text-indigo-600 font-bold text-xs flex items-center justify-center gap-1"><Icons.Check size={14} /> Đã xuất</span>
                                        ) : (
                                            <span className="text-slate-400 font-bold text-xs flex items-center justify-center gap-1"><Icons.X size={14} /> Chưa xuất</span>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={7} className="text-center py-8 text-slate-400">Chưa có điều khoản thanh toán nào</td></tr>
                            )}
                        </tbody>
                    </table>
                )}

                {activeDetailTab === 'expense' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border border-slate-100 rounded-lg">
                            <thead className="bg-slate-50 text-slate-700 font-bold text-xs uppercase whitespace-nowrap">
                                <tr>
                                    <th className="px-4 py-2 border-b text-center">STT</th>
                                    <th className="px-4 py-2 border-b min-w-[180px]">Nhà cung cấp</th>
                                    <th className="px-4 py-2 border-b min-w-[150px]">Hạng mục</th>
                                    <th className="px-4 py-2 border-b min-w-[150px]">Diễn giải</th>
                                    <th className="px-4 py-2 border-b min-w-[120px] text-right">Tổng chi phí (VNĐ)</th>
                                    <th className="px-4 py-2 border-b min-w-[140px] text-center">Trạng thái HĐ</th>
                                    <th className="px-4 py-2 border-b min-w-[140px] text-center">TT Thanh toán</th>
                                    <th className="px-4 py-2 border-b min-w-[140px]">Nhân viên phụ trách</th>
                                    <th className="px-4 py-2 border-b min-w-[150px]">Ghi chú</th>
                                    <th className="px-4 py-2 border-b text-center min-w-[120px]">File đính kèm</th>
                                </tr>
                            </thead>
                            <tbody className="whitespace-nowrap">
                                {expenses.length > 0 ? expenses.map((exp, idx) => (
                                    <tr key={exp.id} className="hover:bg-slate-50">
                                        <td className="px-4 py-3 text-center text-slate-500">{idx + 1}</td>
                                        <td className="px-4 py-3 font-medium text-slate-700">
                                            {getSupplierName(exp.supplierId)}
                                        </td>
                                        <td className="px-4 py-3 text-slate-600">{exp.category}</td>
                                        <td className="px-4 py-3 text-slate-600">{exp.description}</td>
                                        <td className="px-4 py-3 text-right font-bold text-rose-600">{formatCurrency(exp.totalAmount)}</td>
                                        <td className="px-4 py-3 text-center">
                                            {(() => {
                                                const status = getStatusDisplay(selectedContract.status);
                                                return (
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${status.color}`}>
                                                        {status.text}
                                                    </span>
                                                );
                                            })()}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {exp.paymentStatus === 'paid' ? (
                                                <span className="text-emerald-600 font-bold text-xs flex items-center justify-center gap-1"><Icons.Check size={14} /> Đã thanh toán</span>
                                            ) : (
                                                <span className="text-slate-400 font-bold text-xs flex items-center justify-center gap-1"><Icons.X size={14} /> Chưa thanh toán</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-slate-600 flex items-center gap-2">
                                            {exp.pic && <div className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-500">{exp.pic.charAt(0)}</div>}
                                            {exp.pic}
                                        </td>
                                        <td className="px-4 py-3 text-slate-500 italic max-w-[150px] truncate" title={exp.note}>{exp.note}</td>
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                onClick={() => openViewFilesModal(`Chi phí: ${exp.category}`, exp.attachments || [])}
                                                className="text-blue-600 hover:text-blue-800 text-xs font-bold underline"
                                            >
                                                Xem ({exp.attachments?.length || 0})
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={10} className="text-center py-8 text-slate-400">Chưa có chi phí phát sinh</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeDetailTab === 'member' && (
                    <table className="w-full text-sm text-left border border-slate-100 rounded-lg overflow-hidden">
                        <thead className="bg-slate-50 text-slate-700 font-bold text-xs uppercase">
                            <tr>
                                <th className="px-4 py-2 border-b w-16 text-center">#</th>
                                <th className="px-4 py-2 border-b">Mã thành viên</th>
                                <th className="px-4 py-2 border-b">Tên thành viên</th>
                                <th className="px-4 py-2 border-b">Chức vụ / Vai trò</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.length > 0 ? members.map((mem, idx) => (
                                <tr key={mem.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-3 text-center text-slate-400">{idx + 1}</td>
                                    <td className="px-4 py-3 font-mono text-slate-600">{mem.memberCode}</td>
                                    <td className="px-4 py-3 font-bold text-slate-700">{mem.name}</td>
                                    <td className="px-4 py-3">
                                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium border border-blue-100">{mem.role}</span>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={4} className="text-center py-8 text-slate-400">Chưa có thành viên dự án</td></tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};
