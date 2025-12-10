import React, { useState } from 'react';
import { Icons } from './Icons';

interface LoginScreenProps {
  onLogin: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 1. Validate Empty
    if (!username.trim() || !password.trim()) {
      setError('Vui lòng nhập tên đăng nhập và mật khẩu');
      return;
    }

    setIsLoading(true);

    // Simulate DB check with a timeout
    setTimeout(() => {
      // 2. Validate Credentials (Mock: admin / admin)
      if (username === 'admin' && password === 'admin') {
        onLogin();
      } else {
        setError('Tên đăng nhập hoặc mật khẩu không đúng');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#006DFF] font-sans p-4">
      
      {/* Main Card Container */}
      <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8 md:p-10 flex flex-col items-center">
          
          {/* 1. Logo - Increased size */}
          <div className="h-32 w-48 flex items-center justify-center mb-6">
             <img 
                src="https://res.cloudinary.com/dikm4mb2h/image/upload/v1765185786/logo_iwgmoz.png" 
                alt="CEH Logo" 
                className="h-full w-full object-contain"
             />
          </div>

          {/* 2. Title & 3. Subtext */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-800 uppercase tracking-tight mb-2">
              Quản Lý Hợp Đồng
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              Hệ thống quản lý hợp đồng doanh nghiệp
            </p>
          </div>

          {/* 4. Login Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-5">
            
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 text-red-600 text-xs py-2 px-3 rounded-lg flex items-center gap-2 border border-red-100">
                <Icons.Warning size={14} />
                {error}
              </div>
            )}

            {/* Username */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 block ml-1">Tên đăng nhập</label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <Icons.User size={18} />
                </div>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Password */}
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
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                <span className="text-slate-600 group-hover:text-slate-800">Ghi nhớ đăng nhập</span>
              </label>
              <a href="#" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                Quên mật khẩu?
              </a>
            </div>

            {/* Submit Button */}
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
        </div>
      </div>

      {/* 5. Copyright */}
      <div className="mt-8 text-center text-white/80 text-xs">
        <p>© 2025 CEH Contract Manager. All rights reserved.</p>
      </div>
      
    </div>
  );
};