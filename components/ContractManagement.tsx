
import React, { useState } from 'react';
import { Icons } from './Icons';
import { MOCK_CONTRACTS, MOCK_MD_CUSTOMERS, SOFTWARE_TYPES, MOCK_USERS, MOCK_MD_SUPPLIERS, MOCK_MD_STATUS, MOCK_MD_CONTRACT_TYPES } from '../constants';
import { Contract, ContractAttachment, PaymentTerm, Expense, ProjectMember } from '../types';
import { CustomDatePicker } from './CustomDatePicker';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

// Helper to get status text based on inherited contract status (Updated to use MOCK_MD_STATUS)
const getContractStatusText = (statusCode: string | undefined) => {
    // 1. Try to find in Master Data
    const status = MOCK_MD_STATUS.find(s => s.code === statusCode || s.id === statusCode);
    if (status) {
        return { text: status.name, color: status.color || 'bg-slate-100 text-slate-600' };
    }

    // 2. Fallback for legacy data/hardcoded string if needed
    switch (statusCode) {
        case 'ST01': return { text: 'Chưa thực hiện', color: 'text-slate-500 bg-slate-100' };
        case 'ST02': return { text: 'Đang triển khai', color: 'text-blue-600 bg-blue-100' };
        case 'ST03': return { text: 'Hoàn thành', color: 'text-emerald-600 bg-emerald-100' };
        case 'pending': return { text: 'Mới tạo', color: 'text-slate-500 bg-slate-100' };
        case 'active': return { text: 'Đang thực hiện', color: 'text-blue-600 bg-blue-100' };
        case 'completed': return { text: 'Đã hoàn thành', color: 'text-emerald-600 bg-emerald-100' };
        default: return { text: statusCode || 'Mới tạo', color: 'text-slate-500 bg-slate-100' };
    }
};

export const ContractManagement: React.FC = () => {
  // Use state for contracts to allow updates (mocking DB)
  const [contracts, setContracts] = useState<Contract[]>(MOCK_CONTRACTS);
  const [selectedContractId, setSelectedContractId] = useState<string | null>(contracts[0]?.id || null);
  const [activeDetailTab, setActiveDetailTab] = useState<'payment' | 'expense' | 'member'>('payment');
  
  // Main Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [modalTab, setModalTab] = useState<'general' | 'payment' | 'expense' | 'member'>('general');
  const [formData, setFormData] = useState<Partial<Contract>>({});

  // View Files Modal State (For General Contract Files OR Expense Files)
  const [viewFilesModal, setViewFilesModal] = useState<{ 
      title: string; 
      files: ContractAttachment[]; 
      isOpen: boolean; 
  }>({ title: '', files: [], isOpen: false });

  // Filter states
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [searchCustomer, setSearchCustomer] = useState('');
  const [quickSearch, setQuickSearch] = useState('');

  const selectedContract = contracts.find(c => c.id === selectedContractId);

  // --- Main Modal Handlers ---

  const handleOpenAddModal = () => {
      setIsEditMode(false);
      setFormData({ 
          status: 'ST01', // Default to 'Chưa thực hiện' (ST01) instead of 'pending'
          attachments: [], 
          vat: 10,
          valuePostVat: 0,
          paymentTerms: [],
          expenses: [],
          members: []
      });
      setModalTab('general');
      setIsModalOpen(true);
  };

  const handleOpenEditModal = (contract: Contract) => {
      setIsEditMode(true);
      // Clone deeply to avoid reference issues
      setFormData(JSON.parse(JSON.stringify(contract)));
      setModalTab('general');
      setIsModalOpen(true);
  };

  const handleFormChange = (field: keyof Contract, value: any) => {
      setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
          const newFiles: ContractAttachment[] = Array.from(e.target.files).map((f: File, index) => ({
              id: `new_${Date.now()}_${index}`,
              name: f.name,
              size: (f.size / 1024 / 1024).toFixed(2) + ' MB',
              type: f.name.split('.').pop() || 'file',
              uploadDate: new Date().toISOString().split('T')[0]
          }));
          
          setFormData(prev => ({
              ...prev,
              attachments: [...(prev.attachments || []), ...newFiles]
          }));
      }
  };

  const removeFile = (fileId: string) => {
      setFormData(prev => ({
          ...prev,
          attachments: prev.attachments?.filter(f => f.id !== fileId)
      }));
  };

  const handleSave = () => {
      // VALIDATION: Acceptance Date is required if Status is 'ST03' (Hoàn thành) - assuming ST03 is completed code
      if (formData.status === 'ST03' && !formData.acceptanceDate) {
          alert("Vui lòng nhập 'Ngày nghiệm thu' khi trạng thái là 'Hoàn thành'.");
          return;
      }

      if (isEditMode && formData.id) {
          // Update existing
          setContracts(prev => prev.map(c => c.id === formData.id ? { ...c, ...formData } as Contract : c));
      } else {
          // Add new (generate dummy ID)
          const newContract = { ...formData, id: Date.now().toString() } as Contract;
          setContracts(prev => [newContract, ...prev]);
          setSelectedContractId(newContract.id);
      }
      setIsModalOpen(false);
  };

  // --- Inline Editing Handlers ---

  // 1. Payment Terms
  const handleAddPaymentTerm = () => {
      const newTerm: PaymentTerm = {
          id: `term_${Date.now()}`,
          batch: `Đợt ${ (formData.paymentTerms?.length || 0) + 1}`,
          content: '',
          ratio: 0,
          value: 0,
          isCollected: false,
          collectionDate: '',
          invoiceStatus: 'not_exported'
      };
      setFormData(prev => ({
          ...prev,
          paymentTerms: [...(prev.paymentTerms || []), newTerm]
      }));
  };

  const handleUpdatePaymentTerm = (id: string, field: keyof PaymentTerm, value: any) => {
      setFormData(prev => ({
          ...prev,
          paymentTerms: prev.paymentTerms?.map(t => {
              if (t.id !== id) return t;
              
              // Logic for Ratio change -> Auto Value
              if (field === 'ratio') {
                   const totalValue = prev.valuePostVat || 0;
                   const calculatedValue = (totalValue * Number(value)) / 100;
                   return { ...t, [field]: value, value: calculatedValue };
              }
              
              return { ...t, [field]: value };
          })
      }));
  };

  const handleDeletePayment = (id: string) => {
      setFormData(prev => ({
          ...prev,
          paymentTerms: prev.paymentTerms?.filter(t => t.id !== id)
      }));
  };

  // 2. Expenses (UPDATED with new logic)
  const handleAddExpense = () => {
      const newExp: Expense = {
          id: `exp_${Date.now()}`,
          category: '',
          description: '', // New Field
          supplierId: '',
          totalAmount: 0,
          contractStatus: '',
          paymentStatus: 'unpaid',
          pic: '',
          note: '',
          attachments: []
      };
      setFormData(prev => ({
          ...prev,
          expenses: [...(prev.expenses || []), newExp]
      }));
  };

  const handleUpdateExpense = (id: string, field: keyof Expense, value: any) => {
      setFormData(prev => ({
          ...prev,
          expenses: prev.expenses?.map(e => e.id === id ? { ...e, [field]: value } : e)
      }));
  };

  const handleExpenseFileUpload = (e: React.ChangeEvent<HTMLInputElement>, expenseId: string) => {
      if (e.target.files && e.target.files.length > 0) {
           const newFiles: ContractAttachment[] = Array.from(e.target.files).map((f: File, index) => ({
              id: `exp_file_${Date.now()}_${index}`,
              name: f.name,
              size: (f.size / 1024 / 1024).toFixed(2) + ' MB',
              type: f.name.split('.').pop() || 'file',
              uploadDate: new Date().toISOString().split('T')[0]
          }));

           setFormData(prev => ({
              ...prev,
              expenses: prev.expenses?.map(exp => {
                  if (exp.id === expenseId) {
                      return { ...exp, attachments: [...(exp.attachments || []), ...newFiles] };
                  }
                  return exp;
              })
          }));
      }
  };

  const removeExpenseFile = (expenseId: string, fileId: string) => {
      setFormData(prev => ({
          ...prev,
          expenses: prev.expenses?.map(exp => {
               if (exp.id === expenseId) {
                   return { ...exp, attachments: exp.attachments?.filter(f => f.id !== fileId) };
               }
               return exp;
          })
      }));
  };

  const handleDeleteExpense = (id: string) => {
      setFormData(prev => ({
          ...prev,
          expenses: prev.expenses?.filter(e => e.id !== id)
      }));
  };

  const openViewFilesModal = (title: string, files: ContractAttachment[] = []) => {
      setViewFilesModal({ title, files, isOpen: true });
  }

  // 3. Members
  const handleAddMember = () => {
      const newMem: ProjectMember = {
          id: `mem_${Date.now()}`,
          memberCode: '',
          name: '',
          role: 'Dev'
      };
      setFormData(prev => ({
          ...prev,
          members: [...(prev.members || []), newMem]
      }));
  };

  const handleUpdateMember = (id: string, field: keyof ProjectMember, value: any) => {
       setFormData(prev => ({
          ...prev,
          members: prev.members?.map(m => m.id === id ? { ...m, [field]: value } : m)
      }));
  };

  const handleDeleteMember = (id: string) => {
      setFormData(prev => ({
          ...prev,
          members: prev.members?.filter(m => m.id !== id)
      }));
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300 gap-4">
      
      {/* 1. PAGE HEADER */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800">Quản lý hợp đồng</h2>
      </div>

      {/* 2. FILTERS & ACTIONS CONTAINER */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex flex-col xl:flex-row gap-4 justify-between items-end xl:items-center">
            
            {/* Left: Filters */}
            <div className="flex flex-wrap items-end gap-3 w-full xl:w-auto">
                <div className="w-[150px]">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Từ ngày ký</label>
                    <CustomDatePicker 
                        value={fromDate} 
                        onChange={setFromDate}
                        placeholder="Từ ngày..."
                    />
                </div>
                <div className="w-[150px]">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Đến ngày ký</label>
                    <CustomDatePicker 
                        value={toDate} 
                        onChange={setToDate}
                        placeholder="Đến ngày..."
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Khách hàng</label>
                    <select 
                        value={searchCustomer} 
                        onChange={e => setSearchCustomer(e.target.value)}
                        className="pl-3 pr-8 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-500 outline-none shadow-sm bg-white min-w-[200px]"
                    >
                        <option value="">-- Tất cả khách hàng --</option>
                        {MOCK_MD_CUSTOMERS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <button className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 shadow-sm flex items-center gap-2">
                    <Icons.Search size={16} /> Tra cứu
                </button>
            </div>

            {/* Right: Quick Search & Actions */}
            <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto justify-end">
                <div className="relative">
                     <input 
                        type="text" 
                        placeholder="Tìm kiếm nhanh..." 
                        value={quickSearch}
                        onChange={e => setQuickSearch(e.target.value)}
                        className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-500 outline-none shadow-sm w-full xl:w-64"
                     />
                     <Icons.Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                </div>
                <div className="h-8 w-px bg-slate-200 mx-1 hidden xl:block"></div>
                <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-medium shadow-sm transition-all" title="Export Excel">
                    <Icons.Download size={18} /> <span className="hidden sm:inline">Xuất Excel</span>
                </button>
                <button 
                    onClick={handleOpenAddModal}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-lg hover:shadow-blue-500/30 transition-all"
                >
                    <Icons.Plus size={18} /> Thêm mới
                </button>
            </div>
        </div>
      </div>

      {/* 3. MASTER LIST (TABLE) */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-[400px]">
          <div className="overflow-auto flex-1">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-slate-100 text-slate-700 font-bold text-xs uppercase sticky top-0 z-10 shadow-sm">
                  <tr>
                      <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200">Số hợp đồng</th>
                      <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200">Ngày ký</th>
                      <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200">Khách hàng</th>
                      <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200">Nội dung hợp đồng</th>
                      <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200">Loại phần mềm</th>
                      <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200 text-right">Giá trị trước VAT</th>
                      <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200 text-right">VAT</th>
                      <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200 text-right">Giá trị sau VAT</th>
                      <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200 text-center">Ngày nghiệm thu</th>
                      <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200 text-center">File đính kèm</th>
                      <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200 text-center">Thời hạn</th>
                      <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200 text-center w-24">Tác vụ</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                  {contracts.map((contract) => (
                      <tr 
                        key={contract.id} 
                        onClick={() => setSelectedContractId(contract.id)}
                        className={`cursor-pointer transition-colors ${selectedContractId === contract.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'hover:bg-slate-50 border-l-4 border-l-transparent'}`}
                      >
                          <td className="px-4 py-3 font-bold text-blue-700 whitespace-nowrap">{contract.code}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-slate-600">{contract.signDate}</td>
                          <td className="px-4 py-3 font-medium text-slate-800 whitespace-nowrap max-w-[200px] truncate" title={contract.customerName}>{contract.customerName}</td>
                          <td className="px-4 py-3 text-slate-500 max-w-[250px] truncate" title={contract.content}>{contract.content}</td>
                          <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                              <div className="flex gap-1">
                                  {contract.softwareTypes.map((t, i) => (
                                      <span key={i} className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] font-medium">{t}</span>
                                  ))}
                              </div>
                          </td>
                          <td className="px-4 py-3 text-right text-slate-600 whitespace-nowrap">{formatCurrency(contract.valuePreVat)}</td>
                          <td className="px-4 py-3 text-right text-slate-500 whitespace-nowrap">{formatCurrency(contract.vat)}</td>
                          <td className="px-4 py-3 text-right font-bold text-slate-800 whitespace-nowrap">{formatCurrency(contract.valuePostVat)}</td>
                          <td className="px-4 py-3 text-center text-slate-600 whitespace-nowrap">{contract.acceptanceDate || '-'}</td>
                          <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                              <button 
                                onClick={() => openViewFilesModal(contract.code, contract.attachments)}
                                className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 text-slate-600 rounded-lg text-xs font-bold transition-all shadow-sm"
                              >
                                <Icons.Attach size={14}/> 
                                Xem {contract.attachments && contract.attachments.length > 0 ? `(${contract.attachments.length})` : ''}
                              </button>
                          </td>
                          <td className="px-4 py-3 text-center text-slate-600 whitespace-nowrap">{contract.duration}</td>
                          <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-center gap-2">
                                  <button onClick={() => handleOpenEditModal(contract)} className="text-slate-400 hover:text-blue-600 transition-colors" title="Chỉnh sửa"><Icons.Edit size={16}/></button>
                                  <button className="text-slate-400 hover:text-rose-600 transition-colors" title="Xóa"><Icons.Trash size={16}/></button>
                                  <button className="text-slate-400 hover:text-green-600 transition-colors" title="Lưu"><Icons.Save size={16}/></button>
                              </div>
                          </td>
                      </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="p-2 px-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center text-xs text-slate-500">
              <span>Hiển thị {contracts.length} hợp đồng</span>
              <div className="flex gap-1">
                  <button className="px-2 py-1 border rounded bg-white hover:bg-slate-50 disabled:opacity-50">Trước</button>
                  <button className="px-2 py-1 border rounded bg-blue-600 text-white">1</button>
                  <button className="px-2 py-1 border rounded bg-white hover:bg-slate-50">2</button>
                  <button className="px-2 py-1 border rounded bg-white hover:bg-slate-50">Sau</button>
              </div>
          </div>
      </div>

      {/* 4. DETAIL PANEL (TABS) */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col min-h-[300px] overflow-hidden">
        {selectedContract ? (
            <>
                <div className="flex items-center px-4 border-b border-slate-200 bg-slate-50/50">
                    <button 
                        onClick={() => setActiveDetailTab('payment')}
                        className={`py-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${activeDetailTab === 'payment' ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        <Icons.Dollar size={16}/> Điều khoản thanh toán
                    </button>
                    <button 
                        onClick={() => setActiveDetailTab('expense')}
                        className={`py-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${activeDetailTab === 'expense' ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        <Icons.Chart size={16}/> Chi phí
                    </button>
                    <button 
                        onClick={() => setActiveDetailTab('member')}
                        className={`py-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${activeDetailTab === 'member' ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        <Icons.Users size={16}/> Thành viên dự án
                    </button>
                </div>
                
                <div className="flex-1 p-4 overflow-y-auto bg-white">
                    {activeDetailTab === 'payment' && (
                        <table className="w-full text-sm text-left border border-slate-100 rounded-lg overflow-hidden">
                            <thead className="bg-slate-50 text-slate-700 font-bold text-xs uppercase">
                                <tr>
                                    <th className="px-4 py-2 border-b">Đợt thanh toán</th>
                                    <th className="px-4 py-2 border-b">Nội dung</th>
                                    <th className="px-4 py-2 border-b text-center">Tỷ lệ (%)</th>
                                    <th className="px-4 py-2 border-b text-right">Giá trị (VNĐ)</th>
                                    <th className="px-4 py-2 border-b text-center">Ngày thu tiền</th>
                                    <th className="px-4 py-2 border-b text-center">Trạng thái thanh toán</th>
                                    <th className="px-4 py-2 border-b text-center">Trạng thái hóa đơn</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedContract.paymentTerms.length > 0 ? selectedContract.paymentTerms.map(term => (
                                    <tr key={term.id} className="hover:bg-slate-50">
                                        <td className="px-4 py-3 font-medium text-slate-700">{term.batch}</td>
                                        <td className="px-4 py-3 text-slate-600">{term.content}</td>
                                        <td className="px-4 py-3 text-center">{term.ratio}%</td>
                                        <td className="px-4 py-3 text-right font-bold text-slate-700">{formatCurrency(term.value)}</td>
                                        <td className="px-4 py-3 text-center text-slate-600">{term.collectionDate || '-'}</td>
                                        <td className="px-4 py-3 text-center">
                                            {term.isCollected ? (
                                                <span className="text-emerald-600 font-bold text-xs flex items-center justify-center gap-1"><Icons.Check size={14}/> Đã thu tiền</span>
                                            ) : (
                                                <span className="text-slate-400 font-bold text-xs flex items-center justify-center gap-1"><Icons.X size={14}/> Chưa thu tiền</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                             {term.invoiceStatus === 'exported' ? (
                                                <span className="text-indigo-600 font-bold text-xs flex items-center justify-center gap-1"><Icons.Check size={14}/> Đã xuất</span>
                                            ) : (
                                                <span className="text-slate-400 font-bold text-xs flex items-center justify-center gap-1"><Icons.X size={14}/> Chưa xuất</span>
                                            )}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={7} className="text-center py-8 text-slate-400">Chưa có điều khoản thanh toán nào</td></tr>
                                )}
                            </tbody>
                        </table>
                    )}

                    {activeDetailTab === 'expense' && (
                        <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border border-slate-100 rounded-lg">
                            <thead className="bg-slate-50 text-slate-700 font-bold text-xs uppercase whitespace-nowrap">
                                <tr>
                                    <th className="px-4 py-2 border-b text-center">STT</th>
                                    <th className="px-4 py-2 border-b min-w-[180px]">Nhà cung cấp</th>
                                    <th className="px-4 py-2 border-b min-w-[150px]">Hạng mục</th>
                                    <th className="px-4 py-2 border-b min-w-[150px]">Diễn giải</th>
                                    <th className="px-4 py-2 border-b min-w-[120px] text-right">Tổng chi phí (VNĐ)</th>
                                    <th className="px-4 py-2 border-b min-w-[140px] text-center">Trạng thái HĐ</th>
                                    <th className="px-4 py-2 border-b min-w-[140px] text-center">TT Thanh toán</th>
                                    <th className="px-4 py-2 border-b min-w-[140px]">Nhân viên phụ trách</th>
                                    <th className="px-4 py-2 border-b min-w-[150px]">Ghi chú</th>
                                    <th className="px-4 py-2 border-b text-center min-w-[120px]">File đính kèm</th>
                                </tr>
                            </thead>
                            <tbody className="whitespace-nowrap">
                                {selectedContract.expenses.length > 0 ? selectedContract.expenses.map((exp, idx) => (
                                    <tr key={exp.id} className="hover:bg-slate-50">
                                        <td className="px-4 py-3 text-center text-slate-500">{idx + 1}</td>
                                        <td className="px-4 py-3 font-medium text-slate-700">
                                            {MOCK_MD_SUPPLIERS.find(s => s.id === exp.supplierId)?.name || '-'}
                                        </td>
                                        <td className="px-4 py-3 text-slate-600">{exp.category}</td>
                                        <td className="px-4 py-3 text-slate-600">{exp.description}</td>
                                        <td className="px-4 py-3 text-right font-bold text-rose-600">{formatCurrency(exp.totalAmount)}</td>
                                        <td className="px-4 py-3 text-center">
                                            {(() => {
                                                const status = getContractStatusText(selectedContract.status);
                                                return (
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${status.color}`}>
                                                        {status.text}
                                                    </span>
                                                );
                                            })()}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {exp.paymentStatus === 'paid' ? (
                                                <span className="text-emerald-600 font-bold text-xs flex items-center justify-center gap-1"><Icons.Check size={14}/> Đã thanh toán</span>
                                            ) : (
                                                <span className="text-slate-400 font-bold text-xs flex items-center justify-center gap-1"><Icons.X size={14}/> Chưa thanh toán</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-slate-600 flex items-center gap-2">
                                            {exp.pic && <div className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-500">{exp.pic.charAt(0)}</div>}
                                            {exp.pic}
                                        </td>
                                        <td className="px-4 py-3 text-slate-500 italic max-w-[150px] truncate" title={exp.note}>{exp.note}</td>
                                        <td className="px-4 py-3 text-center">
                                            <button 
                                                onClick={() => openViewFilesModal(`Chi phí: ${exp.category}`, exp.attachments)}
                                                className="text-blue-600 hover:text-blue-800 text-xs font-bold underline"
                                            >
                                                Xem ({exp.attachments?.length || 0})
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={10} className="text-center py-8 text-slate-400">Chưa có chi phí phát sinh</td></tr>
                                )}
                            </tbody>
                        </table>
                        </div>
                    )}

                    {activeDetailTab === 'member' && (
                         <table className="w-full text-sm text-left border border-slate-100 rounded-lg overflow-hidden">
                            <thead className="bg-slate-50 text-slate-700 font-bold text-xs uppercase">
                                <tr>
                                    <th className="px-4 py-2 border-b w-16 text-center">#</th>
                                    <th className="px-4 py-2 border-b">Mã thành viên</th>
                                    <th className="px-4 py-2 border-b">Tên thành viên</th>
                                    <th className="px-4 py-2 border-b">Chức vụ / Vai trò</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedContract.members.length > 0 ? selectedContract.members.map((mem, idx) => (
                                    <tr key={mem.id} className="hover:bg-slate-50">
                                        <td className="px-4 py-3 text-center text-slate-400">{idx + 1}</td>
                                        <td className="px-4 py-3 font-mono text-slate-600">{mem.memberCode}</td>
                                        <td className="px-4 py-3 font-bold text-slate-700">{mem.name}</td>
                                        <td className="px-4 py-3">
                                            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium border border-blue-100">{mem.role}</span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={4} className="text-center py-8 text-slate-400">Chưa có thành viên dự án</td></tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </>
        ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <Icons.Contract size={48} className="text-slate-200 mb-2" />
                <p>Chọn một hợp đồng để xem chi tiết</p>
            </div>
        )}
      </div>

      {/* 5. MODAL ADD NEW / EDIT */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-7xl h-[95vh] flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
                
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">
                            {isEditMode ? `Chỉnh sửa hợp đồng: ${formData.code}` : 'Thêm mới hợp đồng'}
                        </h3>
                        <p className="text-sm text-slate-500">
                            {isEditMode ? 'Cập nhật thông tin và file đính kèm' : 'Nhập đầy đủ thông tin hợp đồng dự án'}
                        </p>
                    </div>
                    <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"><Icons.X size={20}/></button>
                </div>
                
                {/* Tabs */}
                <div className="flex border-b border-slate-100 px-6 bg-slate-50/50">
                    {[
                        { id: 'general', label: '1. Thông tin chung' },
                        { id: 'payment', label: '2. Điều khoản thanh toán' },
                        { id: 'expense', label: '3. Chi phí' },
                        { id: 'member', label: '4. Thành viên dự án' }
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setModalTab(tab.id as any)}
                            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${modalTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1 bg-white relative">
                    {modalTab === 'general' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Column 1 */}
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-slate-700">Số hợp đồng <span className="text-red-500">*</span></label>
                                        <input 
                                            type="text" 
                                            value={formData.code || ''} 
                                            onChange={(e) => handleFormChange('code', e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none" 
                                            placeholder="VD: HD-2025/..." 
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-slate-700">Ngày ký</label>
                                        <CustomDatePicker 
                                            value={formData.signDate || ''}
                                            onChange={(val) => handleFormChange('signDate', val)}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-slate-700">Thời hạn</label>
                                        <input 
                                            type="text" 
                                            value={formData.duration || ''}
                                            onChange={(e) => handleFormChange('duration', e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none" 
                                            placeholder="VD: 12 Tháng" 
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-slate-700">Loại hợp đồng</label>
                                        <select 
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none bg-white"
                                            value={formData.contractType || ''}
                                            onChange={(e) => handleFormChange('contractType', e.target.value)}
                                        >
                                            <option value="">-- Chọn loại hợp đồng --</option>
                                            {MOCK_MD_CONTRACT_TYPES.map(type => (
                                                <option key={type.id} value={type.name}>{type.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-slate-700">Trạng thái</label>
                                        <select 
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none bg-white"
                                            value={formData.status || ''}
                                            onChange={(e) => handleFormChange('status', e.target.value)}
                                        >
                                            <option value="">-- Chọn trạng thái --</option>
                                            {MOCK_MD_STATUS.map(st => (
                                                <option key={st.id} value={st.code}>{st.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Column 2 */}
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-slate-700">Khách hàng</label>
                                        <select 
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none bg-white"
                                            value={formData.customerName || ''}
                                            onChange={(e) => handleFormChange('customerName', e.target.value)}
                                        >
                                            <option value="">-- Chọn khách hàng --</option>
                                            {MOCK_MD_CUSTOMERS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-slate-700">Người liên hệ</label>
                                        <input type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-slate-700">Đơn vị thực hiện</label>
                                        <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none bg-white">
                                            <option>CEH Software</option>
                                            <option>CEH Infra</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-slate-700">Người thực hiện (AM/PM)</label>
                                        <input type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none" />
                                    </div>
                                    {/* New Field: Acceptance Date */}
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-slate-700">
                                            Ngày nghiệm thu {formData.status === 'ST03' && <span className="text-red-500">*</span>}
                                        </label>
                                        <CustomDatePicker 
                                            value={formData.acceptanceDate || ''}
                                            onChange={(val) => handleFormChange('acceptanceDate', val)}
                                            className={formData.status === 'ST03' && !formData.acceptanceDate ? 'border-red-300 bg-red-50' : ''}
                                        />
                                    </div>
                                </div>

                                {/* Column 3 */}
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-slate-700">Loại phần mềm</label>
                                        <div className="h-[180px] overflow-y-auto border border-slate-200 rounded-lg p-2 space-y-1">
                                            {SOFTWARE_TYPES.map((type, i) => (
                                                <label key={i} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:bg-slate-50 p-1 rounded">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={formData.softwareTypes?.includes(type.name)}
                                                        onChange={() => {}} // Placeholder logic
                                                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                                                    />
                                                    {type.name}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-bold text-slate-700">Giá trị trước VAT</label>
                                            <input 
                                                type="number" 
                                                value={formData.valuePreVat || ''}
                                                onChange={(e) => handleFormChange('valuePreVat', Number(e.target.value))}
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none text-right" 
                                                placeholder="0" 
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-bold text-slate-700">VAT (%)</label>
                                            <input 
                                                type="number" 
                                                value={formData.vat || 10}
                                                onChange={(e) => handleFormChange('vat', Number(e.target.value))}
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none text-right" 
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-slate-700">Giá trị sau VAT</label>
                                        <input 
                                            type="text" 
                                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800 text-right" 
                                            // readOnly 
                                            value={formData.valuePostVat || 0}
                                            onChange={(e) => handleFormChange('valuePostVat', Number(e.target.value))}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* FILE UPLOAD SECTION */}
                            <div className="border-t border-slate-100 pt-6">
                                <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                                    <Icons.Attach size={18} className="text-blue-600"/> Tài liệu đính kèm
                                </h4>
                                
                                {/* Dropzone */}
                                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 bg-slate-50/50 hover:bg-blue-50/30 hover:border-blue-200 transition-colors text-center relative mb-4">
                                    <input 
                                        type="file" 
                                        multiple 
                                        accept=".pdf,.docx,.doc,.xlsx,.xls,.png,.jpg,.jpeg"
                                        onChange={handleFileUpload}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <div className="flex flex-col items-center justify-center pointer-events-none">
                                        <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center mb-2">
                                            <Icons.Upload size={20} className="text-blue-600"/>
                                        </div>
                                        <p className="text-sm font-medium text-slate-700">
                                            <span className="text-blue-600">Click để chọn</span> hoặc kéo thả file vào đây
                                        </p>
                                        <p className="text-xs text-slate-400 mt-1">Hỗ trợ: PDF, Word, Excel, Images (Max 10MB)</p>
                                    </div>
                                </div>

                                {/* File List */}
                                {formData.attachments && formData.attachments.length > 0 && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {formData.attachments.map((file) => (
                                            <div key={file.id} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg shadow-sm group">
                                                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                                    {file.type === 'pdf' ? <Icons.File size={20} /> : <Icons.FileText size={20} />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-slate-700 truncate" title={file.name}>{file.name}</p>
                                                    <p className="text-xs text-slate-400">{file.size} • {file.uploadDate}</p>
                                                </div>
                                                <button 
                                                    onClick={() => removeFile(file.id)}
                                                    className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded transition-colors"
                                                >
                                                    <Icons.X size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    
                    {modalTab === 'payment' && (
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="font-bold text-slate-700 text-sm uppercase">Danh sách đợt thanh toán</h4>
                                <button 
                                    onClick={handleAddPaymentTerm}
                                    className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 flex items-center gap-2 shadow-sm"
                                >
                                    <Icons.Plus size={14}/> Thêm đợt
                                </button>
                            </div>
                            
                            <table className="w-full text-sm text-left border border-slate-200 rounded-lg overflow-hidden">
                                <thead className="bg-slate-50 text-slate-700 font-bold text-xs uppercase">
                                    <tr>
                                        <th className="px-4 py-3 border-b">Đợt thanh toán</th>
                                        <th className="px-4 py-3 border-b">Nội dung</th>
                                        <th className="px-4 py-3 border-b text-center">Tỷ lệ (%)</th>
                                        <th className="px-4 py-3 border-b text-right">Giá trị (VNĐ)</th>
                                        <th className="px-4 py-3 border-b text-center">Ngày thu tiền</th>
                                        <th className="px-4 py-3 border-b text-center">Trạng thái thanh toán</th>
                                        <th className="px-4 py-3 border-b text-center">Trạng thái hóa đơn</th>
                                        <th className="px-4 py-3 border-b text-center w-16"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {formData.paymentTerms && formData.paymentTerms.length > 0 ? (
                                        formData.paymentTerms.map((term, idx) => (
                                            <tr key={term.id || idx} className="hover:bg-slate-50 border-b border-slate-100 last:border-0">
                                                <td className="px-2 py-2">
                                                    <input 
                                                        className="w-full px-2 py-1.5 border border-transparent hover:border-slate-300 focus:border-blue-500 rounded bg-transparent outline-none transition-all font-medium" 
                                                        value={term.batch} 
                                                        onChange={(e) => handleUpdatePaymentTerm(term.id, 'batch', e.target.value)}
                                                    />
                                                </td>
                                                <td className="px-2 py-2">
                                                     <input 
                                                        className="w-full px-2 py-1.5 border border-transparent hover:border-slate-300 focus:border-blue-500 rounded bg-transparent outline-none transition-all" 
                                                        value={term.content} 
                                                        placeholder="Nội dung..."
                                                        onChange={(e) => handleUpdatePaymentTerm(term.id, 'content', e.target.value)}
                                                    />
                                                </td>
                                                <td className="px-2 py-2 text-center">
                                                    <input 
                                                        type="number"
                                                        className="w-20 px-2 py-1.5 border border-transparent hover:border-slate-300 focus:border-blue-500 rounded bg-transparent outline-none text-center transition-all" 
                                                        value={term.ratio} 
                                                        onChange={(e) => handleUpdatePaymentTerm(term.id, 'ratio', e.target.value)}
                                                    />
                                                </td>
                                                <td className="px-2 py-2 text-right">
                                                    <input 
                                                        type="number"
                                                        className="w-32 px-2 py-1.5 border border-transparent hover:border-slate-300 focus:border-blue-500 rounded bg-transparent outline-none text-right font-bold text-slate-800 transition-all" 
                                                        value={term.value} 
                                                        onChange={(e) => handleUpdatePaymentTerm(term.id, 'value', e.target.value)}
                                                    />
                                                </td>
                                                <td className="px-2 py-2 text-center">
                                                     <CustomDatePicker 
                                                        value={term.collectionDate || ''}
                                                        onChange={(val) => handleUpdatePaymentTerm(term.id, 'collectionDate', val)}
                                                        className="w-full"
                                                    />
                                                </td>
                                                <td className="px-2 py-2 text-center">
                                                    <select 
                                                        className={`px-2 py-1.5 border border-transparent hover:border-slate-300 focus:border-blue-500 rounded outline-none transition-all text-xs font-bold ${term.isCollected ? 'text-emerald-600 bg-emerald-50' : 'text-slate-500 bg-slate-100'}`}
                                                        value={term.isCollected ? 'true' : 'false'}
                                                        onChange={(e) => handleUpdatePaymentTerm(term.id, 'isCollected', e.target.value === 'true')}
                                                    >
                                                        <option value="false">Chưa thu tiền</option>
                                                        <option value="true">Đã thu tiền</option>
                                                    </select>
                                                </td>
                                                <td className="px-2 py-2 text-center">
                                                     <select 
                                                        className={`px-2 py-1.5 border border-transparent hover:border-slate-300 focus:border-blue-500 rounded outline-none transition-all text-xs font-bold ${term.invoiceStatus === 'exported' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 bg-slate-100'}`}
                                                        value={term.invoiceStatus || 'not_exported'}
                                                        onChange={(e) => handleUpdatePaymentTerm(term.id, 'invoiceStatus', e.target.value)}
                                                    >
                                                        <option value="not_exported">Chưa xuất</option>
                                                        <option value="exported">Đã xuất</option>
                                                    </select>
                                                </td>
                                                <td className="px-2 py-2 text-center">
                                                    <button onClick={() => handleDeletePayment(term.id)} className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded transition-colors"><Icons.Trash size={16}/></button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={8} className="text-center py-8 text-slate-400 italic">Chưa có điều khoản thanh toán nào. Nhấn "Thêm đợt" để tạo mới.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {modalTab === 'expense' && (
                        <div>
                             <div className="flex justify-between items-center mb-4">
                                <h4 className="font-bold text-slate-700 text-sm uppercase">Danh sách chi phí</h4>
                                <button 
                                    onClick={handleAddExpense}
                                    className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 flex items-center gap-2 shadow-sm"
                                >
                                    <Icons.Plus size={14}/> Thêm chi phí
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left border border-slate-200 rounded-lg">
                                <thead className="bg-slate-50 text-slate-700 font-bold text-xs uppercase whitespace-nowrap">
                                    <tr>
                                        <th className="px-4 py-3 border-b text-center w-12">STT</th>
                                        <th className="px-4 py-3 border-b min-w-[180px]">Nhà cung cấp</th>
                                        <th className="px-4 py-3 border-b min-w-[150px]">Hạng mục</th>
                                        <th className="px-4 py-3 border-b min-w-[150px]">Diễn giải</th>
                                        <th className="px-4 py-3 border-b min-w-[120px] text-right">Tổng chi phí (VNĐ)</th>
                                        <th className="px-4 py-3 border-b min-w-[140px] text-center">Trạng thái HĐ</th>
                                        <th className="px-4 py-3 border-b min-w-[140px] text-center">TT Thanh toán</th>
                                        <th className="px-4 py-3 border-b min-w-[140px]">Nhân viên phụ trách</th>
                                        <th className="px-4 py-3 border-b min-w-[150px]">Ghi chú</th>
                                        <th className="px-4 py-3 border-b text-center min-w-[120px]">File đính kèm</th>
                                        <th className="px-4 py-3 border-b text-center w-10"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {formData.expenses && formData.expenses.length > 0 ? (
                                        formData.expenses.map((exp, idx) => (
                                            <tr key={exp.id || idx} className="hover:bg-slate-50 border-b border-slate-100 last:border-0">
                                                <td className="px-2 py-2 text-center text-slate-500">{idx + 1}</td>
                                                <td className="px-2 py-2">
                                                     <select 
                                                        className="w-full px-2 py-1.5 border border-transparent hover:border-slate-300 focus:border-blue-500 rounded bg-transparent outline-none transition-all"
                                                        value={exp.supplierId}
                                                        onChange={(e) => handleUpdateExpense(exp.id, 'supplierId', e.target.value)}
                                                    >
                                                        <option value="">-- Chọn NCC --</option>
                                                        {MOCK_MD_SUPPLIERS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                                    </select>
                                                </td>
                                                <td className="px-2 py-2">
                                                    <input 
                                                        className="w-full px-2 py-1.5 border border-transparent hover:border-slate-300 focus:border-blue-500 rounded bg-transparent outline-none transition-all" 
                                                        value={exp.category} 
                                                        placeholder="Hạng mục..."
                                                        onChange={(e) => handleUpdateExpense(exp.id, 'category', e.target.value)}
                                                    />
                                                </td>
                                                <td className="px-2 py-2">
                                                    <input 
                                                        className="w-full px-2 py-1.5 border border-transparent hover:border-slate-300 focus:border-blue-500 rounded bg-transparent outline-none transition-all" 
                                                        value={exp.description} 
                                                        placeholder="Diễn giải..."
                                                        onChange={(e) => handleUpdateExpense(exp.id, 'description', e.target.value)}
                                                    />
                                                </td>
                                                <td className="px-2 py-2 text-right">
                                                    <input 
                                                        type="number"
                                                        className="w-full px-2 py-1.5 border border-transparent hover:border-slate-300 focus:border-blue-500 rounded bg-transparent outline-none text-right font-bold text-rose-600 transition-all" 
                                                        value={exp.totalAmount} 
                                                        onChange={(e) => handleUpdateExpense(exp.id, 'totalAmount', Number(e.target.value))}
                                                    />
                                                </td>
                                                <td className="px-2 py-2 text-center">
                                                    {(() => {
                                                        // Inherit from parent formData.status
                                                        const status = getContractStatusText(formData.status);
                                                        return (
                                                            <div className={`w-full px-2 py-1.5 rounded text-xs font-bold text-center ${status.color}`}>
                                                                {status.text}
                                                            </div>
                                                        );
                                                    })()}
                                                </td>
                                                <td className="px-2 py-2 text-center">
                                                     <select 
                                                        className={`w-full px-2 py-1.5 border border-transparent hover:border-slate-300 focus:border-blue-500 rounded outline-none transition-all text-xs font-bold ${exp.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-slate-500'}`}
                                                        value={exp.paymentStatus}
                                                        onChange={(e) => handleUpdateExpense(exp.id, 'paymentStatus', e.target.value)}
                                                    >
                                                        <option value="unpaid">Chưa thanh toán</option>
                                                        <option value="paid">Đã thanh toán</option>
                                                    </select>
                                                </td>
                                                <td className="px-2 py-2">
                                                    <input 
                                                        className="w-full px-2 py-1.5 border border-transparent hover:border-slate-300 focus:border-blue-500 rounded bg-transparent outline-none transition-all" 
                                                        value={exp.pic} 
                                                        placeholder="NV phụ trách"
                                                        onChange={(e) => handleUpdateExpense(exp.id, 'pic', e.target.value)}
                                                    />
                                                </td>
                                                 <td className="px-2 py-2">
                                                    <input 
                                                        className="w-full px-2 py-1.5 border border-transparent hover:border-slate-300 focus:border-blue-500 rounded bg-transparent outline-none transition-all" 
                                                        value={exp.note} 
                                                        placeholder="Ghi chú..."
                                                        onChange={(e) => handleUpdateExpense(exp.id, 'note', e.target.value)}
                                                    />
                                                </td>
                                                <td className="px-2 py-2 text-center">
                                                    <div className="flex flex-col items-center gap-1">
                                                        <label className="cursor-pointer px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-xs font-bold flex items-center gap-1">
                                                            <Icons.Upload size={12}/> Thêm
                                                            <input 
                                                                type="file" 
                                                                multiple 
                                                                className="hidden" 
                                                                onChange={(e) => handleExpenseFileUpload(e, exp.id)}
                                                            />
                                                        </label>
                                                        {exp.attachments && exp.attachments.length > 0 && (
                                                            <button 
                                                                onClick={() => openViewFilesModal(`Chi phí: ${exp.category}`, exp.attachments)}
                                                                className="text-blue-600 hover:text-blue-800 text-xs font-bold underline"
                                                            >
                                                                Xem ({exp.attachments.length})
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-2 py-2 text-center">
                                                    <button onClick={() => handleDeleteExpense(exp.id)} className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded transition-colors"><Icons.Trash size={16}/></button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={11} className="text-center py-8 text-slate-400 italic">Chưa có chi phí nào. Nhấn "Thêm chi phí" để tạo mới.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            </div>
                        </div>
                    )}

                    {modalTab === 'member' && (
                        <div>
                             <div className="flex justify-between items-center mb-4">
                                <h4 className="font-bold text-slate-700 text-sm uppercase">Danh sách thành viên dự án</h4>
                                <button 
                                    onClick={handleAddMember}
                                    className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 flex items-center gap-2 shadow-sm"
                                >
                                    <Icons.Plus size={14}/> Thêm thành viên
                                </button>
                            </div>
                            <table className="w-full text-sm text-left border border-slate-200 rounded-lg overflow-hidden">
                                <thead className="bg-slate-50 text-slate-700 font-bold text-xs uppercase">
                                    <tr>
                                        <th className="px-4 py-3 border-b w-16 text-center">#</th>
                                        <th className="px-4 py-3 border-b">Mã thành viên</th>
                                        <th className="px-4 py-3 border-b">Tên thành viên</th>
                                        <th className="px-4 py-3 border-b">Chức vụ / Vai trò</th>
                                        <th className="px-4 py-3 border-b text-center w-16"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {formData.members && formData.members.length > 0 ? (
                                        formData.members.map((mem, idx) => (
                                            <tr key={mem.id || idx} className="hover:bg-slate-50 border-b border-slate-100 last:border-0">
                                                <td className="px-2 py-2 text-center text-slate-400">{idx + 1}</td>
                                                <td className="px-2 py-2">
                                                    <input 
                                                        className="w-full px-2 py-1.5 border border-transparent hover:border-slate-300 focus:border-blue-500 rounded bg-transparent outline-none transition-all font-mono" 
                                                        value={mem.memberCode} 
                                                        placeholder="NV..."
                                                        onChange={(e) => handleUpdateMember(mem.id, 'memberCode', e.target.value)}
                                                    />
                                                </td>
                                                <td className="px-2 py-2">
                                                    <input 
                                                        className="w-full px-2 py-1.5 border border-transparent hover:border-slate-300 focus:border-blue-500 rounded bg-transparent outline-none transition-all font-bold text-slate-700" 
                                                        value={mem.name} 
                                                        placeholder="Tên thành viên"
                                                        onChange={(e) => handleUpdateMember(mem.id, 'name', e.target.value)}
                                                    />
                                                </td>
                                                <td className="px-2 py-2">
                                                    <select 
                                                        className="w-full px-2 py-1.5 border border-transparent hover:border-slate-300 focus:border-blue-500 rounded bg-transparent outline-none transition-all text-sm font-medium"
                                                        value={mem.role}
                                                        onChange={(e) => handleUpdateMember(mem.id, 'role', e.target.value)}
                                                    >
                                                        <option value="PM">Project Manager (PM)</option>
                                                        <option value="BA">Business Analyst (BA)</option>
                                                        <option value="Dev">Developer</option>
                                                        <option value="Tester">Tester / QC</option>
                                                        <option value="AM">Account Manager</option>
                                                    </select>
                                                </td>
                                                <td className="px-2 py-2 text-center">
                                                    <button onClick={() => handleDeleteMember(mem.id)} className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded transition-colors"><Icons.Trash size={16}/></button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="text-center py-8 text-slate-400 italic">Chưa có thành viên tham gia. Nhấn "Thêm thành viên" để tạo mới.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 px-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 rounded-b-xl">
                    <button 
                        onClick={() => setIsModalOpen(false)}
                        className="px-5 py-2.5 text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-lg text-sm font-bold transition-all"
                    >
                        Hủy bỏ
                    </button>
                    <button 
                         onClick={handleSave}
                         className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-2"
                    >
                        <Icons.Check size={18} /> Lưu dữ liệu
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* 6. MODAL VIEW FILES (Generic) */}
      {viewFilesModal.isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden">
                <div className="flex justify-between items-center px-4 py-3 border-b border-slate-100 bg-slate-50">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Icons.Attach size={18} className="text-blue-600"/>
                        {viewFilesModal.title}
                    </h3>
                    <button onClick={() => setViewFilesModal(prev => ({ ...prev, isOpen: false }))} className="text-slate-400 hover:text-slate-600"><Icons.X size={20}/></button>
                </div>
                <div className="p-4 max-h-[60vh] overflow-y-auto">
                    {viewFilesModal.files && viewFilesModal.files.length > 0 ? (
                        <div className="space-y-2">
                            {viewFilesModal.files.map(file => (
                                <div key={file.id} className="flex items-center gap-3 p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                                     <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                         {file.type === 'pdf' ? <Icons.File size={16} /> : <Icons.FileText size={16} />}
                                     </div>
                                     <div className="flex-1 min-w-0">
                                         <p className="text-sm font-medium text-slate-700 truncate">{file.name}</p>
                                         <p className="text-xs text-slate-400">{file.size} • {file.uploadDate}</p>
                                     </div>
                                     <button className="text-blue-600 hover:underline text-xs font-medium whitespace-nowrap">Tải về</button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-slate-400 flex flex-col items-center">
                            <Icons.File size={32} className="mb-2 opacity-50"/>
                            <p>Không có tài liệu đính kèm</p>
                        </div>
                    )}
                </div>
                <div className="p-3 border-t border-slate-100 bg-slate-50 text-right">
                     <button onClick={() => setViewFilesModal(prev => ({ ...prev, isOpen: false }))} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-100 shadow-sm">Đóng</button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};
