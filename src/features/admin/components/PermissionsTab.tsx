
import React from 'react';
import { Icons } from '../../../components/ui/Icons';
import { PermissionNode, UserGroup } from '../../../types';
import { Button } from 'antd';

interface PermissionsTabProps {
    permissions: PermissionNode[];
    groups: UserGroup[];
    selectedGroupForPermission: string;
    setSelectedGroupForPermission: (value: string) => void;
    togglePermission: (permId: string, field: 'canView' | 'canAdd' | 'canEdit' | 'canDelete') => void;
    onSave: () => void;
    isSaving: boolean;
}

export const PermissionsTab: React.FC<PermissionsTabProps> = ({
    permissions,
    groups,
    selectedGroupForPermission,
    setSelectedGroupForPermission,
    togglePermission,
    onSave,
    isSaving
}) => {
    return (
        <div>
            <div className="flex items-center gap-4 mb-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
                <label className="text-sm font-bold text-slate-700">Chọn nhóm tài khoản phân quyền:</label>
                <select
                    value={selectedGroupForPermission}
                    onChange={(e) => setSelectedGroupForPermission(e.target.value)}
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white min-w-[250px] font-medium text-slate-800"
                >
                    {groups.map(g => (
                        <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                </select>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3 w-16 text-center">STT</th>
                            <th className="px-4 py-3">Tên danh mục / Chức năng</th>
                            <th className="px-4 py-3 text-center w-24">Xem</th>
                            <th className="px-4 py-3 text-center w-24">Thêm</th>
                            <th className="px-4 py-3 text-center w-24">Sửa</th>
                            <th className="px-4 py-3 text-center w-24">Xóa</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {permissions.map((perm, idx) => (
                            <tr key={perm.id} className={`hover:bg-blue-50/50 ${perm.isParent ? 'bg-slate-50 font-bold' : ''}`}>
                                <td className="px-4 py-3 text-center text-slate-400">{idx + 1}</td>
                                <td className="px-4 py-3">
                                    <div style={{ paddingLeft: perm.isParent ? 0 : '24px' }} className={perm.isParent ? 'text-blue-800' : 'text-slate-700'}>
                                        {perm.name}
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <input type="checkbox" checked={perm.canView} onChange={() => togglePermission(perm.id, 'canView')} className="w-4 h-4 text-blue-600 rounded cursor-pointer" />
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <input type="checkbox" checked={perm.canAdd} onChange={() => togglePermission(perm.id, 'canAdd')} className="w-4 h-4 text-blue-600 rounded cursor-pointer" />
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <input type="checkbox" checked={perm.canEdit} onChange={() => togglePermission(perm.id, 'canEdit')} className="w-4 h-4 text-blue-600 rounded cursor-pointer" />
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <input type="checkbox" checked={perm.canDelete} onChange={() => togglePermission(perm.id, 'canDelete')} className="w-4 h-4 text-blue-600 rounded cursor-pointer" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-end mt-4">
                <Button
                    type="primary"
                    onClick={onSave}
                    loading={isSaving}
                    icon={<Icons.Save size={18} />}
                    className="bg-blue-600 hover:bg-blue-700 font-bold shadow-lg h-10 px-6"
                >
                    Lưu phân quyền
                </Button>
            </div>
        </div>
    );
};
