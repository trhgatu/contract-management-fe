
import React, { useState, useEffect } from 'react';
import { Icons } from './Icons';
import { MOCK_USERS, MOCK_AUDIT_LOGS, MOCK_USER_GROUPS, MOCK_PERMISSIONS } from '../constants';
import { AdminTabType, SystemUser, UserGroup, PermissionNode } from '../types';
import { CustomDatePicker } from './CustomDatePicker';

interface AdminScreenProps {
  activeTab?: AdminTabType;
}

export const AdminScreen: React.FC<AdminScreenProps> = ({ activeTab = 'config' }) => {
  const [currentTab, setCurrentTab] = useState<AdminTabType>(activeTab);
  
  // Data States
  const [users, setUsers] = useState<SystemUser[]>(MOCK_USERS);
  const [groups, setGroups] = useState<UserGroup[]>(MOCK_USER_GROUPS);
  const [permissions, setPermissions] = useState<PermissionNode[]>(MOCK_PERMISSIONS);
  const [selectedGroupForPermission, setSelectedGroupForPermission] = useState<string>(groups[0]?.id || '');

  // Log States
  const [logSearchUser, setLogSearchUser] = useState('');
  const [logFromDate, setLogFromDate] = useState('');
  const [logToDate, setLogToDate] = useState('');
  const [logAction, setLogAction] = useState('ALL');
  const [viewLogDetails, setViewLogDetails] = useState<any>(null);

  // UI States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editItem, setEditItem] = useState<any>(null); // Generic for user/group

  // Sync internal state if prop changes (navigation from header)
  useEffect(() => {
    setCurrentTab(activeTab);
  }, [activeTab]);

  // --- BREADCRUMBS LOGIC ---
  const getBreadcrumbs = () => {
      const base = 'Quản trị hệ thống';
      switch(currentTab) {
          case 'user-accounts': return `${base} > Quản lý người dùng > Quản lý tài khoản`;
          case 'user-groups': return `${base} > Quản lý người dùng > Quản lý nhóm tài khoản`;
          case 'permissions': return `${base} > Quản lý người dùng > Quản lý phân quyền`;
          case 'logs': return `${base} > Nhật ký hệ thống`;
          case 'notification': return `${base} > Cảnh báo & Thông báo`;
          case 'config': return `${base} > Cấu hình hệ thống`;
          default: return base;
      }
  };

  // --- CRUD HANDLERS (GENERIC) ---
  const handleDelete = (id: string, type: 'user' | 'group') => {
      if(!window.confirm('Bạn có chắc chắn muốn xóa?')) return;
      if(type === 'user') {
          setUsers(prev => prev.filter(u => u.id !== id));
      } else {
          setGroups(prev => prev.filter(g => g.id !== id));
      }
  };

  const handleSaveUser = (data: any) => {
      if(modalMode === 'add') {
          const newUser = { ...data, id: `u_${Date.now()}`, lastLogin: 'Chưa đăng nhập' };
          setUsers(prev => [...prev, newUser]);
      } else {
          setUsers(prev => prev.map(u => u.id === data.id ? { ...u, ...data } : u));
      }
      setIsModalOpen(false);
  };

  const handleSaveGroup = (data: any) => {
      if(modalMode === 'add') {
          const newGroup = { ...data, id: `g_${Date.now()}` };
          setGroups(prev => [...prev, newGroup]);
      } else {
          setGroups(prev => prev.map(g => g.id === data.id ? data : g));
      }
      setIsModalOpen(false);
  };

  const openModal = (mode: 'add' | 'edit', item?: any) => {
      setModalMode(mode);
      setEditItem(item || {});
      setIsModalOpen(true);
  };

  // --- PERMISSION HANDLERS ---
  const togglePermission = (permId: string, field: 'canView' | 'canAdd' | 'canEdit' | 'canDelete') => {
      setPermissions(prev => {
          const newPerms = [...prev];
          const targetIndex = newPerms.findIndex(p => p.id === permId);
          if(targetIndex === -1) return prev;

          // Toggle the specific field
          newPerms[targetIndex] = { ...newPerms[targetIndex], [field]: !newPerms[targetIndex][field] };
          
          const target = newPerms[targetIndex];

          if(target.isParent) {
              // Find children
              newPerms.forEach((p, idx) => {
                  if(p.parentId === target.id) {
                      newPerms[idx] = { ...newPerms[idx], [field]: target[field] };
                  }
              });
          }

          return newPerms;
      });
  };

  // --- LOG HANDLERS ---
  const filteredLogs = MOCK_AUDIT_LOGS.filter(log => {
      const matchUser = log.user.toLowerCase().includes(logSearchUser.toLowerCase());
      const matchAction = logAction === 'ALL' || log.action === logAction;
      
      // Date logic (Simplified for string comparison dd/mm/yyyy)
      // In real app, convert string to Date objects
      let matchDate = true;
      if (logFromDate && logToDate) {
           // Simple string includes for demo purposes or custom logic needed for dd/mm/yyyy range
           // For this mock, we skip strict date range logic to avoid complexity without momentjs/date-fns
           // Assuming if user selects date, we roughly check (or just ignore for mock)
      }
      
      return matchUser && matchAction && matchDate;
  });

  const handleExportLogs = (type: 'csv' | 'excel') => {
      // Mock Export
      const extension = type === 'csv' ? 'csv' : 'xls';
      const content = "STT,Thời gian,Người thực hiện,Chức năng,Hành động,Chi tiết\n" + 
          filteredLogs.map((l, i) => `${i+1},${l.timestamp},${l.user},${l.screen},${l.action},"${JSON.stringify(l.details).replace(/"/g, '""')}"`).join("\n");
      
      const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `System_Logs_${new Date().toISOString().slice(0,10)}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
       
       <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800">Quản trị hệ thống</h2>
        <div className="text-sm text-slate-500 flex items-center gap-2 font-medium">
            {getBreadcrumbs()}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col flex-1">
         <div className="p-6 overflow-y-auto flex-1">
             
             {/* 1. CONFIG */}
             {currentTab === 'config' && (
                 <div className="max-w-4xl space-y-8">
                     {/* General Settings */}
                     <div>
                         <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Icons.Settings size={20} className="text-slate-400"/> Thiết lập chung
                         </h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="space-y-1">
                                 <label className="text-sm font-medium text-slate-700">Tên hệ thống</label>
                                 <input type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none" defaultValue="CEH Contract Management" />
                             </div>
                             <div className="space-y-1">
                                 <label className="text-sm font-medium text-slate-700">Domain</label>
                                 <input type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none" defaultValue="contract.ceh.vn" />
                             </div>
                         </div>
                     </div>
                     <div className="flex justify-end pt-4">
                         <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm">Lưu cấu hình</button>
                     </div>
                 </div>
             )}

             {/* 2. USER ACCOUNTS */}
             {currentTab === 'user-accounts' && (
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
                                    <th className="px-4 py-3">Tên đăng nhập</th>
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
                                            <td className="px-4 py-3 font-medium text-slate-800">{user.username}</td>
                                            <td className="px-4 py-3 text-slate-600">{user.fullName}</td>
                                            <td className="px-4 py-3 text-slate-500">{user.email}</td>
                                            <td className="px-4 py-3 text-center">
                                                {user.status === 'active' 
                                                    ? <span className="text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-full">Hoạt động</span>
                                                    : <span className="text-slate-500 text-xs font-bold bg-slate-100 px-2 py-1 rounded-full">Đã khóa</span>
                                                }
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button onClick={() => openModal('edit', user)} className="text-blue-600 hover:text-blue-800"><Icons.Edit size={16}/></button>
                                                    <button onClick={() => handleDelete(user.id, 'user')} className="text-rose-500 hover:text-rose-700"><Icons.Trash size={16}/></button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                     </div>
                 </div>
             )}

             {/* 3. USER GROUPS */}
             {currentTab === 'user-groups' && (
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
                                                <button onClick={() => openModal('edit', group)} className="text-blue-600 hover:text-blue-800"><Icons.Edit size={16}/></button>
                                                <button onClick={() => handleDelete(group.id, 'group')} className="text-rose-500 hover:text-rose-700"><Icons.Trash size={16}/></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                     </div>
                 </div>
             )}

             {/* 4. PERMISSIONS */}
             {currentTab === 'permissions' && (
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
                         <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg flex items-center gap-2">
                             <Icons.Save size={18} /> Lưu phân quyền
                         </button>
                     </div>
                 </div>
             )}

             {/* 5. LOGS */}
             {currentTab === 'logs' && (
                 <div>
                      {/* Filters */}
                      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                             <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Người thực hiện</label>
                                <input 
                                    type="text" 
                                    placeholder="Nhập tên đăng nhập..." 
                                    value={logSearchUser}
                                    onChange={(e) => setLogSearchUser(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white" 
                                />
                             </div>
                             <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Từ ngày</label>
                                <CustomDatePicker value={logFromDate} onChange={setLogFromDate} placeholder="dd/mm/yyyy" />
                             </div>
                             <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Đến ngày</label>
                                <CustomDatePicker value={logToDate} onChange={setLogToDate} placeholder="dd/mm/yyyy" />
                             </div>
                             <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Loại hành động</label>
                                <select 
                                    value={logAction}
                                    onChange={(e) => setLogAction(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white"
                                >
                                    <option value="ALL">Tất cả</option>
                                    <option value="THÊM">THÊM</option>
                                    <option value="SỬA">SỬA</option>
                                    <option value="XÓA">XÓA</option>
                                </select>
                             </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-slate-200">
                             <button onClick={() => handleExportLogs('csv')} className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition-colors">
                                 <Icons.FileText size={14}/> Export CSV
                             </button>
                             <button onClick={() => handleExportLogs('excel')} className="flex items-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors">
                                 <Icons.Download size={14}/> Export Excel
                             </button>
                        </div>
                      </div>

                      {/* Table */}
                      <div className="overflow-x-auto border border-slate-200 rounded-lg">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-xs">
                                <tr>
                                    <th className="px-4 py-3 w-16 text-center">STT</th>
                                    <th className="px-4 py-3">Thời gian thực hiện</th>
                                    <th className="px-4 py-3">Người thực hiện</th>
                                    <th className="px-4 py-3">Chức năng</th>
                                    <th className="px-4 py-3 text-center">Loại hành động</th>
                                    <th className="px-4 py-3 text-center">Dữ liệu thay đổi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredLogs.length > 0 ? filteredLogs.map((log, idx) => (
                                    <tr key={log.id} className="hover:bg-slate-50">
                                        <td className="px-4 py-3 text-center text-slate-500">{idx + 1}</td>
                                        <td className="px-4 py-3 font-mono text-slate-600">{log.timestamp}</td>
                                        <td className="px-4 py-3 font-bold text-slate-700">{log.user}</td>
                                        <td className="px-4 py-3 text-slate-600">{log.screen}</td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                                log.action === 'THÊM' ? 'bg-blue-100 text-blue-700' :
                                                log.action === 'XÓA' ? 'bg-red-100 text-red-700' :
                                                log.action === 'SỬA' ? 'bg-orange-100 text-orange-700' :
                                                'bg-slate-100 text-slate-600'
                                            }`}>
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <button 
                                                onClick={() => setViewLogDetails(log)}
                                                className="text-blue-600 hover:text-blue-800 text-xs font-bold underline flex items-center justify-center gap-1 mx-auto"
                                            >
                                                <Icons.Eye size={14}/> Xem
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={6} className="text-center py-8 text-slate-400">Không tìm thấy dữ liệu nhật ký phù hợp.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                     </div>
                 </div>
             )}
         </div>
      </div>

      {/* --- SHARED MODAL (Add/Edit User/Group) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
                    <h3 className="text-xl font-bold text-slate-800">
                        {modalMode === 'add' ? 'Thêm mới' : 'Cập nhật'} {currentTab === 'user-accounts' ? 'Tài khoản' : 'Nhóm tài khoản'}
                    </h3>
                    <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500"><Icons.X size={20}/></button>
                </div>
                
                <div className="p-6 space-y-4">
                    {currentTab === 'user-accounts' ? (
                        <>
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-slate-700">Nhóm tài khoản</label>
                                <select 
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                                    value={editItem.groupId || ''}
                                    onChange={e => setEditItem({...editItem, groupId: e.target.value})}
                                >
                                    <option value="">-- Chọn nhóm --</option>
                                    {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-slate-700">Tên đăng nhập</label>
                                <input 
                                    type="text" 
                                    value={editItem.username || ''}
                                    onChange={e => setEditItem({...editItem, username: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-slate-700">Mật khẩu</label>
                                <input 
                                    type="password" 
                                    placeholder={modalMode === 'edit' ? 'Để trống nếu không đổi' : ''}
                                    value={editItem.password || ''}
                                    onChange={e => setEditItem({...editItem, password: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-slate-700">Họ và tên</label>
                                <input 
                                    type="text" 
                                    value={editItem.fullName || ''}
                                    onChange={e => setEditItem({...editItem, fullName: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-slate-700">Email</label>
                                <input 
                                    type="email" 
                                    value={editItem.email || ''}
                                    onChange={e => setEditItem({...editItem, email: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                                />
                            </div>
                            <div className="pt-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={editItem.status === 'active'}
                                        onChange={e => setEditItem({...editItem, status: e.target.checked ? 'active' : 'inactive'})}
                                        className="w-4 h-4 text-blue-600 rounded" 
                                    />
                                    <span className="text-sm font-bold text-slate-700">Kích hoạt tài khoản</span>
                                </label>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-slate-700">Mã nhóm</label>
                                <input 
                                    type="text" 
                                    value={editItem.code || ''}
                                    onChange={e => setEditItem({...editItem, code: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none font-mono"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-slate-700">Tên nhóm tài khoản</label>
                                <input 
                                    type="text" 
                                    value={editItem.name || ''}
                                    onChange={e => setEditItem({...editItem, name: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-slate-700">Ghi chú</label>
                                <textarea 
                                    value={editItem.note || ''}
                                    onChange={e => setEditItem({...editItem, note: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none h-24 resize-none"
                                />
                            </div>
                        </>
                    )}
                </div>

                <div className="p-4 px-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 rounded-b-xl">
                    <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-sm font-bold">Hủy bỏ</button>
                    <button onClick={() => currentTab === 'user-accounts' ? handleSaveUser(editItem) : handleSaveGroup(editItem)} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-lg">Lưu dữ liệu</button>
                </div>
            </div>
        </div>
      )}

      {/* --- LOG DETAILS MODAL --- */}
      {viewLogDetails && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
             <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50 rounded-t-xl">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Icons.List size={20} className="text-blue-600"/>
                        Chi tiết thay đổi
                    </h3>
                    <button onClick={() => setViewLogDetails(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-slate-200 hover:bg-slate-100 text-slate-500"><Icons.X size={18}/></button>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div>
                            <span className="block text-xs font-bold text-slate-500 uppercase">Người thực hiện</span>
                            <span className="font-semibold text-slate-800">{viewLogDetails.user}</span>
                        </div>
                        <div>
                            <span className="block text-xs font-bold text-slate-500 uppercase">Thời gian</span>
                            <span className="font-mono text-slate-700">{viewLogDetails.timestamp}</span>
                        </div>
                         <div>
                            <span className="block text-xs font-bold text-slate-500 uppercase">Hành động</span>
                            <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                                viewLogDetails.action === 'THÊM' ? 'bg-blue-100 text-blue-700' :
                                viewLogDetails.action === 'XÓA' ? 'bg-red-100 text-red-700' :
                                viewLogDetails.action === 'SỬA' ? 'bg-orange-100 text-orange-700' :
                                'bg-slate-100 text-slate-600'
                            }`}>
                                {viewLogDetails.action}
                            </span>
                        </div>
                         <div>
                            <span className="block text-xs font-bold text-slate-500 uppercase">Chức năng</span>
                            <span className="font-semibold text-slate-800">{viewLogDetails.screen}</span>
                        </div>
                    </div>
                    
                    <div className="mt-4">
                        <span className="block text-xs font-bold text-slate-500 uppercase mb-2">Dữ liệu chi tiết (JSON)</span>
                        <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                            <pre className="text-xs font-mono text-green-400">
                                {JSON.stringify(viewLogDetails.details, null, 2)}
                            </pre>
                        </div>
                    </div>
                </div>
                <div className="p-4 border-t border-slate-100 flex justify-end">
                     <button onClick={() => setViewLogDetails(null)} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-sm">Đóng</button>
                </div>
             </div>
        </div>
      )}

    </div>
  );
};
