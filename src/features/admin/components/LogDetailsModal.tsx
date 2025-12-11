
import React from 'react';
import { Icons } from '../../../components/ui/Icons';
import { AuditLog } from '../../../types';

interface LogDetailsModalProps {
    log: AuditLog;
    onClose: () => void;
}

export const LogDetailsModal: React.FC<LogDetailsModalProps> = ({ log, onClose }) => {
    if (!log) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50 rounded-t-xl">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Icons.List size={20} className="text-blue-600" />
                        Chi tiết thay đổi
                    </h3>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-slate-200 hover:bg-slate-100 text-slate-500"><Icons.X size={18} /></button>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div>
                            <span className="block text-xs font-bold text-slate-500 uppercase">Người thực hiện</span>
                            <span className="font-semibold text-slate-800">{log.user?.name || 'Unknown'}</span>
                        </div>
                        <div>
                            <span className="block text-xs font-bold text-slate-500 uppercase">Thời gian</span>
                            <span className="font-mono text-slate-700">{new Date(log.createdAt).toLocaleString('vi-VN')}</span>
                        </div>
                        <div>
                            <span className="block text-xs font-bold text-slate-500 uppercase">Hành động</span>
                            <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold ${log.action === 'THÊM' ? 'bg-blue-100 text-blue-700' :
                                log.action === 'XÓA' ? 'bg-red-100 text-red-700' :
                                    log.action === 'SỬA' ? 'bg-orange-100 text-orange-700' :
                                        'bg-slate-100 text-slate-600'
                                }`}>
                                {log.action}
                            </span>
                        </div>
                        <div>
                            <span className="block text-xs font-bold text-slate-500 uppercase">Chức năng</span>
                            <span className="font-semibold text-slate-800">{log.screen}</span>
                        </div>
                    </div>

                    <div className="mt-4">
                        <span className="block text-xs font-bold text-slate-500 uppercase mb-2">Dữ liệu chi tiết (JSON)</span>
                        <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                            <pre className="text-xs font-mono text-green-400">
                                {JSON.stringify(log.details, null, 2)}
                            </pre>
                        </div>
                    </div>
                </div>
                <div className="p-4 border-t border-slate-100 flex justify-end">
                    <button onClick={onClose} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-sm">Đóng</button>
                </div>
            </div>
        </div>
    );
};
