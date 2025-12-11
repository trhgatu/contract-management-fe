
import React from 'react';
import { Icons } from '../../../components/ui/Icons';
import { ContractAttachment } from '../../../types';

interface ViewFilesModalProps {
    viewFilesModal: {
        title: string;
        files: ContractAttachment[];
        isOpen: boolean;
    };
    setViewFilesModal: React.Dispatch<React.SetStateAction<{
        title: string;
        files: ContractAttachment[];
        isOpen: boolean;
    }>>;
}

export const ViewFilesModal: React.FC<ViewFilesModalProps> = ({ viewFilesModal, setViewFilesModal }) => {
    if (!viewFilesModal.isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden">
                <div className="flex justify-between items-center px-4 py-3 border-b border-slate-100 bg-slate-50">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Icons.Attach size={18} className="text-blue-600" />
                        {viewFilesModal.title}
                    </h3>
                    <button onClick={() => setViewFilesModal(prev => ({ ...prev, isOpen: false }))} className="text-slate-400 hover:text-slate-600"><Icons.X size={20} /></button>
                </div>
                <div className="p-4 max-h-[60vh] overflow-y-auto">
                    {viewFilesModal.files && viewFilesModal.files.length > 0 ? (
                        <div className="space-y-2">
                            {viewFilesModal.files.map(file => (
                                <div key={file.id} className="flex items-center gap-3 p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                                    <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                        {file.type === 'pdf' ? <Icons.File size={16} /> : <Icons.FileText size={16} />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-700 truncate">{file.name}</p>
                                        <p className="text-xs text-slate-400">{file.size} • {file.uploadDate}</p>
                                    </div>
                                    <button className="text-blue-600 hover:underline text-xs font-medium whitespace-nowrap">Tải về</button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-slate-400 flex flex-col items-center">
                            <Icons.File size={32} className="mb-2 opacity-50" />
                            <p>Không có tài liệu đính kèm</p>
                        </div>
                    )}
                </div>
                <div className="p-3 border-t border-slate-100 bg-slate-50 text-right">
                    <button onClick={() => setViewFilesModal(prev => ({ ...prev, isOpen: false }))} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-100 shadow-sm">Đóng</button>
                </div>
            </div>
        </div>
    );
};
