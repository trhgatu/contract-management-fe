import React from 'react';
import { Icons } from '../ui/Icons';

const MENU_ITEMS = [
  { id: 'dashboard', name: 'Dashboard', icon: 'Dashboard' },
  { id: 'contracts', name: 'Hợp đồng', icon: 'Contract' },
  { id: 'customers', name: 'Khách hàng', icon: 'Customer' },
  { id: 'reports', name: 'Báo cáo', icon: 'Report' },
  { id: 'settings', name: 'Cài đặt', icon: 'Settings' },
];

interface SidebarProps {
  currentView: string;
  onNavigate: (viewId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-screen fixed left-0 top-0 flex flex-col z-20">
      <div className="h-16 flex items-center justify-center border-b border-slate-100">
         <span className="text-xl font-bold text-blue-600 tracking-wider">CEH ADMIN</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {MENU_ITEMS.map((item) => {
            const Icon = Icons[item.icon as keyof typeof Icons];
            const isActive = currentView === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon size={20} />
                  {item.name}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <h4 className="font-semibold text-sm mb-1">Cần hỗ trợ?</h4>
          <p className="text-xs text-blue-100 mb-3">Liên hệ đội ngũ IT để được giải đáp thắc mắc.</p>
          <button className="text-xs bg-white text-blue-600 px-3 py-1.5 rounded font-medium shadow-sm w-full">
            Gửi yêu cầu
          </button>
        </div>
      </div>
    </aside>
  );
};