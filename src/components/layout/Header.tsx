
import React from 'react';
import { Icons } from '../ui/Icons';
import { SHARED_CATEGORIES_LIST } from '../../constants';
import { CategoryType, ReportType, AdminTabType } from '../../types';

interface HeaderProps {
  currentView: string;
  onNavigate: (viewId: string) => void;
  onSelectSharedCategory: (id: CategoryType) => void;
  onSelectReportTab: (id: ReportType) => void;
  onSelectAdminTab: (id: AdminTabType) => void;
  onLogout: () => void;
}

const MENU_ITEMS = [
  { id: 'dashboard', name: 'Dashboard', icon: 'Dashboard', type: 'link' },
  { id: 'shared-categories', name: 'Danh mục dùng chung', icon: 'Category', type: 'mega' },
  { id: 'contracts', name: 'Quản lý hợp đồng', icon: 'Contract', type: 'link' },
  { id: 'reports', name: 'Thống kê – Báo cáo', icon: 'Report', type: 'mega' },
  { id: 'admin', name: 'Quản trị hệ thống', icon: 'Admin', type: 'mega' },
];

const REPORTS_LIST = [
  { id: 'contract', name: 'Báo cáo hợp đồng', icon: 'Contract', description: 'Tổng hợp số lượng, trạng thái' },
  { id: 'revenue', name: 'Báo cáo doanh thu', icon: 'Dollar', description: 'Doanh thu thực tế vs dự kiến' },
  { id: 'expense', name: 'Báo cáo chi phí', icon: 'Chart', description: 'Chi phí triển khai, vận hành' },
  { id: 'profit', name: 'Báo cáo lợi nhuận', icon: 'TrendingUp', description: 'Phân tích lợi nhuận dự án' },
  { id: 'customer', name: 'Báo cáo khách hàng', icon: 'Customer', description: 'Top khách hàng, công nợ' },
  { id: 'software', name: 'Hiệu quả phần mềm', icon: 'Document', description: 'Phân tích theo sản phẩm' },
  { id: 'payment', name: 'Tình hình thanh toán', icon: 'Briefcase', description: 'Công nợ, dòng tiền' },
  { id: 'invoice', name: 'Quản lý hóa đơn', icon: 'Tag', description: 'Theo dõi xuất hóa đơn' },
  { id: 'warnings', name: 'Báo cáo cảnh báo', icon: 'Warning', description: 'Cảnh báo hạn thanh toán, nghiệm thu' },
];

// Updated Admin List Structure
const ADMIN_LIST = [
  // User Management Group
  { id: 'user-accounts', name: 'Quản lý tài khoản', icon: 'User', description: 'Tạo và quản lý người dùng', group: 'Quản lý người dùng' },
  { id: 'user-groups', name: 'Quản lý nhóm tài khoản', icon: 'Users', description: 'Phân nhóm và vai trò', group: 'Quản lý người dùng' },
  { id: 'permissions', name: 'Quản lý phân quyền', icon: 'ShieldCheck', description: 'Cấp quyền truy cập chức năng', group: 'Quản lý người dùng' },
  // System Group
  { id: 'config', name: 'Cấu hình hệ thống', icon: 'Settings', description: 'Thiết lập chung, Email, SMS', group: 'Hệ thống' },
  { id: 'notification', name: 'Cảnh báo & Thông báo', icon: 'Bell', description: 'Cấu hình kịch bản gửi tin', group: 'Hệ thống' },
  { id: 'logs', name: 'Nhật ký hệ thống', icon: 'List', description: 'Tra cứu lịch sử tác động', group: 'Hệ thống' },
];

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onSelectSharedCategory,
  onSelectReportTab,
  onSelectAdminTab,
  onLogout
}) => {
  return (
    <header className="h-16 bg-[#0067FF] fixed top-0 right-0 left-0 z-50 px-6 flex items-center justify-between shadow-md transition-colors duration-300">
      {/* Left: Logo, Module Name, and Navigation */}
      <div className="flex items-center gap-6 flex-1">
        {/* Logo Area */}
        <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <div className="h-10 w-10 flex items-center justify-center overflow-hidden bg-white rounded-md p-0.5">
                 <img
                    src="https://res.cloudinary.com/dikm4mb2h/image/upload/v1765185786/logo_iwgmoz.png"
                    alt="CEH Logo"
                    className="h-full w-full object-contain"
                 />
            </div>
            {/* Divider changed to lighter opacity for blue background */}
            <div className="h-6 w-px bg-white/20 mx-1"></div>

            {/* Updated Title: Font Bold */}
            <h1 className="text-[19px] font-bold text-[#EEEEEE] hidden md:block font-sans tracking-wide">
              Quản lý hợp đồng
            </h1>
        </div>

        {/* Navigation - Horizontal */}
        <nav className="hidden xl:flex items-center gap-1 ml-4 relative h-full">
          {MENU_ITEMS.map((item) => {
             const isActive = currentView === item.id;
             const Icon = Icons[item.icon as keyof typeof Icons];

             // Base classes for nav items: Font Bold
             const navItemClasses = `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-white/20 text-white shadow-sm'
                  : 'text-blue-100 hover:bg-white/10 hover:text-white'
              }`;

             if (item.type === 'mega') {
               // Determine content for mega menu based on ID
               let subItems: any[] = [];
               let onSelect: (id: any) => void = () => {};
               let headerIcon = item.icon;
               let headerTitle = item.name;

               if (item.id === 'shared-categories') {
                   // Special handling for shared-categories below
                   onSelect = onSelectSharedCategory;
                   headerIcon = 'Category';
               } else if (item.id === 'reports') {
                   subItems = REPORTS_LIST;
                   onSelect = onSelectReportTab;
                   headerIcon = 'Report';
               } else if (item.id === 'admin') {
                   subItems = ADMIN_LIST; // Now contains grouping info
                   onSelect = onSelectAdminTab;
                   headerIcon = 'Admin';
               }

               const HeaderIconComp = Icons[headerIcon as keyof typeof Icons];

               // Adjust alignment: Admin menu aligns right to avoid overflow, others align left
               const alignmentClass = item.id === 'admin' ? 'right-0 origin-top-right' : 'left-0 origin-top-left';

               return (
                 <div key={item.id} className="group relative h-full flex items-center">
                    <button
                      className={navItemClasses}
                      onClick={(e) => e.preventDefault()} // Disabled navigation on click
                    >
                      <Icon size={16} className={isActive ? 'text-white' : 'text-blue-200 group-hover:text-white'}/>
                      {item.name}
                      <Icons.ChevronDown size={14} className="ml-0.5 text-blue-300 group-hover:text-white transition-transform group-hover:rotate-180" />
                    </button>

                    {/* MEGA MENU DROPDOWN PANEL */}
                    <div className={`absolute top-full ${alignmentClass} w-[550px] pt-2 hidden group-hover:block animate-in fade-in slide-in-from-top-1 z-50`}>
                        <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-4 overflow-hidden">

                            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-50">
                                <span className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
                                    <HeaderIconComp size={18} />
                                </span>
                                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">{headerTitle}</h3>
                            </div>

                            {/* CONDITIONAL RENDERING FOR SHARED CATEGORIES & ADMIN LAYOUT */}
                            {item.id === 'shared-categories' ? (
                                <div className="flex gap-4">
                                    {/* Left Column: Management Groups */}
                                    <div className="w-5/12 flex flex-col gap-2">
                                        {[
                                            SHARED_CATEGORIES_LIST.find(i => i.id === 'customer'),
                                            SHARED_CATEGORIES_LIST.find(i => i.id === 'supplier')
                                        ].filter(Boolean).map((subItem: any) => {
                                            const SubItemIcon = Icons[subItem.icon as keyof typeof Icons];
                                            return (
                                                <button
                                                    key={subItem.id}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onSelect(subItem.id);
                                                        onNavigate(item.id);
                                                    }}
                                                    className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-all text-left group/item border border-transparent hover:border-slate-100 hover:shadow-sm"
                                                >
                                                    <div className="p-2 bg-slate-50 text-slate-500 rounded-lg group-hover/item:bg-blue-600 group-hover/item:text-white transition-colors shrink-0">
                                                        <SubItemIcon size={18} />
                                                    </div>
                                                    <div className="min-w-0 flex flex-col justify-center h-full">
                                                        <div className="text-sm font-bold text-slate-700 group-hover/item:text-blue-700 transition-colors truncate">{subItem.name}</div>
                                                        <div className="text-[10px] text-slate-400 mt-0.5">Quản lý đối tác</div>
                                                    </div>
                                                </button>
                                            )
                                        })}
                                    </div>

                                    {/* Right Column: Parameters Config */}
                                    <div className="w-7/12 border-l border-slate-100 pl-4">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 pl-1 tracking-wider">Cấu hình tham số</h4>
                                        <div className="grid grid-cols-1 gap-1">
                                            {SHARED_CATEGORIES_LIST.filter(i => !['customer', 'supplier'].includes(i.id)).map((subItem) => {
                                                const SubItemIcon = Icons[subItem.icon as keyof typeof Icons];
                                                return (
                                                    <button
                                                        key={subItem.id}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onSelect(subItem.id);
                                                            onNavigate(item.id);
                                                        }}
                                                        className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-slate-50 transition-all text-left group/item"
                                                    >
                                                        <div className="text-slate-400 group-hover/item:text-blue-600 transition-colors shrink-0">
                                                            <SubItemIcon size={16} />
                                                        </div>
                                                        <div className="text-sm font-medium text-slate-600 group-hover/item:text-slate-900 transition-colors truncate">
                                                            {subItem.name}
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            ) : item.id === 'admin' ? (
                                /* ADMIN LAYOUT WITH GROUPS */
                                <div className="flex gap-4">
                                    <div className="w-1/2">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-2 tracking-wider">Quản lý người dùng</h4>
                                        <div className="flex flex-col gap-1">
                                            {subItems.filter(i => i.group === 'Quản lý người dùng').map(subItem => {
                                                const SubItemIcon = Icons[subItem.icon as keyof typeof Icons];
                                                return (
                                                    <button key={subItem.id} onClick={(e) => {e.stopPropagation(); onSelect(subItem.id); onNavigate(item.id);}} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-all text-left group/item">
                                                        <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md shrink-0"><SubItemIcon size={16} /></div>
                                                        <div className="text-sm font-medium text-slate-700 group-hover/item:text-blue-700">{subItem.name}</div>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                    <div className="w-1/2 border-l border-slate-100 pl-4">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-2 tracking-wider">Hệ thống</h4>
                                        <div className="flex flex-col gap-1">
                                            {subItems.filter(i => i.group === 'Hệ thống').map(subItem => {
                                                const SubItemIcon = Icons[subItem.icon as keyof typeof Icons];
                                                return (
                                                    <button key={subItem.id} onClick={(e) => {e.stopPropagation(); onSelect(subItem.id); onNavigate(item.id);}} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-all text-left group/item">
                                                        <div className="p-1.5 bg-slate-100 text-slate-500 rounded-md shrink-0"><SubItemIcon size={16} /></div>
                                                        <div className="text-sm font-medium text-slate-700 group-hover/item:text-blue-700">{subItem.name}</div>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* DEFAULT RENDERING FOR REPORTS */
                                <div className="grid grid-cols-2 gap-2">
                                    {subItems.map((subItem) => {
                                        const SubItemIcon = Icons[subItem.icon as keyof typeof Icons];
                                        return (
                                            <button
                                                key={subItem.id}
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevent bubbling
                                                    // If clicking on warnings, navigate to warnings view
                                                    if (subItem.id === 'warnings') {
                                                        onNavigate('warnings');
                                                    } else {
                                                        onSelect(subItem.id);
                                                        onNavigate(item.id); // Navigate to the main view
                                                    }
                                                }}
                                                className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-all text-left group/item border border-transparent hover:border-slate-100 hover:shadow-sm"
                                            >
                                                <div className="p-2 bg-slate-50 text-slate-500 rounded-lg group-hover/item:bg-blue-600 group-hover/item:text-white transition-colors shrink-0">
                                                    <SubItemIcon size={18} />
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="text-sm font-bold text-slate-700 group-hover/item:text-blue-700 transition-colors truncate">{subItem.name}</div>
                                                    <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1 group-hover/item:text-slate-600">{subItem.description}</div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                 </div>
               );
             }

             return (
               <button
                 key={item.id}
                 onClick={() => onNavigate(item.id)}
                 className={navItemClasses}
               >
                 <Icon size={16} className={isActive ? 'text-white' : 'text-blue-200 hover:text-white'}/>
                 {item.name}
               </button>
             )
          })}
        </nav>
      </div>

      {/* Center/Right: User Profile */}
      <div className="flex items-center gap-4 shrink-0">
        {/* User Profile - Group hover for dropdown */}
        <div className="flex items-center gap-3 cursor-pointer group relative h-16">
            <div className="text-right hidden xl:block">
                <div className="text-sm font-semibold text-white">Nguyễn Văn A</div>
                <div className="text-xs text-blue-200">Giám đốc dự án</div>
            </div>
            {/* Avatar border adjusted for blue bg */}
            <div className="h-9 w-9 rounded-full bg-white border-2 border-white/20 flex items-center justify-center text-[#0067FF] font-bold overflow-hidden shadow-sm">
                <img
                    src="https://res.cloudinary.com/dikm4mb2h/image/upload/v1765246514/user_fb_nubbmt.jpg"
                    alt="Avatar"
                    className="h-full w-full object-cover scale-[1.75]"
                />
            </div>
            <Icons.ChevronDown size={16} className="text-blue-200 group-hover:text-white transition-colors group-hover:rotate-180" />

            {/* Dropdown for Logout */}
            <div className="absolute top-full right-0 w-48 pt-1 hidden group-hover:block animate-in fade-in slide-in-from-top-1 z-50">
                <div className="bg-white rounded-lg shadow-xl border border-slate-100 py-1 overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-50 md:hidden">
                        <div className="text-sm font-semibold text-slate-800">Nguyễn Văn A</div>
                        <div className="text-xs text-slate-500">Giám đốc dự án</div>
                    </div>
                    <button
                      onClick={onLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                    >
                      <Icons.LogOut size={16} /> Đăng xuất
                    </button>
                </div>
            </div>
        </div>
      </div>
    </header>
  );
};

