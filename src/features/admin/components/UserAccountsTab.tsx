
import React from 'react';
import { Icons } from '../../../components/ui/Icons';
import { SystemUser, UserGroup } from '../../../types';
import { Button, Tooltip, Popconfirm } from 'antd';

interface UserAccountsTabProps {
    users: SystemUser[];
    groups: UserGroup[];
    openModal: (mode: 'add' | 'edit', item?: any) => void;
    handleDelete: (id: string, type: 'user' | 'group') => void;
}

export const UserAccountsTab: React.FC<UserAccountsTabProps> = ({ users, groups, openModal, handleDelete }) => {
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2">
                    <input type="text" placeholder="Tìm kiếm tài khoản..." className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 w-64" />
                </div>
                <button onClick={() => openModal('add')} className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">
                    <Icons.Plus size={16} /> Thêm tài khoản
                </button>
            </div>
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                        <tr>
                            <th className="px-4 py-3 w-16 text-center">STT</th>
                            <th className="px-4 py-3">Nhóm tài khoản</th>
                            {/* <th className="px-4 py-3">Tên đăng nhập</th> */}
                            <th className="px-4 py-3">Họ tên</th>
                            <th className="px-4 py-3">Email</th>
                            <th className="px-4 py-3 text-center">Trạng thái</th>
                            <th className="px-4 py-3 text-center w-24">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {users.map((user, idx) => {
                            const groupName = groups.find(g => g.id === user.groupId)?.name || '---';
                            return (
                                <tr key={user.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-3 text-center text-slate-500">{idx + 1}</td>
                                    <td className="px-4 py-3">
                                        <span className="px-2 py-0.5 bg-slate-100 rounded text-xs font-medium border border-slate-200">{groupName}</span>
                                    </td>
                                    {/* <td className="px-4 py-3 font-medium text-slate-800">{user.username}</td> */}
                                    <td className="px-4 py-3 font-medium text-slate-800">{user.name}</td>
                                    <td className="px-4 py-3 text-slate-500">{user.email}</td>
                                    <td className="px-4 py-3 text-center">
                                        {user.status === 'active'
                                            ? <span className="text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-full">Hoạt động</span>
                                            : <span className="text-slate-500 text-xs font-bold bg-slate-100 px-2 py-1 rounded-full">Đã khóa</span>
                                        }
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <Tooltip title="Chỉnh sửa">
                                                <Button
                                                    type="text"
                                                    size="small"
                                                    icon={<Icons.Edit size={16} className="text-blue-600" />}
                                                    onClick={() => openModal('edit', user)}
                                                />
                                            </Tooltip>
                                            <Popconfirm
                                                title="Xóa người dùng?"
                                                description="Hành động này không thể hoàn tác."
                                                onConfirm={() => handleDelete(user.id, 'user')}
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
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
