
import React from 'react';
import { Icons } from '../../../components/ui/Icons';

interface DocumentsHeaderProps {
    activeDoc: 'db' | 'srs';
    handleExport: (type: 'excel' | 'word') => void;
}

export const DocumentsHeader: React.FC<DocumentsHeaderProps> = ({ activeDoc, handleExport }) => {
    return (
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h2 className="text-xl font-bold text-slate-800">Tài liệu hệ thống</h2>
                <div className="text-sm text-slate-500 flex items-center gap-2">
                    <span>Tài liệu</span>
                    <Icons.ChevronDown size={14} className="-rotate-90 text-slate-300" />
                    <span className="text-blue-600 font-medium">
                        {activeDoc === 'db' ? 'Từ điển dữ liệu (Database)' : 'Đặc tả yêu cầu (SRS)'}
                    </span>
                </div>
            </div>
            <div className="flex gap-3">
                <button
                    onClick={() => handleExport('word')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm font-bold shadow-sm transition-colors"
                >
                    <Icons.FileText size={16} /> Xuất Word (.doc)
                </button>
                <button
                    onClick={() => handleExport('excel')}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors"
                >
                    <Icons.List size={16} /> Xuất Excel (.xls)
                </button>
            </div>
        </div>
    );
};
