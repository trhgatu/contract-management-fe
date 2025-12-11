import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    allowedRoles
}) => {
    const { isAuthenticated, user, isLoading } = useAuth();

    // Show loading state while checking auth
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Not authenticated - redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Check role-based access
    if (allowedRoles && allowedRoles.length > 0) {
        if (!user || !allowedRoles.includes(user.role)) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-slate-50">
                    <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
                        <div className="text-6xl mb-4">🔒</div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Truy cập bị từ chối</h2>
                        <p className="text-slate-600 mb-4">
                            Bạn không có quyền truy cập trang này.
                            <br />
                            Role hiện tại: <span className="font-semibold">{user?.role}</span>
                        </p>
                        <button
                            onClick={() => window.history.back()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Quay lại
                        </button>
                    </div>
                </div>
            );
        }
    }

    // All checks passed - render children
    return <>{children}</>;
};
