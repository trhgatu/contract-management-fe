
import React from 'react';
import { Icons } from '../../../components/ui/Icons';
import { ReportType } from '../../../types';

interface ReportHeaderProps {
    currentReportName: string | undefined;
}

export const ReportHeader: React.FC<ReportHeaderProps> = ({ currentReportName }) => {
    return (
        <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-800">Thống kê - Báo cáo</h2>
            <div className="text-sm text-slate-500 flex items-center gap-2">
                <span>Thống kê - Báo cáo</span>
                <Icons.ChevronDown size={14} className="-rotate-90 text-slate-300" />
                <span className="text-blue-600 font-medium">
                    {currentReportName}
                </span>
            </div>
        </div>
    );
};
