
import React from 'react';
import { Icons } from '../../../../components/ui/Icons';
import { ProjectMember } from '../../../../types';

interface MembersTabProps {
    members: ProjectMember[];
    handleAddMember: () => void;
    handleUpdateMember: (id: string, field: keyof ProjectMember, value: any) => void;
    handleDeleteMember: (id: string) => void;
}

export const MembersTab: React.FC<MembersTabProps> = ({
    members,
    handleAddMember,
    handleUpdateMember,
    handleDeleteMember,
}) => {
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-slate-700 text-sm uppercase">Danh sách thành viên dự án</h4>
                <button
                    onClick={handleAddMember}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 flex items-center gap-2 shadow-sm"
                >
                    <Icons.Plus size={14} /> Thêm thành viên
                </button>
            </div>
            <table className="w-full text-sm text-left border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-50 text-slate-700 font-bold text-xs uppercase">
                    <tr>
                        <th className="px-4 py-3 border-b w-16 text-center">#</th>
                        <th className="px-4 py-3 border-b">Mã thành viên</th>
                        <th className="px-4 py-3 border-b">Tên thành viên</th>
                        <th className="px-4 py-3 border-b">Chức vụ / Vai trò</th>
                        <th className="px-4 py-3 border-b text-center w-16"></th>
                    </tr>
                </thead>
                <tbody>
                    {members && members.length > 0 ? (
                        members.map((mem, idx) => (
                            <tr key={mem.id || idx} className="hover:bg-slate-50 border-b border-slate-100 last:border-0">
                                <td className="px-2 py-2 text-center text-slate-400">{idx + 1}</td>
                                <td className="px-2 py-2">
                                    <input
                                        className="w-full px-2 py-1.5 border border-transparent hover:border-slate-300 focus:border-blue-500 rounded bg-transparent outline-none transition-all font-mono"
                                        value={mem.memberCode}
                                        placeholder="NV..."
                                        onChange={(e) => handleUpdateMember(mem.id, 'memberCode', e.target.value)}
                                    />
                                </td>
                                <td className="px-2 py-2">
                                    <input
                                        className="w-full px-2 py-1.5 border border-transparent hover:border-slate-300 focus:border-blue-500 rounded bg-transparent outline-none transition-all font-bold text-slate-700"
                                        value={mem.name}
                                        placeholder="Tên thành viên"
                                        onChange={(e) => handleUpdateMember(mem.id, 'name', e.target.value)}
                                    />
                                </td>
                                <td className="px-2 py-2">
                                    <select
                                        className="w-full px-2 py-1.5 border border-transparent hover:border-slate-300 focus:border-blue-500 rounded bg-transparent outline-none transition-all text-sm font-medium"
                                        value={mem.role}
                                        onChange={(e) => handleUpdateMember(mem.id, 'role', e.target.value)}
                                    >
                                        <option value="PM">Project Manager (PM)</option>
                                        <option value="BA">Business Analyst (BA)</option>
                                        <option value="Dev">Developer</option>
                                        <option value="Tester">Tester / QC</option>
                                        <option value="AM">Account Manager</option>
                                    </select>
                                </td>
                                <td className="px-2 py-2 text-center">
                                    <button onClick={() => handleDeleteMember(mem.id)} className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded transition-colors"><Icons.Trash size={16} /></button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="text-center py-8 text-slate-400 italic">Chưa có thành viên tham gia. Nhấn "Thêm thành viên" để tạo mới.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
