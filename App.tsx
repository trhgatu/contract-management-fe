
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { KPICards } from './components/KPICards';
import { ChartsSection } from './components/ChartsSection';
import { TablesSection } from './components/TablesSection';
import { ContractManagement } from './components/ContractManagement';
import { SharedCategories } from './components/SharedCategories';
import { ReportsScreen } from './components/ReportsScreen';
import { AdminScreen } from './components/AdminScreen';
import { LoginScreen } from './components/LoginScreen';
import { Icons } from './components/Icons';
import { CategoryType, ReportType, AdminTabType } from './types';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  
  // State for sub-navigation in specific modules
  const [currentCategoryTab, setCurrentCategoryTab] = useState<CategoryType>('customer');
  const [currentReportTab, setCurrentReportTab] = useState<ReportType>('contract');
  const [currentAdminTab, setCurrentAdminTab] = useState<AdminTabType>('config');

  // --- Dashboard Filter States ---
  const [filterType, setFilterType] = useState<'day' | 'month' | 'quarter' | 'year'>('day');
  const [dateRange, setDateRange] = useState('01/01/2025 - 31/12/2025');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Initialize Dashboard Date Range on Load (or when logged in)
  useEffect(() => {
    if (isLoggedIn) {
      const currentYear = new Date().getFullYear();
      setFilterType('day');
      setDateRange(`01/01/${currentYear} - 31/12/${currentYear}`);
    }
  }, [isLoggedIn]);

  const handleFilterTypeChange = (type: 'day' | 'month' | 'quarter' | 'year') => {
    setFilterType(type);
    const currentYear = new Date().getFullYear();
    
    // Update display format based on type selection
    switch (type) {
      case 'day':
        setDateRange(`01/01/${currentYear} - 31/12/${currentYear}`);
        break;
      case 'month':
        setDateRange(`01/${currentYear} - 12/${currentYear}`);
        break;
      case 'quarter':
        setDateRange(`Quý 1/${currentYear} - Quý 4/${currentYear}`);
        break;
      case 'year':
        setDateRange(`${currentYear} - ${currentYear}`);
        break;
    }
  };

  const handleLoadData = () => {
    setIsRefreshing(true);
    // Simulate API call / Data Refresh
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView('dashboard'); // Reset view on logout
  };

  return (
    <>
    {!isLoggedIn ? (
      <LoginScreen onLogin={handleLogin} />
    ) : (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
        
        {/* Fixed Header with Navigation and Logout */}
        <Header 
          currentView={currentView} 
          onNavigate={setCurrentView} 
          onSelectSharedCategory={setCurrentCategoryTab}
          onSelectReportTab={setCurrentReportTab}
          onSelectAdminTab={setCurrentAdminTab}
          onLogout={handleLogout}
        />
        
        {/* Main Content Wrapper - Removed left padding (pl-64) since Sidebar is gone */}
        <main className="flex-1 pt-20 px-4 md:px-8 pb-8 overflow-y-auto w-full max-w-[100vw]">
            
            {currentView === 'dashboard' && (
              <div className="animate-in fade-in duration-500 max-w-7xl mx-auto">
                
                {/* 1. Header Control Bar */}
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        {/* Period Selector */}
                        <div className="bg-white border border-slate-200 rounded-lg p-1 flex shadow-sm">
                            <button 
                                onClick={() => handleFilterTypeChange('day')}
                                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${filterType === 'day' ? 'bg-blue-50 text-blue-600 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                            >
                                Ngày
                            </button>
                            <button 
                                onClick={() => handleFilterTypeChange('month')}
                                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${filterType === 'month' ? 'bg-blue-50 text-blue-600 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                            >
                                Tháng
                            </button>
                            <button 
                                onClick={() => handleFilterTypeChange('quarter')}
                                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${filterType === 'quarter' ? 'bg-blue-50 text-blue-600 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                            >
                                Quý
                            </button>
                            <button 
                                onClick={() => handleFilterTypeChange('year')}
                                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${filterType === 'year' ? 'bg-blue-50 text-blue-600 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                            >
                                Năm
                            </button>
                        </div>

                        {/* Date Range Picker Placeholder */}
                        <div 
                          className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm cursor-pointer hover:border-blue-400 transition-colors group min-w-[220px] justify-between"
                          title="Click để chọn khoảng thời gian"
                        >
                            <div className="flex items-center gap-2">
                              <Icons.Calendar size={16} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                              <span className="text-sm font-semibold text-slate-700">{dateRange}</span>
                            </div>
                            <Icons.ChevronDown size={14} className="text-slate-400 ml-1 group-hover:text-slate-600" />
                        </div>

                         <button 
                            onClick={handleLoadData}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-2 text-sm font-bold"
                         >
                            {isRefreshing ? <Icons.Chart size={16} className="animate-spin"/> : <Icons.Filter size={16} />}
                            Nạp dữ liệu
                        </button>
                    </div>
                </div>

                {/* Dashboard Content Container with Refresh Overlay */}
                <div className="relative">
                    {isRefreshing && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-xl animate-in fade-in duration-200">
                             <div className="flex flex-col items-center bg-white p-4 rounded-xl shadow-lg border border-slate-100">
                                <span className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></span>
                                <span className="text-sm font-bold text-slate-600">Đang tải dữ liệu...</span>
                             </div>
                        </div>
                    )}

                    <div className={isRefreshing ? 'opacity-50 transition-opacity duration-300' : 'opacity-100 transition-opacity duration-300'}>
                        {/* 2. Row 1: Top KPIs */}
                        <KPICards />
                        
                        {/* 3. Row 2: Tables (Customers, Warnings, Software) */}
                        <TablesSection />

                        {/* 4. Row 3: Charts */}
                        <ChartsSection />
                    </div>
                </div>

              </div>
            )}

            {currentView === 'contracts' && (
              <div className="animate-in fade-in duration-500 h-[calc(100vh-8rem)]">
                 <ContractManagement />
              </div>
            )}

            {currentView === 'shared-categories' && (
              <div className="animate-in fade-in duration-500 h-[calc(100vh-8rem)]">
                 <SharedCategories activeCategory={currentCategoryTab} />
              </div>
            )}

             {currentView === 'reports' && (
              <div className="animate-in fade-in duration-500">
                 <ReportsScreen activeTab={currentReportTab} />
              </div>
            )}

             {currentView === 'admin' && (
              <div className="animate-in fade-in duration-500 h-[calc(100vh-8rem)]">
                 <AdminScreen activeTab={currentAdminTab} />
              </div>
            )}

            {currentView !== 'dashboard' && currentView !== 'contracts' && currentView !== 'shared-categories' && currentView !== 'reports' && currentView !== 'admin' && (
                <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400 animate-in zoom-in duration-300">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <Icons.Settings size={32} className="text-slate-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-600">Tính năng đang phát triển</h3>
                  <p className="text-sm max-w-md text-center mt-2 mb-6">Mục "{currentView}" hiện đang được xây dựng. Vui lòng quay lại sau.</p>
                  <button 
                    onClick={() => setCurrentView('dashboard')} 
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Quay về Dashboard
                  </button>
                </div>
            )}
            
            <footer className="mt-12 border-t border-slate-200 py-6 text-center text-xs text-slate-400">
              <p>&copy; 2025 CEH - Nền Tảng Cảng Biển Số Việt Nam. All rights reserved.</p>
            </footer>
        </main>
      </div>
    )}
    </>
  );
}

export default App;
