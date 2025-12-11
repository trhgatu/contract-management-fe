import React from 'react';
import { Icons } from '../../../components/ui/Icons';
import { Contract, ContractAttachment } from '../../../types';
import { formatCurrency } from '../utils';
import { Button, Tooltip, Popconfirm, Tag, Space } from 'antd';

interface ContractListProps {
    contracts: Contract[];
    selectedContractId: string | null;
    setSelectedContractId: (id: string | null) => void;
    handleOpenEditModal: (contract: Contract) => void;
    handleDeleteContract: (id: string) => void;
    openViewFilesModal: (title: string, files: ContractAttachment[]) => void;
}

export const ContractList: React.FC<ContractListProps> = ({
    contracts,
    selectedContractId,
    setSelectedContractId,
    handleOpenEditModal,
    handleDeleteContract,
    openViewFilesModal,
}) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-[400px]">
            <div className="overflow-auto flex-1">
                <table className="w-full text-sm text-left border-collapse">
                    <thead className="bg-slate-100 text-slate-700 font-bold text-xs uppercase sticky top-0 z-10 shadow-sm">
                        <tr>
                            <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200">Số hợp đồng</th>
                            <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200">Ngày ký</th>
                            <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200">Khách hàng</th>
                            <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200">Nội dung hợp đồng</th>
                            <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200">Loại phần mềm</th>
                            <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200 text-right">Giá trị trước VAT</th>
                            <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200 text-right">VAT</th>
                            <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200 text-right">Giá trị sau VAT</th>
                            <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200 text-center">Ngày nghiệm thu</th>
                            <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200 text-center">File đính kèm</th>
                            <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200 text-center">Thời hạn</th>
                            <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200 text-center w-24">Tác vụ</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {contracts.map((contract) => {
                            // Handle API response format - customer might be object or string
                            const customerName = typeof contract.customer === 'object' && contract.customer
                                ? contract.customer.name
                                : contract.customerName || '-';

                            // Handle software types - might be array of objects or strings
                            const softwareTypes = contract.softwareTypes
                                ? (Array.isArray(contract.softwareTypes)
                                    ? contract.softwareTypes.map((s: any) =>
                                        typeof s === 'object' ? (s.name || s.code) : s
                                    )
                                    : [])
                                : [];

                            return (
                                <tr
                                    key={contract.id}
                                    onClick={() => setSelectedContractId(contract.id)}
                                    className={`cursor-pointer transition-colors ${selectedContractId === contract.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'hover:bg-slate-50 border-l-4 border-l-transparent'}`}
                                >
                                    <td className="px-4 py-3 font-bold text-blue-700 whitespace-nowrap">{contract.code}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-slate-600">{contract.signDate}</td>
                                    <td className="px-4 py-3 font-medium text-slate-800 whitespace-nowrap max-w-[200px] truncate" title={customerName}>{customerName}</td>
                                    <td className="px-4 py-3 text-slate-500 max-w-[250px] truncate" title={contract.content}>{contract.content}</td>
                                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                                        <div className="flex gap-1">
                                            {softwareTypes.map((t, i) => (
                                                <span key={i} className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] font-medium">{t}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-right text-slate-600 whitespace-nowrap">{formatCurrency(contract.valuePreVat)}</td>
                                    <td className="px-4 py-3 text-right text-slate-500 whitespace-nowrap">{formatCurrency(contract.vat)}</td>
                                    <td className="px-4 py-3 text-right font-bold text-slate-800 whitespace-nowrap">{formatCurrency(contract.valuePostVat)}</td>
                                    <td className="px-4 py-3 text-center text-slate-600 whitespace-nowrap">{contract.acceptanceDate || '-'}</td>
                                    <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                                        <Button
                                            size="small"
                                            onClick={() => openViewFilesModal(contract.code, contract.attachments || [])}
                                            icon={<Icons.Attach size={14} />}
                                            className="inline-flex items-center text-xs"
                                        >
                                            Xem {contract.attachments && contract.attachments.length > 0 ? `(${contract.attachments.length})` : ''}
                                        </Button>
                                    </td>
                                    <td className="px-4 py-3 text-center text-slate-600 whitespace-nowrap">{contract.duration}</td>
                                    <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                                        <Space size="small">
                                            <Tooltip title="Chỉnh sửa">
                                                <Button
                                                    type="text"
                                                    size="small"
                                                    icon={<Icons.Edit size={16} className="text-blue-600" />}
                                                    onClick={() => handleOpenEditModal(contract)}
                                                />
                                            </Tooltip>
                                            <Popconfirm
                                                title="Xóa hợp đồng?"
                                                description="Hành động này không thể hoàn tác."
                                                onConfirm={() => handleDeleteContract(contract.id)}
                                                okText="Xóa"
                                                cancelText="Hủy"
                                                okButtonProps={{ danger: true }}
                                            >
                                                <Tooltip title="Xóa">
                                                    <Button
                                                        type="text"
                                                        size="small"
                                                        icon={<Icons.Trash size={16} className="text-rose-500" />}
                                                    />
                                                </Tooltip>
                                            </Popconfirm>
                                        </Space>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {/* Pagination */}
            <div className="p-2 px-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center text-xs text-slate-500">
                <span>Hiển thị {contracts.length} hợp đồng</span>
                <div className="flex gap-1">
                    <button className="px-2 py-1 border rounded bg-white hover:bg-slate-50 disabled:opacity-50">Trước</button>
                    <button className="px-2 py-1 border rounded bg-blue-600 text-white">1</button>
                    <button className="px-2 py-1 border rounded bg-white hover:bg-slate-50">2</button>
                    <button className="px-2 py-1 border rounded bg-white hover:bg-slate-50">Sau</button>
                </div>
            </div>
        </div>
    )
}
