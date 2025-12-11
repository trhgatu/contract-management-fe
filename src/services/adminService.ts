import api from './api';

export interface AdminUser {
    id: string;
    name: string;
    email: string;
    role: string;
    groupId?: string;
    status: 'active' | 'inactive';
    createdAt?: string;
    updatedAt?: string;
}

export interface UserGroup {
    id: string;
    code: string;
    name: string;
    note?: string;
    status: 'active' | 'inactive';
}

export interface Permission {
    id: string;
    groupId: string;
    name: string;
    isParent: boolean;
    parentId?: string;
    canView: boolean;
    canAdd: boolean;
    canEdit: boolean;
    canDelete: boolean;
}

export interface AuditLog {
    id: string;
    userId: string;
    screen: string;
    action: string;
    details?: any;
    ipAddress?: string;
    userAgent?: string;
    createdAt: string;
    user?: {
        id: string;
        name: string;
        email: string;
    };
}

export interface SystemConfig {
    id: string;
    key: string;
    value: string;
    type: 'string' | 'number' | 'boolean' | 'json';
    category?: string;
    description?: string;
    isEditable: boolean;
}

class AdminService {
    // ===== USER MANAGEMENT =====
    async getUsers(): Promise<AdminUser[]> {
        const response = await api.get('/admin/users');
        return response.data.data || response.data || [];
    }

    async updateUser(id: string, data: Partial<AdminUser>): Promise<AdminUser> {
        const response = await api.put(`/admin/users/${id}`, data);
        return response.data.data || response.data;
    }

    async deleteUser(id: string): Promise<void> {
        await api.delete(`/admin/users/${id}`);
    }

    // ===== GROUP MANAGEMENT =====
    async getGroups(): Promise<UserGroup[]> {
        const response = await api.get('/admin/groups');
        return response.data.data || response.data || [];
    }

    async createGroup(data: Partial<UserGroup>): Promise<UserGroup> {
        const response = await api.post('/admin/groups', data);
        return response.data.data || response.data;
    }

    async updateGroup(id: string, data: Partial<UserGroup>): Promise<UserGroup> {
        const response = await api.put(`/admin/groups/${id}`, data);
        return response.data.data || response.data;
    }

    async deleteGroup(id: string): Promise<void> {
        await api.delete(`/admin/groups/${id}`);
    }

    // ===== PERMISSION MANAGEMENT =====
    async getPermissions(groupId: string): Promise<Permission[]> {
        const response = await api.get(`/admin/permissions/${groupId}`);
        return response.data.data || response.data || [];
    }

    async updatePermissions(permissions: Permission[]): Promise<any> {
        const response = await api.put(`/admin/permissions-bulk`, { permissions });
        return response.data;
    }

    async updatePermission(id: string, data: Partial<Permission>): Promise<Permission> {
        const response = await api.put(`/admin/permissions/${id}`, data);
        return response.data.data || response.data;
    }

    // ===== AUDIT LOGS =====
    async getLogs(params?: {
        screen?: string;
        action?: string;
        startDate?: string;
        endDate?: string;
        limit?: number;
    }): Promise<AuditLog[]> {
        const response = await api.get('/admin/logs', { params });
        return response.data.data || response.data || [];
    }

    async createLog(data: {
        screen: string;
        action: string;
        details?: any;
    }): Promise<AuditLog> {
        const response = await api.post('/admin/logs', data);
        return response.data.data || response.data;
    }

    // ===== SYSTEM CONFIG =====
    async getConfigs(category?: string): Promise<SystemConfig[]> {
        const response = await api.get('/admin/configs', {
            params: category ? { category } : {}
        });
        return response.data.data || response.data || [];
    }

    async updateConfig(id: string, value: string): Promise<SystemConfig> {
        const response = await api.put(`/admin/configs/${id}`, { value });
        return response.data.data || response.data;
    }
}

export default new AdminService();
