import React, { useState } from 'react';
import { Icons } from '../../components/ui/Icons';
import { DB_DICTIONARY, SRS_DOCUMENT } from './data';
import { DocumentsHeader } from './components/DocumentsHeader';
import { DbDictionary } from './components/DbDictionary';
import { SrsDocument } from './components/SrsDocument';

export const DocumentsScreen: React.FC = () => {
  const [activeDoc, setActiveDoc] = useState<'db' | 'srs'>('db');

  const handleExport = (type: 'excel' | 'word') => {
    // 1. Build HTML String based on Active Document
    let htmlContent = `
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Times New Roman', serif; line-height: 1.5; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #000; padding: 8px; text-align: left; font-size: 12px; }
          th { background-color: #f0f0f0; font-weight: bold; }
          .title { font-size: 24px; font-weight: bold; text-align: center; margin-bottom: 20px; color: #2c3e50; }
          .subtitle { text-align: center; font-style: italic; margin-bottom: 40px; }
          
          /* DB Styles */
          .group-title { font-size: 16px; font-weight: bold; margin-top: 30px; margin-bottom: 10px; color: #2c3e50; border-bottom: 2px solid #ccc; padding-bottom: 5px; }
          .table-title { font-size: 14px; font-weight: bold; margin-top: 15px; margin-bottom: 5px; color: #2980b9; }
          .table-desc { font-style: italic; margin-bottom: 10px; font-size: 12px; color: #555; }

          /* SRS Styles */
          .srs-h1 { font-size: 18px; font-weight: bold; margin-top: 25px; margin-bottom: 10px; color: #2c3e50; text-transform: uppercase; }
          .srs-h2 { font-size: 14px; font-weight: bold; margin-top: 15px; margin-bottom: 5px; color: #444; }
          .srs-p { margin-bottom: 10px; text-align: justify; }
          .srs-ul { list-style-type: disc; margin-left: 20px; }
          .srs-li { margin-bottom: 5px; }
          .srs-bold { font-weight: bold; }
        </style>
      </head>
      <body>
    `;

    if (activeDoc === 'db') {
        htmlContent += `
          <div class="title">TỪ ĐIỂN DỮ LIỆU (DATABASE DICTIONARY)</div>
          <div class="subtitle">Hệ thống Quản lý Hợp đồng CEH<br/>Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}</div>
        `;
        DB_DICTIONARY.forEach(group => {
            htmlContent += `<div class="group-title">${group.group}</div>`;
            group.tables.forEach(table => {
            htmlContent += `
                <div class="table-title">Bảng: ${table.name}</div>
                <div class="table-desc">${table.description}</div>
                <table>
                <thead>
                    <tr>
                    <th style="width: 20%">Tên trường (Column)</th>
                    <th style="width: 15%">Kiểu dữ liệu</th>
                    <th style="width: 20%">Ràng buộc (Constraint)</th>
                    <th style="width: 45%">Mô tả (Description)</th>
                    </tr>
                </thead>
                <tbody>
                    ${table.columns.map(col => `
                    <tr>
                        <td><b>${col.name}</b></td>
                        <td>${col.type}</td>
                        <td>${col.constraint}</td>
                        <td>${col.desc}</td>
                    </tr>
                    `).join('')}
                </tbody>
                </table>
            `;
            });
        });
    } else {
        htmlContent += `
          <div class="title">ĐẶC TẢ YÊU CẦU PHẦN MỀM (SRS)</div>
          <div class="subtitle">Dự án: Hệ thống Quản lý Hợp đồng CEH<br/>Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}</div>
        `;
        SRS_DOCUMENT.forEach(section => {
            htmlContent += `<div class="srs-h1">${section.title}</div>`;
            
            if (section.subSections) {
                section.subSections.forEach(sub => {
                    htmlContent += `<div class="srs-h2">${sub.title}</div>`;
                    if (sub.content) htmlContent += `<div class="srs-p">${sub.content}</div>`;
                    if (sub.items) {
                        htmlContent += `<ul class="srs-ul">`;
                        sub.items.forEach(item => {
                            htmlContent += `<li class="srs-li"><span class="srs-bold">${item.title}:</span> ${item.desc}</li>`;
                        });
                        htmlContent += `</ul>`;
                    }
                });
            }

            if (section.items) {
                htmlContent += `<ul class="srs-ul">`;
                section.items.forEach(item => {
                    htmlContent += `<li class="srs-li"><span class="srs-bold">${item.title}:</span> ${item.desc}</li>`;
                });
                htmlContent += `</ul>`;
            }
        });
    }

    htmlContent += `</body></html>`;

    // 2. Create Blob & Download
    const mimeType = type === 'excel' ? 'application/vnd.ms-excel' : 'application/msword';
    const extension = type === 'excel' ? 'xls' : 'doc';
    const blob = new Blob([htmlContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `CEH_${activeDoc === 'db' ? 'Database_Dictionary' : 'SRS_Document'}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      
      <DocumentsHeader activeDoc={activeDoc} handleExport={handleExport} />

      {/* Main Container */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col flex-1 max-w-5xl mx-auto w-full h-[calc(100vh-10rem)]">
         
         {/* Tab Navigation */}
         <div className="flex border-b border-slate-200 bg-slate-50">
             <button 
                onClick={() => setActiveDoc('db')}
                className={`px-6 py-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${activeDoc === 'db' ? 'border-blue-600 text-blue-700 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
             >
                 <Icons.Category size={18} /> Từ điển dữ liệu (DB Dictionary)
             </button>
             <button 
                onClick={() => setActiveDoc('srs')}
                className={`px-6 py-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${activeDoc === 'srs' ? 'border-blue-600 text-blue-700 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
             >
                 <Icons.FileText size={18} /> Đặc tả yêu cầu (SRS)
             </button>
         </div>

         {/* Content Area */}
         <div className="overflow-y-auto flex-1 p-8 bg-white">
            
            {activeDoc === 'db' && (
                <DbDictionary dbDictionary={DB_DICTIONARY} />
            )}

            {activeDoc === 'srs' && (
                <SrsDocument srsDocument={SRS_DOCUMENT} />
            )}

         </div>
      </div>
    </div>
  );
};