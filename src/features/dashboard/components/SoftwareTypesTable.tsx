
import React from 'react';
import { Icons } from '../../../components/ui/Icons';
import { SOFTWARE_TYPES } from '../../../constants';

export const SoftwareTypesTable: React.FC = () => {
    return (
        <div className="xl:w-[25%] bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase">
                    <Icons.Document size={16} className="text-indigo-500" />
                    Loại phần mềm
                </h3>
            </div>
            <div className="p-4 space-y-3 flex-1 overflow-y-auto">
                {SOFTWARE_TYPES.map((type, idx) => {
                    const max = Math.max(...SOFTWARE_TYPES.map(t => t.count));
                    const percentage = (type.count / max) * 100;

                    return (
                        <div key={idx}>
                            <div className="flex justify-between items-center text-xs mb-1">
                                <span className="text-slate-700 font-medium truncate max-w-[150px]" title={type.name}>{type.name}</span>
                                <span className="text-slate-500">{type.count}</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5">
                                <div
                                    className="h-1.5 rounded-full bg-indigo-500 transition-all duration-500"
                                    style={{ width: `${percentage}%` }}
                                ></div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};
