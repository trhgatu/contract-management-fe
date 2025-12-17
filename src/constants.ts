
import { KPI, Customer, ContractWarning, SoftwareType, MonthlyData, ContractStatus, Contract, MasterDataCustomer, MasterDataGeneric, CategoryDefinition, SystemUser, AuditLog, ProfitData, RevenueBySoftware, MasterDataSupplier, UserGroup, PermissionNode } from './types';

export const KPIS: KPI[] = [
  {
    title: 'Tổng số hợp đồng',
    value: 121,
    trend: 30,
    trendLabel: 'so với năm trước',
    isPositive: true,
    icon: 'file',
  },
  {
    title: 'Tổng số lượng phụ lục',
    value: 52,
    trend: -11.4,
    trendLabel: 'so với năm trước',
    isPositive: false,
    icon: 'files',
  },
  {
    title: 'Doanh thu trong năm',
    value: 2065382000,
    trend: 15.2,
    trendLabel: 'đạt kế hoạch',
    isPositive: true,
    icon: 'dollar',
  },
  {
    title: 'Chi phí trong năm',
    value: 1065382000,
    trend: -5.1,
    trendLabel: 'tối ưu hoá',
    isPositive: true,
    icon: 'chart',
  },
];

export const TOP_CUSTOMERS: Customer[] = [
  { id: '1', rank: 1, name: 'Công ty Cổ phần Cảng Sài Gòn', revenue: 3175600000, expense: 1200000000 },
  { id: '2', rank: 2, name: 'Công ty TNHH MTV Tổng Công ty Tân Cảng Sài Gòn', revenue: 2175600000, expense: 900000000 },
  { id: '3', rank: 3, name: 'Công ty Cổ phần Cảng Nam Hải', revenue: 1850000000, expense: 750000000 },
  { id: '4', rank: 4, name: 'Công ty Cổ phần Cảng Đồng Nai', revenue: 1200000000, expense: 400000000 },
  { id: '5', rank: 5, name: 'Công ty Cổ phần Vận tải và Xếp dỡ Hải An', revenue: 980000000, expense: 300000000 },
];

export const WARNINGS: ContractWarning[] = [
  { id: '1', contractCode: 'HD001', type: 'Bảo trì hệ thống', expiryDate: '2024-12-31', daysLate: 5 },
  { id: '2', contractCode: 'HD034', type: 'Thuê phần mềm', expiryDate: '2025-01-15', daysLate: 2 },
  { id: '3', contractCode: 'HD089', type: 'Tư vấn giải pháp', expiryDate: '2025-01-20', daysLate: 0 }, // 0 means due today
  { id: '4', contractCode: 'HD112', type: 'Nâng cấp server', expiryDate: '2025-02-01', daysLate: -10 }, // Negative means upcoming soon (optional logic)
];

// UPDATED SOFTWARE TYPES
export const SOFTWARE_TYPES: SoftwareType[] = [
  { name: 'VTOS', count: 35 },
  { name: 'VSL', count: 28 },
  { name: 'CAS', count: 12 },
  { name: 'ECM', count: 10 },
  { name: 'M&R', count: 22 },
  { name: 'Smartport', count: 28 },
  { name: 'GTOS', count: 15 },
  { name: 'Eport', count: 18 },
  { name: 'TAS', count: 8 },
];

export const CHART_DATA: MonthlyData[] = [
  { month: '1/2025', contracts: 57, appendices: 10, revenue: 120000000, expense: 80000000 },
  { month: '2/2025', contracts: 62, appendices: 11, revenue: 150000000, expense: 90000000 },
  { month: '3/2025', contracts: 68, appendices: 12, revenue: 180000000, expense: 95000000 },
  { month: '4/2025', contracts: 75, appendices: 14, revenue: 210000000, expense: 110000000 },
  { month: '5/2025', contracts: 85, appendices: 14, revenue: 250000000, expense: 130000000 },
  { month: '6/2025', contracts: 93, appendices: 15, revenue: 300000000, expense: 150000000 },
  { month: '7/2025', contracts: 98, appendices: 18, revenue: 320000000, expense: 160000000 },
  { month: '8/2025', contracts: 105, appendices: 20, revenue: 350000000, expense: 175000000 },
];

export const STATUS_DATA: ContractStatus[] = [
  { name: 'Đang thực hiện', value: 41, color: '#3b82f6' }, // Blue-500
  { name: 'Hoàn tất', value: 80, color: '#10b981' }, // Emerald-500
  { name: 'Tạm dừng', value: 5, color: '#f59e0b' }, // Amber-500
  { name: 'Hủy bỏ', value: 2, color: '#ef4444' }, // Red-500
];

// --- Mock Data for Contracts (Updated to match new software types) ---

export const MOCK_CONTRACTS: Contract[] = [
  {
    id: '1',
    code: 'HD-2025-001',
    signDate: '2025-01-15',
    customerName: 'Công ty Cổ phần Cảng Sài Gòn',
    content: 'Triển khai hệ thống VTOS và Smartport',
    softwareTypes: ['VTOS', 'Smartport'],
    contractType: 'Triển khai mới',
    valuePreVat: 500000000,
    vat: 50000000,
    valuePostVat: 550000000,
    duration: '12 Tháng',
    status: 'ST02', // Was 'active' -> ST02 (Đang triển khai)
    acceptanceDate: '',
    paymentTerms: [
      { id: '1', batch: 'Đợt 1', content: 'Tạm ứng', ratio: 30, value: 165000000, isCollected: true, collectionDate: '2025-01-20', invoiceStatus: 'exported' },
      { id: '2', batch: 'Đợt 2', content: 'Nghiệm thu UAT', ratio: 40, value: 220000000, isCollected: false, collectionDate: '', invoiceStatus: 'not_exported' },
      { id: '3', batch: 'Đợt 3', content: 'Nghiệm thu tổng thể', ratio: 30, value: 165000000, isCollected: false, collectionDate: '', invoiceStatus: 'not_exported' },
    ],
    expenses: [
      {
        id: '1',
        category: 'Thuê Server',
        description: 'Server 32GB RAM, 8 Core',
        supplierId: '1', // NCC001 - Viễn Thông A
        totalAmount: 50000000,
        contractStatus: 'ST02', // Consistent status code
        paymentStatus: 'paid',
        pic: 'Nguyễn Văn A',
        note: 'Thanh toán theo quý',
        attachments: [
          { id: 'f1', name: 'HD_Thue_Server.pdf', size: '1.2 MB', type: 'pdf', uploadDate: '2025-01-10' }
        ]
      },
      {
        id: '2',
        category: 'Chi phí đi lại',
        description: 'Vé máy bay khứ hồi HCM-HP',
        supplierId: '2', // NCC002 - FPT (Example)
        totalAmount: 10000000,
        contractStatus: 'ST03', // Was ST03
        paymentStatus: 'unpaid',
        pic: 'Trần Thị B',
        note: 'Công tác phí Hải Phòng',
        attachments: []
      },
    ],
    members: [
      { id: '1', memberCode: 'NV001', name: 'Nguyễn Văn A', role: 'PM' },
      { id: '2', memberCode: 'NV005', name: 'Lê Văn C', role: 'Dev' },
    ],
    attachments: [
      { id: '1', name: 'Hop_dong_goc_001.pdf', size: '2.4 MB', type: 'pdf', uploadDate: '2025-01-15' },
      { id: '2', name: 'Phu_luc_01.docx', size: '500 KB', type: 'docx', uploadDate: '2025-01-20' }
    ]
  },
  {
    id: '2',
    code: 'HD-2025-002',
    signDate: '2025-02-10',
    customerName: 'Công ty TNHH MTV Tổng Công ty Tân Cảng Sài Gòn',
    content: 'Nâng cấp hệ thống Eport',
    softwareTypes: ['Eport'],
    contractType: 'Triển khai mới',
    valuePreVat: 1200000000,
    vat: 120000000,
    valuePostVat: 1320000000,
    duration: '24 Tháng',
    status: 'ST03', // Was 'completed' -> ST03 (Hoàn thành)
    acceptanceDate: '2025-02-28',
    paymentTerms: [
      { id: '1', batch: 'Đợt 1', content: 'Ký hợp đồng', ratio: 50, value: 660000000, isCollected: true, collectionDate: '2025-02-15', invoiceStatus: 'exported' },
      { id: '2', batch: 'Đợt 2', content: 'Golive', ratio: 50, value: 660000000, isCollected: false, collectionDate: '', invoiceStatus: 'not_exported' },
    ],
    expenses: [],
    members: [
      { id: '1', memberCode: 'NV002', name: 'Trần Thị B', role: 'BA' },
    ],
    attachments: []
  },
  {
    id: '3',
    code: 'HD-2025-003',
    signDate: '2025-02-20',
    customerName: 'Công ty Cổ phần Cảng Nam Hải',
    content: 'Bảo trì hệ thống M&R',
    softwareTypes: ['M&R'],
    contractType: 'Bảo trì',
    valuePreVat: 200000000,
    vat: 20000000,
    valuePostVat: 220000000,
    duration: '12 Tháng',
    status: 'ST01', // Was 'pending' -> ST01 (Chưa thực hiện)
    acceptanceDate: '',
    paymentTerms: [],
    expenses: [],
    members: [],
    attachments: []
  },
];

// --- Mock Data for Master Data ---

export const SHARED_CATEGORIES_LIST: CategoryDefinition[] = [
  { id: 'customer', name: 'Quản lý Khách hàng', icon: 'Customer', description: 'Quản lý thông tin đối tác, khách hàng' },
  { id: 'supplier', name: 'Quản lý Nhà cung cấp', icon: 'Supplier', description: 'Quản lý thông tin nhà cung cấp, đối tác' },
  { id: 'software', name: 'Loại hình phần mềm', icon: 'Category', description: 'VTOS, ICD, M&R, VSL...' },
  { id: 'contract-type', name: 'Loại hợp đồng', icon: 'Contract', description: 'Triển khai mới, bảo trì, gia hạn' },
  { id: 'status', name: 'Trạng thái hợp đồng', icon: 'Check', description: 'Các trạng thái vòng đời dự án' },
  { id: 'personnel', name: 'Danh sách nhân sự', icon: 'Users', description: 'Quản lý nhân viên, PM, AM' },
];

// UPDATED CUSTOMER LIST with new fields
export const MOCK_MD_CUSTOMERS: MasterDataCustomer[] = [
  { id: '1', code: 'KH001', name: 'Công ty Cổ phần Cảng Sài Gòn', field: 'Cảng biển', contactPerson: 'Ông Nguyễn Văn A', phone: '0901234567', email: 'a.nguyen@csg.com', address: 'TP.HCM', taxCode: '0301111111', group: 'VIP', status: 'active' },
  { id: '2', code: 'KH002', name: 'Công ty TNHH MTV DV Hàng hải Hậu Giang', field: 'Hàng hải', contactPerson: 'Bà Lê Thị B', phone: '0902222222', email: 'b.le@hgl.com', address: 'Hậu Giang', taxCode: '0302222222', group: 'Thân thiết', status: 'active' },
  { id: '3', code: 'KH003', name: 'Công ty CP Giải pháp CNTT Tân Cảng', field: 'CNTT', contactPerson: 'Ông Trần Văn C', phone: '0903333333', email: 'c.tran@tcl.com', address: 'TP.Thủ Đức', taxCode: '0303333333', group: 'Nội bộ', status: 'active' },
  { id: '4', code: 'KH004', name: 'Công ty TNHH Cảng Quốc tế Tân Cảng - Cái Mép', field: 'Cảng biển', contactPerson: 'Bà Phạm Thị D', phone: '0904444444', email: 'd.pham@tcit.com', address: 'Bà Rịa - Vũng Tàu', taxCode: '0304444444', group: 'VIP', status: 'active' },
  { id: '5', code: 'KH005', name: 'Công ty CP Vận tải và Thương mại Quốc tế', field: 'Vận tải', contactPerson: 'Ông Hoàng Văn E', phone: '0905555555', email: 'e.hoang@itc.com', address: 'TP.HCM', taxCode: '0305555555', group: 'Mới', status: 'inactive' },
  // Simplified remaining entries for brevity, assuming standard active status
  { id: '6', code: 'KH006', name: 'Công ty TNHH Xuất nhập khẩu Sang Trọng', field: 'XNK', contactPerson: 'Bà Ngô Thị F', phone: '0906666666', email: 'f.ngo@sangtrong.com', address: 'Bình Dương', taxCode: '0306666666', group: 'Thường', status: 'active' },
  { id: '7', code: 'KH007', name: 'Công ty Cổ phần Dịch vụ Hàng hải Tân Cảng', field: 'Hàng hải', contactPerson: 'Ông Đỗ Văn G', phone: '0907777777', email: 'g.do@tcco.com', address: 'TP.Thủ Đức', taxCode: '0307777777', group: 'Nội bộ', status: 'active' },
  { id: '8', code: 'KH008', name: 'Công ty Cổ phần Cảng Nam Hải', field: 'Cảng biển', contactPerson: 'Bà Vũ Thị H', phone: '0908888888', email: 'h.vu@namhai.com', address: 'Hải Phòng', taxCode: '0308888888', group: 'VIP', status: 'active' },
  { id: '9', code: 'KH009', name: 'Công ty TNHH MTV Tổng Công ty Tân Cảng Sài Gòn', field: 'Cảng biển', contactPerson: 'Ông Lý Văn I', phone: '0909999999', email: 'i.ly@snp.com', address: 'TP.HCM', taxCode: '0309999999', group: 'VIP', status: 'active' },
  { id: '10', code: 'KH010', name: 'Công ty TNHH Cảng Phước Long', field: 'Cảng biển', contactPerson: 'Bà Bùi Thị K', phone: '0910000000', email: 'k.bui@phuoclong.com', address: 'TP.Thủ Đức', taxCode: '0310000000', group: 'Thân thiết', status: 'active' },
];

// UPDATED SUPPLIER LIST with new fields
export const MOCK_MD_SUPPLIERS: MasterDataSupplier[] = [
  { id: '1', code: 'NCC001', name: 'Công ty TNHH Viễn Thông A', field: 'Hạ tầng mạng', taxCode: '0312223331', contactPerson: 'Nguyễn Văn Minh', phone: '0987654321', email: 'minh.nv@vienthonga.com', address: 'TP.HCM', status: 'active' },
  { id: '2', code: 'NCC002', name: 'Công ty CP Phần Mềm FPT', field: 'Phần mềm', taxCode: '0312223332', contactPerson: 'Lê Thị Hà', phone: '0912345678', email: 'ha.le@fsoft.com.vn', address: 'Hà Nội', status: 'active' },
  { id: '3', code: 'NCC003', name: 'Công ty TNHH Máy Tính CMC', field: 'Thiết bị IT', taxCode: '0312223333', contactPerson: 'Trần Văn Tú', phone: '0909090909', email: 'tu.tv@cmc.com', address: 'Đà Nẵng', status: 'inactive' },
  { id: '4', code: 'NCC004', name: 'Công ty TNHH Dịch vụ Bảo vệ Long Hải', field: 'An ninh', taxCode: '0312223334', contactPerson: 'Phạm Thị Lan', phone: '0933333333', email: 'lan.pt@longhai.com', address: 'Bình Dương', status: 'active' },
  { id: '5', code: 'NCC005', name: 'Công ty TNHH Vệ sinh Công nghiệp Hoàn Mỹ', field: 'Vệ sinh', taxCode: '0312223335', contactPerson: 'Hoàng Văn Nam', phone: '0944444444', email: 'nam.hv@hoanmy.com', address: 'Đồng Nai', status: 'active' },
];

export const MOCK_MD_UNITS: MasterDataGeneric[] = [
  { id: '1', code: 'DV01', name: 'CEH Software', description: 'Khối phát triển phần mềm' },
  { id: '2', code: 'DV02', name: 'CEH Infrastructure', description: 'Khối hạ tầng mạng' },
  { id: '3', code: 'DV03', name: 'CEH Consulting', description: 'Khối tư vấn giải pháp' },
];

// UPDATED SOFTWARE TYPES MASTER DATA
export const MOCK_MD_SOFTWARE_TYPES: MasterDataGeneric[] = [
  { id: '1', code: 'PM01', name: 'VTOS', description: 'Vietnam Terminal Operating System' },
  { id: '2', code: 'PM02', name: 'VSL', description: 'Vessel Planning System' },
  { id: '3', code: 'PM03', name: 'CAS', description: 'Container Automation System' },
  { id: '4', code: 'PM04', name: 'ECM', description: 'Empty Container Management' },
  { id: '5', code: 'PM05', name: 'M&R', description: 'Maintenance and Repair' },
  { id: '6', code: 'PM06', name: 'Smartport', description: 'Smart Port Application' },
  { id: '7', code: 'PM07', name: 'GTOS', description: 'General Cargo Terminal Operating System' },
  { id: '8', code: 'PM08', name: 'Eport', description: 'Electronic Port' },
  { id: '9', code: 'PM09', name: 'TAS', description: 'Terminal Automation System' },
];

export const MOCK_MD_CONTRACT_TYPES: MasterDataGeneric[] = [
  { id: '1', code: 'HD01', name: 'Triển khai mới', description: 'Hợp đồng dự án mới' },
  { id: '2', code: 'HD02', name: 'Bảo trì', description: 'Hợp đồng bảo trì, hỗ trợ' },
  { id: '3', code: 'HD03', name: 'Gia hạn', description: 'Phụ lục gia hạn thời gian' },
  { id: '4', code: 'HD04', name: 'Mua sắm', description: 'Mua sắm thiết bị, bản quyền' },
];

export const MOCK_MD_STATUS: MasterDataGeneric[] = [
  { id: '1', code: 'ST01', name: 'Chưa thực hiện', description: 'Mới ký, chưa start', color: 'bg-slate-100 text-slate-600' },
  { id: '2', code: 'ST02', name: 'Đang triển khai', description: 'Dự án đang chạy', color: 'bg-blue-100 text-blue-600' },
  { id: '3', code: 'ST03', name: 'Hoàn thành', description: 'Đã nghiệm thu', color: 'bg-emerald-100 text-emerald-600' },
];

// --- Mock Data for Admin & Reports ---

export const MOCK_USER_GROUPS: UserGroup[] = [
  { id: '1', code: 'G01', name: 'Super Admin', note: 'Quản trị hệ thống toàn quyền' },
  { id: '2', code: 'G02', name: 'Ban Giám Đốc', note: 'Xem báo cáo, duyệt hợp đồng' },
  { id: '3', code: 'G03', name: 'Kế Toán Trưởng', note: 'Quản lý công nợ, hóa đơn' },
  { id: '4', code: 'G04', name: 'Project Manager', note: 'Quản lý dự án, chi phí' },
  { id: '5', code: 'G05', name: 'Sales', note: 'Tạo hợp đồng, quản lý khách hàng' },
];

export const MOCK_USERS: SystemUser[] = [
  { id: '1', username: 'admin', fullName: 'Nguyễn Quản Trị', role: 'Super Admin', groupId: '1', email: 'admin@ceh.vn', status: 'active', lastLogin: '2025-02-28 08:30:00' },
  { id: '2', username: 'kttruong', fullName: 'Trần Kế Toán', role: 'Kế toán trưởng', groupId: '3', email: 'ketoan@ceh.vn', status: 'active', lastLogin: '2025-02-27 14:15:00' },
  { id: '3', username: 'giamdoc', fullName: 'Lê Giám Đốc', role: 'Ban Giám Đốc', groupId: '2', email: 'ceo@ceh.vn', status: 'active', lastLogin: '2025-02-28 09:00:00' },
  { id: '4', username: 'pm_nam', fullName: 'Phạm Nam', role: 'Project Manager', groupId: '4', email: 'nam.pham@ceh.vn', status: 'inactive', lastLogin: '2025-01-10 10:00:00' },
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: '1',
    user: 'admin',
    action: 'SỬA',
    screen: 'Cấu hình hệ thống',
    details: { field: 'email_config', old: 'smtp.gmail.com', new: 'mail.ceh.vn' },
    timestamp: '28/02/2025 08:35:12'
  },
  {
    id: '2',
    user: 'kttruong',
    action: 'THÊM',
    screen: 'Quản lý hợp đồng > Chi phí',
    details: { contract: 'HD-2025-001', amount: 50000000, supplier: 'Viễn Thông A' },
    timestamp: '27/02/2025 15:20:00'
  },
  {
    id: '3',
    user: 'admin',
    action: 'THÊM',
    screen: 'Quản lý người dùng > Tài khoản',
    details: { username: 'nhanvien_moi', role: 'Nhân viên', email: 'nv@ceh.vn' },
    timestamp: '28/02/2025 09:00:01'
  },
  {
    id: '4',
    user: 'pm_nam',
    action: 'SỬA',
    screen: 'Quản lý hợp đồng',
    details: { contract: 'HD-2025-001', field: 'status', old: 'ST01', new: 'ST02' },
    timestamp: '10/01/2025 10:05:00'
  },
  {
    id: '5',
    user: 'admin',
    action: 'XÓA',
    screen: 'Danh mục dùng chung > Khách hàng',
    details: { id: 'KH099', name: 'Công ty ABC' },
    timestamp: '01/03/2025 14:30:22'
  },
];

export const MOCK_PERMISSIONS: PermissionNode[] = [
  { id: 'p1', name: 'Dashboard', isParent: true, canView: true, canAdd: false, canEdit: false, canDelete: false },
  { id: 'p2', name: 'Quản lý hợp đồng', isParent: true, canView: true, canAdd: true, canEdit: true, canDelete: true },
  { id: 'p3', name: 'Danh mục dùng chung', isParent: true, canView: true, canAdd: false, canEdit: false, canDelete: false },
  { id: 'p3_1', name: 'Quản lý khách hàng', isParent: false, parentId: 'p3', canView: true, canAdd: true, canEdit: true, canDelete: false },
  { id: 'p3_2', name: 'Quản lý nhà cung cấp', isParent: false, parentId: 'p3', canView: true, canAdd: true, canEdit: true, canDelete: false },
  { id: 'p3_3', name: 'Cấu hình tham số', isParent: false, parentId: 'p3', canView: true, canAdd: false, canEdit: false, canDelete: false },
  { id: 'p4', name: 'Báo cáo thống kê', isParent: true, canView: true, canAdd: false, canEdit: false, canDelete: false },
  { id: 'p5', name: 'Quản trị hệ thống', isParent: true, canView: true, canAdd: true, canEdit: true, canDelete: true },
];

export const REPORT_PROFIT_DATA: ProfitData[] = [
  { month: 'T1', revenue: 1200, expense: 800, profit: 400 },
  { month: 'T2', revenue: 1500, expense: 900, profit: 600 },
  { month: 'T3', revenue: 1800, expense: 950, profit: 850 },
  { month: 'T4', revenue: 2100, expense: 1100, profit: 1000 },
  { month: 'T5', revenue: 2500, expense: 1300, profit: 1200 },
  { month: 'T6', revenue: 3000, expense: 1500, profit: 1500 },
];

// UPDATED REPORT SOFTWARE DATA
export const REPORT_SOFTWARE_DATA: RevenueBySoftware[] = [
  { name: 'VTOS', value: 35 },
  { name: 'Smartport', value: 28 },
  { name: 'VSL', value: 20 },
  { name: 'M&R', value: 10 },
  { name: 'Eport', value: 7 },
];
