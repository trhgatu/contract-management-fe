import React, { useState, useEffect } from 'react';
import { Icons } from '../../components/ui/Icons';
import { masterDataService } from '../../services';
import { SHARED_CATEGORIES_LIST } from '../../constants';
import { CategoryType, MasterDataCustomer, MasterDataSupplier } from '../../types';
import { useToast } from '../../contexts/ToastContext';
import { Button, Popconfirm, Spin, message, Tooltip, Input, Select, Tag } from 'antd';

interface SharedCategoriesProps {
    activeCategory: CategoryType;
}

const STATUS_COLORS = [
    { label: 'Mặc định (Xám)', value: 'bg-slate-100 text-slate-600', color: 'default' },
    { label: 'Xanh dương (Đang chạy)', value: 'bg-blue-100 text-blue-600', color: 'blue' },
    { label: 'Xanh lá (Hoàn thành)', value: 'bg-emerald-100 text-emerald-600', color: 'green' },
    { label: 'Vàng (Cảnh báo/Chờ)', value: 'bg-amber-100 text-amber-700', color: 'gold' },
    { label: 'Đỏ (Hủy/Lỗi)', value: 'bg-rose-100 text-rose-600', color: 'red' },
];

const CATEGORY_TO_API_TYPE: Record<string, string> = {
    'customer': 'customers',
    'supplier': 'suppliers',
    'unit': 'units',
    'software': 'software',
    'contract-type': 'contract-types',
    'status': 'status'
};

export const SharedCategories: React.FC<SharedCategoriesProps> = ({ activeCategory }) => {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any[]>([]);
    const [searchText, setSearchText] = useState('');

    // Modal State (Tailwind Overlay)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [formData, setFormData] = useState<any>({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchData();
        setSearchText('');
    }, [activeCategory]);

    const fetchData = async () => {
        const apiType = CATEGORY_TO_API_TYPE[activeCategory];
        if (!apiType) return;

        setLoading(true);
        try {
            const result = await masterDataService.getAll(apiType as any);
            setData(result);
        } catch (error: any) {
            console.error(error);
            showToast('Lỗi tải dữ liệu: ' + (error.message || 'Unknown'), 'error');
        } finally {
            setLoading(false);
        }
    };

    // --- Actions ---

    const handleAdd = () => {
        setModalMode('add');
        const initialData: any = { status: 'active' };

        if (activeCategory === 'customer' || activeCategory === 'supplier') {
            const prefix = activeCategory === 'customer' ? 'KH' : 'NCC';
            const nextId = (data.length || 0) + 1;
            initialData.code = `${prefix}${String(nextId).padStart(3, '0')}`;
            if (activeCategory === 'customer') initialData.group = 'Thường';
        }

        setFormData(initialData);
        setIsModalOpen(true);
    };

    const handleEdit = (record: any) => {
        setModalMode('edit');
        setFormData({ ...record });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        const apiType = CATEGORY_TO_API_TYPE[activeCategory];
        try {
            await masterDataService.delete(apiType as any, id);
            message.success('Đã xóa thành công!');
            setData(prev => prev.filter(item => item.id !== id));
        } catch (error: any) {
            message.error('Lỗi khi xóa: ' + (error.message || 'Unknown'));
        }
    };

    const handleSave = async () => {
        if (!formData.code || !formData.name) {
            message.warning('Vui lòng điền đủ Mã và Tên');
            return;
        }

        setSubmitting(true);
        const apiType = CATEGORY_TO_API_TYPE[activeCategory];
        try {
            if (modalMode === 'add') {
                const { id, ...dataToCreate } = formData; // Remove id if present
                const created = await masterDataService.create(apiType as any, dataToCreate);
                setData(prev => [created, ...prev]);
                message.success('Thêm mới thành công!');
            } else {
                const updated = await masterDataService.update(apiType as any, formData.id, formData);
                setData(prev => prev.map(item => item.id === formData.id ? updated : item));
                message.success('Cập nhật thành công!');
            }
            setIsModalOpen(false);
        } catch (error: any) {
            message.error('Lỗi lưu dữ liệu: ' + (error.message || 'Unknown'));
        } finally {
            setSubmitting(false);
        }
    };

    // --- Filters Logic ---
    const filteredData = data.filter(item =>
        item.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.code?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.contactPerson?.toLowerCase().includes(searchText.toLowerCase())
    );

    const currentCategoryInfo = SHARED_CATEGORIES_LIST.find(c => c.id === activeCategory);
    const parentGroup = ['customer', 'supplier'].includes(activeCategory) ? 'Quản lý đối tác' : 'Cấu hình tham số';

    // --- Renderers ---

    // 1. Render Table Content
    const renderTableContent = () => {
        if (loading) {
            return (
                <div className="flex items-center justify-center p-12">
                    <Spin size="large" tip="Đang tải dữ liệu..." />
                </div>
            );
        }

        if (filteredData.length === 0) {
            return (
                <div className="p-8 text-center text-slate-400">
                    Chưa có dữ liệu nào.
                </div>
            );
        }

        return (
            <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-slate-100 text-slate-700 font-bold text-xs uppercase sticky top-0 z-10 shadow-sm">
                    <tr>
                        <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200 w-24">Mã</th>
                        <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200">Tên danh mục</th>
                        {activeCategory === 'status' && <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200">Màu sắc</th>}
                        {['software', 'status'].includes(activeCategory) && <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200">Mô tả</th>}
                        {(activeCategory === 'customer' || activeCategory === 'supplier') && (
                            <>
                                <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200">Thông tin liên hệ</th>
                                <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200 text-center">Trạng thái</th>
                            </>
                        )}
                        <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200 text-center w-24">Tác vụ</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {filteredData.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3 font-mono font-bold text-slate-600">{item.code}</td>
                            <td className="px-4 py-3">
                                <div className="font-medium text-blue-700">{item.name}</div>
                                {/** Subname display based on type */}
                                {activeCategory === 'customer' && <div className="text-xs text-slate-400">{item.address}</div>}
                                {activeCategory === 'supplier' && <div className="text-xs text-slate-400">MST: {item.taxCode}</div>}
                                {['unit', 'contract-type'].includes(activeCategory) && item.description && (
                                    <div className="text-xs text-slate-400 truncate max-w-xs">{item.description}</div>
                                )}
                            </td>

                            {activeCategory === 'status' && (
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${item.color}`}>Màu hiển thị</span>
                                </td>
                            )}

                            {(activeCategory === 'customer' || activeCategory === 'supplier') && (
                                <td className="px-4 py-3">
                                    <div className="text-xs text-slate-500">
                                        {item.contactPerson && <div className="font-medium text-slate-700 mb-0.5">{item.contactPerson}</div>}
                                        {item.phone && <div className="flex items-center gap-1"><Icons.Phone size={10} /> {item.phone}</div>}
                                        {item.email && <div className="flex items-center gap-1"><Icons.Attach size={10} /> {item.email}</div>}
                                    </div>
                                </td>
                            )}

                            {(activeCategory === 'customer' || activeCategory === 'supplier') && (
                                <td className="px-4 py-3 text-center">
                                    {item.status === 'active'
                                        ? <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 border border-green-200">Hoạt động</span>
                                        : <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200">Đã khóa</span>
                                    }
                                </td>
                            )}

                            {['software', 'status'].includes(activeCategory) && <td className="px-4 py-3 text-slate-500">{item.description}</td>}

                            <td className="px-4 py-3 text-center">
                                <div className="flex items-center justify-center gap-2">
                                    <Tooltip title="Chỉnh sửa">
                                        <Button
                                            type="text"
                                            size="small"
                                            icon={<Icons.Edit size={16} className="text-blue-600" />}
                                            onClick={() => handleEdit(item)}
                                        />
                                    </Tooltip>
                                    <Popconfirm
                                        title="Xóa mục này?"
                                        description="Hành động này không thể hoàn tác."
                                        onConfirm={() => handleDelete(item.id)}
                                        okText="Xóa"
                                        cancelText="Hủy"
                                        okButtonProps={{ danger: true }}
                                    >
                                        <Tooltip title="Xóa vĩnh viễn">
                                            <Button
                                                type="text"
                                                size="small"
                                                icon={<Icons.Trash size={16} className="text-rose-500" />}
                                            />
                                        </Tooltip>
                                    </Popconfirm>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    // 2. Render Modal Form (Tailwind Overlay + Modern Layout)
    const renderModalForm = () => {
        const isPartner = ['customer', 'supplier'].includes(activeCategory);

        return (
            <div className="grid grid-cols-1 gap-4">
                {isPartner ? (
                    <>
                        <div className="mb-2">
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <span className="w-1 h-3 bg-blue-600 rounded-full"></span>
                                Thông tin chung
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Mã (Code) <span className="text-red-500">*</span></label>
                                    <Input
                                        prefix={<Icons.Hash size={14} className="text-slate-400" />}
                                        value={formData.code}
                                        onChange={e => setFormData({ ...formData, code: e.target.value })}
                                        placeholder="Nhập mã..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Tên đơn vị <span className="text-red-500">*</span></label>
                                    <Input
                                        prefix={<Icons.Building size={14} className="text-slate-400" />}
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Nhập tên..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Mã số thuế</label>
                                    <Input
                                        prefix={<Icons.FileText size={14} className="text-slate-400" />}
                                        value={formData.taxCode}
                                        onChange={e => setFormData({ ...formData, taxCode: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        {activeCategory === 'customer' ? 'Nhóm khách hàng' : 'Lĩnh vực'}
                                    </label>
                                    {activeCategory === 'customer' ? (
                                        <Select
                                            className="w-full"
                                            value={formData.group}
                                            onChange={val => setFormData({ ...formData, group: val })}
                                        >
                                            <Select.Option value="Thường">Thường</Select.Option>
                                            <Select.Option value="VIP">VIP</Select.Option>
                                            <Select.Option value="Thân thiết">Thân thiết</Select.Option>
                                            <Select.Option value="Nội bộ">Nội bộ</Select.Option>
                                        </Select>
                                    ) : (
                                        <Input
                                            value={formData.field}
                                            onChange={e => setFormData({ ...formData, field: e.target.value })}
                                            placeholder="VD: Phần mềm..."
                                        />
                                    )}
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Trạng thái</label>
                                    <Select
                                        className="w-full"
                                        value={formData.status}
                                        onChange={val => setFormData({ ...formData, status: val })}
                                    >
                                        <Select.Option value="active">
                                            <span className="text-emerald-600 font-medium">● Đang hoạt động</span>
                                        </Select.Option>
                                        <Select.Option value="inactive">
                                            <span className="text-slate-400 font-medium">● Ngưng hoạt động (Đã khóa)</span>
                                        </Select.Option>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-slate-100 my-1"></div>

                        <div className="mb-2">
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <span className="w-1 h-3 bg-orange-500 rounded-full"></span>
                                Thông tin liên hệ
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Người liên hệ</label>
                                    <Input prefix={<Icons.User size={14} className="text-slate-400" />} value={formData.contactPerson} onChange={e => setFormData({ ...formData, contactPerson: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Điện thoại</label>
                                    <Input prefix={<Icons.Phone size={14} className="text-slate-400" />} value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                    <Input prefix={<Icons.Mail size={14} className="text-slate-400" />} value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                </div>
                                <div className="col-span-3">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Địa chỉ</label>
                                    <Input.TextArea rows={2} className="resize-none" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    // Generic Form
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Mã danh mục <span className="text-red-500">*</span></label>
                            <Input value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} placeholder="Nhập mã..." />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Tên danh mục <span className="text-red-500">*</span></label>
                            <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Nhập tên..." />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Mô tả</label>
                            <Input.TextArea rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                        </div>
                        {activeCategory === 'status' && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Màu hiển thị</label>
                                <Select className="w-full" value={formData.color} onChange={val => setFormData({ ...formData, color: val })}>
                                    {STATUS_COLORS.map(c => (
                                        <Select.Option key={c.value} value={c.value}>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-4 h-4 rounded ${c.value.split(' ')[0]}`}></div>
                                                <span>{c.label}</span>
                                            </div>
                                        </Select.Option>
                                    ))}
                                </Select>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full animate-in fade-in duration-300 p-6 bg-slate-50 gap-4">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                        <span>Danh mục dùng chung</span>
                        <Icons.ChevronRight size={12} />
                        <span>{parentGroup}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">{currentCategoryInfo?.name}</h2>
                </div>
                <Button
                    type="primary"
                    icon={<Icons.Plus size={16} />}
                    onClick={handleAdd}
                    size="large"
                >
                    Thêm mới
                </Button>
            </div>

            {/* Main Content Card (Tailwind Style) */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col flex-1 overflow-hidden h-[500px]">
                {/* Toolbar */}
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white">
                    <div className="relative w-72">
                        <Input
                            prefix={<Icons.Search size={16} className="text-slate-400" />}
                            placeholder="Tìm kiếm..."
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                            allowClear
                        />
                    </div>
                </div>

                {/* Manual Table (Tailwind) */}
                <div className="flex-1 overflow-auto">
                    {renderTableContent()}
                </div>

                {/* Pagination (Static for now to match style, functional logic can be added later) */}
                <div className="p-2 px-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center text-xs text-slate-500">
                    <span>Hiển thị {filteredData.length} bản ghi</span>
                    <div className="flex gap-1">
                        <button className="px-2 py-1 border rounded bg-white hover:bg-slate-50 disabled:opacity-50">Trước</button>
                        <button className="px-2 py-1 border rounded bg-blue-600 text-white">1</button>
                        <button className="px-2 py-1 border rounded bg-white hover:bg-slate-50">2</button>
                        <button className="px-2 py-1 border rounded bg-white hover:bg-slate-50">Sau</button>
                    </div>
                </div>
            </div>

            {/* Custom Modal (Tailwind CSS Overlay) */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className={`bg-white rounded-xl flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200 ${['customer', 'supplier'].includes(activeCategory) ? 'max-w-2xl w-full' : 'max-w-md w-full'}`}>

                        {/* Modal Header */}
                        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800">
                                    {modalMode === 'add' ? 'Thêm mới' : 'Chỉnh sửa'} {currentCategoryInfo?.name}
                                </h3>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"><Icons.X size={20} /></button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto max-h-[70vh]">
                            {renderModalForm()}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 px-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 rounded-b-xl">
                            <Button onClick={() => setIsModalOpen(false)}>Hủy bỏ</Button>
                            <Button type="primary" onClick={handleSave} loading={submitting} icon={<Icons.Check size={16} />}>
                                Lưu dữ liệu
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
