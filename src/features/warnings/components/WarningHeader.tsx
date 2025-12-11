import React from 'react';
import { Icons } from '../../../components/ui/Icons'; // Adjust import path for Icons

export const WarningHeader: React.FC = () => {
  return (
    <div className="mb-2">
      <h2 className="text-xl font-bold text-slate-800">Báo cáo cảnh báo</h2>
      <div className="text-sm text-slate-500 flex items-center gap-2">
        <span>Thống kê - Báo cáo</span>
        <Icons.ChevronDown size={14} className="-rotate-90 text-slate-300"/>
        <span className="text-blue-600 font-medium">Báo cáo cảnh báo</span>
      </div>
    </div>
  );
};
