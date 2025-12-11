
import React, { useState, useEffect } from 'react';
import { Icons } from '../../../components/ui/Icons';
import { dashboardService } from '@/services';

export const LateWarningsTable: React.FC = () => {
    const [warnings, setWarnings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await dashboardService.getWarningsSummary();
                // Map backend response to UI format if needed, or use directly
                // Backend returns: Contract with Customer included
                setWarnings(data || []);
            } catch (error) {
                console.error('Failed to fetch warnings', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="xl:w-[35%] bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase">
                    <Icons.Warning size={16} className="text-orange-500" />
                    Cảnh báo hạn
                </h3>
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">{warnings.length}</span>
            </div>
            <div className="p-0 overflow-y-auto max-h-[300px] flex-1">
                {loading ? (
                    <div className="p-4 space-y-3">
                        {[1, 2].map(i => <div key={i} className="h-12 bg-slate-50 animate-pulse rounded"></div>)}
                    </div>
                ) : warnings.length === 0 ? (
                    <div className="p-4 text-center text-slate-400 text-xs">Không có cảnh báo nào</div>
                ) : (
                    warnings.map((warning) => {
                        const dueDate = new Date(warning.dueDate);
                        const today = new Date();
                        // Reset time portion for accurate day comparison
                        dueDate.setHours(0, 0, 0, 0);
                        today.setHours(0, 0, 0, 0);

                        // Simple calculation for days late (if needed) or just display dueDate
                        const isLate = dueDate < today;
                        const diffTime = Math.abs(today.getTime() - dueDate.getTime());
                        const daysLate = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                        return (
                            <div key={warning.id} className="p-3 border-b border-slate-50 last:border-none hover:bg-slate-50 transition-colors">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-semibold text-slate-700 text-xs">{warning.contract?.code || 'N/A'}</span>
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isLate ? 'bg-rose-100 text-rose-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {isLate ? `Trễ ${daysLate} ngày` : 'Sắp hết hạn'}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 mb-1 truncate">{warning.contract?.customer?.name || warning.type}</p>
                                <div className="flex items-center justify-between text-xs text-slate-400">
                                    <span className="flex items-center gap-1"><Icons.Calendar size={10} /> {dueDate.toLocaleDateString('vi-VN')}</span>
                                    {/* <button className="text-blue-600 font-medium hover:underline text-[10px]">Gia hạn</button> */}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};
