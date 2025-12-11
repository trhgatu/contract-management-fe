
import React from 'react';

export const LoginHeader: React.FC = () => {
    return (
        <div className="text-center mb-8">
            <div className="h-32 w-48 flex items-center justify-center mb-6">
                <img
                    src="https://res.cloudinary.com/dikm4mb2h/image/upload/v1765185786/logo_iwgmoz.png"
                    alt="CEH Logo"
                    className="h-full w-full object-contain"
                />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 uppercase tracking-tight mb-2">
                Quản Lý Hợp Đồng
            </h1>
            <p className="text-slate-500 text-sm font-medium">
                Hệ thống quản lý hợp đồng doanh nghiệp
            </p>
        </div>
    );
}
