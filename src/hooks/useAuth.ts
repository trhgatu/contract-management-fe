import { useEffect, useState } from 'react';
import { authService, type User } from '@/services/authService';

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(authService.getUser());
    const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
    const [isLoading, setIsLoading] = useState(false);

    // Check auth status on mount
    useEffect(() => {
        const checkAuth = async () => {
            if (authService.isAuthenticated()) {
                try {
                    setIsLoading(true);
                    const currentUser = await authService.getCurrentUser();
                    setUser(currentUser);
                    setIsAuthenticated(true);
                } catch (error) {
                    // Token invalid, clear auth
                    authService.logout();
                    setUser(null);
                    setIsAuthenticated(false);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        checkAuth();
    }, []);

    const logout = () => {
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
    };

    const hasRole = (...roles: string[]) => {
        return authService.hasRole(...roles);
    };

    const isAdmin = () => {
        return authService.isAdmin();
    };

    const canManage = () => {
        return authService.canManage();
    };

    return {
        user,
        isAuthenticated,
        isLoading,
        logout,
        hasRole,
        isAdmin,
        canManage
    };
};
