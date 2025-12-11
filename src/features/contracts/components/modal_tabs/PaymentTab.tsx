
import React from 'react';
import { Icons } from '../../../../components/ui/Icons';
import { CustomDatePicker } from '../../../../components/ui/CustomDatePicker';
import { PaymentTerm } from '../../../../types';

interface PaymentTabProps {
    paymentTerms: PaymentTerm[];
    handleAddPaymentTerm: () => void;
    handleUpdatePaymentTerm: (id: string, field: keyof PaymentTerm, value: any) => void;
    handleDeletePayment: (id: string) => void;
}

export const PaymentTab: React.FC<PaymentTabProps> = ({
    paymentTerms,
    handleAddPaymentTerm,
    handleUpdatePaymentTerm,
    handleDeletePayment,
}) => {
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-slate-700 text-sm uppercase">Danh sách đợt thanh toán</h4>
                <button
                    onClick={handleAddPaymentTerm}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 flex items-center gap-2 shadow-sm"
                >
                    <Icons.Plus size={14} /> Thêm đợt
                </button>
            </div>

            <table className="w-full text-sm text-left border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-50 text-slate-700 font-bold text-xs uppercase">
                    <tr>
                        <th className="px-4 py-3 border-b">Đợt thanh toán</th>
                        <th className="px-4 py-3 border-b">Nội dung</th>
                        <th className="px-4 py-3 border-b text-center">Tỷ lệ (%)</th>
                        <th className="px-4 py-3 border-b text-right">Giá trị (VNĐ)</th>
                        <th className="px-4 py-3 border-b text-center">Ngày thu tiền</th>
                        <th className="px-4 py-3 border-b text-center">Trạng thái thanh toán</th>
                        <th className="px-4 py-3 border-b text-center">Trạng thái hóa đơn</th>
                        <th className="px-4 py-3 border-b text-center w-16"></th>
                    </tr>
                </thead>
                <tbody>
                    {paymentTerms && paymentTerms.length > 0 ? (
                        paymentTerms.map((term, idx) => (
                            <tr key={term.id || idx} className="hover:bg-slate-50 border-b border-slate-100 last:border-0">
                                <td className="px-2 py-2">
                                    <input
                                        className="w-full px-2 py-1.5 border border-transparent hover:border-slate-300 focus:border-blue-500 rounded bg-transparent outline-none transition-all font-medium"
                                        value={term.batch}
                                        onChange={(e) => handleUpdatePaymentTerm(term.id, 'batch', e.target.value)}
                                    />
                                </td>
                                <td className="px-2 py-2">
                                    <input
                                        className="w-full px-2 py-1.5 border border-transparent hover:border-slate-300 focus:border-blue-500 rounded bg-transparent outline-none transition-all"
                                        value={term.content}
                                        placeholder="Nội dung..."
                                        onChange={(e) => handleUpdatePaymentTerm(term.id, 'content', e.target.value)}
                                    />
                                </td>
                                <td className="px-2 py-2 text-center">
                                    <input
                                        type="number"
                                        className="w-20 px-2 py-1.5 border border-transparent hover:border-slate-300 focus:border-blue-500 rounded bg-transparent outline-none text-center transition-all"
                                        value={term.ratio}
                                        onChange={(e) => handleUpdatePaymentTerm(term.id, 'ratio', e.target.value)}
                                    />
                                </td>
                                <td className="px-2 py-2 text-right">
                                    <input
                                        type="number"
                                        className="w-32 px-2 py-1.5 border border-transparent hover:border-slate-300 focus:border-blue-500 rounded bg-transparent outline-none text-right font-bold text-slate-800 transition-all"
                                        value={term.value}
                                        onChange={(e) => handleUpdatePaymentTerm(term.id, 'value', e.target.value)}
                                    />
                                </td>
                                <td className="px-2 py-2 text-center">
                                    <CustomDatePicker
                                        value={term.collectionDate || ''}
                                        onChange={(val) => handleUpdatePaymentTerm(term.id, 'collectionDate', val)}
                                        className="w-full"
                                    />
                                </td>
                                <td className="px-2 py-2 text-center">
                                    <select
                                        className={`px-2 py-1.5 border border-transparent hover:border-slate-300 focus:border-blue-500 rounded outline-none transition-all text-xs font-bold ${term.isCollected ? 'text-emerald-600 bg-emerald-50' : 'text-slate-500 bg-slate-100'}`}
                                        value={term.isCollected ? 'true' : 'false'}
                                        onChange={(e) => handleUpdatePaymentTerm(term.id, 'isCollected', e.target.value === 'true')}
                                    >
                                        <option value="false">Chưa thu tiền</option>
                                        <option value="true">Đã thu tiền</option>
                                    </select>
                                </td>
                                <td className="px-2 py-2 text-center">
                                    <select
                                        className={`px-2 py-1.5 border border-transparent hover:border-slate-300 focus:border-blue-500 rounded outline-none transition-all text-xs font-bold ${term.invoiceStatus === 'exported' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 bg-slate-100'}`}
                                        value={term.invoiceStatus || 'not_exported'}
                                        onChange={(e) => handleUpdatePaymentTerm(term.id, 'invoiceStatus', e.target.value)}
                                    >
                                        <option value="not_exported">Chưa xuất</option>
                                        <option value="exported">Đã xuất</option>
                                    </select>
                                </td>
                                <td className="px-2 py-2 text-center">
                                    <button onClick={() => handleDeletePayment(term.id)} className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded transition-colors"><Icons.Trash size={16} /></button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={8} className="text-center py-8 text-slate-400 italic">Chưa có điều khoản thanh toán nào. Nhấn "Thêm đợt" để tạo mới.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
