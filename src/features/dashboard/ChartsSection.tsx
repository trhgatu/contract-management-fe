
import React from 'react';
import { ContractsChart } from './components/ContractsChart';
import { RevenueExpenseChart } from './components/RevenueExpenseChart';
import { StatusPieChart } from './components/StatusPieChart';

export const ChartsSection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <ContractsChart />
        <RevenueExpenseChart />
        <StatusPieChart />
    </div>
  );
};
