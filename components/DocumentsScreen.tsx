
import React, { useState } from 'react';
import { Icons } from './Icons';

// --- DATABASE DICTIONARY DATA ---
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

const DB_DICTIONARY: TableGroup[] = [
  {
    group: '1. NHÓM QUẢN LÝ ĐỐI TÁC (PARTNERS)',
    tables: [
      {
        name: 'customers',
        description: 'Lưu trữ thông tin các đối tác thuê dịch vụ/phần mềm.',
        columns: [
          { name: 'id', type: 'UUID / INT', constraint: 'PK', desc: 'Khóa chính, định danh duy nhất.' },
          { name: 'customer_code', type: 'VARCHAR(20)', constraint: 'UQ, Not Null', desc: 'Mã khách hàng (VD: KH001).' },
          { name: 'customer_name', type: 'VARCHAR(255)', constraint: 'Not Null', desc: 'Tên đầy đủ công ty/khách hàng.' },
          { name: 'tax_code', type: 'VARCHAR(20)', constraint: '', desc: 'Mã số thuế.' },
          { name: 'field', type: 'VARCHAR(100)', constraint: '', desc: 'Lĩnh vực hoạt động.' },
          { name: 'address', type: 'VARCHAR(500)', constraint: '', desc: 'Địa chỉ trụ sở.' },
          { name: 'contact_person', type: 'VARCHAR(100)', constraint: '', desc: 'Tên người liên hệ đại diện.' },
          { name: 'phone', type: 'VARCHAR(20)', constraint: '', desc: 'Số điện thoại liên hệ.' },
          { name: 'created_at', type: 'DATETIME', constraint: '', desc: 'Thời gian tạo.' }
        ]
      },
      {
        name: 'suppliers',
        description: 'Lưu trữ thông tin các đơn vị cung cấp dịch vụ, thiết bị đầu vào.',
        columns: [
          { name: 'id', type: 'UUID / INT', constraint: 'PK', desc: 'Khóa chính.' },
          { name: 'supplier_code', type: 'VARCHAR(20)', constraint: 'UQ, Not Null', desc: 'Mã nhà cung cấp (VD: NCC001).' },
          { name: 'supplier_name', type: 'VARCHAR(255)', constraint: 'Not Null', desc: 'Tên nhà cung cấp.' },
          { name: 'field', type: 'VARCHAR(100)', constraint: '', desc: 'Lĩnh vực cung cấp.' },
          { name: 'tax_code', type: 'VARCHAR(20)', constraint: '', desc: 'Mã số thuế.' },
          { name: 'contact_person', type: 'VARCHAR(100)', constraint: '', desc: 'Người liên hệ.' },
          { name: 'phone', type: 'VARCHAR(20)', constraint: '', desc: 'SĐT liên hệ.' }
        ]
      }
    ]
  },
  {
    group: '2. NHÓM QUẢN LÝ HỢP ĐỒNG (CORE BUSINESS)',
    tables: [
      {
        name: 'contracts',
        description: 'Bảng trung tâm lưu trữ thông tin hợp đồng.',
        columns: [
          { name: 'id', type: 'UUID / INT', constraint: 'PK', desc: 'Khóa chính.' },
          { name: 'contract_code', type: 'VARCHAR(50)', constraint: 'UQ, Not Null', desc: 'Số hợp đồng (VD: HD-2025-001).' },
          { name: 'customer_id', type: 'UUID / INT', constraint: 'FK -> customers', desc: 'Liên kết với khách hàng.' },
          { name: 'sign_date', type: 'DATE', constraint: 'Not Null', desc: 'Ngày ký hợp đồng.' },
          { name: 'content', type: 'TEXT', constraint: '', desc: 'Nội dung/Tên gói thầu.' },
          { name: 'contract_type_id', type: 'INT', constraint: 'FK -> master_contract_types', desc: 'Loại hợp đồng.' },
          { name: 'status_code', type: 'VARCHAR(20)', constraint: 'FK -> master_status', desc: 'Trạng thái hiện tại.' },
          { name: 'value_pre_vat', type: 'DECIMAL(18,2)', constraint: 'Default 0', desc: 'Giá trị trước VAT.' },
          { name: 'vat_amount', type: 'DECIMAL(18,2)', constraint: 'Default 0', desc: 'Giá trị VAT.' },
          { name: 'value_post_vat', type: 'DECIMAL(18,2)', constraint: 'Default 0', desc: 'Tổng giá trị sau VAT.' },
          { name: 'duration', type: 'VARCHAR(50)', constraint: '', desc: 'Thời hạn hợp đồng.' },
          { name: 'acceptance_date', type: 'DATE', constraint: '', desc: 'Ngày nghiệm thu.' },
          { name: 'created_by', type: 'UUID / INT', constraint: 'FK -> users', desc: 'Người tạo bản ghi.' }
        ]
      },
      {
        name: 'contract_software_map',
        description: 'Bảng trung gian liên kết Hợp đồng và Loại phần mềm.',
        columns: [
          { name: 'id', type: 'UUID / INT', constraint: 'PK', desc: 'Khóa chính.' },
          { name: 'contract_id', type: 'UUID / INT', constraint: 'FK -> contracts', desc: 'ID hợp đồng.' },
          { name: 'software_type_id', type: 'INT', constraint: 'FK -> master_software_types', desc: 'ID loại phần mềm.' }
        ]
      },
      {
        name: 'payment_terms',
        description: 'Quản lý các đợt thanh toán của hợp đồng.',
        columns: [
          { name: 'id', type: 'UUID / INT', constraint: 'PK', desc: 'Khóa chính.' },
          { name: 'contract_id', type: 'UUID / INT', constraint: 'FK -> contracts', desc: 'Thuộc hợp đồng nào.' },
          { name: 'batch_name', type: 'VARCHAR(50)', constraint: '', desc: 'Tên đợt (Đợt 1, Đợt 2...).' },
          { name: 'content', type: 'VARCHAR(255)', constraint: '', desc: 'Nội dung thanh toán.' },
          { name: 'ratio_percent', type: 'DECIMAL(5,2)', constraint: '', desc: 'Tỷ lệ thanh toán (%).' },
          { name: 'amount_value', type: 'DECIMAL(18,2)', constraint: '', desc: 'Số tiền thanh toán (VNĐ).' },
          { name: 'is_collected', type: 'BOOLEAN', constraint: 'Default False', desc: 'Trạng thái đã thu tiền.' },
          { name: 'collection_date', type: 'DATE', constraint: '', desc: 'Ngày thực thu.' },
          { name: 'invoice_status', type: 'ENUM', constraint: '', desc: 'Trạng thái xuất hóa đơn.' }
        ]
      },
      {
        name: 'expenses',
        description: 'Quản lý chi phí dự án.',
        columns: [
          { name: 'id', type: 'UUID / INT', constraint: 'PK', desc: 'Khóa chính.' },
          { name: 'contract_id', type: 'UUID / INT', constraint: 'FK -> contracts', desc: 'Thuộc hợp đồng nào.' },
          { name: 'supplier_id', type: 'UUID / INT', constraint: 'FK -> suppliers', desc: 'Chi trả cho NCC nào.' },
          { name: 'category', type: 'VARCHAR(100)', constraint: '', desc: 'Hạng mục chi phí.' },
          { name: 'total_amount', type: 'DECIMAL(18,2)', constraint: 'Not Null', desc: 'Tổng số tiền chi.' },
          { name: 'payment_status', type: 'ENUM', constraint: '', desc: 'Trạng thái thanh toán.' },
          { name: 'pic_name', type: 'VARCHAR(100)', constraint: '', desc: 'Nhân viên phụ trách.' }
        ]
      },
      {
        name: 'attachments',
        description: 'Lưu trữ tài liệu đính kèm (Polymorphic).',
        columns: [
          { name: 'id', type: 'UUID / INT', constraint: 'PK', desc: 'Khóa chính.' },
          { name: 'reference_id', type: 'UUID / INT', constraint: 'Not Null', desc: 'ID đối tượng cha.' },
          { name: 'reference_type', type: 'VARCHAR(20)', constraint: 'Not Null', desc: 'Loại (CONTRACT/EXPENSE).' },
          { name: 'file_name', type: 'VARCHAR(255)', constraint: '', desc: 'Tên file gốc.' },
          { name: 'file_url', type: 'VARCHAR(500)', constraint: '', desc: 'Đường dẫn file.' }
        ]
      }
    ]
  },
  {
    group: '3. NHÓM DANH MỤC DÙNG CHUNG (MASTER DATA)',
    tables: [
      {
        name: 'master_contract_types',
        description: 'Danh mục loại hợp đồng (Triển khai mới, Bảo trì...).',
        columns: [
          { name: 'id', type: 'INT', constraint: 'PK', desc: 'Khóa chính.' },
          { name: 'code', type: 'VARCHAR(20)', constraint: 'UQ', desc: 'Mã loại.' },
          { name: 'name', type: 'VARCHAR(100)', constraint: '', desc: 'Tên loại.' }
        ]
      },
      {
        name: 'master_status',
        description: 'Trạng thái hợp đồng (Mới, Đang chạy, Hoàn thành...).',
        columns: [
          { name: 'id', type: 'INT', constraint: 'PK', desc: 'Khóa chính.' },
          { name: 'code', type: 'VARCHAR(20)', constraint: 'UQ', desc: 'Mã trạng thái.' },
          { name: 'name', type: 'VARCHAR(100)', constraint: '', desc: 'Tên hiển thị.' },
          { name: 'color_hex', type: 'VARCHAR(10)', constraint: '', desc: 'Màu sắc hiển thị.' }
        ]
      }
    ]
  },
  {
    group: '4. NHÓM QUẢN TRỊ (ADMIN)',
    tables: [
      {
        name: 'users',
        description: 'Người dùng hệ thống.',
        columns: [
          { name: 'id', type: 'UUID / INT', constraint: 'PK', desc: 'Khóa chính.' },
          { name: 'username', type: 'VARCHAR(50)', constraint: 'UQ, Not Null', desc: 'Tên đăng nhập.' },
          { name: 'full_name', type: 'VARCHAR(100)', constraint: '', desc: 'Họ tên.' },
          { name: 'role', type: 'VARCHAR(50)', constraint: '', desc: 'Vai trò.' },
          { name: 'status', type: 'ENUM', constraint: '', desc: 'Trạng thái hoạt động.' }
        ]
      },
      {
        name: 'audit_logs',
        description: 'Nhật ký truy cập và thao tác.',
        columns: [
          { name: 'id', type: 'BIGINT', constraint: 'PK', desc: 'Khóa chính.' },
          { name: 'user_id', type: 'UUID / INT', constraint: 'FK -> users', desc: 'Người thực hiện.' },
          { name: 'action_type', type: 'VARCHAR(20)', constraint: '', desc: 'Loại hành động.' },
          { name: 'target_table', type: 'VARCHAR(50)', constraint: '', desc: 'Bảng bị tác động.' },
          { name: 'description', type: 'TEXT', constraint: '', desc: 'Chi tiết.' }
        ]
      }
    ]
  }
];

// --- SRS DOCUMENT DATA ---
interface SRSSection {
  title: string;
  content?: string;
  subSections?: SRSSection[];
  items?: { title: string; desc: string }[];
}

const SRS_DOCUMENT: SRSSection[] = [
  {
    title: '1. GIỚI THIỆU TỔNG QUAN',
    subSections: [
      {
        title: '1.1. Mục đích',
        content: 'Tài liệu này mô tả chi tiết các yêu cầu chức năng và phi chức năng cho Hệ thống Quản lý Hợp đồng CEH. Hệ thống nhằm mục đích số hóa quy trình quản lý hợp đồng, theo dõi tiến độ thanh toán, kiểm soát chi phí và cung cấp báo cáo quản trị.'
      },
      {
        title: '1.2. Phạm vi',
        content: 'Hệ thống được sử dụng nội bộ bởi các phòng ban: Kinh doanh, Kế toán, Ban Giám đốc và các PM dự án. Phạm vi bao gồm: Quản lý vòng đời hợp đồng, Quản lý khách hàng/NCC, Theo dõi công nợ, Báo cáo thống kê.'
      }
    ]
  },
  {
    title: '2. YÊU CẦU CHỨC NĂNG (FUNCTIONAL REQUIREMENTS)',
    subSections: [
      {
        title: '2.1. Phân hệ Quản trị hệ thống (System Admin)',
        items: [
          { title: 'Đăng nhập / Đăng xuất', desc: 'Người dùng đăng nhập bằng tài khoản được cấp. Hệ thống hỗ trợ ghi nhớ phiên đăng nhập.' },
          { title: 'Quản lý người dùng', desc: 'Admin có thể thêm, sửa, khóa tài khoản người dùng và phân quyền (Role-based).' },
          { title: 'Nhật ký hệ thống (Audit Logs)', desc: 'Ghi lại toàn bộ thao tác thêm/sửa/xóa dữ liệu quan trọng để tra cứu.' }
        ]
      },
      {
        title: '2.2. Phân hệ Quản lý Danh mục (Master Data)',
        items: [
          { title: 'Quản lý Khách hàng', desc: 'CRUD thông tin khách hàng, gán mã KH tự động hoặc thủ công.' },
          { title: 'Quản lý Nhà cung cấp', desc: 'CRUD thông tin NCC, phân loại lĩnh vực cung cấp.' },
          { title: 'Cấu hình tham số', desc: 'Quản lý các danh mục động: Loại hợp đồng, Trạng thái, Loại phần mềm.' }
        ]
      },
      {
        title: '2.3. Phân hệ Quản lý Hợp đồng (Core)',
        items: [
          { title: 'Tạo mới Hợp đồng', desc: 'Nhập thông tin chung, đính kèm file scan hợp đồng. Hệ thống tự động cảnh báo nếu trùng số hợp đồng.' },
          { title: 'Quản lý Đợt thanh toán', desc: 'Thiết lập các mốc thanh toán (Installments), theo dõi trạng thái "Đã thu tiền" và "Xuất hóa đơn".' },
          { title: 'Quản lý Chi phí (Expenses)', desc: 'Ghi nhận các khoản chi liên quan đến hợp đồng (Mua thiết bị, công tác phí), liên kết với Nhà cung cấp.' },
          { title: 'Theo dõi Nhân sự', desc: 'Gán thành viên tham gia dự án (PM, BA, Dev) để tính KPI (Giai đoạn 2).' }
        ]
      },
      {
        title: '2.4. Phân hệ Báo cáo (Reporting)',
        items: [
          { title: 'Dashboard', desc: 'Hiển thị KPI tổng quan, biểu đồ doanh thu/chi phí theo thời gian thực.' },
          { title: 'Báo cáo cảnh báo', desc: 'Liệt kê các hợp đồng sắp hết hạn hoặc quá hạn nghiệm thu/thanh toán.' },
          { title: 'Xuất dữ liệu', desc: 'Hỗ trợ xuất danh sách hợp đồng, công nợ ra định dạng Excel.' }
        ]
      }
    ]
  },
  {
    title: '3. YÊU CẦU PHI CHỨC NĂNG (NON-FUNCTIONAL)',
    items: [
      { title: 'Hiệu năng', desc: 'Thời gian phản hồi của hệ thống < 2 giây cho các tác vụ tra cứu thông thường. Hỗ trợ 50-100 người dùng đồng thời.' },
      { title: 'Bảo mật', desc: 'Mật khẩu người dùng phải được mã hóa (Hash). Dữ liệu nhạy cảm (Doanh thu) chỉ hiển thị cho Ban Giám đốc và Kế toán.' },
      { title: 'Giao diện (UI/UX)', desc: 'Thiết kế hiện đại, hỗ trợ Responsive (hiển thị tốt trên Desktop và Tablet).' },
      { title: 'Sao lưu', desc: 'Hệ thống tự động sao lưu dữ liệu hàng ngày vào 00:00.' }
    ]
  },
  {
    title: '4. QUY TẮC NGHIỆP VỤ (BUSINESS RULES)',
    items: [
      { title: 'BR-01: Mã hợp đồng', desc: 'Mã hợp đồng là duy nhất trên toàn hệ thống. Không được phép trùng lặp.' },
      { title: 'BR-02: Xóa dữ liệu', desc: 'Chỉ được phép xóa hợp đồng khi trạng thái là "Mới tạo". Nếu đã có phát sinh thanh toán hoặc chi phí, chỉ được phép chuyển trạng thái sang "Hủy".' },
      { title: 'BR-03: Nghiệm thu', desc: 'Hợp đồng bắt buộc phải nhập "Ngày nghiệm thu" khi chuyển trạng thái sang "Hoàn thành".' }
    ]
  }
];

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
            
            if (section.content) {
                htmlContent += `<div class="srs-p">${section.content}</div>`;
            }

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
      
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Tài liệu hệ thống</h2>
          <div className="text-sm text-slate-500 flex items-center gap-2">
            <span>Tài liệu</span> 
            <Icons.ChevronDown size={14} className="-rotate-90 text-slate-300"/> 
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
            
            {/* DATABASE DICTIONARY VIEW */}
            {activeDoc === 'db' && (
                <div className="animate-in fade-in duration-300">
                    <div className="mb-8 text-center border-b border-slate-100 pb-6">
                        <h1 className="text-2xl font-bold text-slate-800 uppercase tracking-wide">TỪ ĐIỂN DỮ LIỆU (DATABASE DICTIONARY)</h1>
                        <p className="text-slate-500 mt-2">Hệ thống quản lý hợp đồng CEH</p>
                    </div>

                    <div className="space-y-10">
                        {DB_DICTIONARY.map((group, gIdx) => (
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
            )}

            {/* SRS DOCUMENT VIEW */}
            {activeDoc === 'srs' && (
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
                        {SRS_DOCUMENT.map((section, idx) => (
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
            )}

         </div>
      </div>
    </div>
  );
};
