import React, { useState, useEffect } from 'react';
import { Icons } from '@/components/ui/Icons';
import { CustomDatePicker } from '@/components/ui/CustomDatePicker';
import { Contract } from '@/types';
import { masterDataService } from '@/services';

interface GeneralTabProps {
    formData: Partial<Contract>;
    handleFormChange: (field: keyof Contract, value: any) => void;
    handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    removeFile: (fileId: string) => void;
}

export const GeneralTab: React.FC<GeneralTabProps> = ({ formData, handleFormChange, handleFileUpload, removeFile }) => {
    const [softwares, setSoftwares] = useState<any[]>([]);
    const [loadingSoftwares, setLoadingSoftwares] = useState(true);
    const [customers, setCustomers] = useState<any[]>([]);
    const [loadingCustomers, setLoadingCustomers] = useState(true);
    const [contractTypes, setContractTypes] = useState<any[]>([]);
    const [statuses, setStatuses] = useState<any[]>([]);
    const [loadingMasterData, setLoadingMasterData] = useState(true);

    useEffect(() => {
        const fetchAllMasterData = async () => {
            try {
                setLoadingMasterData(true);
                const [swData, custData, typeData, statusData] = await Promise.all([
                    masterDataService.getAll('software' as any),
                    masterDataService.getAll('customers' as any),
                    masterDataService.getAll('contract-types' as any),
                    masterDataService.getAll('status' as any)
                ]);
                setSoftwares(swData);
                setCustomers(custData);
                setContractTypes(typeData);
                setStatuses(statusData);
            } catch (err) {
                console.error('Error fetching master data:', err);
            } finally {
                setLoadingMasterData(false);
                setLoadingSoftwares(false);
                setLoadingCustomers(false);
            }
        };
        fetchAllMasterData();
    }, []);

    const handleSoftwareToggle = (softwareId: string) => {
        const current = formData.softwareIds || [];
        if (current.includes(softwareId)) {
            handleFormChange('softwareIds', current.filter(id => id !== softwareId));
        } else {
            handleFormChange('softwareIds', [...current, softwareId]);
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Column 1 */}
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700">Số hợp đồng <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            value={formData.code || ''}
                            onChange={(e) => handleFormChange('code', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                            placeholder="VD: HD-2025/..."
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700">Ngày ký <span className="text-red-500">*</span></label>
                        <CustomDatePicker
                            value={formData.signDate || ''}
                            onChange={(val) => handleFormChange('signDate', val)}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700">Thời hạn</label>
                        <input
                            type="text"
                            value={formData.duration || ''}
                            onChange={(e) => handleFormChange('duration', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                            placeholder="VD: 12 Tháng"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700">Loại hợp đồng</label>
                        <select
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none bg-white"
                            value={formData.contractTypeId || ''}
                            onChange={(e) => handleFormChange('contractTypeId', e.target.value)}
                            disabled={loadingMasterData}
                        >
                            <option value="">-- Chọn loại hợp đồng --</option>
                            {contractTypes.map(type => (
                                <option key={type.id} value={type.id}>{type.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700">Trạng thái</label>
                        <select
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none bg-white"
                            value={formData.statusId || ''}
                            onChange={(e) => handleFormChange('statusId', e.target.value)}
                            disabled={loadingMasterData}
                        >
                            <option value="">-- Chọn trạng thái --</option>
                            {statuses.map(st => (
                                <option key={st.id} value={st.id}>{st.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Column 2 */}
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700">Khách hàng <span className="text-red-500">*</span></label>
                        <select
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none bg-white"
                            value={formData.customerId || ''}
                            onChange={(e) => handleFormChange('customerId', e.target.value)}
                            disabled={loadingCustomers}
                        >
                            <option value="">{loadingCustomers ? 'Đang tải...' : '-- Chọn khách hàng --'}</option>
                            {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700">Người liên hệ</label>
                        <input type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700">Đơn vị thực hiện</label>
                        <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none bg-white">
                            <option>CEH Software</option>
                            <option>CEH Infra</option>
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700">Người thực hiện (AM/PM)</label>
                        <input type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700">
                            Ngày nghiệm thu {formData.status === 'ST03' && <span className="text-red-500">*</span>}
                        </label>
                        <CustomDatePicker
                            value={formData.acceptanceDate || ''}
                            onChange={(val) => handleFormChange('acceptanceDate', val)}
                            className={formData.status === 'ST03' && !formData.acceptanceDate ? 'border-red-300 bg-red-50' : ''}
                        />
                    </div>
                </div>

                {/* Column 3 */}
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700">Loại phần mềm <span className="text-red-500">*</span></label>
                        <div className="h-[180px] overflow-y-auto border border-slate-200 rounded-lg p-2 space-y-1">
                            {loadingSoftwares ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                </div>
                            ) : softwares.length > 0 ? (
                                softwares.map((software) => (
                                    <label key={software.id} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:bg-slate-50 p-1 rounded">
                                        <input
                                            type="checkbox"
                                            checked={formData.softwareIds?.includes(software.id) || false}
                                            onChange={() => handleSoftwareToggle(software.id)}
                                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        {software.name}
                                    </label>
                                ))
                            ) : (
                                <p className="text-sm text-slate-400 text-center py-4">Không có dữ liệu phần mềm</p>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700">Giá trị trước VAT</label>
                            <input
                                type="number"
                                value={formData.valuePreVat || ''}
                                onChange={(e) => handleFormChange('valuePreVat', Number(e.target.value))}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none text-right"
                                placeholder="0"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700">VAT (%)</label>
                            <input
                                type="number"
                                value={formData.vat || 10}
                                onChange={(e) => handleFormChange('vat', Number(e.target.value))}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none text-right"
                            />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700">Giá trị sau VAT</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800 text-right"
                            value={formData.valuePostVat || 0}
                            onChange={(e) => handleFormChange('valuePostVat', Number(e.target.value))}
                        />
                    </div>
                </div>
            </div>

            {/* FILE UPLOAD SECTION */}
            <div className="border-t border-slate-100 pt-6">
                <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <Icons.Attach size={18} className="text-blue-600" /> Tài liệu đính kèm
                </h4>

                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 bg-slate-50/50 hover:bg-blue-50/30 hover:border-blue-200 transition-colors text-center relative mb-4">
                    <input
                        type="file"
                        multiple
                        accept=".pdf,.docx,.doc,.xlsx,.xls,.png,.jpg,.jpeg"
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center justify-center pointer-events-none">
                        <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center mb-2">
                            <Icons.Upload size={20} className="text-blue-600" />
                        </div>
                        <p className="text-sm font-medium text-slate-700">
                            <span className="text-blue-600">Click để chọn</span> hoặc kéo thả file vào đây
                        </p>
                        <p className="text-xs text-slate-400 mt-1">Hỗ trợ: PDF, Word, Excel, Images (Max 10MB)</p>
                    </div>
                </div>

                {formData.attachments && formData.attachments.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {formData.attachments.map((file) => (
                            <div key={file.id} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg shadow-sm group">
                                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                    {file.type === 'pdf' ? <Icons.File size={20} /> : <Icons.FileText size={20} />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-700 truncate" title={file.name}>{file.name}</p>
                                    <p className="text-xs text-slate-400">{file.size} • {file.uploadDate}</p>
                                </div>
                                <button
                                    onClick={() => removeFile(file.id)}
                                    className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded transition-colors"
                                >
                                    <Icons.X size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
