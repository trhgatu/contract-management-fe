
import React, { useState } from 'react';
import { Icons } from '../../../components/ui/Icons';
import { authService } from '@/services';

interface LoginFormProps {
    onLogin: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email.trim() || !password.trim()) {
            setError('Vui lòng nhập email và mật khẩu');
            return;
        }

        setIsLoading(true);

        try {
            await authService.login({ email, password });
            // Login successful, token and user stored in localStorage
            onLogin(); // Call parent callback to update UI
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full space-y-5">

            {error && (
                <div className="bg-red-50 text-red-600 text-xs py-2 px-3 rounded-lg flex items-center gap-2 border border-red-100">
                    <Icons.Warning size={14} />
                    {error}
                </div>
            )}

            {/* Helper text */}
            <div className="bg-blue-50 text-blue-700 text-xs py-2 px-3 rounded-lg border border-blue-100">
                <strong>Tài khoản test:</strong> admin@cehsoft.com / Admin@123
            </div>

            <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 block ml-1">Email</label>
                <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                        <Icons.User size={18} />
                    </div>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@ceh.vn"
                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-400"
                    />
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 block ml-1">Mật khẩu</label>
                <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                        <Icons.Lock size={18} />
                    </div>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-400"
                    />
                </div>
            </div>

            <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-slate-600 group-hover:text-slate-800">Ghi nhớ đăng nhập</span>
                </label>
                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                    Quên mật khẩu?
                </a>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#006DFF] to-[#003A8C] text-white font-semibold py-3.5 px-4 rounded-lg shadow-lg hover:shadow-xl hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
                {isLoading ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                    <>
                        Đăng nhập
                        <Icons.ArrowRight size={18} />
                    </>
                )}
            </button>
        </form>
    );
};
