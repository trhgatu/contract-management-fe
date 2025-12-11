import api from './api';

export interface MasterDataItem {
    id: string;
    code: string;
    name: string;
    description?: string;
    [key: string]: any; // Allow additional fields for different types
}

// Generic type for Master Data types
type MasterDataType = 'customers' | 'suppliers' | 'software' | 'status' | 'contract-types' | 'units';

/**
 * Master Data Service
 * Handles CRUD operations for all Master Data entities
 */
class MasterDataService {
    /**
     * Get all items for a specific master data type
     */
    async getAll(type: MasterDataType): Promise<MasterDataItem[]> {
        const response = await api.get(`/master-data/${type}`);
        // Backend returns {success: true, data: [...]}
        return response.data.data || response.data || [];
    }

    /**
     * Get a single item by ID
     */
    async getById(type: MasterDataType, id: string): Promise<MasterDataItem> {
        const response = await api.get(`/master-data/${type}/${id}`);
        return response.data.data || response.data;
    }

    /**
     * Create a new item
     */
    async create(type: MasterDataType, data: Partial<MasterDataItem>): Promise<MasterDataItem> {
        const response = await api.post(`/master-data/${type}`, data);
        return response.data.data || response.data;
    }

    /**
     * Update an existing item
     */
    async update(type: MasterDataType, id: string, data: Partial<MasterDataItem>): Promise<MasterDataItem> {
        const response = await api.put(`/master-data/${type}/${id}`, data);
        return response.data.data || response.data;
    }

    /**
     * Delete an item
     */
    async delete(type: MasterDataType, id: string): Promise<void> {
        await api.delete(`/master-data/${type}/${id}`);
    }

    // Convenience methods for specific types
    async getCustomers() {
        return this.getAll('customers');
    }

    async getSuppliers() {
        return this.getAll('suppliers');
    }

    async getSoftwareTypes() {
        return this.getAll('software');
    }

    async getStatuses() {
        return this.getAll('status');
    }

    async getContractTypes() {
        return this.getAll('contract-types');
    }

    async getUnits() {
        return this.getAll('units');
    }
}

export default new MasterDataService();
