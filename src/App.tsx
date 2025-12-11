import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { KPICards } from './features/dashboard/KPICards';
import { ChartsSection } from './features/dashboard/ChartsSection';
import { TablesSection } from './features/dashboard/TablesSection';
import { ContractManagement } from './features/contracts/ContractManagement';
import { SharedCategories } from './features/sharedCategories/SharedCategories';
import { ReportsScreen } from './features/reports/ReportsScreen';
import { AdminScreen } from './features/admin/AdminScreen';
import { LoginScreen } from './features/auth/LoginScreen';
import { Icons } from './components/ui/Icons';
import { CategoryType, ReportType, AdminTabType } from './types';
import { WarningScreen } from './features/warnings/WarningScreen';
import { authService } from './services';
import { ToastProvider } from './contexts/ToastContext';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');

  // State for sub-navigation in specific modules
  const [currentCategoryTab, setCurrentCategoryTab] = useState<CategoryType>('customer');
  const [currentReportTab, setCurrentReportTab] = useState<ReportType>('contract');
  const [currentAdminTab, setCurrentAdminTab] = useState<AdminTabType>('config');

  // --- Dashboard Filter States ---
  const [filterType, setFilterType] = useState<'day' | 'month' | 'quarter' | 'year'>('day');
  const [dateRange, setDateRange] = useState('01/01/2025 - 31/12/2025');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = () => {
      const isAuth = authService.isAuthenticated();
      setIsLoggedIn(isAuth);
      setIsCheckingAuth(false);
    };

    checkAuth();
  }, []);

  // Initialize Dashboard Date Range on Load (or when logged in)
  useEffect(() => {
    if (isLoggedIn) {
      const currentYear = new Date().getFullYear();
      setFilterType('day');
      setDateRange(`01/01/${currentYear} - 31/12/${currentYear}`);
    }
  }, [isLoggedIn]);

  const handleLoadData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  const handleNavigate = (viewId: string) => {
    setCurrentView(viewId);
  };

  const handleSelectCategory = (categoryId: CategoryType) => {
    setCurrentCategoryTab(categoryId);
  };

  const handleSelectReportTab = (reportId: ReportType) => {
    setCurrentReportTab(reportId);
  };

  const handleSelectAdminTab = (tabId: AdminTabType) => {
    setCurrentAdminTab(tabId);
  };

  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
    setCurrentView('dashboard');
  };

  // Show loading while checking auth
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <ToastProvider>
      {!isLoggedIn ? (
        <LoginScreen onLoginSuccess={() => setIsLoggedIn(true)} />
      ) : (
        <div className="min-h-screen bg-slate-50">
          {/* Rest of the app content stays the same */}
          <Header
            currentView={currentView}
            onNavigate={handleNavigate}
            onSelectSharedCategory={handleSelectCategory}
            onSelectReportTab={handleSelectReportTab}
            onSelectAdminTab={handleSelectAdminTab}
            onLogout={handleLogout}
          />

          <main className="pt-16 px-6 bg-slate-50">
            {/* All existing view code remains unchanged */}
            {currentView === 'dashboard' && (
              <div className="animate-in fade-in duration-500 space-y-6">
                {/* Dashboard content */}
                <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                      <Icons.TrendingUp size={20} />
                    </span>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
                      <p className="text-sm text-slate-500">Tổng quan hệ thống quản lý hợp đồng</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex gap-1 bg-white rounded-lg p-1 shadow-sm border border-slate-200">
                      <button onClick={() => setFilterType('day')} className={`px-3 py-1.5 rounded-md text-sm font-bold transition-all ${filterType === 'day' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>Ngày</button>
                      <button onClick={() => setFilterType('month')} className={`px-3 py-1.5 rounded-md text-sm font-bold transition-all ${filterType === 'month' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>Tháng</button>
                      <button onClick={() => setFilterType('quarter')} className={`px-3 py-1.5 rounded-md text-sm font-bold transition-all ${filterType === 'quarter' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>Quý</button>
                      <button onClick={() => setFilterType('year')} className={`px-3 py-1.5 rounded-md text-sm font-bold transition-all ${filterType === 'year' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>Năm</button>
                    </div>
                    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm cursor-pointer hover:border-blue-400 transition-colors group min-w-[220px] justify-between">
                      <div className="flex items-center gap-2">
                        <Icons.Calendar size={16} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                        <span className="text-sm font-semibold text-slate-700">{dateRange}</span>
                      </div>
                      <Icons.ChevronDown size={14} className="text-slate-400 ml-1 group-hover:text-slate-600" />
                    </div>
                    <button onClick={handleLoadData} className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-2 text-sm font-bold">
                      {isRefreshing ? <Icons.Chart size={16} className="animate-spin" /> : <Icons.Filter size={16} />}
                      Lọc dữ liệu
                    </button>
                  </div>
                </div>
                <KPICards />
                <ChartsSection />
                <TablesSection />
              </div>
            )}

            {currentView === 'contracts' && (<div className="animate-in fade-in duration-500 h-[calc(100vh-8rem)]"><ContractManagement /></div>)}
            {currentView === 'shared-categories' && (<div className="animate-in fade-in duration-500 h-[calc(100vh-8rem)]"><SharedCategories activeCategory={currentCategoryTab} onTabChange={setCurrentCategoryTab} /></div>)}
            {currentView === 'reports' && (<div className="animate-in fade-in duration-500 h-[calc(100vh-8rem)]"><ReportsScreen activeReport={currentReportTab} /></div>)}
            {currentView === 'admin' && (<div className="animate-in fade-in duration-500 h-[calc(100vh-8rem)]"><AdminScreen activeTab={currentAdminTab} /></div>)}
            {currentView === 'warnings' && (<div className="animate-in fade-in duration-500 h-[calc(100vh-8rem)]"><WarningScreen /></div>)}

            {currentView !== 'dashboard' && currentView !== 'contracts' && currentView !== 'shared-categories' && currentView !== 'reports' && currentView !== 'admin' && currentView !== 'warnings' && (
              <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400 animate-in zoom-in duration-300">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <Icons.Settings size={32} className="text-slate-300" />
                </div>
                <h3 className="text-lg font-semibold text-slate-600">Tính năng đang phát triển</h3>
                <p className="text-sm max-w-md text-center mt-2 mb-6">Mục "{currentView}" hiện đang được xây dựng. Vui lòng quay lại sau.</p>
                <button onClick={() => setCurrentView('dashboard')} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  Quay về Dashboard
                </button>
              </div>
            )}
          </main>

          {/* Fixed Footer */}
          <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-400 z-40">
            <p>&copy; 2025 CEH - Nền Tảng Cảng Biển Số Việt Nam. All rights reserved.</p>
          </footer>
        </div>
      )}
    </ToastProvider>
  );
}

export default App;
