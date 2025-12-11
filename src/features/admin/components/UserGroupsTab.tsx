
import React from 'react';
import { Icons } from '../../../components/ui/Icons';
import { UserGroup } from '../../../types';
import { Button, Tooltip, Popconfirm } from 'antd';

interface UserGroupsTabProps {
    groups: UserGroup[];
    openModal: (mode: 'add' | 'edit', item?: any) => void;
    handleDelete: (id: string, type: 'user' | 'group') => void;
}

export const UserGroupsTab: React.FC<UserGroupsTabProps> = ({ groups, openModal, handleDelete }) => {
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-800">Danh sách nhóm tài khoản</h3>
                <button onClick={() => openModal('add')} className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">
                    <Icons.Plus size={16} /> Thêm nhóm
                </button>
            </div>
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                        <tr>
                            <th className="px-4 py-3 w-16 text-center">STT</th>
                            <th className="px-4 py-3 w-48">Mã nhóm</th>
                            <th className="px-4 py-3 w-64">Tên nhóm tài khoản</th>
                            <th className="px-4 py-3">Ghi chú</th>
                            <th className="px-4 py-3 text-center w-24">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {groups.map((group, idx) => (
                            <tr key={group.id} className="hover:bg-slate-50">
                                <td className="px-4 py-3 text-center text-slate-500">{idx + 1}</td>
                                <td className="px-4 py-3 font-mono text-blue-700 font-bold">{group.code}</td>
                                <td className="px-4 py-3 font-bold text-slate-800">{group.name}</td>
                                <td className="px-4 py-3 text-slate-500 italic">{group.note}</td>
                                <td className="px-4 py-3 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <Tooltip title="Chỉnh sửa">
                                            <Button
                                                type="text"
                                                size="small"
                                                icon={<Icons.Edit size={16} className="text-blue-600" />}
                                                onClick={() => openModal('edit', group)}
                                            />
                                        </Tooltip>
                                        <Popconfirm
                                            title="Xóa nhóm?"
                                            description="Hành động này không thể hoàn tác."
                                            onConfirm={() => handleDelete(group.id, 'group')}
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
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
