import React, { useState, useEffect } from 'react';
import { AdminTabType, SystemUser, UserGroup, PermissionNode, AuditLog } from '../../types';
import { AdminHeader } from './components/AdminHeader';
import { ConfigTab } from './components/ConfigTab';
import { UserAccountsTab } from './components/UserAccountsTab';
import { UserGroupsTab } from './components/UserGroupsTab';
import { PermissionsTab } from './components/PermissionsTab';
import { LogsTab } from './components/LogsTab';
import { UserModal } from './components/UserModal';
import { GroupModal } from './components/GroupModal';
import { LogDetailsModal } from './components/LogDetailsModal';
import { adminService } from '../../services';
import { useToast } from '../../contexts/ToastContext';

interface AdminScreenProps {
    activeTab?: AdminTabType;
}

export const AdminScreen: React.FC<AdminScreenProps> = ({ activeTab = 'config' }) => {
    const { showToast } = useToast();
    const [currentTab, setCurrentTab] = useState<AdminTabType>(activeTab);

    // Data States
    const [users, setUsers] = useState<SystemUser[]>([]);
    const [groups, setGroups] = useState<UserGroup[]>([]);
    const [permissions, setPermissions] = useState<PermissionNode[]>([]);
    const [selectedGroupForPermission, setSelectedGroupForPermission] = useState<string>('');

    // Loading States
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Log States
    const [viewLogDetails, setViewLogDetails] = useState<AuditLog | null>(null);

    // UI States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [editItem, setEditItem] = useState<any>(null);

    // Fetch data on mount and tab change
    useEffect(() => {
        setCurrentTab(activeTab);
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [usersData, groupsData] = await Promise.all([
                adminService.getUsers(),
                adminService.getGroups()
            ]);

            setUsers(usersData);
            setGroups(groupsData);

            if (groupsData.length > 0 && !selectedGroupForPermission) {
                setSelectedGroupForPermission(groupsData[0].id);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to load admin data');
            showToast('Lỗi khi tải dữ liệu: ' + (err.message || 'Unknown error'), 'error');
            console.error('Fetch admin data error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch permissions when group changes
    useEffect(() => {
        if (selectedGroupForPermission) {
            fetchPermissions(selectedGroupForPermission);
        }
    }, [selectedGroupForPermission]);

    const fetchPermissions = async (groupId: string) => {
        try {
            const permsData = await adminService.getPermissions(groupId);
            setPermissions(permsData);
        } catch (err: any) {
            showToast('Lỗi khi tải phân quyền', 'error');
            console.error('Fetch permissions error:', err);
        }
    };

    const getBreadcrumbs = () => {
        const base = 'Quản trị hệ thống';
        switch (currentTab) {
            case 'user-accounts': return `${base} > Quản lý người dùng > Quản lý tài khoản`;
            case 'user-groups': return `${base} > Quản lý người dùng > Quản lý nhóm tài khoản`;
            case 'permissions': return `${base} > Quản lý người dùng > Quản lý phân quyền`;
            case 'logs': return `${base} > Nhật ký hệ thống`;
            case 'notification': return `${base} > Cảnh báo & Thông báo`;
            case 'config': return `${base} > Cấu hình hệ thống`;
            default: return base;
        }
    };

    // CRUD HANDLERS WITH LOADING & TOAST

    const handleDelete = async (id: string, type: 'user' | 'group') => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa?')) return;

        try {
            setActionLoading(true);
            if (type === 'user') {
                await adminService.deleteUser(id);
                setUsers(prev => prev.filter(u => u.id !== id));
                showToast('Xóa người dùng thành công', 'success');
            } else {
                await adminService.deleteGroup(id);
                setGroups(prev => prev.filter(g => g.id !== id));
                showToast('Xóa nhóm thành công', 'success');
            }
        } catch (err: any) {
            showToast('Lỗi khi xóa: ' + (err.message || 'Unknown error'), 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const handleSaveUser = async (data: any) => {
        try {
            setActionLoading(true);
            if (modalMode === 'add') {
                showToast('Vui lòng sử dụng chức năng Register để tạo user mới', 'warning');
            } else {
                const updated = await adminService.updateUser(data.id, data);
                setUsers(prev => prev.map(u => u.id === data.id ? { ...u, ...updated } : u));
                setIsModalOpen(false);
                showToast('Cập nhật người dùng thành công', 'success');
            }
        } catch (err: any) {
            showToast('Lỗi khi lưu user: ' + (err.message || 'Unknown error'), 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const handleSaveGroup = async (data: any) => {
        try {
            setActionLoading(true);
            if (modalMode === 'add') {
                const newGroup = await adminService.createGroup(data);
                setGroups(prev => [...prev, newGroup]);
                showToast('Thêm nhóm mới thành công', 'success');
            } else {
                const updated = await adminService.updateGroup(data.id, data);
                setGroups(prev => prev.map(g => g.id === data.id ? updated : g));
                showToast('Cập nhật nhóm thành công', 'success');
            }
            setIsModalOpen(false);
        } catch (err: any) {
            showToast('Lỗi khi lưu nhóm: ' + (err.message || 'Unknown error'), 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const openModal = (mode: 'add' | 'edit', item?: any) => {
        setModalMode(mode);
        setEditItem(item || {});
        setIsModalOpen(true);
    };

    const togglePermission = async (permId: string, field: 'canView' | 'canAdd' | 'canEdit' | 'canDelete') => {
        try {
            const perm = permissions.find(p => p.id === permId);
            if (!perm) return;

            const newValue = !perm[field];

            // Local state update only - removed optimistic API call
            setPermissions(prev => {
                const newPerms = [...prev];
                const targetIndex = newPerms.findIndex(p => p.id === permId);
                if (targetIndex === -1) return prev;

                newPerms[targetIndex] = { ...newPerms[targetIndex], [field]: newValue };
                const target = newPerms[targetIndex];

                if (target.isParent) {
                    newPerms.forEach((p, idx) => {
                        if (p.parentId === target.id) {
                            newPerms[idx] = { ...newPerms[idx], [field]: newValue };
                        }
                    });
                }

                return newPerms;
            });
        } catch (err: any) {
            console.error('Toggle permission error:', err);
        }
    };

    const handleSavePermissions = async () => {
        try {
            setActionLoading(true);
            await adminService.updatePermissions(permissions);
            showToast('Lưu phân quyền thành công', 'success');
        } catch (err: any) {
            showToast('Lỗi khi lưu phân quyền: ' + (err.message || 'Unknown error'), 'error');
            // Reload on error to sync with DB
            fetchPermissions(selectedGroupForPermission);
        } finally {
            setActionLoading(false);
        }
    };

    const renderTabContent = () => {
        if (loading) {
            return (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex items-center justify-center h-64 text-red-600">
                    <p>{error}</p>
                </div>
            );
        }

        switch (currentTab) {
            case 'config':
                return <ConfigTab />;
            case 'user-accounts':
                return <UserAccountsTab
                    users={users}
                    groups={groups}
                    openModal={openModal}
                    handleDelete={handleDelete}
                />;
            case 'user-groups':
                return <UserGroupsTab
                    groups={groups}
                    openModal={openModal}
                    handleDelete={handleDelete}
                />;
            case 'permissions':
                return <PermissionsTab
                    permissions={permissions}
                    groups={groups}
                    selectedGroupForPermission={selectedGroupForPermission}
                    setSelectedGroupForPermission={setSelectedGroupForPermission}
                    togglePermission={togglePermission}
                    onSave={handleSavePermissions}
                    isSaving={actionLoading}
                />;
            case 'logs':
                return <LogsTab setViewLogDetails={setViewLogDetails} />;
            default:
                return null;
        }
    }

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-300">
            <AdminHeader getBreadcrumbs={getBreadcrumbs} />

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col flex-1">
                <div className="p-6 overflow-y-auto flex-1">
                    {renderTabContent()}
                </div>
            </div>

            {(currentTab === 'user-accounts') && (
                <UserModal
                    isOpen={isModalOpen}
                    mode={modalMode}
                    groups={groups}
                    editItem={editItem}
                    onSave={handleSaveUser}
                    onClose={() => setIsModalOpen(false)}
                    isLoading={actionLoading}
                />
            )}

            {(currentTab === 'user-groups') && (
                <GroupModal
                    isOpen={isModalOpen}
                    mode={modalMode}
                    editItem={editItem}
                    onSave={handleSaveGroup}
                    onClose={() => setIsModalOpen(false)}
                    isLoading={actionLoading}
                />
            )}

            {viewLogDetails && (
                <LogDetailsModal log={viewLogDetails} onClose={() => setViewLogDetails(null)} />
            )}

        </div>
    );
};