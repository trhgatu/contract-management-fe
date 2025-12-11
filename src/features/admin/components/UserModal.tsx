
import React, { useState, useEffect } from 'react';
import { Icons } from '../../../components/ui/Icons';
import { UserGroup } from '../../../types';
import { Button } from 'antd';

interface UserModalProps {
    isOpen: boolean;
    mode: 'add' | 'edit';
    groups: UserGroup[];
    editItem: any;
    onSave: (data: any) => void;
    onClose: () => void;
    isLoading?: boolean;
}

export const UserModal: React.FC<UserModalProps> = ({ isOpen, mode, groups, editItem, onSave, onClose, isLoading = false }) => {
    const [item, setItem] = useState<any>({});
    const [errors, setErrors] = useState<any>({});

    useEffect(() => {
        setItem(editItem || {});
        setErrors({});
    }, [editItem]);

    const validate = () => {
        const newErrors: any = {};

        if (!item.username || item.username.trim() === '') {
            newErrors.username = 'Tên đăng nhập không được để trống';
        }

        if (!item.email || item.email.trim() === '') {
            newErrors.email = 'Email không được để trống';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        if (!item.fullName || item.fullName.trim() === '') {
            newErrors.fullName = 'Họ và tên không được để trống';
        }

        if (mode === 'add' && (!item.password || item.password.trim() === '')) {
            newErrors.password = 'Mật khẩu không được để trống';
        }

        if (item.password && item.password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (validate()) {
            onSave(item);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
                    <h3 className="text-xl font-bold text-slate-800">
                        {mode === 'add' ? 'Thêm mới' : 'Cập nhật'} Tài khoản
                    </h3>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500"><Icons.X size={20} /></button>
                </div>

                <div className="p-6 space-y-4">
                    <>
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-700">Nhóm tài khoản</label>
                            <select
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                                value={item.groupId || ''}
                                onChange={e => setItem({ ...item, groupId: e.target.value })}
                            >
                                <option value="">-- Chọn nhóm --</option>
                                {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-700">Tên đăng nhập <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={item.username || ''}
                                onChange={e => setItem({ ...item, username: e.target.value })}
                                className={`w-full px-3 py-2 border rounded-lg focus:border-blue-500 outline-none ${errors.username ? 'border-red-500' : 'border-slate-200'}`}
                            />
                            {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username}</p>}
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-700">Mật khẩu {mode === 'add' && <span className="text-red-500">*</span>}</label>
                            <input
                                type="password"
                                placeholder={mode === 'edit' ? 'Để trống nếu không đổi' : ''}
                                value={item.password || ''}
                                onChange={e => setItem({ ...item, password: e.target.value })}
                                className={`w-full px-3 py-2 border rounded-lg focus:border-blue-500 outline-none ${errors.password ? 'border-red-500' : 'border-slate-200'}`}
                            />
                            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-700">Họ và tên <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={item.fullName || ''}
                                onChange={e => setItem({ ...item, fullName: e.target.value })}
                                className={`w-full px-3 py-2 border rounded-lg focus:border-blue-500 outline-none ${errors.fullName ? 'border-red-500' : 'border-slate-200'}`}
                            />
                            {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-700">Email <span className="text-red-500">*</span></label>
                            <input
                                type="email"
                                value={item.email || ''}
                                onChange={e => setItem({ ...item, email: e.target.value })}
                                className={`w-full px-3 py-2 border rounded-lg focus:border-blue-500 outline-none ${errors.email ? 'border-red-500' : 'border-slate-200'}`}
                            />
                            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                        </div>
                        <div className="pt-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={item.status === 'active'}
                                    onChange={e => setItem({ ...item, status: e.target.checked ? 'active' : 'inactive' })}
                                    className="w-4 h-4 text-blue-600 rounded"
                                />
                                <span className="text-sm font-bold text-slate-700">Kích hoạt tài khoản</span>
                            </label>
                        </div>
                    </>
                </div>

                <div className="p-4 px-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 rounded-b-xl">
                    <Button onClick={onClose} className="h-10 px-6 border-slate-300 text-slate-600 font-medium hover:bg-slate-50">
                        Hủy bỏ
                    </Button>
                    <Button
                        type="primary"
                        onClick={handleSave}
                        loading={isLoading}
                        className="h-10 px-6 bg-blue-600 hover:bg-blue-700 font-bold shadow-sm"
                    >
                        Lưu dữ liệu
                    </Button>
                </div>
            </div>
        </div>
    );
}
