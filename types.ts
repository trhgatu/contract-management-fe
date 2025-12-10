
export interface KPI {
  title: string;
  value: string | number;
  trend: number; // percentage
  trendLabel: string;
  isPositive: boolean; // for color coding
  icon: 'file' | 'files' | 'dollar' | 'chart';
}

export interface Customer {
  id: string;
  rank: number;
  name: string;
  revenue: number;
  expense: number;
}

export interface ContractWarning {
  id: string;
  contractCode: string;
  type: string;
  expiryDate: string;
  daysLate: number;
}

export interface SoftwareType {
  name: string;
  count: number;
}

export interface MonthlyData {
  month: string;
  contracts: number;
  appendices: number;
  revenue: number;
  expense: number;
}

export interface ContractStatus {
  name: string;
  value: number;
  color: string;
}

// --- New Types for Contract Management ---

export interface PaymentTerm {
  id: string;
  batch: string; // Đợt thanh toán (Replaces stage)
  content: string;
  ratio: number; // %
  value: number;
  isCollected: boolean; // Trạng thái: Đã thu tiền / Chưa thu tiền
  collectionDate: string; // Ngày thu tiền (dd/mm/yyyy)
  invoiceStatus: 'exported' | 'not_exported'; // Trạng thái hóa đơn
}

export interface ContractAttachment {
  id: string;
  name: string;
  size: string;
  type: string; // 'pdf', 'docx', 'xlsx', etc.
  uploadDate: string;
}

export interface Expense {
  id: string;
  category: string; // Hạng mục (Replaces description)
  description: string; // Diễn giải (New field)
  supplierId: string; // Mã nhà cung cấp (Liên kết với MasterDataSupplier)
  totalAmount: number; // Tổng chi phí (VNĐ)
  contractStatus: string; // Trạng thái hợp đồng (Thừa hưởng từ MasterDataStatus)
  paymentStatus: 'paid' | 'unpaid'; // Trạng thái thanh toán
  pic: string; // Nhân viên phụ trách
  note: string; // Ghi chú
  attachments: ContractAttachment[]; // File đính kèm
}

export interface ProjectMember {
  id: string;
  memberCode: string;
  name: string;
  role: string;
}

export interface Contract {
  id: string;
  code: string;
  signDate: string;
  customerName: string;
  content: string;
  softwareTypes: string[];
  contractType?: string; // Loại hợp đồng
  valuePreVat: number;
  vat: number; // percentage or amount, assuming amount for display logic simplicity or calculated
  valuePostVat: number;
  duration: string;
  status: string; // CHANGED: from strict union to string to support dynamic codes (ST01, ST02...)
  acceptanceDate?: string; // Ngày nghiệm thu
  // Details
  paymentTerms: PaymentTerm[];
  expenses: Expense[];
  members: ProjectMember[];
  attachments?: ContractAttachment[];
}

// --- Master Data Types ---

export interface MasterDataCustomer {
  id: string;
  code: string;
  name: string;
  field: string; // Lĩnh vực
  contactPerson: string;
  phone: string;
  email?: string; // New
  address: string;
  taxCode: string;
  group?: string; // New: Nhóm khách hàng
  status: 'active' | 'inactive'; // New
}

export interface MasterDataSupplier {
  id: string;
  code: string;
  name: string;
  field: string;
  taxCode: string;
  contactPerson: string;
  phone: string;
  email?: string; // New
  address: string;
  status: 'active' | 'inactive'; // New
}

export interface MasterDataGeneric {
  id: string;
  code: string;
  name: string;
  description?: string;
  color?: string; // Optional for status
}

// --- Navigation / Category Types ---

export type CategoryType = 'customer' | 'supplier' | 'unit' | 'software' | 'contract-type' | 'status' | 'expense' | 'job';

export type ReportType = 'contract' | 'revenue' | 'expense' | 'profit' | 'customer' | 'software' | 'payment' | 'invoice';

export type AdminTabType = 'config' | 'notification' | 'logs' | 'user-accounts' | 'user-groups' | 'permissions';

export interface CategoryDefinition {
  id: string; // Changed from CategoryType to string to support generic lists if needed, but keeping usage consistent
  name: string;
  icon: string; // keyof Icons
  description: string;
}

// --- Admin & Reports Types ---

export interface UserGroup {
  id: string;
  code: string;
  name: string;
  note: string;
}

export interface SystemUser {
  id: string;
  username: string;
  fullName: string;
  role: string; // Display role name
  groupId: string; // Link to UserGroup
  email: string;
  status: 'active' | 'inactive';
  lastLogin: string;
  password?: string; // Only for update logic
}

export interface PermissionNode {
  id: string;
  name: string;
  isParent: boolean;
  parentId?: string;
  canView: boolean;
  canAdd: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

export interface AuditLogEntry {
  id: string;
  user: string;
  screen: string; // New: Chức năng (e.g., Quản lý hợp đồng)
  action: string; // 'THÊM', 'SỬA', 'XÓA', 'LOGIN', etc.
  details: any; // New: Dữ liệu thay đổi (Object or String)
  timestamp: string; // dd/mm/yyyy hh:mm:ss
}

export interface RevenueBySoftware {
  name: string;
  value: number;
}

export interface ProfitData {
  month: string;
  revenue: number;
  expense: number;
  profit: number;
}
