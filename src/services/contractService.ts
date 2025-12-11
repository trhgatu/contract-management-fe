import api from './api';
import { Contract } from '../types';

/**
 * Contract Service
 * Handles all contract-related API calls
 */
class ContractService {
    /**
     * Get all contracts
     */
    async getAll(): Promise<Contract[]> {
        const response = await api.get('/contracts');
        // Backend returns {success: true, data: [...]}
        return response.data.data || response.data || [];
    }

    /**
     * Get a single contract by ID with all details
     */
    async getById(id: string): Promise<Contract> {
        const response = await api.get(`/contracts/${id}`);
        return response.data.data || response.data;
    }

    /**
     * Create a new contract
     */
    async create(data: Partial<Contract>): Promise<Contract> {
        const response = await api.post('/contracts', data);
        return response.data.data || response.data;
    }

    /**
     * Update an existing contract
     */
    async update(id: string, data: Partial<Contract>): Promise<Contract> {
        const response = await api.put(`/contracts/${id}`, data);
        return response.data.data || response.data;
    }

    /**
     * Delete a contract
     */
    async delete(id: string): Promise<void> {
        await api.delete(`/contracts/${id}`);
    }

    // Nested operations

    /**
     * Add a payment term to a contract
     */
    async addPaymentTerm(contractId: string, data: any): Promise<any> {
        const response = await api.post(`/contracts/${contractId}/payment-terms`, data);
        return response.data.data || response.data;
    }

    /**
     * Update a payment term
     */
    async updatePaymentTerm(contractId: string, termId: string, data: any): Promise<any> {
        const response = await api.put(`/contracts/${contractId}/payment-terms/${termId}`, data);
        return response.data.data || response.data;
    }

    /**
     * Add an expense to a contract
     */
    async addExpense(contractId: string, data: any): Promise<any> {
        const response = await api.post(`/contracts/${contractId}/expenses`, data);
        return response.data.data || response.data;
    }

    /**
     * Update an expense
     */
    async updateExpense(contractId: string, expenseId: string, data: any): Promise<any> {
        const response = await api.put(`/contracts/${contractId}/expenses/${expenseId}`, data);
        return response.data.data || response.data;
    }

    /**
     * Add a member to a contract
     */
    async addMember(contractId: string, data: any): Promise<any> {
        const response = await api.post(`/contracts/${contractId}/members`, data);
        return response.data.data || response.data;
    }

    /**
     * Delete a member from a contract
     */
    async deleteMember(contractId: string, memberId: string): Promise<void> {
        await api.delete(`/contracts/${contractId}/members/${memberId}`);
    }
}

export default new ContractService();
