import api from './api';

/**
 * Dashboard Service
 * Handles dashboard-related API calls for KPIs and statistics
 */
class DashboardService {
    /**
     * Get KPI data (total contracts, revenue, expenses, etc.)
     */
    async getKPIs(): Promise<any> {
        const response = await api.get('/dashboard/kpis');
        return response.data.data || response.data;
    }

    /**
     * Get top customers by revenue
     */
    async getTopCustomers(): Promise<any> {
        const response = await api.get('/dashboard/top-customers');
        return response.data.data || response.data || [];
    }

    /**
     * Get warnings summary for dashboard
     */
    async getWarningsSummary(): Promise<any> {
        const response = await api.get('/dashboard/warnings-summary');
        return response.data.data || response.data;
    }

    /**
     * Get software distribution data
     */
    async getSoftwareDistribution(): Promise<any> {
        const response = await api.get('/dashboard/software-distribution');
        return response.data.data || response.data || [];
    }

    /**
     * Get monthly statistics
     */
    async getMonthlyStats(): Promise<any> {
        const response = await api.get('/dashboard/monthly-stats');
        return response.data.data || response.data || [];
    }
}

export default new DashboardService();
