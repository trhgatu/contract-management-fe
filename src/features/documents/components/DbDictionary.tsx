
import React from 'react';

interface ColumnDef {
    name: string;
    type: string;
    constraint: string;
    desc: string;
}

interface TableDef {
    name: string;
    description: string;
    columns: ColumnDef[];
}

interface TableGroup {
    group: string;
    tables: TableDef[];
}

interface DbDictionaryProps {
    dbDictionary: TableGroup[];
}

export const DbDictionary: React.FC<DbDictionaryProps> = ({ dbDictionary }) => {
    return (
        <div className="animate-in fade-in duration-300">
            <div className="mb-8 text-center border-b border-slate-100 pb-6">
                <h1 className="text-2xl font-bold text-slate-800 uppercase tracking-wide">TỪ ĐIỂN DỮ LIỆU (DATABASE DICTIONARY)</h1>
                <p className="text-slate-500 mt-2">Hệ thống quản lý hợp đồng CEH</p>
            </div>

            <div className="space-y-10">
                {dbDictionary.map((group, gIdx) => (
                    <div key={gIdx} className="space-y-6">
                        <h2 className="text-lg font-bold text-blue-800 border-l-4 border-blue-600 pl-3 bg-blue-50 py-2 rounded-r-lg">{group.group}</h2>

                        <div className="grid gap-8">
                            {group.tables.map((table, tIdx) => (
                                <div key={tIdx} className="border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                                    <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                                        <div className="flex items-baseline gap-2">
                                            <span className="font-mono font-bold text-rose-600 text-base">{table.name}</span>
                                            <span className="text-slate-500 text-sm">- {table.description}</span>
                                        </div>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-white text-slate-600 font-semibold border-b border-slate-100 text-xs uppercase">
                                                <tr>
                                                    <th className="px-4 py-2 w-1/4">Tên trường</th>
                                                    <th className="px-4 py-2 w-1/6">Kiểu dữ liệu</th>
                                                    <th className="px-4 py-2 w-1/5">Ràng buộc</th>
                                                    <th className="px-4 py-2">Mô tả</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {table.columns.map((col, cIdx) => (
                                                    <tr key={cIdx} className="hover:bg-slate-50">
                                                        <td className="px-4 py-2 font-mono text-slate-700 font-medium">{col.name}</td>
                                                        <td className="px-4 py-2 text-blue-600 font-mono text-xs">{col.type}</td>
                                                        <td className="px-4 py-2 text-rose-500 font-mono text-xs">{col.constraint}</td>
                                                        <td className="px-4 py-2 text-slate-600">{col.desc}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
