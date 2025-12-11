
import React, { useState, useEffect } from 'react';
import { Icons } from '../../../components/ui/Icons';
import { Button } from 'antd';

interface GroupModalProps {
    isOpen: boolean;
    mode: 'add' | 'edit';
    editItem: any;
    onSave: (data: any) => void;
    onClose: () => void;
    isLoading?: boolean;
}

export const GroupModal: React.FC<GroupModalProps> = ({ isOpen, mode, editItem, onSave, onClose, isLoading = false }) => {
    const [item, setItem] = useState<any>({});
    const [errors, setErrors] = useState<any>({});

    useEffect(() => {
        setItem(editItem || {});
        setErrors({});
    }, [editItem]);

    const validate = () => {
        const newErrors: any = {};

        if (!item.code || item.code.trim() === '') {
            newErrors.code = 'Mã nhóm không được để trống';
        } else if (!/^[A-Z0-9_]+$/.test(item.code)) {
            newErrors.code = 'Mã nhóm chỉ chứa chữ in hoa, số và dấu gạch dưới';
        }

        if (!item.name || item.name.trim() === '') {
            newErrors.name = 'Tên nhóm không được để trống';
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
                        {mode === 'add' ? 'Thêm mới' : 'Cập nhật'} Nhóm tài khoản
                    </h3>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500"><Icons.X size={20} /></button>
                </div>

                <div className="p-6 space-y-4">
                    <>
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-700">Mã nhóm <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={item.code || ''}
                                onChange={e => setItem({ ...item, code: e.target.value.toUpperCase() })}
                                className={`w-full px-3 py-2 border rounded-lg focus:border-blue-500 outline-none font-mono ${errors.code ? 'border-red-500' : 'border-slate-200'}`}
                                placeholder="VD: ADMIN, MANAGER"
                            />
                            {errors.code && <p className="text-xs text-red-500 mt-1">{errors.code}</p>}
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-700">Tên nhóm tài khoản <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={item.name || ''}
                                onChange={e => setItem({ ...item, name: e.target.value })}
                                className={`w-full px-3 py-2 border rounded-lg focus:border-blue-500 outline-none ${errors.name ? 'border-red-500' : 'border-slate-200'}`}
                            />
                            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-700">Ghi chú</label>
                            <textarea
                                value={item.note || ''}
                                onChange={e => setItem({ ...item, note: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none h-24 resize-none"
                            />
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
