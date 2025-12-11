
export const DB_DICTIONARY = [
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

export const SRS_DOCUMENT = [
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
