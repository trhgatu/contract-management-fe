
import React, { useState, useEffect } from 'react';
import { Icons } from './Icons';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, LineChart, Line
} from 'recharts';
import { REPORT_PROFIT_DATA, REPORT_SOFTWARE_DATA, CHART_DATA } from '../constants';
import { ReportType } from '../types';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

interface ReportsScreenProps {
  activeTab?: ReportType;
}

export const ReportsScreen: React.FC<ReportsScreenProps> = ({ activeTab = 'contract' }) => {
  const [activeReport, setActiveReport] = useState<ReportType>(activeTab);

  // Sync internal state if prop changes (navigation from header)
  useEffect(() => {
    setActiveReport(activeTab);
  }, [activeTab]);

  const REPORT_MENU = [
    { id: 'contract', name: 'Báo cáo hợp đồng', icon: 'Contract' },
    { id: 'revenue', name: 'Báo cáo doanh thu', icon: 'Dollar' },
    { id: 'expense', name: 'Báo cáo chi phí', icon: 'Chart' },
    { id: 'profit', name: 'Báo cáo lợi nhuận', icon: 'TrendingUp' },
    { id: 'customer', name: 'Báo cáo khách hàng', icon: 'Customer' },
    { id: 'software', name: 'Hiệu quả phần mềm', icon: 'Document' },
    { id: 'payment', name: 'Tình hình thanh toán', icon: 'Briefcase' },
    { id: 'invoice', name: 'Quản lý hóa đơn', icon: 'Tag' },
  ];

  const currentReportName = REPORT_MENU.find(r => r.id === activeReport)?.name;

  const renderCharts = () => {
    switch (activeReport) {
      case 'contract':
        return (
          <div className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <h4 className="text-slate-500 text-xs font-bold uppercase mb-1">Tổng hợp đồng</h4>
                    <p className="text-2xl font-bold text-blue-700">128</p>
                </div>
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                    <h4 className="text-slate-500 text-xs font-bold uppercase mb-1">Đã hoàn thành</h4>
                    <p className="text-2xl font-bold text-emerald-700">80</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                    <h4 className="text-slate-500 text-xs font-bold uppercase mb-1">Đang triển khai</h4>
                    <p className="text-2xl font-bold text-yellow-700">41</p>
                </div>
                <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
                    <h4 className="text-slate-500 text-xs font-bold uppercase mb-1">Quá hạn</h4>
                    <p className="text-2xl font-bold text-rose-700">7</p>
                </div>
             </div>
             <div className="bg-white p-6 rounded-xl border border-slate-200 h-80 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4">Biểu đồ tình trạng hợp đồng</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={CHART_DATA}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="contracts" name="Tổng HĐ" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="appendices" name="Phụ lục" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
             </div>
          </div>
        );
      
      case 'revenue':
         return (
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 h-96 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-800">Doanh thu thực tế vs Dự kiến</h3>
                        <div className="flex gap-2 text-sm">
                            <span className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500 rounded-full"></div> Thực tế</span>
                            <span className="flex items-center gap-1"><div className="w-3 h-3 bg-indigo-300 rounded-full"></div> Dự kiến</span>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={REPORT_PROFIT_DATA}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Area type="monotone" dataKey="revenue" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Thực tế" />
                            <Area type="monotone" dataKey="profit" stackId="1" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.4} name="Dự kiến" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
         );

      case 'software':
          return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 h-80 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-2">Tỷ trọng doanh thu theo PM</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={REPORT_SOFTWARE_DATA}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {REPORT_SOFTWARE_DATA.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend layout="vertical" verticalAlign="middle" align="right" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                 <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
                    <h3 className="font-bold text-slate-800 mb-4">Nhận định hiệu quả</h3>
                    <ul className="space-y-4">
                        <li className="flex items-start gap-3">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg shrink-0"><Icons.Check size={16}/></div>
                            <div>
                                <span className="font-bold text-slate-700 block">VTOS (40%)</span>
                                <span className="text-sm text-slate-500">Sản phẩm chủ lực, tăng trưởng 12% so với quý trước.</span>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="p-2 bg-green-100 text-green-600 rounded-lg shrink-0"><Icons.TrendingUp size={16}/></div>
                            <div>
                                <span className="font-bold text-slate-700 block">VSL (25%)</span>
                                <span className="text-sm text-slate-500">Đang mở rộng thị phần, tiềm năng cao.</span>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg shrink-0"><Icons.Warning size={16}/></div>
                            <div>
                                <span className="font-bold text-slate-700 block">ERP (10%)</span>
                                <span className="text-sm text-slate-500">Cần đẩy mạnh marketing hoặc tối ưu chi phí triển khai.</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
          );

      case 'profit':
         return (
             <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 h-96 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-4">Biểu đồ Lợi nhuận (Doanh thu - Chi phí)</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={REPORT_PROFIT_DATA}>
                             <CartesianGrid strokeDasharray="3 3" />
                             <XAxis dataKey="month" />
                             <YAxis />
                             <Tooltip />
                             <Legend />
                             <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} name="Doanh thu" />
                             <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} name="Chi phí" />
                             <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} name="Lợi nhuận" dot={{r: 6}} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
             </div>
         );

      default:
        return (
            <div className="flex flex-col items-center justify-center h-80 text-slate-400">
                 <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <Icons.Chart size={32} className="text-slate-300" />
                 </div>
                 <p>Chọn loại báo cáo khác để xem chi tiết</p>
                 <p className="text-xs mt-2 text-slate-300">(Demo Placeholder for {activeReport})</p>
            </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      
      {/* Header Breadcrumb */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800">Thống kê - Báo cáo</h2>
        <div className="text-sm text-slate-500 flex items-center gap-2">
            <span>Thống kê - Báo cáo</span> 
            <Icons.ChevronDown size={14} className="-rotate-90 text-slate-300"/> 
            <span className="text-blue-600 font-medium">
                {currentReportName}
            </span>
        </div>
      </div>

      {/* RIGHT MAIN CONTENT (Full Width) */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col overflow-hidden h-[calc(100vh-11rem)]">
          {/* Toolbar */}
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
              <div>
                  <h2 className="font-bold text-lg text-slate-800">{currentReportName}</h2>
              </div>
              <div className="flex items-center gap-3">
                  <select className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500 bg-white">
                      <option>Năm 2025</option>
                      <option>Năm 2024</option>
                  </select>
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-sm font-medium transition-colors">
                      <Icons.Filter size={16} /> Bộ lọc
                  </button>
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                      <Icons.Download size={16} /> Xuất báo cáo
                  </button>
              </div>
          </div>
          
          {/* Chart Area */}
          <div className="p-6 overflow-y-auto flex-1 bg-slate-50/30">
              {renderCharts()}
          </div>
      </div>
    </div>
  );
};
