import api from './api';
import { Warning } from '../types';

/**
 * Warning Service
 * Handles all warning-related API calls
 */
class WarningService {
    /**
     * Get all warnings with optional filters
     */
    async getAll(params?: {
        type?: string;
        status?: string;
        startDate?: string;
        endDate?: string;
    }): Promise<Warning[]> {
        const response = await api.get('/warnings', { params });
        // Backend returns {success: true, data: [...]}
        return response.data.data || response.data || [];
    }

    /**
     * Get warning by ID
     */
    async getById(id: string): Promise<Warning> {
        const response = await api.get(`/warnings/${id}`);
        return response.data.data || response.data;
    }

    /**
     * Create new warning
     */
    async create(data: Partial<Warning>): Promise<Warning> {
        const response = await api.post('/warnings', data);
        return response.data.data || response.data;
    }

    /**
     * Update warning
     */
    async update(id: string, data: Partial<Warning>): Promise<Warning> {
        const response = await api.put(`/warnings/${id}`, data);
        return response.data.data || response.data;
    }

    /**
     * Delete warning
     */
    async delete(id: string): Promise<void> {
        await api.delete(`/warnings/${id}`);
    }

    /**
     * Generate warnings automatically
     */
    async generate(): Promise<{ message: string; count: number }> {
        const response = await api.post('/warnings/generate');
        return response.data.data || response.data;
    }
}

export default new WarningService();
