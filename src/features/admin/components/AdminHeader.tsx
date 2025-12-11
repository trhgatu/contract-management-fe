
import React from 'react';

interface AdminHeaderProps {
    getBreadcrumbs: () => string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ getBreadcrumbs }) => {
    return (
        <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-800">Quản trị hệ thống</h2>
            <div className="text-sm text-slate-500 flex items-center gap-2 font-medium">
                {getBreadcrumbs()}
            </div>
        </div>
    );
};
