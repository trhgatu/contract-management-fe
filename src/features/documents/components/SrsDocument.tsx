
import React from 'react';

interface SRSSection {
    title: string;
    content?: string;
    subSections?: SRSSection[];
    items?: { title: string; desc: string }[];
}

interface SrsDocumentProps {
    srsDocument: SRSSection[];
}

export const SrsDocument: React.FC<SrsDocumentProps> = ({ srsDocument }) => {
    return (
        <div className="animate-in fade-in duration-300 max-w-4xl mx-auto">
            <div className="mb-10 text-center border-b border-slate-100 pb-8">
                <h1 className="text-3xl font-bold text-slate-800 uppercase tracking-wide mb-2">ĐẶC TẢ YÊU CẦU PHẦN MỀM (SRS)</h1>
                <h3 className="text-xl font-medium text-blue-700 mb-4">Dự án: Hệ thống Quản lý Hợp đồng CEH</h3>
                <div className="text-slate-500 text-sm">
                    <p>Phiên bản: 1.0</p>
                    <p>Ngày cập nhật: {new Date().toLocaleDateString('vi-VN')}</p>
                </div>
            </div>

            <div className="space-y-8 text-slate-800 leading-relaxed">
                {srsDocument.map((section, idx) => (
                    <div key={idx} className="mb-8">
                        <h2 className="text-xl font-bold text-slate-900 uppercase mb-4 pb-2 border-b border-slate-200">{section.title}</h2>

                        {section.content && (
                            <p className="text-slate-700 mb-4 text-justify">{section.content}</p>
                        )}

                        {/* Subsections */}
                        {section.subSections && section.subSections.map((sub, sIdx) => (
                            <div key={sIdx} className="ml-0 md:ml-4 mb-6">
                                <h3 className="text-lg font-bold text-slate-800 mb-2">{sub.title}</h3>
                                {sub.content && <p className="text-slate-700 mb-3 text-justify">{sub.content}</p>}

                                {sub.items && (
                                    <ul className="list-disc list-inside space-y-2 bg-slate-50 p-4 rounded-lg border border-slate-100">
                                        {sub.items.map((item, iIdx) => (
                                            <li key={iIdx} className="text-slate-700">
                                                <span className="font-bold text-slate-900">{item.title}:</span> {item.desc}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}

                        {/* Direct Items in Section */}
                        {section.items && (
                            <ul className="list-disc list-inside space-y-3 bg-slate-50 p-5 rounded-lg border border-slate-100 ml-0 md:ml-4">
                                {section.items.map((item, iIdx) => (
                                    <li key={iIdx} className="text-slate-700">
                                        <span className="font-bold text-slate-900">{item.title}:</span> {item.desc}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </div>

            {/* SRS Footer Signature Placeholder */}
            <div className="mt-16 pt-8 border-t border-slate-200 grid grid-cols-2 gap-20 text-center">
                <div>
                    <p className="font-bold text-slate-700 mb-16">Người lập</p>
                    <p className="text-slate-500 italic">(Ký và ghi rõ họ tên)</p>
                </div>
                <div>
                    <p className="font-bold text-slate-700 mb-16">Phê duyệt</p>
                    <p className="text-slate-500 italic">(Ký và ghi rõ họ tên)</p>
                </div>
            </div>
        </div>
    )
}
