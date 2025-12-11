import React, { useState, useEffect } from 'react';
import { Icons } from '../../components/ui/Icons';
import { authService } from '../../services';
import { useToast } from '../../contexts/ToastContext';
import { Button } from 'antd'; // Assuming Ant Design is available/used elsewhere or fallback to standard HTML
import { User } from '../../services/authService';

export const ProfileScreen = () => {
    const { showToast } = useToast();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Form states
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        const currentUser = authService.getUser();
        if (currentUser) {
            setUser(currentUser);
            setName(currentUser.name);
            setEmail(currentUser.email);
        }
    }, []);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword && newPassword !== confirmPassword) {
            showToast('Mật khẩu mới không khớp', 'error');
            return;
        }

        try {
            setIsLoading(true);
            const updateData: any = { name, email };

            if (newPassword) {
                if (!currentPassword) {
                    showToast('Vui lòng nhập mật khẩu hiện tại để đổi mật khẩu', 'warning');
                    setIsLoading(false);
                    return;
                }
                updateData.currentPassword = currentPassword;
                updateData.newPassword = newPassword;
            }

            const updatedUser = await authService.updateProfile(updateData);
            setUser(updatedUser);
            // Clear sensitive fields
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');

            showToast('Cập nhật hồ sơ thành công', 'success');
        } catch (error: any) {
            console.error('Update profile error:', error);
            showToast(error.response?.data?.message || 'Lỗi khi cập nhật hồ sơ', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300 pb-10">
            <div className="flex items-center gap-3 mb-6">
                <span className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <Icons.User size={24} />
                </span>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Thông tin cá nhân</h2>
                    <p className="text-sm text-slate-500">Quản lý thông tin tài khoản của bạn</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column: Avatar & Basic Info Card */}
                <div className="md:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold mb-4 border-4 border-white shadow-md">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">{user.name}</h3>
                        <p className="text-sm text-slate-500 mb-1">{user.email}</p>
                        <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full uppercase mt-2">
                            {user.role}
                        </span>

                        <div className="w-full mt-6 pt-6 border-t border-slate-100 text-left space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Trạng thái</span>
                                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Active
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Ngày tham gia</span>
                                <span className="text-slate-700 font-medium">Coming soon</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Edit Form */}
                <div className="md:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="font-semibold text-slate-800">Cập nhật thông tin</h3>
                        </div>

                        <form onSubmit={handleUpdateProfile} className="p-6 space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-slate-700">Họ và tên</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-slate-700">Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100">
                                <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <Icons.Lock size={16} className="text-slate-400" />
                                    Đổi mật khẩu
                                </h4>

                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-slate-700">Mật khẩu hiện tại</label>
                                        <input
                                            type="password"
                                            placeholder="Chỉ nhập nếu muốn đổi mật khẩu"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-semibold text-slate-700">Mật khẩu mới</label>
                                            <input
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-semibold text-slate-700">Xác nhận mật khẩu mới</label>
                                            <input
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className={`w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors ${confirmPassword && newPassword !== confirmPassword ? 'border-red-300 bg-red-50' : ''}`}
                                            />
                                            {confirmPassword && newPassword !== confirmPassword && (
                                                <p className="text-xs text-red-500">Mật khẩu không khớp</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <Button
                                    className="h-10 px-6 border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-medium"
                                    onClick={() => {
                                        // Reset fields
                                        setName(user.name);
                                        setEmail(user.email);
                                        setCurrentPassword('');
                                        setNewPassword('');
                                        setConfirmPassword('');
                                    }}
                                >
                                    Hủy bỏ
                                </Button>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={isLoading}
                                    className="h-10 px-6 bg-blue-600 hover:bg-blue-700 shadow-sm font-bold"
                                >
                                    Lưu thay đổi
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
