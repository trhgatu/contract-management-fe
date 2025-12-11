
import React, { useState, useEffect } from 'react';
import { Icons } from '../../../../components/ui/Icons';
import { Expense, ContractAttachment } from '../../../../types';
import { masterDataService } from '../../../../services';
import { getContractStatusText } from '../../utils';

interface ExpenseTabProps {
    expenses: Expense[];
    formData: any;
    handleAddExpense: () => void;
    handleUpdateExpense: (id: string, field: keyof Expense, value: any) => void;
    handleDeleteExpense: (id: string) => void;
    handleExpenseFileUpload: (e: React.ChangeEvent<HTMLInputElement>, expenseId: string) => void;
    openViewFilesModal: (title: string, files: ContractAttachment[]) => void;
}

export const ExpenseTab: React.FC<ExpenseTabProps> = ({
    expenses,
    formData,
    handleAddExpense,
    handleUpdateExpense,
    handleDeleteExpense,
    handleExpenseFileUpload,
    openViewFilesModal,
}) => {
    const [suppliers, setSuppliers] = useState<any[]>([]);
    const [loadingSuppliers, setLoadingSuppliers] = useState(true);

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                setLoadingSuppliers(true);
                const data = await masterDataService.getAll('suppliers' as any);
                setSuppliers(data);
            } catch (err) {
                console.error('Error fetching suppliers:', err);
                setSuppliers([]);
            } finally {
                setLoadingSuppliers(false);
            }
        };
        fetchSuppliers();
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-slate-700 text-sm uppercase">Danh sách chi phí</h4>
                <button
                    onClick={handleAddExpense}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 flex items-center gap-2 shadow-sm"
                >
                    <Icons.Plus size={14} /> Thêm chi phí
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border border-slate-200 rounded-lg">
                    <thead className="bg-slate-50 text-slate-700 font-bold text-xs uppercase whitespace-nowrap">
                        <tr>
                            <th className="px-4 py-3 border-b text-center w-12">STT</th>
                            <th className="px-4 py-3 border-b min-w-[180px]">Nhà cung cấp</th>
                            <th className="px-4 py-3 border-b min-w-[150px]">Hạng mục</th>
                            <th className="px-4 py-3 border-b min-w-[150px]">Diễn giải</th>
                            <th className="px-4 py-3 border-b min-w-[120px] text-right">Tổng chi phí (VNĐ)</th>
                            <th className="px-4 py-3 border-b min-w-[140px] text-center">Trạng thái HĐ</th>
                            <th className="px-4 py-3 border-b min-w-[140px] text-center">TT Thanh toán</th>
                            <th className="px-4 py-3 border-b min-w-[140px]">Nhân viên phụ trách</th>
                            <th className="px-4 py-3 border-b min-w-[150px]">Ghi chú</th>
                            <th className="px-4 py-3 border-b text-center min-w-[120px]">File đính kèm</th>
                            <th className="px-4 py-3 border-b text-center w-10"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses && expenses.length > 0 ? (
                            expenses.map((exp, idx) => (
                                <tr key={exp.id || idx} className="hover:bg-slate-50 border-b border-slate-100 last:border-0">
                                    <td className="px-2 py-2 text-center text-slate-500">{idx + 1}</td>
                                    <td className="px-2 py-2">
                                        <select
                                            className="w-full px-2 py-1.5 border border-transparent hover:border-slate-300 focus:border-blue-500 rounded bg-transparent outline-none transition-all"
                                            value={exp.supplierId}
                                            onChange={(e) => handleUpdateExpense(exp.id, 'supplierId', e.target.value)}
                                            disabled={loadingSuppliers}
                                        >
                                            <option value="">{loadingSuppliers ? 'Đang tải...' : '-- Chọn NCC --'}</option>
                                            {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                        </select>
                                    </td>
                                    <td className="px-2 py-2">
                                        <input
                                            className="w-full px-2 py-1.5 border border-transparent hover:border-slate-300 focus:border-blue-500 rounded bg-transparent outline-none transition-all"
                                            value={exp.category}
                                            placeholder="Hạng mục..."
                                            onChange={(e) => handleUpdateExpense(exp.id, 'category', e.target.value)}
                                        />
                                    </td>
                                    <td className="px-2 py-2">
                                        <input
                                            className="w-full px-2 py-1.5 border border-transparent hover:border-slate-300 focus:border-blue-500 rounded bg-transparent outline-none transition-all"
                                            value={exp.description}
                                            placeholder="Diễn giải..."
                                            onChange={(e) => handleUpdateExpense(exp.id, 'description', e.target.value)}
                                        />
                                    </td>
                                    <td className="px-2 py-2 text-right">
                                        <input
                                            type="number"
                                            className="w-full px-2 py-1.5 border border-transparent hover:border-slate-300 focus:border-blue-500 rounded bg-transparent outline-none text-right font-bold text-rose-600 transition-all"
                                            value={exp.totalAmount}
                                            onChange={(e) => handleUpdateExpense(exp.id, 'totalAmount', Number(e.target.value))}
                                        />
                                    </td>
                                    <td className="px-2 py-2 text-center">
                                        {(() => {
                                            // Inherit from parent formData.status
                                            const statusVal = formData.status;
                                            const statusCode = (typeof statusVal === 'object' && statusVal !== null) ? statusVal.code || statusVal.id : statusVal;
                                            const status = getContractStatusText(statusCode);
                                            return (
                                                <div className={`w-full px-2 py-1.5 rounded text-xs font-bold text-center ${status.color}`}>
                                                    {status.text}
                                                </div>
                                            );
                                        })()}
                                    </td>
                                    <td className="px-2 py-2 text-center">
                                        <select
                                            className={`w-full px-2 py-1.5 border border-transparent hover:border-slate-300 focus:border-blue-500 rounded outline-none transition-all text-xs font-bold ${exp.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-slate-500'}`}
                                            value={exp.paymentStatus}
                                            onChange={(e) => handleUpdateExpense(exp.id, 'paymentStatus', e.target.value)}
                                        >
                                            <option value="unpaid">Chưa thanh toán</option>
                                            <option value="paid">Đã thanh toán</option>
                                        </select>
                                    </td>
                                    <td className="px-2 py-2">
                                        <input
                                            className="w-full px-2 py-1.5 border border-transparent hover:border-slate-300 focus:border-blue-500 rounded bg-transparent outline-none transition-all"
                                            value={exp.pic}
                                            placeholder="NV phụ trách"
                                            onChange={(e) => handleUpdateExpense(exp.id, 'pic', e.target.value)}
                                        />
                                    </td>
                                    <td className="px-2 py-2">
                                        <input
                                            className="w-full px-2 py-1.5 border border-transparent hover:border-slate-300 focus:border-blue-500 rounded bg-transparent outline-none transition-all"
                                            value={exp.note}
                                            placeholder="Ghi chú..."
                                            onChange={(e) => handleUpdateExpense(exp.id, 'note', e.target.value)}
                                        />
                                    </td>
                                    <td className="px-2 py-2 text-center">
                                        <div className="flex flex-col items-center gap-1">
                                            <label className="cursor-pointer px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-xs font-bold flex items-center gap-1">
                                                <Icons.Upload size={12} /> Thêm
                                                <input
                                                    type="file"
                                                    multiple
                                                    className="hidden"
                                                    onChange={(e) => handleExpenseFileUpload(e, exp.id)}
                                                />
                                            </label>
                                            {exp.attachments && exp.attachments.length > 0 && (
                                                <button
                                                    onClick={() => openViewFilesModal(`Chi phí: ${exp.category}`, exp.attachments)}
                                                    className="text-blue-600 hover:text-blue-800 text-xs font-bold underline"
                                                >
                                                    Xem ({exp.attachments.length})
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-2 py-2 text-center">
                                        <button onClick={() => handleDeleteExpense(exp.id)} className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded transition-colors"><Icons.Trash size={16} /></button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={11} className="text-center py-8 text-slate-400 italic">Chưa có chi phí nào. Nhấn "Thêm chi phí" để tạo mới.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
