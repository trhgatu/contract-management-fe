
import React, { useState, useEffect } from 'react';
import { Icons } from './Icons';
import { 
  MOCK_MD_CUSTOMERS, 
  MOCK_MD_UNITS, 
  MOCK_MD_SOFTWARE_TYPES, 
  MOCK_MD_CONTRACT_TYPES, 
  MOCK_MD_STATUS,
  MOCK_MD_SUPPLIERS,
  SHARED_CATEGORIES_LIST
} from '../constants';
import { CategoryType, MasterDataCustomer, MasterDataSupplier } from '../types';

interface SharedCategoriesProps {
  activeCategory: CategoryType;
}

// In-memory cache to persist data changes during the session
const SESSION_CACHE: Record<string, any[]> = {};

const STATUS_COLORS = [
    { label: 'Mặc định (Xám)', value: 'bg-slate-100 text-slate-600' },
    { label: 'Xanh dương (Đang chạy)', value: 'bg-blue-100 text-blue-600' },
    { label: 'Xanh lá (Hoàn thành)', value: 'bg-emerald-100 text-emerald-600' },
    { label: 'Vàng (Cảnh báo/Chờ)', value: 'bg-amber-100 text-amber-700' },
    { label: 'Đỏ (Hủy/Lỗi)', value: 'bg-rose-100 text-rose-600' },
];

export const SharedCategories: React.FC<SharedCategoriesProps> = ({ activeCategory }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for generic lists (Unit, Software, Status, ContractType)
  const [localData, setLocalData] = useState<any[]>([]);
  const [editingIds, setEditingIds] = useState<Set<string>>(new Set());
  const [isDirty, setIsDirty] = useState(false);

  // States for Customer/Supplier Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [formData, setFormData] = useState<any>({});
  
  // Filter States for Customer/Supplier
  const [statusFilter, setStatusFilter] = useState('all');
  const [groupFilter, setGroupFilter] = useState('all'); // Customer only
  const [fieldFilter, setFieldFilter] = useState('all'); // Supplier only

  // Load data when category changes
  useEffect(() => {
    // Check cache first
    if (SESSION_CACHE[activeCategory]) {
       setLocalData(JSON.parse(JSON.stringify(SESSION_CACHE[activeCategory])));
    } else {
        // Fallback to constants
        let initialData: any[] = [];
        if (activeCategory === 'customer') initialData = MOCK_MD_CUSTOMERS;
        else if (activeCategory === 'supplier') initialData = MOCK_MD_SUPPLIERS;
        else if (activeCategory === 'unit') initialData = MOCK_MD_UNITS;
        else if (activeCategory === 'software') initialData = MOCK_MD_SOFTWARE_TYPES;
        else if (activeCategory === 'contract-type') initialData = MOCK_MD_CONTRACT_TYPES;
        else if (activeCategory === 'status') initialData = MOCK_MD_STATUS;
        else if (activeCategory === 'job') initialData = []; 

        setLocalData(JSON.parse(JSON.stringify(initialData)));
    }

    setEditingIds(new Set());
    setIsDirty(false);
    setSearchTerm('');
    setStatusFilter('all');
    setGroupFilter('all');
    setFieldFilter('all');
  }, [activeCategory]);

  // Update cache whenever localData changes (for generic lists) or after modal save
  useEffect(() => {
    if (localData.length > 0) {
         SESSION_CACHE[activeCategory] = JSON.parse(JSON.stringify(localData));
    }
  }, [localData, activeCategory]);


  // --- Handlers for Generic List (Inline Edit) ---

  const handleGenericAddNew = () => {
    const newId = `new_${Date.now()}`;
    const newRow: any = { 
        id: newId, 
        code: '', 
        name: '', 
        description: '', 
        isNew: true 
    };
    if (activeCategory === 'status') {
        newRow.color = 'bg-slate-100 text-slate-600';
    }
    setLocalData(prev => [...prev, newRow]);
    const newEditingIds = new Set(editingIds);
    newEditingIds.add(newId);
    setEditingIds(newEditingIds);
    setIsDirty(true);
  };

  const toggleGenericEdit = (id: string) => {
    const newEditingIds = new Set(editingIds);
    if (newEditingIds.has(id)) {
        newEditingIds.delete(id);
    } else {
        newEditingIds.add(id);
    }
    setEditingIds(newEditingIds);
  };

  const handleGenericChange = (id: string, field: string, value: string) => {
      setLocalData(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
      setIsDirty(true);
  };

  const handleGenericDelete = (id: string) => {
      setLocalData(prev => prev.filter(item => item.id !== id));
      setIsDirty(true);
  };

  const handleGenericSave = () => {
      if (!isDirty) return;
      const emptyCode = localData.find(d => !d.code || !d.name);
      if (emptyCode) {
          alert('Vui lòng điền đầy đủ Mã và Tên cho tất cả các dòng.');
          return;
      }
      setEditingIds(new Set());
      setIsDirty(false);
      alert('Đã lưu dữ liệu thành công!'); 
  };

  // --- Handlers for Customer/Supplier (Modal Based) ---

  const handleOpenModal = (mode: 'add' | 'edit', data?: any) => {
      setModalMode(mode);
      if (mode === 'add') {
          // Auto generate code suggestion (simplified)
          const prefix = activeCategory === 'customer' ? 'KH' : 'NCC';
          const nextId = localData.length + 1;
          const code = `${prefix}${String(nextId).padStart(3, '0')}`;
          
          setFormData({
              id: `new_${Date.now()}`,
              code: code,
              name: '',
              field: '',
              taxCode: '',
              address: '',
              contactPerson: '',
              phone: '',
              email: '',
              status: 'active',
              group: activeCategory === 'customer' ? 'Thường' : undefined
          });
      } else {
          setFormData({ ...data });
      }
      setIsModalOpen(true);
  };

  const handleModalSave = () => {
      if (!formData.code || !formData.name) {
          alert('Vui lòng nhập Mã và Tên');
          return;
      }

      if (modalMode === 'add') {
          // Check duplicate code
          if (localData.some(i => i.code === formData.code)) {
              alert('Mã đã tồn tại, vui lòng chọn mã khác.');
              return;
          }
          setLocalData(prev => [...prev, formData]);
      } else {
          setLocalData(prev => prev.map(item => item.id === formData.id ? formData : item));
      }
      setIsModalOpen(false);
  };

  const handleComplexDelete = (item: any) => {
      // Logic: Only allow delete if inactive. If active, suggest deactivating.
      if (item.status === 'active') {
          const confirmDeactivate = window.confirm(`Dữ liệu "${item.name}" đang hoạt động. Bạn có muốn chuyển sang trạng thái "Ngưng hoạt động" (Inactive) thay vì xóa không?`);
          if (confirmDeactivate) {
              setLocalData(prev => prev.map(i => i.id === item.id ? { ...i, status: 'inactive' } : i));
          }
      } else {
          const confirmDelete = window.confirm(`Bạn có chắc chắn muốn xóa "${item.name}" không? Hành động này không thể hoàn tác.`);
          if (confirmDelete) {
              setLocalData(prev => prev.filter(i => i.id !== item.id));
          }
      }
  };

  // --- Filters Logic ---
  const filteredData = localData.filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.code.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      
      let matchesGroup = true;
      if (activeCategory === 'customer' && groupFilter !== 'all') {
          matchesGroup = item.group === groupFilter;
      }

      let matchesField = true;
      if (activeCategory === 'supplier' && fieldFilter !== 'all') {
          matchesField = item.field === fieldFilter;
      }

      return matchesSearch && matchesStatus && matchesGroup && matchesField;
  });


  // --- Renderers ---

  const renderGenericTable = () => {
      const isStatusCategory = activeCategory === 'status';
      return (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 w-32 whitespace-nowrap">Mã</th>
                  <th className="px-4 py-3 w-1/3 whitespace-nowrap">Tên danh mục</th>
                  {isStatusCategory && <th className="px-4 py-3 whitespace-nowrap">Màu sắc</th>}
                  <th className="px-4 py-3 whitespace-nowrap">Diễn giải / Mô tả</th>
                  <th className="px-4 py-3 text-center w-24">Tác vụ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.length > 0 ? filteredData.map((item) => {
                  const isEditing = editingIds.has(item.id);
                  return (
                    <tr key={item.id} className={`hover:bg-slate-50 transition-colors ${item.isNew ? 'bg-blue-50/30' : ''}`}>
                      <td className="px-4 py-3 font-mono text-slate-500 align-top">
                          {isEditing ? (
                              <input 
                                  value={item.code}
                                  onChange={(e) => handleGenericChange(item.id, 'code', e.target.value)}
                                  className="w-full px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
                                  placeholder="Mã..."
                                  autoFocus
                              />
                          ) : ( item.code )}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-700 align-top">
                          {isEditing ? (
                              <input 
                                  value={item.name}
                                  onChange={(e) => handleGenericChange(item.id, 'name', e.target.value)}
                                  className="w-full px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
                              />
                          ) : (
                              isStatusCategory && item.color ? (
                                <span className={`px-2 py-1 rounded text-xs font-semibold ${item.color}`}>{item.name}</span>
                              ) : ( item.name )
                          )}
                      </td>
                       {isStatusCategory && (
                         <td className="px-4 py-3 align-top">
                             {isEditing ? (
                                 <select
                                    value={item.color}
                                    onChange={(e) => handleGenericChange(item.id, 'color', e.target.value)}
                                    className="w-full px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white text-xs"
                                 >
                                     {STATUS_COLORS.map(c => (
                                         <option key={c.value} value={c.value}>{c.label}</option>
                                     ))}
                                 </select>
                             ) : (
                                 <div className={`w-6 h-6 rounded border border-slate-200 ${item.color ? item.color.split(' ')[0] : 'bg-slate-100'}`} title="Màu hiển thị"></div>
                             )}
                         </td>
                       )}
                      <td className="px-4 py-3 text-slate-500 align-top">
                          {isEditing ? (
                              <input 
                                  value={item.description || ''}
                                  onChange={(e) => handleGenericChange(item.id, 'description', e.target.value)}
                                  className="w-full px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
                                  placeholder="Mô tả..."
                              />
                          ) : ( item.description )}
                      </td>
                      <td className="px-4 py-3 text-center align-top">
                        <div className="flex items-center justify-center gap-2 mt-1">
                          <button onClick={() => toggleGenericEdit(item.id)} className={`transition-colors ${isEditing ? 'text-green-600 hover:text-green-800' : 'text-slate-400 hover:text-blue-600'}`}>
                              {isEditing ? <Icons.Check size={18}/> : <Icons.Edit size={16}/>}
                          </button>
                          <button onClick={() => handleGenericDelete(item.id)} className="text-slate-400 hover:text-rose-600 transition-colors">
                              <Icons.Trash size={16}/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr><td colSpan={isStatusCategory ? 5 : 4} className="text-center py-8 text-slate-400">Chưa có dữ liệu.</td></tr>
                )}
              </tbody>
            </table>
          </div>
      )
  }

  const renderCustomerTable = () => (
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 whitespace-nowrap">Mã KH</th>
              <th className="px-4 py-3 whitespace-nowrap">Tên khách hàng</th>
              <th className="px-4 py-3 whitespace-nowrap">MST</th>
              <th className="px-4 py-3 whitespace-nowrap">Liên hệ</th>
              <th className="px-4 py-3 whitespace-nowrap">Nhóm</th>
              <th className="px-4 py-3 whitespace-nowrap text-center">Trạng thái</th>
              <th className="px-4 py-3 text-center">Tác vụ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredData.map((item: MasterDataCustomer) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-mono text-slate-500 font-bold">{item.code}</td>
                <td className="px-4 py-3">
                    <div className="font-medium text-blue-600">{item.name}</div>
                    <div className="text-xs text-slate-400">{item.address}</div>
                </td>
                <td className="px-4 py-3 text-slate-600">{item.taxCode}</td>
                <td className="px-4 py-3">
                  <div className="text-slate-700 font-medium">{item.contactPerson}</div>
                  <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><Icons.Phone size={10}/> {item.phone}</div>
                  <div className="text-xs text-slate-400 flex items-center gap-1"><Icons.Attach size={10}/> {item.email}</div>
                </td>
                 <td className="px-4 py-3">
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs border border-slate-200">{item.group || 'Thường'}</span>
                </td>
                <td className="px-4 py-3 text-center">
                    {item.status === 'active' 
                        ? <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Hoạt động</span>
                        : <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-500">Đã khóa</span>
                    }
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => handleOpenModal('edit', item)} className="text-slate-400 hover:text-blue-600"><Icons.Edit size={16}/></button>
                    <button onClick={() => handleComplexDelete(item)} className="text-slate-400 hover:text-rose-600"><Icons.Trash size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  );

  const renderSupplierTable = () => (
     <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 whitespace-nowrap">Mã NCC</th>
              <th className="px-4 py-3 whitespace-nowrap">Tên nhà cung cấp</th>
              <th className="px-4 py-3 whitespace-nowrap">Lĩnh vực</th>
              <th className="px-4 py-3 whitespace-nowrap">Liên hệ</th>
              <th className="px-4 py-3 whitespace-nowrap text-center">Trạng thái</th>
              <th className="px-4 py-3 text-center">Tác vụ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredData.map((item: MasterDataSupplier) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-mono text-slate-500 font-bold">{item.code}</td>
                <td className="px-4 py-3">
                    <div className="font-medium text-blue-600">{item.name}</div>
                    <div className="text-xs text-slate-400 flex items-center gap-1">MST: {item.taxCode}</div>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-xs border border-indigo-100">{item.field}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="text-slate-700 font-medium">{item.contactPerson}</div>
                  <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><Icons.Phone size={10}/> {item.phone}</div>
                  {item.email && <div className="text-xs text-slate-400 flex items-center gap-1"><Icons.Attach size={10}/> {item.email}</div>}
                </td>
                 <td className="px-4 py-3 text-center">
                    {item.status === 'active' 
                        ? <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Hoạt động</span>
                        : <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-500">Đã khóa</span>
                    }
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => handleOpenModal('edit', item)} className="text-slate-400 hover:text-blue-600"><Icons.Edit size={16}/></button>
                    <button onClick={() => handleComplexDelete(item)} className="text-slate-400 hover:text-rose-600"><Icons.Trash size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  );

  const currentCategoryInfo = SHARED_CATEGORIES_LIST.find(c => c.id === activeCategory);
  const CurrentIcon = Icons[currentCategoryInfo?.icon as keyof typeof Icons || 'Category'] as React.ElementType;
  const isGenericCategory = ['unit', 'software', 'contract-type', 'status', 'job', 'expense'].includes(activeCategory);

  const parentGroup = ['customer', 'supplier'].includes(activeCategory) ? 'Quản lý đối tác' : 'Cấu hình tham số';

  return (
    <div className="flex-1 flex flex-col h-full animate-in fade-in duration-300">
      
      {/* Header Breadcrumb */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800">Danh mục dùng chung</h2>
        <div className="text-sm text-slate-500 flex items-center gap-2">
          <span>Danh mục dùng chung</span> 
          <Icons.ChevronDown size={14} className="-rotate-90 text-slate-300"/> 
          <span>{parentGroup}</span>
          <Icons.ChevronDown size={14} className="-rotate-90 text-slate-300"/> 
          <span className="text-blue-600 font-medium">{currentCategoryInfo?.name}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col min-h-[500px]">
          
          {/* Toolbar */}
          <div className="p-5 border-b border-slate-100 flex flex-col xl:flex-row gap-4 justify-between">
             <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                   <CurrentIcon size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">{currentCategoryInfo?.name}</h3>
                  <p className="text-xs text-slate-500">{currentCategoryInfo?.description}</p>
                </div>
             </div>

             <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Tìm kiếm..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 w-full sm:w-64"
                  />
                  <Icons.Search size={16} className="absolute left-3 top-2.5 text-slate-400"/>
                </div>

                {/* Specific Filters for Customer/Supplier */}
                {!isGenericCategory && (
                    <>
                        <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white"
                        >
                            <option value="all">Tất cả trạng thái</option>
                            <option value="active">Đang hoạt động</option>
                            <option value="inactive">Đã khóa</option>
                        </select>
                        
                        {activeCategory === 'customer' && (
                            <select 
                                value={groupFilter}
                                onChange={(e) => setGroupFilter(e.target.value)}
                                className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white"
                            >
                                <option value="all">Tất cả nhóm</option>
                                <option value="VIP">VIP</option>
                                <option value="Thân thiết">Thân thiết</option>
                                <option value="Thường">Thường</option>
                                <option value="Nội bộ">Nội bộ</option>
                                <option value="Mới">Mới</option>
                            </select>
                        )}

                        {activeCategory === 'supplier' && (
                            <select 
                                value={fieldFilter}
                                onChange={(e) => setFieldFilter(e.target.value)}
                                className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white"
                            >
                                <option value="all">Tất cả lĩnh vực</option>
                                {/* Extract unique fields dynamically in real app, hardcoded for now */}
                                <option value="Hạ tầng mạng">Hạ tầng mạng</option>
                                <option value="Phần mềm">Phần mềm</option>
                                <option value="Thiết bị IT">Thiết bị IT</option>
                                <option value="An ninh">An ninh</option>
                                <option value="Vệ sinh">Vệ sinh</option>
                            </select>
                        )}
                    </>
                )}
                
                {/* Actions */}
                {isGenericCategory ? (
                    <>
                        <button 
                            onClick={handleGenericSave}
                            disabled={!isDirty}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all whitespace-nowrap ${isDirty ? 'bg-emerald-600 hover:bg-emerald-700 text-white animate-pulse-slow' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                        >
                           <Icons.Save size={16} /> Lưu thay đổi
                        </button>
                        <button 
                            onClick={handleGenericAddNew}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-sm transition-colors whitespace-nowrap"
                        >
                           <Icons.Plus size={16} /> Thêm mới
                        </button>
                    </>
                ) : (
                    <button 
                        onClick={() => handleOpenModal('add')}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-sm transition-colors whitespace-nowrap"
                    >
                        <Icons.Plus size={16} /> Thêm mới
                    </button>
                )}
             </div>
          </div>

          {/* Table Content */}
          <div className="flex-1 bg-white">
             {activeCategory === 'customer' && renderCustomerTable()}
             {activeCategory === 'supplier' && renderSupplierTable()}
             {isGenericCategory && renderGenericTable()}
          </div>

          {/* Pagination (Visual Only) */}
          <div className="p-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
             <span>Hiển thị {filteredData.length} dòng</span>
             <div className="flex gap-1">
                <button className="px-2 py-1 border rounded hover:bg-slate-50 disabled:opacity-50">Trước</button>
                <button className="px-2 py-1 bg-blue-600 text-white rounded">1</button>
                <button className="px-2 py-1 border rounded hover:bg-slate-50">2</button>
                <button className="px-2 py-1 border rounded hover:bg-slate-50">Sau</button>
             </div>
          </div>
          
      </div>

      {/* MODAL FOR CUSTOMER / SUPPLIER */}
      {isModalOpen && !isGenericCategory && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-3xl shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
                    <h3 className="text-xl font-bold text-slate-800">
                        {modalMode === 'add' ? 'Thêm mới' : 'Chỉnh sửa'} {currentCategoryInfo?.name}
                    </h3>
                    <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500"><Icons.X size={20}/></button>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-700">Mã (Code) <span className="text-red-500">*</span></label>
                            <input 
                                type="text" 
                                value={formData.code || ''}
                                onChange={e => setFormData({...formData, code: e.target.value})}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                                placeholder="Tự sinh hoặc nhập..."
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-700">Tên đơn vị <span className="text-red-500">*</span></label>
                            <input 
                                type="text" 
                                value={formData.name || ''}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Mã số thuế</label>
                            <input 
                                type="text" 
                                value={formData.taxCode || ''}
                                onChange={e => setFormData({...formData, taxCode: e.target.value})}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Địa chỉ</label>
                            <textarea 
                                value={formData.address || ''}
                                onChange={e => setFormData({...formData, address: e.target.value})}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none h-20 resize-none"
                            />
                        </div>
                    </div>
                    <div className="space-y-4">
                         <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-700">
                                {activeCategory === 'customer' ? 'Nhóm khách hàng' : 'Lĩnh vực cung cấp'}
                            </label>
                            {activeCategory === 'customer' ? (
                                <select 
                                    value={formData.group || ''}
                                    onChange={e => setFormData({...formData, group: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none bg-white"
                                >
                                    <option value="Thường">Thường</option>
                                    <option value="VIP">VIP</option>
                                    <option value="Thân thiết">Thân thiết</option>
                                    <option value="Nội bộ">Nội bộ</option>
                                    <option value="Mới">Mới</option>
                                </select>
                            ) : (
                                <input 
                                    type="text" 
                                    value={formData.field || ''}
                                    onChange={e => setFormData({...formData, field: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                                    placeholder="VD: Phần mềm, An ninh..."
                                />
                            )}
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Người liên hệ</label>
                            <input 
                                type="text" 
                                value={formData.contactPerson || ''}
                                onChange={e => setFormData({...formData, contactPerson: e.target.value})}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                             <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700">Điện thoại</label>
                                <input 
                                    type="text" 
                                    value={formData.phone || ''}
                                    onChange={e => setFormData({...formData, phone: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                                />
                            </div>
                             <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700">Email</label>
                                <input 
                                    type="text" 
                                    value={formData.email || ''}
                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                                />
                            </div>
                        </div>
                         <div className="space-y-1 pt-2">
                            <label className="text-sm font-bold text-slate-700 block mb-2">Trạng thái hoạt động</label>
                            <div className="flex items-center gap-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name="status" 
                                        checked={formData.status === 'active'} 
                                        onChange={() => setFormData({...formData, status: 'active'})}
                                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-slate-700">Đang hoạt động</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name="status" 
                                        checked={formData.status === 'inactive'}
                                        onChange={() => setFormData({...formData, status: 'inactive'})}
                                        className="w-4 h-4 text-slate-500 focus:ring-slate-500"
                                    />
                                    <span className="text-sm text-slate-500">Ngưng hoạt động</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-4 px-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 rounded-b-xl">
                    <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-sm font-bold">Hủy bỏ</button>
                    <button onClick={handleModalSave} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-lg">Lưu thông tin</button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};
