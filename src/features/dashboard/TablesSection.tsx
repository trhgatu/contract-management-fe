
import React from 'react';
import { TopCustomersTable } from './components/TopCustomersTable';
import { LateWarningsTable } from './components/LateWarningsTable';
import { SoftwareTypesTable } from './components/SoftwareTypesTable';

export const TablesSection: React.FC = () => {
  return (
    <div className="flex flex-col xl:flex-row gap-6 mb-6">
      <TopCustomersTable />
      <LateWarningsTable />
      <SoftwareTypesTable />
    </div>
  );
};
